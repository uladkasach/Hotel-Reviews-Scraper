module.exports = function(city_to_open){
    // define horseman object explicitly
    var horseman = this;
    
    var open_search_area_button_selector = "div[data-placement-name='masthead_search'] .search";
    var first_result_choice_selector = ".resultContainer.local .displayItem.result:eq(0) .map-pin-fill";
    var final_search_button_selector = "#SEARCH_BUTTON_CONTENT .search";
    
    /*
    element = document.querySelector("input#GEO_SCOPED_SEARCH_INPUT")
    element.addEventListener("focus", function(){
        console.log(document.querySelector(".results_panel .where_results").innerHTML)
    
    })
    element.addEventListener("click", function(){
        console.log(document.querySelector(".results_panel .where_results").innerHTML)
    
    })
    */
    
    return this
        .wait(21)
        
        .then(()=>{ // output opening
            console.log("Opening Trip Advisor...");
            return horseman;
        })
        .open('https://www.tripadvisor.com/Hotels')  
        .then(()=>{ // output opening
            console.log("Opened Trivago. Waiting for everything to load...");
            return horseman;
        })
        .catch((e)=>{
            console.log("Caught an early error.")
            console.log(e)
        })
        .waitForNextPage({timeout: 15000}) // wait up to 15 seconds for first page

    
        .then(()=>{
            console.log("Searching for city " + city_to_open + "...");
            return horseman;
        })
    
         // click to open search area and wait to load
        .waitForSelector(open_search_area_button_selector)
        .then(()=>{
            console.log("Clicking the search opening button...");
            return horseman;
        })
        .click(open_search_area_button_selector)
        .waitForNextPage()
    
    
        // type in search values and wait untill results load
        .then(()=>{
            console.log("Entering Search Values...");
            return horseman;
        })
        .clear('input#mainSearch')
        .type('input#mainSearch', "hotels")
        .clear('input#GEO_SCOPED_SEARCH_INPUT')
        .type('input#GEO_SCOPED_SEARCH_INPUT', city_to_open)
        .wait(500)
        //.waitForNextPage()

        .then(()=>{
            console.log("Selecting first search result...");
            return horseman;
        })
        // select first autocomplete recomendation
        
        //.exists(first_result_choice_selector)
        //.log()
        .waitForSelector(first_result_choice_selector) // wait for autocomplete elements to appear
        //.exists(first_result_choice_selector)
        //.log()
        .click(first_result_choice_selector)
        .wait(500) // wait after clicking first choice
    
        // click search button
        .then(()=>{
            console.log("Clicking final search button...");
            return horseman;
        })
        //.exists(final_search_button_selector)
        //.log()
        .click(final_search_button_selector)
        .waitForNextPage()
        
    
        // new page openning
        .then(()=>{
            console.log("City page was opened. Waiting for new page to load...");
            return horseman;
        })
        .waitForNextPage()
        .wait(1000)
        .waitForNextPage()
    
    
    
        // snapshot and exit
        /*
        .screenshot("page.jpg")
        .then(()=>{
            console.log("Completed...");
            process.exit();
        })
        */
        .catch((e)=>{
            console.log("Catching an error:")
            console.log(e);
            console.log("Should probably try again...");
            horseman.screenshot("z_screenshots/test.jpg");
            throw e;
        })
    
}