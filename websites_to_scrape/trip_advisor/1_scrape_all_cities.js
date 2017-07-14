module.exports = function(){
    // define horseman object explicitly
    var horseman = this;
    
    // get indicies for all cities remaining to be completed
    var initial_start_city_number = GLOBAL.scraping_metadata.index.city;
    var all_cities = GLOBAL.scraping_metadata.cities_to_scrape;
    var range_array = Array.apply(null, {length: all_cities.length}).map(Number.call, Number);
    range_array.splice(0, initial_start_city_number);

    // send output to user
    console.log(" ")
    console.log("count of cities left to do : " + range_array.length)
    
    // chain scraping FOREACH city left to do
    return range_array.reduce(function(accumulated, current_city_index){
        var current_city = all_cities[current_city_index];
        return accumulated.then((last_result) => {
            
            // update curernt city index
            process.stdout.write("\n\nBeginning scraping of city " + current_city + ", #" + current_city_index + "\n");
            GLOBAL.scraping_metadata.index.city = current_city_index;
            
            // scrape this city and return resulting horseman promise
            return horseman
                .wait(1)
            
                // log attempt
                .then((data)=>{
                    GLOBAL.logging.log_city_attempt(current_city);
                    return horseman;
                })
            
                // search for and open the city
                .open_the_city(current_city) // ----- throws {type: "no_matches"} error if city has not autocomplete options
            
                // for each review button, record the link
                .recursivly_scrape_each_city_page()
                
                .then((data)=>{
                    console.log("Scraped city successfully!");
                    return horseman;
                })
                .catch((e)=>{
                    console.log("Full error scraping this city...");
                    console.log(e);
                    global.scraping_metadata.error_counts.citylevel += 1;
                    if(global.scraping_metadata.error_counts.citylevel > 3) throw e; // more than 3 in a row
                    console.log("Skipping this city and trying next....")
                    global.logging.log_city_error(current_city + " : " + current_city_index);
                    return horseman;
                })
            
                // cleanup indicies
                .then((data)=>{
                    global.scraping_metadata.index.city_page = 0;
                    return horseman;
                })
             
        });
    }, horseman.wait(1));
    
}