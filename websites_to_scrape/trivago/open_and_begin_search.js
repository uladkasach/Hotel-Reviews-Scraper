
function open_trivago_and_begin_search(initial_conditions){
    var horseman = new Horseman({timeout : 10000}); // wait up to 30 seconds for load
    console.log("")
    console.log("")
    horseman
        .viewport(1300, 900)
        .userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36')
        .then(()=>{
            console.log("Opening trivago...");
            return horseman;
        })

        .open('http://www.trivago.com')


        .then((data)=>{
            // get indicies for all cities remaining to be completed
            var initial_start_city_number = GLOBAL.scraping_meta_data.last_successful_city_index;
            var range_array = Array.apply(null, {length: all_cities.length}).map(Number.call, Number);
            range_array.splice(0, initial_start_city_number);

            console.log(" ")
            console.log("count of cities left to do : " + range_array.length)
            // chain scraping for each city left to do
            return range_array.reduce(function(accumulated, current_city_index){
                var current_city = all_cities[current_city_index];
                return accumulated.then((last_result) => {
                    process.stdout.write("\n\nBeginning scraping of city " + current_city + ", #" + current_city_index + "\n");
                    GLOBAL.scraping_meta_data.last_city_parsed = current_city;
                    return horseman
                        .wait(1)
                        .then((data)=>{
                            fs.appendFile('cities/tried_cities.txt', current_city + "\n", function (err) {
                              if (err) throw err;
                              console.log('Saved!');
                            });
                            return horseman;
                        })
                        .search_and_scrape_city(current_city, GLOBAL.scraping_meta_data.last_page_parsed)
                        .then((data)=>{
                            GLOBAL.scraping_meta_data.last_page_parsed = 0;
                            GLOBAL.scraping_meta_data.error_cities_in_a_row = 0;
                            GLOBAL.scraping_meta_data.last_successful_city_index = current_city_index;
                            // reset last page parsed - enables setting initial page to start at 
                        })
                        .catch((e)=>{
                        
                            if(e.type == "no_results"){
                                console.log("This city was not found in the search. Skipping.");
                                return true;
                            }
                            if(e.message == "Phantom Process died" || e.name == "HeadlessError") throw e;
                        
                            console.log("Since third time was not the charm, we'll attempt to skip this sity, log the skip, and try the next city. ")
                            GLOBAL.scraping_meta_data.error_cities_in_a_row += 1;
                            fs.appendFile('cities/error_cities.txt', current_city + "\n", function (err) {
                              //if (err) throw err;
                              console.log('Saved!');
                            });
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
                });
            }, horseman.wait(1));
        })

        // handle results
        .then((data)=>{
            console.log(" ")
            console.log("Procedure successful. Closing MySQL Connection now...");
            connection.end()
            return horseman;
        })
        .catch((e)=>{
            // if phantom died, create new horseman and start over
            if(e.message == "Phantom Process died" || e.name == "HeadlessError") {
                // need to create a new horseman
                if(e.message == "Phantom Process died") console.log("Phantom died has been detected.");
                if(e.name == "HeadlessError") console.log("Headless error has been detected.");
                console.log(e);
                console.log("Beginning timeout for new horseman to be created and search to be continued.")
                setTimeout(function(){
                    console.log("Starting search w/ new horseman now.");
                    open_trivago_and_begin_search();
                }, 300);
            } else {
                console.log(" ")
                console.log("there has been some larger error! Ending...")
                console.log(e);
                connection.end()
            }
        })
    
        .close()
}
open_trivago_and_begin_search();