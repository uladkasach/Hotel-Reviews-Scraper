var initial_city_to_search_for = "Chicago,Illinois";
var initial_start_at_page_number = 3;


var Horseman = require('node-horseman');
var horseman_actions = require("./trivago_horseman_actions/0_index.js")
Horseman.registerAction('scrape_all_reviews', horseman_actions.scrape_all_reviews);
Horseman.registerAction('recursively_scrape_each_page', horseman_actions.recursively_scrape_each_page);
Horseman.registerAction('search_and_scrape_city', horseman_actions.search_and_scrape_city);
var horseman = new Horseman();



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
    last_city_parsed : initial_city_to_search_for,
    last_page_parsed : initial_start_at_page_number,
    recursive_parsing_error_count : 0,
},



////////////////////
// Open hotels page for a city
////////////////////
horseman
    .viewport(1300, 900)
    .userAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0')
    .then(()=>{
        console.log("Opening trivago...");
        return horseman;
    })
    .open('http://www.trivago.com')


    .search_and_scrape_city(GLOBAL.scraping_meta_data.last_city_parsed, GLOBAL.scraping_meta_data.last_page_parsed)


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
