var Horseman = require('node-horseman');
var horseman = new Horseman();
var fs = require('fs');

console.log("starting...");

horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://www.google.com')
    .type('input[name="q"]', 'github')
    .click('[name="btnK"]')
    .keyboardEvent('keypress', 16777221)
    .waitForSelector('div.g')
    .count('div.g')
    .log() // prints out the number of results
    .html()
    .then((html)=>{
        return new Promise((resolve, reject)=>{
            //console.log(html);
            fs.writeFile("result.html", html)
            resolve();
       })
    })
    .screenshot("test.png")
    .close();