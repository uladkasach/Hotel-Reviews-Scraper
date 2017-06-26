module.exports = function(){
    console.log("Scrapping all reviews on page...");
    var connection = global.connection;
    var cherrio = global.cheerio;
    var self = this;
    return this
        // open reviews for each hotel
        .count('.review__count')
        .then((count_of_hotels)=>{
            var range_array = Array.apply(null, {length: count_of_hotels}).map(Number.call, Number);
            // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
            return range_array.reduce(function(accumulated, current_value){
                return accumulated.then((last_result) => {
                    var i = current_value;
                    //console.log(last_result);
                    process.stdout.write("*Opening `reviews preview` for hotel " + i + "\r");
                    return self.click(".review__count:eq("+i+")").wait(150);
                });
            }, self.wait(1));
        })

        // wait untill atleast 10 show mores are displayed
        .waitFor(function waitForSelectorCount(selector, count) {
            return $(selector).length >= count
        }, ".sl-box__expand-btn", 10, true)

        // open "show more" for each hotels reviews
        .count('.sl-box__expand-btn')
        .then((count_of_showmore)=>{
            console.log(" ")
            console.log("count of show more buttons : " + count_of_showmore)
            //throw "--------------TEST ERROR MESSAGE---------";
            var range_array = Array.apply(null, {length: count_of_showmore}).map(Number.call, Number);
            // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
            return range_array.reduce(function(accumulated, current_value){
                return accumulated.then((last_result) => {
                    var i = current_value;
                    process.stdout.write("*Opening `show more reviews` for hotel " + i + "\r");
                    return self.click(".sl-box__expand-btn:eq("+i+")").wait(150);
                });
            }, self.wait(1));
        })
        .catch((e)=>{
            console.log("there has been some error getting reviews open. Tring again.")
            console.log(e);
            //return promise_to_record_reviews_for_city_and_page(); // try again
            return self.scrape_all_reviews();
       })


        // get the html of each review and save it to a text file
        .count('div[itemprop="review"]')
        .then((count_of_reviews)=>{
            console.log(" ")
            console.log("count of reviews : " + count_of_reviews)
            
            //return self;
        
        
            var range_array = Array.apply(null, {length: count_of_reviews}).map(Number.call, Number);
            // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
            return range_array.reduce(function(accumulated, current_value){
                return accumulated.then((last_result) => {
                    var i = current_value;
                    //console.log(last_result);
                    process.stdout.write("*Opening html and recording data for review " + i + "\r");
                    //console.log("now openning html for review " + i + " out of " + count_of_reviews);
                    var this_selection = "div[itemprop='review']:eq("+i+")";
                    return self
                        .html(this_selection)
                        .then((html_content)=>{
                            return new Promise((resolve, reject)=>{
                                //console.log(html_content);
                                //console.log("writing to db");
                                var query_data  = {HTML: html_content};
                                var query = connection.query('INSERT INTO raw_reviews_html SET ?', query_data, function(err, result) {
                                    //console.log(err);
                                    if(err === null){
                                        //console.log("written to db");
                                        //console.log(result);
                                        resolve([result, html_content]);
                                    } else {
                                        console.log(err);
                                        resolve([err, false]);
                                    }
                                });
                                //console.log(query.sql);
                           });
                        })
                        .then((data)=>{
                            if(data[1] === false) return self; // if last entry resulted in error, dont try and parse the data
                            return new Promise((resolve, reject)=>{
                                //console.log(html_content);
                                //console.log("writing to db");
                                var raw_review_id = data[0].insertId;
                                var html_content = data[1];
                                var $ = cheerio.load(html_content)
                                var text = ($(".sl-review__summary").html());
                                var score = ($("span[itemprop='ratingValue']").text());
                                var date = ($("time[itemprop='dateCreated']").attr("datetime"));
                                var query_data = {
                                    RawReviewID : raw_review_id,
                                    Text : text,
                                    Score : score,
                                    Date : date
                                }
                                var query = connection.query('INSERT INTO reviews SET ?', query_data, function(err, result) {
                                    //console.log(err);
                                    if(err === null){
                                        //console.log("written to db");
                                        //console.log(result);
                                        resolve([result, html_content]);
                                    } else {
                                        console.log(err);
                                        resolve(err);
                                    }
                                });
                                //console.log(query.sql);
                           });
                        })
                        .wait(150)
                });
            }, self.wait(1));
        })
}