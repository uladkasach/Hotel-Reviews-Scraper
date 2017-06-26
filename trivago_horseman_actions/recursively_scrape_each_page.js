module.exports = function(){
    var current_page_number_selector = ".pagination__pages .btn--active";
    var self = this;
    return this
        // alert page number of current page
        .html(current_page_number_selector)
        .then((current_page_number)=>{
            console.log(" ")
            console.log(" ")
            console.log("Now parsing page " + current_page_number);
            return self;
        })
        
        // scrape reviews from page
        .scrape_all_reviews()
        
        // detect if "next" button exists
        .exists(".melody-pagination .btn--next")
    
        // if exists, click it and run recursively_scrape_each_page again
        .then((bool_exists_next_page)=>{
            if(bool_exists_next_page){
                return self
                    .html(current_page_number_selector) // get current page number
                    .then((current_page_number)=>{
                        var next_page_number = parseInt(current_page_number)+1;
                        //console.log("opening page " + next_page_number)
                        return self
                            // click next page
                            .click(".melody-pagination .btn--next")
                            // wait for loading div to disapear (i.e., contents to load)
                            .wait(1000).waitFor(function waitForDisapear(selector, value){
                                return $(selector).text() == value;
                            }, current_page_number_selector, next_page_number, true)
                    })
                    // scrape the page
                    .recursively_scrape_each_page();
            } else {
                console.log("All pages have been parsed.");
                return self; // done
            }
        })
            
    
}