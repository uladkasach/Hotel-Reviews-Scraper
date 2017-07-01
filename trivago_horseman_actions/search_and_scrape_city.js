module.exports = function(city_to_search_for, start_at_page_number){
    var self = this;
    
    return this
        .wait(1)
        // search for city
        .then(()=>{
            console.log("Searching for city...");
            return self;
        })
        .type('input[name="sQuery"]', city_to_search_for) //ssg-suggestions

        // wait for results to load
        .waitFor(function waitForSelectorCount(selector, count) {
            return $(selector).length >= count
        }, '.ssg-suggestion', 2, true)

        // select city
        .then(()=>{
            console.log("Opening city...");
            return self;
        })
        .click('.ssg-suggestion:first')

        // wait for atleast 10 open review buttons to load
        .waitFor(function waitForSelectorCount(selector, count) {
            return $(selector).length >= count
        }, '.review__count', 10, true)
        // wait for page current page to be 1
        .waitFor(function waitForSelectorCount(selector, value) {
            return $(selector).text() == value
        }, '.pagination__pages .btn--active', 1, true)

        // scrape all reviews on each page
        .recursively_scrape_each_page(start_at_page_number)
    
        // handle results
        .then((data)=>{
            console.log(" ")
            console.log("Procedure successful! Completed scraping " + city_to_search_for);
            GLOBAL.scraping_meta_data.recursive_parsing_error_count = 0;
            return self;
        })
        .catch((e)=>{
            GLOBAL.scraping_meta_data.recursive_parsing_error_count += 1;
            console.log("there has been some scraping city " + city_to_search_for)

            if(GLOBAL.scraping_meta_data.recursive_parsing_error_count < 3){
                console.log("Will try again in 5 seconds, starting from the last page started.")
                return self.wait(5000).search_and_scrape_city(city_to_search_for, GLOBAL.scraping_meta_data.last_page_parsed);
            } else {
                GLOBAL.scraping_meta_data.recursive_parsing_error_count = 0;
                console.log("Third time was not the charm. Ending furthur attempt and throwing error now because trying again is not helping.")
                throw (e);
            }
            //return promise_to_record_reviews_for_city_and_page(); // try again
        })

}