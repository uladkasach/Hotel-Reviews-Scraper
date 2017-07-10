module.exports = {
    
    actions : {
        scrape_all_cities : require("./1_scrape_all_cities.js"),
        open_the_city : require("./2_open_the_city.js"),
        
    }, 
    
    
    register_horseman_actions : function(){
        /*
            Horseman.registerAction('scrape_all_reviews', horseman_actions.scrape_all_reviews);
            Horseman.registerAction('recursively_scrape_each_page', horseman_actions.recursively_scrape_each_page);
            Horseman.registerAction('search_and_scrape_city', horseman_actions.search_and_scrape_city);
        */
        var action_keys = Object.keys(this.actions);
        for(var i = 0; i < action_keys.length; i++){
            var this_key = action_keys[i];
            var this_action = this.actions[this_key];
            Horseman.registerAction(this_key, this_action);
        }
    }, 
    
    define_initial_conditions : function(initial_conditions){
        /*
        var initial_conditions = {
            city : 0,
            city_page : 0,
            hotel : 0,
            review_page: 0,
        }
        */
        GLOBAL.scraping_metadata = {
            index : {
                city : 0,
                city_page : 0,
                hotel : 0,
                review_page: 0,
            },
        };
        if(typeof initial_conditions !== "undefined"){
            if(typeof initial_conditions.city !== "undefined") GLOBAL.scraping_metadata.index.city = initial_conditions.city;
            if(typeof initial_conditions.city_page !== "undefined") GLOBAL.scraping_metadata.index.city_page = initial_conditions.city_page;
            if(typeof initial_conditions.hotel !== "undefined") GLOBAL.scraping_metadata.index.hotel = initial_conditions.hotel;
            if(typeof initial_conditions.review_page !== "undefined") GLOBAL.scraping_metadata.index.review_page = initial_conditions.review_page;
        }
        return true;
    },
    
    return_promise_for_scraping_every_city_from_list : function(cities_to_scrape){
        if(typeof GLOBAL.scraping_metadata === "undefined") this.define_initial_conditions();
        GLOBAL.scraping_metadata.cities_to_scrape = cities_to_scrape;
        
        console.log("");
        console.log("");
        console.log("Promising to create a horseman, open the website, and scrape all cities.");
        var horseman = new GLOBAL.Horseman({timeout : 10000, ignoreSSLErrors: true});
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
                console.log("    `-> Load finished status was fail. Weird.")
            }
        })
        horseman.on("urlChanged", (new_url)=>{
            console.log(" (!) Phantom Url Changed to : " + new_url);
        })
        
        return horseman // define new horseman which waits atmost 10 seconds for loading
            .viewport(1300, 900)         // define a viewport
            .userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36') // define a user agent
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
            .scrape_all_cities() // custom horseman action
            .catch((e)=>{
                console.log("!!!!!!!!!!!!!!!!!!!!here i am");
                horseman.screenshot("page_error.jpg")
                console.log(e);
            })
    },
    
}