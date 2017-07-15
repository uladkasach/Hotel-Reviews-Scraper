echo "Running finish $1 times with claimant $2"
for i in {1..$1}; do node scraping_finish.js $2; done