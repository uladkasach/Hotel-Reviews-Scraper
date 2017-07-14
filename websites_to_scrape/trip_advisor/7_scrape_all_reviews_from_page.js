module.exports = function(current_page_number){
    var review_selector = ".reviewSelector";
    var more_buttom_selector = review_selector + " .taLnk.ulBlueLinks:contains(More)"
    var horseman = this;
    
    global.review_links_scraped = 0;
    
    return this
        // press "more" to show more details for all reviews, if more button exists
        .exists(more_buttom_selector)
        .then((boolean)=>{
            if(boolean){
                console.log("Showing more...");
                return horseman
                    .click(more_buttom_selector+":eq(0)")
                    .waitFor(function waitForDisapear(selector, value){
                        return $(selector).length == value;
                    }, more_buttom_selector, 0, true)
            } else {
                return horseman;
            }
        })
    
        // record each review
        .count(review_selector)
        .then((count_of_reviews)=>{
            console.log("count of reviews on this page : " + count_of_reviews)
            //throw "--------------TEST ERROR MESSAGE---------";
            var range_array = Array.apply(null, {length: count_of_reviews}).map(Number.call, Number);
            
            // record each review link in database
            return range_array.reduce(function(accumulated, current_value){
                return accumulated.then((last_result) => {
                    var i = current_value;
                    return horseman
                        .html(review_selector+":eq("+i+")")
                        .then((html)=>{
                            return horseman
                                .attribute(review_selector+":eq("+i+")", "id")
                                .then((review_id)=>{
                                    return [review_id, html];
                                })
                        })
                        .then((data_array)=>{
                            var html_content = data_array[1];
                            var $ = global.cheerio.load(html_content)
                            /*
                                data needed 
                            */
                            
                            // get review id
                            var review_id = data_array[0];
                            
                            // get user text
                            var text = $(".partial_entry").text();
                            
                            // get rating date
                            var rating_date = $(".ratingDate").attr("title");
                        
                            // get user overall rating
                            var rating_holder = $(".rating.reviewItemInline"); 
                            var general_rating = global.grab_trip_advisor_rating_from($, rating_holder);
                        
                            var ratings_elements = $(".recommend-answer");
                            var ratings_data = [];
                            ratings_elements.each(function(i, elem) {
                                // get aspect
                                var aspect = $(this).find(".recommend-description").text();
                                
                                // get rating 
                                var rating = global.grab_trip_advisor_rating_from($, this);
                                
                                // add to data array
                                ratings_data.push({
                                    "aspect" : aspect,
                                    "value" : rating,
                                })
                            });
                            
                            /*
                            console.log(text);
                            console.log(rating_date);
                            console.log(general_rating);
                            console.log(ratings_data);
                            */
                        
                            global.review_links_scraped += 1;
                            process.stdout.write("*recording review link " + i + " (total =  " + global.review_links_scraped + ") \r");
                            return new Promise((resolve, reject)=>{
                                
                                var query_data  = { "Text": text, "Date":rating_date, "Score" : general_rating, "ExtID" : review_id};
                                var query = connection.query('INSERT INTO reviews SET ?', query_data, function(err, result) {
                                    //console.log(err);
                                    if(err === null){
                                        //console.log("written to db");
                                        //console.log(result);
                                        resolve([result, true, ratings_data]);
                                    } else {
                                        //console.log(err);
                                        resolve([err, false]);
                                    }
                                });
                                
                            })
                            .then((data_array)=>{
                                if(data_array[1] !== true){
                                    var err = data_array[0];
                                    throw err;
                                } else {
                                    return ([data_array[0].insertId, data_array[2]]);
                                }
                            })
                            // save the individual scores
                            .then((data)=>{
                                var review_id = data[0];
                                var ratings_data = data[1];


                                // record each review link in database
                                return ratings_data.reduce(function(accumulated, current_data){
                                    return accumulated.then((last_result) => {
                                        var this_rating = current_data;
                                        return new Promise((resolve, reject)=>{
                                            var query_data  = {"ReviewID":review_id, "Aspect": this_rating.aspect, "Value":this_rating.value};
                                            var query = connection.query('INSERT INTO scores SET ?', query_data, function(err, result) {
                                                //console.log(err);
                                                if(err === null){
                                                    //console.log("written to db");
                                                    //console.log(result);
                                                    resolve([result, true, ratings_data]);
                                                } else {
                                                    console.log(err);
                                                    process.exit();
                                                    resolve([err, false]);
                                                }
                                            });
                                        })
                                        
                                    });
                                }, horseman.wait(1));
                            })
                            // catch mysql errors, its no big deal. we'll just skip this one.
                            .catch((err)=>{
                               if(err.errno == 1062) {
                                    console.log("duplicate ")
                                } else {
                                    console.log(data_array[0]);
                                    console.log(Object.keys(err))
                                }
                                return true;
                            })
                        })
                });
            }, horseman.wait(1));
        })
        .then(()=>{
            console.log("All pages scraped");
        })
        .then(()=>{
            process.exit;
            return new Promise((resolve, reject)=>{
                var query_data = [{ LastPageScraped: current_page_number }, { LinkID: global.current_review_link_id }];
                var query = connection.query('UPDATE review_links SET ? WHERE ?', query_data, function(err, result) {
                        if(err === null){
                            //console.log(result);
                            resolve([result, true]);
                        } else {
                            console.log(err);
                            resolve([err, false]);
                        }
                    });
            })
        })
    
}