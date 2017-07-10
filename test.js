
    // load horseman
    var Horseman = require('node-horseman');
    Horseman.registerAction("open_the_city", open_the_city)

    var horseman = new Horseman({timeout : 10000, ignoreSSLErrors: true});
    horseman.on('error', (err) => {
        //console.log("  regular error caught");
        //console.log(err);
    })
    horseman.on('resourceError', (err) => {
        //console.log("  resource error caught");
        //console.log(err);
    })
    horseman.on('loadFinished', (status) => {
        //console.log("  resource load: " + status);
        if(status == "fail"){
            console.log("Load finished status was fail. Weird.")
        }
    })
    horseman.on("urlChanged", (new_url)=>{
        console.log(" (!) Phantom Url Changed to : " + new_url);
    })

    var current_city = "New York"


    horseman // define new horseman which waits atmost 10 seconds for loading
        .viewport(1300, 900)         // define a viewport
        .userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36') // define a user agent
        .then(()=>{ // output opening
            console.log("Opening Trip Advisor...");
            return horseman;
        })
        .open('https://www.tripadvisor.com/Hotels')  
        .then(()=>{ // output opening
            console.log("Opened Trip Advisor. Waiting for everything to load...");
            return horseman;
        })
        .waitForNextPage({timeout: 15000}) // wait up to 15 seconds for first page

        // search for and open the city
        .open_the_city(current_city) // ----- throws {type: "no_matches"} error if city has not autocomplete options

        .close()


    function open_the_city(city_to_open){
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
            .waitForNextPage()

            .then(()=>{
                console.log("Selecting first search result...");
                return horseman;
            })
            // select first autocomplete recomendation

            .exists(first_result_choice_selector)
            .log()
            .waitForSelector(first_result_choice_selector) // wait for autocomplete elements to appear
            .exists(first_result_choice_selector)
            .log()
            .click(first_result_choice_selector)
            .wait(500) // wait after clicking first choice

            // click search button
            .then(()=>{
                console.log("Clicking final search button...");
                return horseman;
            })
            .exists(final_search_button_selector)
            .log()
            .click(final_search_button_selector)
            .waitForNextPage()


            // new page openning
            .then(()=>{
                console.log("City page was opened. Waiting for new page to load...");
                return horseman;
            })
            .then((data)=>{
                console.log("Assigning error handler.");
                horseman.on('resourceError', (err) => {
                    console.log("resource error caught");
                    console.log(err);
                })
                return horseman;
            })
            //.waitForNextPage()
            .wait(5000)


            // snapshot and exit
            .screenshot("page.jpg")
            .then(()=>{
                console.log("Completed...");
                process.exit();
            })
            .catch((e)=>{
                console.log("Catching an error:")
                console.log(e);
                console.log("Trying again...");
            })

    }