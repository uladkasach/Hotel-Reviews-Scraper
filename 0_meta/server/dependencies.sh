!#/bin/bash

sudo apt-get update && sudo apt-get install mysql-server nodejs nodejs-legacy npm libfontconfig libfreetype6 -y
mkdir -p /var/www/git && cd /var/www/git && git clone https://github.com/uladkasach/Hotel-Reviews-Scraper.git && cd Hotel-Reviews-Scraper
npm install

sudo nano auth/mysql_connection_data.json ## enter the config

## then, update node-horseman
truncate node_modules/node-horseman/lib/index.js -s 0 && sudo nano node_modules/node-horseman/lib/index.js



## to migrate sql,
## use phpmyadmin w/ user creation

## scp and import otherwise



# touch /var/www/git/Hotel-Reviews-Scraper/runtimes.log
# sudo tail -fn 1000 /var/www/git/Hotel-Reviews-Scraper/runtimes.log

# 



ssh -fNL 3307:localhost:3306 root@138.197.111.128


UPDATE `review_links` SET `Scraped` = '0', `ClaimedBy` = NULL WHERE `review_links`.`Scraped` = -1;

SELECT * FROM `review_links` WHERE `ClaimedBy` IS NOT NULL ORDER BY `ReviewCount` DESC