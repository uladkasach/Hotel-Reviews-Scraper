///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// define initial conditions
var initial_conditions = {
    city : 999,
    city_page : 0,
    hotel : 0,
    review_page: 0,
}

//DEBUG='horseman*' BLUEBIRD_DEBUG=1

// load cities list
var all_cities = require("./cities/cities.json");

// load horseman
var Horseman = require('node-horseman');
GLOBAL.Horseman = Horseman;

// load cherio - used to parse DOM
var cheerio = require('cheerio')
GLOBAL.cheerio = cheerio;


// initialize MYSQL connection
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
GLOBAL.connection = connection;

// load logging functinoality
GLOBAL.logging = require("./logging.js");

// select the website and load relevant horseman functions
var website = require("./websites_to_scrape/trip_advisor/_load.js");
website.register_horseman_actions(); // register horseman actions
website.define_initial_conditions(initial_conditions);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scrape
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log("Setup complete. Starting...");
    
// deliminate cities files for this new start
GLOBAL.logging.log_new_start();

// promise to scrape every city defined in json 
var promise_to_scrape_every_city_defined_in_json = website.return_promise_for_scraping_every_city_from_list(all_cities);

// handle a non-managable city scraping error. 
// ensure that if the number of cities in a row throwing skip errors is above TOLLERANCE, program halts. Otherwise, to skip the city.


