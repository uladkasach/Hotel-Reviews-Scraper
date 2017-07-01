var initial_start_city_number = 97;
var initial_start_at_page_number = 0;

var all_cities = require("./cities/cities.json");

var Horseman = require('node-horseman');
var horseman_actions = require("./trivago_horseman_actions/0_index.js")
Horseman.registerAction('scrape_all_reviews', horseman_actions.scrape_all_reviews);
Horseman.registerAction('recursively_scrape_each_page', horseman_actions.recursively_scrape_each_page);
Horseman.registerAction('search_and_scrape_city', horseman_actions.search_and_scrape_city);
var horseman = new Horseman();

var fs = require('fs');

var cheerio = require('cheerio')
global.cheerio = cheerio;

var fs = require('fs');

var mysql = require('mysql');
var connection_data = require('./auth/mysql_connection_data.json');
var connection = mysql.createConnection(connection_data);
connection.connect(function(err) {
  // connected! (unless `err` is set)
    if(typeof err !== null){
        console.log("Connected to database");
    } else {
        console.log("Error connecting to database:")
        console.log(err);
        process.exit();
    }    
});
global.connection = connection;


console.log("starting...");


////////////////////
// Define global metadata
////////////////////
GLOBAL.scraping_meta_data = {
    last_city_parsed : null,
    last_page_parsed : initial_start_at_page_number,
    recursive_parsing_error_count : 0,
    error_cities_in_a_row : 0, // used to assess whether the error is more fundemental than just one city not loading
},



////////////////////
// Open hotels page for a city
////////////////////
horseman
    .viewport(1300, 900)
    .userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36')
    .then(()=>{
        console.log("Opening trivago...");
        return horseman;
    })

    .open('http://www.trivago.com')


    .then((data)=>{
        var cities_left_to_complete = all_cities;
        cities_left_to_complete.splice(0, initial_start_city_number);

        console.log(" ")
        console.log("count of cities left to do : " + cities_left_to_complete.length)
        // chain scraping for each city left to do
        return cities_left_to_complete.reduce(function(accumulated, current_city){
            return accumulated.then((last_result) => {
                process.stdout.write("\n\nBeginning scraping of city " + current_city + "\n");
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
                        // reset last page parsed - enables setting initial page to start at 
                    })
                    .catch((e)=>{
                        console.log("Since third time was not the charm, we'll attempt to skip this sity, log the skip, and try the next city. ")
                        GLOBAL.scraping_meta_data.error_cities_in_a_row += 1;
                        fs.appendFile('cities/error_cities.txt', current_city + "\n", function (err) {
                          if (err) throw err;
                          console.log('Saved!');
                        });
                        if(GLOBAL.scraping_meta_data.error_cities_in_a_row > 3){
                            fs.appendFile('cities/error_cities.txt', "....................", function (err) {
                              if (err) throw err;
                              //console.log('Saved!');
                            });
                            fs.appendFile('cities/tried_cities.txt', "....................", function (err) {
                              if (err) throw err;
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
        console.log(" ")
        console.log("there has been some larger error! Ending...")
        console.log(e);
        connection.end()
    })

    .close()
