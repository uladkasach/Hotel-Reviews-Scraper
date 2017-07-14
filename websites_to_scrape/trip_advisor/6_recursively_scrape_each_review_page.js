module.exports = function(start_at_page_number){
    var start_at_page_number = global.scraping_metadata.index.review_page;
    var current_page_number_selector = "#REVIEWS .pagination .pageNumbers .current";
    var next_page_button_selector = "#REVIEWS .pagination .nav.next:not(.disabled)";
    var horseman = this;
    
    return this
        // alert page number of current page
        .html(current_page_number_selector)
        .then((current_page_number)=>{
            console.log(" ")
            if(typeof current_page_number === "undefined") current_page_number = 1; // means that page choice buttons are not displayed
            console.log("Now on page " + current_page_number);
            return current_page_number;
        })
        
        
        // scrape reviews from page if page is not before start page number
        .then((current_page_number)=>{
            if(current_page_number < start_at_page_number){
                console.log("Skipping this page, because its before start page. (start at " + start_at_page_number + ")")
                if(current_page_number == 1){ // only navigate to page if on first page, otherwise logic is not built to deal with the already existing "or"
                    return horseman
                        .url()
                        .then((current_url)=>{
                            var or_number = (start_at_page_number - 2) * 5;
                            var next_url = current_url.split("-Reviews-").join("-Reviews-or"+or_number+"-");
                            console.log("Navigating to page before target page ("+ (start_at_page_number - 1) +", at url " + next_url)
                            return horseman
                                .open(next_url)
                                .waitFor(function waitForDisapear(selector, value){
                                    return $(selector).text() == value;
                                }, current_page_number_selector, start_at_page_number - 1, true)
                        })
                } else {
                    return horseman;
                }
            } else {
                return horseman
                    .scrape_all_reviews_from_page(current_page_number)
                    .then(()=>{
                        var next_page_number = parseInt(current_page_number)+1;
                        global.scraping_metadata.index.review_page = next_page_number;
                    })
                    //.screenshot("z_screenshots/page"+current_page_number+".jpg");
                //return self.scrape_all_reviews()
            }
        })
        
    
        // detect if "next" button exists
        .exists(next_page_button_selector)
    
        // if exists, return next page number, else, catch and throw error
        .then((bool_exists_next_page)=>{
            if(bool_exists_next_page){
                return horseman
                    .html(current_page_number_selector);
            } else {
                return Promise.reject("all_done");
            }
        })
    
        .then((current_page_number)=>{
            var next_page_number = parseInt(current_page_number)+1;
            console.log("opening page " + next_page_number)
            return horseman
                // click next page
                .click(next_page_button_selector)
                // wait for loading div to disapear (i.e., contents to load)
                .wait(5000)
                .waitFor(function waitForDisapear(selector, value){
                    return $(selector).text() == value;
                }, current_page_number_selector, next_page_number, true)
                /*
                .waitFor(function waitForDisapear(selector, value){
                    return $(selector).length == 0;
                }, current_page_number_selector, next_page_number, true)
                */
                .then(()=>{
                    console.log("Next page has loaded. Running recursive Scrape.")
                    return horseman.screenshot("z_screenshots/test_"+next_page_number+".jpg");
                })
                .catch(()=>{
                    horseman.screenshot("test.jpg");
                    process.exit();
                })
                // scrape the page
                .recursively_scrape_each_review_page();
        })
    
        .catch((data)=>{
            if(data == "all_done"){
                console.log("All pages have been parsed.");
                console.log("");
                global.scraping_metadata.index.review_page = 0;
                return horseman.wait(3000); // done
            } else {
                throw data; // we caught an error instead
            }
        })
    
            
    
}