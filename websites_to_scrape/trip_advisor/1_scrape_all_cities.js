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
            
                // scrape the current city
                //.scrape_open_city()
            
                /*
                // update error counts 
                .then((data)=>{
                    GLOBAL.scraping_meta_data.last_page_parsed = 0;
                    GLOBAL.scraping_meta_data.error_cities_in_a_row = 0;
                    GLOBAL.scraping_meta_data.last_successful_city_index = current_city_index;
                    // reset last page parsed - enables setting initial page to start at 
                })
                .catch((e)=>{
                    if(e.type == "no_matches"){
                        console.log("This city was not found in the search. Skipping.");
                        return true; // resolve successfully
                    }
                    if(e.message == "Phantom Process died" || e.name == "HeadlessError") throw e;

                    console.log("Since third time was not the charm, we'll attempt to skip this sity, log the skip, and try the next city. ")
                    GLOBAL.scraping_meta_data.error_cities_in_a_row += 1;
                    GLOBAL.logging.log_city_error(current_city);
                    if(GLOBAL.scraping_meta_data.error_cities_in_a_row > 10){
                        console.log("Actually, error has occured too many times. Throwing larger error.")
                        fs.appendFile('cities/error_cities.txt', "....................", function (err) {
                          //if (err) throw err;
                          //console.log('Saved!');
                        });
                        throw e;
                    } else {
                        return true;
                    }
                })
                .wait(500);
                */
        });
    }, horseman.wait(1));
    
}