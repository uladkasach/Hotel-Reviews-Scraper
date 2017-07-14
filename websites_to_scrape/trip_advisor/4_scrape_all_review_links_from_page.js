module.exports = function(start_at_page_number){
    var review_button_selector = ".ratingReview";
    var horseman = this;
    
    global.review_links_scraped = 0;
    
    return this
        .count(review_button_selector)
        .then((count_of_reviews)=>{
            console.log("count of reviews on this page : " + count_of_reviews)
            //throw "--------------TEST ERROR MESSAGE---------";
            var range_array = Array.apply(null, {length: count_of_reviews}).map(Number.call, Number);
            
            // record each review link in database
            return range_array.reduce(function(accumulated, current_value){
                return accumulated.then((last_result) => {
                    var i = current_value;
                    return horseman
                        .html(review_button_selector+":eq("+i+")")
                        .then((html_content)=>{
                            var $ = global.cheerio.load(html_content)
                            var href = ($("a").attr("href"));
                            var text = ($("a").text());
                            var review_count = parseInt(($("a").text().split(" ")[0].replace(/,/g, '')));
                            global.review_links_scraped += review_count;
                            process.stdout.write("*recording review link " + i + ": " + global.review_links_scraped + " \r");
                            return new Promise((resolve, reject)=>{
                                
                                var query_data  = { "Link": href, "Text":text, "ReviewCount" : review_count};
                                var query = connection.query('INSERT INTO review_links SET ?', query_data, function(err, result) {
                                    //console.log(err);
                                    if(err === null){
                                        //console.log("written to db");
                                        //console.log(result);
                                        resolve([result, true]);
                                    } else {
                                        //console.log(err);
                                        resolve([err, false]);
                                    }
                                });
                                
                            })
                            .then((data_array)=>{
                                if(data_array[1] !== true){
                                    var err = data_array[0];
                                    if(err.errno == 1062) {
                                        //console.log("duplicate ")
                                    } else {
                                        console.log(data_array[0]);
                                        console.log(Object.keys(err))
                                    }
                                }
                            })
                        })
                });
            }, horseman.wait(1));
        })
        .then(()=>{
            console.log(" ");
        })
    
}