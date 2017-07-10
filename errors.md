      horseman using PhantomJS from phantomjs-prebuilt module +0ms
      horseman .setup() creating phantom instance 1 +4ms
      horseman .viewport() set 1300 900 +10ms
      horseman phantom created +116ms
      horseman phantom version 2.1.1 +13ms
      horseman page created +8ms
      horseman phantomjs onLoadFinished triggered success NaN +10ms
      horseman injected jQuery +20ms
      horseman .on() error set. +3ms
      horseman .on() resourceError set. +1ms
      horseman .on() loadFinished set. +0ms
      horseman .on() urlChanged set. +0ms
      horseman .userAgent() set Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 +11ms
    Opening Trip Advisor...
      horseman .open() https://www.tripadvisor.com/Hotels +2ms
     (!) Phantom Url Changed to : https://www.tripadvisor.com/Hotels
      horseman phantomjs onLoadFinished triggered success 1 +2s
      horseman injected jQuery +25ms
    Opened Trivago. Waiting for everything to load...
      horseman .waitForNextPage() +8ms
      horseman .waitForNextPage() completed successfully +52ms
      horseman .wait() 21 +2ms
    Searching for city New York...
      horseman .waitForSelector() div[data-placement-name='masthead_search'] .search undefined +50ms
      horseman .waitFor() elementPresent div[data-placement-name='masthead_search'] .search +0ms
      horseman:verbose .waitFor() iteration elementPresent true 51 1 +85ms
      horseman .waitFor() completed successfully +1ms
      horseman .waitForSelector() complete +0ms
    Clicking the search opening button...
      horseman .click() div[data-placement-name='masthead_search'] .search +0ms
      horseman .click() done +20ms
      horseman .waitForNextPage() +0ms
      horseman phantomjs onLoadFinished triggered success 2 +3s
      horseman jQuery not injected - already exists on page +23ms
      horseman .waitForNextPage() completed successfully +20ms
    Entering Search Values...
      horseman .clear() input#mainSearch +0ms
      horseman .value() input#mainSearch  +0ms
      horseman .type() input#mainSearch hotels undefined +11ms
      horseman .keyboardEvent() keypress h null +22ms
      horseman .keyboardEvent() keypress o null +6ms
      horseman .keyboardEvent() keypress t null +5ms
      horseman .keyboardEvent() keypress e null +4ms
      horseman .keyboardEvent() keypress l null +6ms
      horseman .keyboardEvent() keypress s null +7ms
      horseman .clear() input#GEO_SCOPED_SEARCH_INPUT +0ms
      horseman .value() input#GEO_SCOPED_SEARCH_INPUT  +0ms
      horseman .type() input#GEO_SCOPED_SEARCH_INPUT New York undefined +6ms
      horseman .keyboardEvent() keypress N null +32ms
      horseman .keyboardEvent() keypress e null +8ms
      horseman .keyboardEvent() keypress w null +8ms
      horseman .keyboardEvent() keypress   null +8ms
      horseman .keyboardEvent() keypress Y null +4ms
      horseman .keyboardEvent() keypress o null +6ms
      horseman .keyboardEvent() keypress r null +6ms
      horseman .keyboardEvent() keypress k null +6ms
      horseman .wait() 500 +0ms
      horseman:verbose onConsoleMessage Facebook Pixel Warning: You are sending a non-standard event 'LogAttribution'. The preferred way to send events is using trackCustom. See https://www.facebookmarketingdevelopers.com/pixels/up#sec-custom for more information line: undefined in undefined 1 +325ms
      horseman .waitForNextPage() +176ms
      horseman phantomjs onLoadFinished triggered success 3 +330ms
      horseman jQuery not injected - already exists on page +15ms
      horseman .waitForNextPage() completed successfully +9ms
    Selecting first search result...
      horseman .exists() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +2ms
      horseman .count() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +0ms
    true
      horseman .waitForSelector() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill undefined +25ms
      horseman .waitFor() elementPresent .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +0ms
      horseman:verbose .waitFor() iteration elementPresent true 51 1 +78ms
      horseman .waitFor() completed successfully +0ms
      horseman .waitForSelector() complete +1ms
      horseman .exists() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +0ms
      horseman .count() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +0ms
    true
      horseman .click() .resultContainer.local .displayItem.result:eq(0) .map-pin-fill +16ms
      horseman .click() done +21ms
      horseman .wait() 500 +0ms
      horseman phantomjs onLoadFinished triggered fail 4 +343ms
    Unhandled rejection Error: Failed to load url
        at checkStatus (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:292:16)
    From previous event:
        at Object.loadFinishedSetup [as onLoadFinished] (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:290:43)
        at /var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:636:30
        at Array.forEach (native)
        at IncomingMessage.<anonymous> (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:617:17)
        at emitNone (events.js:110:20)
        at IncomingMessage.emit (events.js:207:7)
        at endReadableNT (_stream_readable.js:1047:12)
        at _combinedTickCallback (internal/process/next_tick.js:102:11)
        at process._tickCallback (internal/process/next_tick.js:161:9)

    Clicking final search button...
      horseman .exists() #SEARCH_BUTTON_CONTENT .search +159ms
      horseman .count() #SEARCH_BUTTON_CONTENT .search +0ms
    Catching an error:
    Error: Failed to load url
        at checkStatus (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:292:16)
    From previous event:
        at Object.loadFinishedSetup [as onLoadFinished] (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:290:43)
        at /var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:636:30
        at Array.forEach (native)
        at IncomingMessage.<anonymous> (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:617:17)
        at emitNone (events.js:110:20)
        at IncomingMessage.emit (events.js:207:7)
        at endReadableNT (_stream_readable.js:1047:12)
        at _combinedTickCallback (internal/process/next_tick.js:102:11)
        at process._tickCallback (internal/process/next_tick.js:161:9)
    Trying again...
      horseman .close(). +11ms
    Unhandled rejection Error: Failed to load url
        at checkStatus (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:292:16)
    From previous event:
        at Object.loadFinishedSetup [as onLoadFinished] (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-horseman/lib/index.js:290:43)
        at /var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:636:30
        at Array.forEach (native)
        at IncomingMessage.<anonymous> (/var/www/git/NLP/Hotel-Reviews-Scraper/node_modules/node-phantom-simple/node-phantom-simple.js:617:17)
        at emitNone (events.js:110:20)
        at IncomingMessage.emit (events.js:207:7)
        at endReadableNT (_stream_readable.js:1047:12)
        at _combinedTickCallback (internal/process/next_tick.js:102:11)
        at process._tickCallback (internal/process/next_tick.js:161:9)
