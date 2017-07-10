// load file system manager
var fs = require('fs');

module.exports = {
    log_new_start : function(){
        fs.appendFile('cities/error_cities.txt', "..........NEWSTART..........\n", function (err) {
          if (err) throw err;
          //console.log('Saved!');
        });
        fs.appendFile('cities/tried_cities.txt', "..........NEWSTART..........\n", function (err) {
          if (err) throw err;
          //console.log('Saved!');
        });
    },
    log_city_attempt : function(current_city){
        fs.appendFile('cities/tried_cities.txt', current_city + "\n", function (err) {
          if (err) throw err;
          //console.log('Saved!');
        });
    },
    log_city_error : function(current_city){
        fs.appendFile('cities/error_cities.txt', current_city + "\n", function (err) {
          //if (err) throw err;
          //console.log('Saved!');
        });
    }, 
    log_city_found : function(found_city){
        fs.appendFile('cities/error_cities.txt', " `-> " + current_city + "\n", function (err) {
          //if (err) throw err;
          //console.log('Saved!');
        });
    }, 
        
}