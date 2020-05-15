# Testing the Backend
In this lecture, we're going to focus on Integration Tests. Integration tests are little more complicated than Unit tests, but not by much. 

### Big Picture Ideas

1. Difference Between Integration Testing and Unit Testing:

    * Unit testing is just testing small pieces of code like pure/helper/utility functions; testing small, isolated, self-contained functions. 
    
    * Integration testing is testing how functions are working together as a whole, not just a single function. 

2. How have we been running our integration tests up until now? 
    
    * We have been doing it manually, running integration tests against API by using Insomnia to do things like test endpoints to get a response. That's integration testing... It's just manual. 

    * Manual integration testing is extremely slow and tedious. It can be really repetitive. 

3. Why is the act of calling an endpoint considered an integration test? What goes into that endpoint that makes it an integration test and not a unit test? 

    * It's testing multiple parts of the app or system. It's testing the route handler, all of our middleware, the request handling, the response handling, etc. 
    
    * It is testing that whole flow of receiving a request and responding with something. That tests a lot of different functions all at once. 

4. Most of the time, integration tests are way more important than unit tests. If you only have time to write one type of testing in your system, you're going to want to write integration tests. 
    
    * This is _especially_ true in our backends because we want to make sure our app is running as expected. We want to make sure we're not saving corrupt data in the database, for example. 
        
        * Remember, you can't traverse corrupted data in your database -- unless you restore backup of the database somehow. 

        * We have to be really careful with our data, which is why testing is so crucial in the backend. It's really difficult to reverse corrupt data that comes as a result of bugs. 

5. Different types of testing

    * Unit testing is small-time. It's checking self-contained pure/helper/utility functions. Unit testing is like making sure that a light turns on and off. Another example is checking to make sure that the door opens and closes and locks. 

    * But if the ship is sinking, those small details (the unit tests) don't really matter that much. 

    * Integration tests help us to see if our ship is still afloat or if our ship is sinking. That really is the most important thing. 

    <p align="center">
        <img src="assets/unit-testing.jpg" alt="Artwork of the Titantic sinking with small circles on different parts of the ship. The heading says 'passing unit tests' in green text." width=750 /> 
    </p>