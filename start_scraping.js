var Horseman = require('node-horseman');
var horseman = new Horseman();

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



Horseman.registerAction('preview', function(results_path) {
  // The function will be called with the Horseman instance as this
  var self = this;
  // Return the horseman chain, or any Promise
  console.log("recording preview to " + results_path + "...");
  return this
    .html()
    /*
    .then((html)=>{
        return new Promise((resolve, reject)=>{
            console.log("html written");
            fs.writeFile(results_path+".html", html)
            resolve();
       })
    })
    */
    //.screenshot(results_path+".png")
    .pdf(results_path+".pdf")
});


console.log("starting...");

////////////////////
// Open hotels page for a city
////////////////////
var promise_to_load_many_hotels = horseman
    .viewport(1300, 900)
    .userAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0')
    .open('http://www.trivago.com')

    // search for city
    .type('input[name="sQuery"]', 'New York') //ssg-suggestions
    
    // wait for results to load
    .waitFor(function waitForSelectorCount(selector, count) {
        return $(selector).length >= count
    }, '.ssg-suggestion', 2, true)

    // select city
    .click('.ssg-suggestion:first')

    // wait for results to load
    .waitFor(function waitForSelectorCount(selector, count) {
        return $(selector).length >= count
    }, '.review__count', 10, true)

    // open reviews for each hotel
    .count('.review__count')
    .then((count_of_hotels)=>{
        var range_array = Array.apply(null, {length: count_of_hotels}).map(Number.call, Number);
        // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
        return range_array.reduce(function(accumulated, current_value){
            return accumulated.then((last_result) => {
                var i = current_value;
                //console.log(last_result);
                console.log("now running opening reviews preview for hotel " + i);
                return horseman.click(".review__count:eq("+i+")").wait(150);
            });
        }, horseman.log());
    })

    // wait untill atleast 10 show mores are displayed
    .waitFor(function waitForSelectorCount(selector, count) {
        return $(selector).length >= count
    }, ".sl-box__expand-btn", 10, true)

    // open "show more" for each hotels reviews
    .count('.sl-box__expand-btn')
    .then((count_of_showmore)=>{
        console.log("count of show more buttons : " + count_of_showmore)
        var range_array = Array.apply(null, {length: count_of_showmore}).map(Number.call, Number);
        // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
        return range_array.reduce(function(accumulated, current_value){
            return accumulated.then((last_result) => {
                var i = current_value;
                //console.log(last_result);
                console.log("now running opening show more reviews for hotel " + i);
                return horseman.click(".sl-box__expand-btn:eq("+i+")").wait(150);
            });
        }, horseman.log());
    })


    // get the html of each review and save it to a text file
    .count('div[itemprop="review"]')
    .then((count_of_reviews)=>{
        console.log("count of reviews : " + count_of_reviews)
        //if(count_of_reviews > 15) count_of_reviews = 15;
        var range_array = Array.apply(null, {length: count_of_reviews}).map(Number.call, Number);
        // chain opening reviews for each hotel found on that page with the reduce function (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
        return range_array.reduce(function(accumulated, current_value){
            return accumulated.then((last_result) => {
                var i = current_value;
                //console.log(last_result);
                console.log("now openning html for review " + i);
                var this_selection = "div[itemprop='review']:eq("+i+")";
                return horseman
                    .wait(150)
                    .html(this_selection)
                    .then((html_content)=>{
                        return new Promise((resolve, reject)=>{
                            console.log(html_content);
                            console.log("writing to db");
                            var post  = {HTML: html_content};
                            var query = connection.query('INSERT INTO raw_reviews_html SET ?', post, function(err, result) {
                                //console.log(err);
                                if(err === null){
                                    console.log("written to db");
                                    console.log(result);
                                    resolve(result);
                                } else {
                                    console.log(err);
                                    resolve(err);
                                }
                            });
                            //console.log(query.sql);
                       });
                    });
            });
        }, horseman.log());
    })

    // show result
    //.preview("result")
    .close()
