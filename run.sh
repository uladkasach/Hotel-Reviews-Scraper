#function run
run() {
    number=$1
    shift
    for i in `seq $number`; do
      $@
    done
}
## usage : run 100 "node scrape_finish.js S2"