module.exports = function(){
    var horseman = this; // define horseman object explicitly
    
    return this
        .wait(21)
        
        // grab a review_link, use huristic returning next unscraped link w/ most reviews
        .then(()=>{ // output opening
            console.log("Grabbing next review link from database...");
            return horseman;
        })
        .then(()=>{
            return new Promise((resolve, reject)=>{
                var query = connection.query('SELECT `LinkID`, `Link`, `ReviewCount`, `LastPageScraped`, `ClaimedBy` FROM `review_links` WHERE `Scraped` = 0 AND (`ClaimedBy` IS NULL  OR  `ClaimedBy` = \'' + global.claimant + '\') ORDER BY `ReviewCount` DESC LIMIT 1', function(err, result) {
                    if(err === null){
                        var source_result = result[0];
                        var cleaned_result = {
                            id : source_result.LinkID,
                            url : source_result.Link,
                            count : source_result.ReviewCount,
                            last_page_scraped : source_result.LastPageScraped,
                            claimed_by : source_result.ClaimedBy,
                        }
                        console.log(cleaned_result);
                        resolve([cleaned_result, true]);
                    } else {
                        console.log(err);
                        reject([err, false]);
                    }
                });
            })
        })
        .then((data)=>{
            // define global data
            var review_link = data[0];
            global.current_review_link_id = review_link.id;
            global.scraping_metadata.index.review_page = review_link.last_page_scraped;
        
            // ensure claimant is set if was null
            if(review_link.claimed_by == null){
                return new Promise((resolve, reject)=>{
                    console.log("claiming this link for claimant `" + global.claimant + "`...")
                    var query_data = [{ ClaimedBy: global.claimant }, { LinkID: global.current_review_link_id }];
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
                .then(()=>{
                    return review_link;
                })
                .catch((e)=>{
                    console.log("caught an error with updating the claimant");
                    console.log(e)
                    return;
                })
            } else {
                return review_link;
            }
        })
    
        .then((data)=>{
            process.exit();
        })
    
        // open the review link
        .then((review_link)=>{
            console.log("Opening Trip Advisor Review Link...");
            var url = review_link.url;
            return horseman
                .open("https://www.tripadvisor.com"+url)
        })
        .then(()=>{ // output opening
            console.log("Opened Review Page. Waiting for everything to load...");
            return horseman;
        })
        .catch((e)=>{
            console.log("Caught an early error.")
            console.log(e)
            //console.log(Object.keys(e))
            throw e;
        })
        .waitForNextPage({timeout: 15000}) // wait up to 15 seconds for first page

        .then(()=>{
            return horseman
                // recursivly scrape each review page
                .recursively_scrape_each_review_page().then(()=>{ return 1; });

        })
        .catch((e)=>{
            //console.log(Object.keys(e));
            (''+e).substring(0,100);
            console.log("caught error, going to move forward and mark this city negative one...");
            return horseman.wait(1500).then(()=>{ return -1; });
        })
    
        // mark the review link as scraped
        .then((scrape_value)=>{
            process.exit;
            return new Promise((resolve, reject)=>{
                console.log("updating last review link to scraped_status " + scrape_value)
                var query_data = [{ Scraped: scrape_value }, { LinkID: global.current_review_link_id }];
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
        .then(()=>{
            // call self to continue with next link
            return horseman.scrape_all_review_links();
        })
        
            
    
}