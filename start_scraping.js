var Horseman = require('node-horseman');
var horseman = new Horseman();
var fs = require('fs');

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
    .screenshot(results_path+".png")
});


console.log("starting...");

promise_to_load_many_hotels = 
    horseman
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
    }, '.review__count', 10, true);

    /////
    // for each hotel element on this page, get all reviews, get html of container holding all reviews, save each review.
    ////
    promise_to_count_reviews = promise_to_load_many_hotels.then((data)=>{
           return horseman
           .count('.review__count') 
           .log()
    });

    promise_to_count_reviews
        .preview("result")
        .close()