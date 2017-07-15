/*
    this file needs to facilitate the continuous retreival of URLS on which reviews reside (hotel urls) from the database, and for each link to scrape the reviews. 
*/
var initial_conditions = {
    review_page: 0, // note - this value is always overwritten by last_scraped_page in db
}

var claimant_identifier = process.argv[2]; 
if(typeof claimant_identifier === "undefined"){
    var claimant_identifier = "STANDARD";
}
global.claimant = claimant_identifier;


// initialize MYSQL connection
var mysql = require('mysql');
var connection_data = require('./auth/mysql_connection_data.json');
var connection = mysql.createConnection(connection_data);
connection.connect(function(err) {
    if(typeof err !== null){
        console.log("Connected to database");
    } else {
        console.log("Error connecting to database:")
        console.log(err);
        process.exit();
    }    
});
global.connection = connection;

// load horseman
var Horseman = require('node-horseman');
GLOBAL.Horseman = Horseman;

// load cherio - used to parse DOM
var cheerio = require('cheerio')
GLOBAL.cheerio = cheerio;

// select the website and load relevant horseman functions
var website = require("./websites_to_scrape/trip_advisor/_load.js");
website.register_horseman_actions(); // register horseman actions
website.define_initial_conditions(initial_conditions);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Scrape
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log("Setup complete. Starting...");
    
// deliminate cities files for this new start
// GLOBAL.logging.log_new_start();

// promise to scrape every city defined in json 
var promise_to_scrape_every_city_defined_in_json = website.return_promise_for_scraping_every_review_from_database();



global.grab_trip_advisor_rating_from = function($, rating_holder){
    var rating = -1;
    var possible_ratings = ["bubble_00", "bubble_10", "bubble_20", "bubble_30", "bubble_40", "bubble_50"];
    for(var i = 0; i < possible_ratings.length; i++){
        if($(rating_holder).find(".ui_bubble_rating").hasClass(possible_ratings[i])){
            rating = i;
            break;
        }
    }
    if(rating == -1){
        console.log("ERROR: no rating found for this expected aspect rating !!!!!!");
        console.log(rating_holder);
        process.exit();
    }
    return rating;
}