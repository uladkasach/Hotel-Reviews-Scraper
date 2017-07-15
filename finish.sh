echo "Running finish $1 times with claimant $2"
for i in `seq $1`; do 
    start=`date +%s`
    node scraping_finish.js $2
    end=`date +%s`
    runtime=$((end-start))
    echo "run for time $i, for claimant $2, took "$runtime >> runtimes.log
done

# touch /var/www/git/Hotel-Reviews-Scraper/runtimes.log
# sudo tail -fn 1000 /var/www/git/Hotel-Reviews-Scraper/runtimes.log