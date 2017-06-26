var Horseman = require('node-horseman');
var horseman_actions = require("./trivago_horseman_actions/0_index.js")
Horseman.registerAction('scrape_all_reviews', horseman_actions.scrape_all_reviews);
Horseman.registerAction('recursively_scrape_each_page', horseman_actions.recursively_scrape_each_page);
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

    // search for city
    .then(()=>{
        console.log("Searching for city...");
        return horseman;
    })
    .type('input[name="sQuery"]', 'New York') //ssg-suggestions

    // wait for results to load
    .waitFor(function waitForSelectorCount(selector, count) {
        return $(selector).length >= count
    }, '.ssg-suggestion', 2, true)

    // select city
    .then(()=>{
        console.log("Opening city...");
        return horseman;
    })
    .click('.ssg-suggestion:first')

    // wait for atleast 10 open review buttons to load
    .waitFor(function waitForSelectorCount(selector, count) {
        return $(selector).length >= count
    }, '.review__count', 10, true)
    // wait for page current page to be 1
    .waitFor(function waitForSelectorCount(selector, value) {
        return $(selector).text() == value
    }, '.pagination__pages .btn--active', 1, true)

    // scrape all reviews on each page
    .recursively_scrape_each_page()

    // handle results
    .then((data)=>{
        console.log(" ")
        console.log("Procedure successful. Closing MySQL Connection now...");
        connection.end()
        return horseman;
    })
    .catch((e)=>{
        console.log("there has been some larger error! Ending...")
        console.log(e);
        connection.end()
        //return promise_to_record_reviews_for_city_and_page(); // try again
    })

    .close()
