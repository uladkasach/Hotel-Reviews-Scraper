echo "Running finish $1 times with claimant $2"
for i in {1..$1}; do 
    start=`date +%s`
    node scraping_finish.js $2
    end=`date +%s`
    runtime=$((end-start))
    echo $runtime >> runtimes.log
done