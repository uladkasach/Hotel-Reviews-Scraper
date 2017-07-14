
## Error Managment
Following requirements must be considered:
- Horseman Errors and Phantom errors must be thrown to top, and the search must be restarted from the previous place.
- Previous place (city, city_page, hotel, hotel_page) must be kept at every step    
    - this is a website specific metadata which should be defined in the site specific function
    
You may want to turn off the rejection node-horseman throws when it gets a certain error. 
    /node_modules/node-horseman/lib/index.js, line 293.
    
## Data Managment
Because of errors, current position / next position to navigate to should be indexed by global data - not by dependency injection
    
## Logic
General framework for trip advisor is as follows:
1. Open a hew horseman & open the website
2. Open hotels for a city
    1. search for a city
    2. wait for autocompleted results to load
        - handle error where city does not exist
    3. select city from autocompleted results
        - wait for page
3. FOREACH page for that city, record url to reviews for each hotel in database
    - store url and review count
    
4. FOREACH hotel w/ review url in database,
    1. Open a hotel
        1. wait for reviews button to open
            - handle case of not having any reviews
    2. open reviews for the hotel
        - wait for pages of reviews to load
    3. FOREACH page of reviews for the hotel
        1. wait for all reviews to load
            - handle case of no reviews (?) (general retry-x,skip error)
        2. FOREACH review on that page
            1. grab the full html, the text, and the score(s)
                - Store aspect scores in table `scores` w/ raw-review-id, review-id, aspect_name, value
