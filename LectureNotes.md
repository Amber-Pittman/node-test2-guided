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
        <img src="assets/unit-testing.jpg" alt="Artwork of the Titanic sinking with small circles on different parts of the ship. The heading says 'passing unit tests' in green text." width=750 /> 
    </p>

5. We usually consider 3 questions when we're asserting data from an endpoint.

    * Does it return the expected status code?

    * Does it return the expected data format? - Does it return JSON or does it return something else?

    * Does it return the expected data itself?

### Code Along

1. In package.json, add some config for JSON for Integration Testing using Jest.

    ```
    "jest": {
        "testEnvironment": "node"
    },
    ```

2. Try `npm test` now. It's failing because we don't have any tests yet.

3. For Integration Tests, it's usually convention for them to go into their own folder, as opposed to having the test file right next to the file you're testing. 

    * Jest will automatically look for a folder named `__tests__`.

    * Create a new file inside the tests folder called `index.test.js`.

4. Create a placeholder test just to get things going with the test runner. Assert that 2 + 2 is 4.

    ```
    test("a placeholder test", () => {
        expect(2 + 2).toBe(4)
    })
    ```

5. If you run `npm test` again, Jest looks in the test folder and runs our tests on the file.

6. Our placeholder test is a great starting point for unit tests. However, it's not so great for integration tests. 

7. We need a way to call our endpoint from a test. We'll need a library that can call our endpoint, something like Axios was for React. In this case, we're going to use a library called [SuperTest](https://github.com/visionmedia/supertest). 
    
    * You can install it with npm like so: `npm install supertest --save-dev`.

    * Super Test is a library that is similar to Axios. It can make HTTP requests to a server. It also has some built-in functionality for testing against the responses, which is really nice. 

    * Take a look in the [Examples](https://github.com/visionmedia/supertest#example) to see how you can make a test request to our API.

        * Import SuperTest

        * Get an instance of our express app

        * In order to make an HTTP call with SuperTest, we'll have to actually pass the instance of our Express app to the SuperTest request. 
            
            * We're not just making an actual HTTP request, we're passing the instance of our Express app. Then, under the hood, what SuperTest does is it starts our application on some random port, it makes the request, and then it stops our application. 

            * We just passed that instance of our app to our server to the request object when we actually want to make that request. 

        * Then we can assert against different things like headers, status code, or the response. 

        
        ```
        // import SuperTest
        const request = require('supertest');
        const express = require('express');

        // get instance of our express app
        const app = express();

        app.get('/user', function(req, res) {
        res.status(200).json({ name: 'john' });
        });

        // pass in the instance of the express app to the SuperTest request
        request(app)
            // endpoint to test
            .get('/user')
            // make assertions
            .expect('Content-Type', /json/)
            .expect('Content-Length', '15')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            }
        );
        ```
        
8. If we have to pass an instance of our Express app to the SuperTest instance in order to make that request, it's not going to work with the way we have our index file set up at the moment. The server on the index file was never exported. 

    * Update the index file to export the server. 

    ```
    // index.js

    module.exports = server
    ```

    * If we're importing server into our test file, and we're passing server to SuperTest, then SuperTest starts the server behind the scenes. It's making the requests and then it's stopping the server all automatically. What current problem do we have in our index file?

        * We don't want the server to actually start and listen on the port that we define. We don't want this code to run if we're running our testing suite.

        * Since this is something SuperTest does automatically, it's essentially starting the server twice. 

    * We can fix this in a few different ways. 

        * Pull the listening code out and put it in a different file. You could put it in a file called server.js and in your test you would import index, not server.  

        * The easier way is add an if statement around the `server.listen()` code. 

            * If the value of module.parent is undefined, start the server. Otherwise, don't start the server. 

                * If a file is being required into another file, then module.parent is going to be the path of that file that's doing the requiring. 

                * It's an easy way to check if a file is kind of just being run as a standalone program or if it's being imported into a different program. 
                
                * It can sometimes change the functionality a little bit. In this case, we don't want to start the server if it's being imported into something else because that something else is probably going to start the server. 

            * All this is saying is: <br> "if this index file is being imported/required into another file, don't actually start the server. Just export the instance of the server but don't start it. Otherwise, if this index file is being run directly with node and it's not being required into anything else, go ahead and start the server."

        ```
        if (!module.parent) {
            server.listen(port, () => {
                console.log(`Running at http://localhost:${port}`)
            })
        }
        ```
9. Get rid of your placeholder test in your test file. 

    * Import SuperTest

    * Import the server

    * Write our first integration test.
        
        * Make a get request to the homepage. 
        
        * Give it an async callback this time since we're now working with asynchronous code (promises).

        * Make the test requests to our endpoint with supertest by using await.

        * Call SuperTest as a function

        * Pass the instance of the server into the SuperTest function as the only parameter.

        * Now we make a _real_ call the HTTP request and the endpoint we want

        * Assign the callback to a variable

        * Logout the variable to see what's in there. 

        * Run your test `npm test`.
            
            * You'll get a passing test because we're not actually asserting anything at this point. We're not really checking anything in the test, just making a request.

            * We do get a huge object in the console of the terminal. There are some really useful things found in this object that we can now assert against to make sure our endpoint is returning the proper data. 

                * The response body

                * The response headers

                * Status code

        * Run assertions against our response

            * When we're setting up our integration tests, it helps to think of the "Triple A Steps."

                * Arrange, Act, and Assert

            * Arrange some data
                
                * create a variable for the endpoint

                * Create a variable for the status code you're expecting

            * Act on the data 

            * Assert the response data

                * The status code

                * Get the expected data format from the content-type header with the value of the content type ought to be. We're expecting the content type to be application/JSON. We want to make sure we're getting JSON.

                    * If you don't want to type out headers with an index of content-type, supertest makes it easy. We can just say res.type

                    * `res.type` is shorthand for `res.headers("content-type")`

                * The expected data itself

                    * What's our response data that we're expecting from our route/endpoint?

                    * We're just expecting a message - you would know this by looking in the index file on the endpoint. Just the simple message is all you'd get back.

                    * We expect the response body's message to be the Welcome message. 

        * Side note: You don't have to arrange you code into chunks in this order. It just helps as a starting point when writing your tests. Sometimes it just makes more sense to just put them inline like we've been doing before. It kind of saves a little code and space. As long as you understand the 3 steps of setting up a test, you can put it however you want it. 

            * We start by arranging some data, acting on that data, and then checking/asserting the data. 

            * Feel free to make this all in-line if that looks nicer to you.

        * Save your file and run the test again using `npm run test:watch` so you don't have to keep restarting your test. Your test should be passing.

        * Experiment:

            * Change the text that gets responded with and that welcome route to "Hello." It should cause the test to fail. We received the value of Hello. but we expected Welcome to our API.

                * Change what your API actually responds with and then run your test again. 

                * Don't forget to change Hello. back to the original message.

            * Instead of testing against the specific string, you could use a regex - kind of a pattern. Instead of saying "Welcome to our API," you could say something like "to match the Regex value of welcome with i to make it case _in_sensitive."

                * Make sure it returns something similar to this pattern that might be a little more flexible.

                * If `/welcome/i` is in the toMatch value, the word welcome better be in there in order to pass. You could replace "welcome" with "api" and the test would pass as long as the message on the endpoint had the word api in it.
        
        * We've now completely automated the process of going into insomnia, creating the new endpoint manually, manually testing it every time we make a change, etc. We can write these tests for thousands of endpoints and just run them all at once with a single command. If any one of them stops working at any point in the future, we'll know right away because our tests will start failing.
            

        ```
        const supertest = require("supertest")
        const server = require("../index")

        test("GET /", async () => {
            // ARRANGE
            const endpoint = "/"
            const status = 200

            // ACT
            const res = await supertest(server).get(endpoint)
            //console.log(res)

            // ASSERT
            expect(res.statusCode).toBe(status)
                // expect(res.headers("content-type")).toBe("application/json") 
            expect(res.type).toBe("application/json") // Same thing as ^^^
            expect(res.body.message).toBe("Welcome to our API")
            //expect(res.body.message).toMatch(/api/i)
        })
    
        ```
10. Setup a new database environment for automated testing

    * If we were using persisted data in our automated tests like a database connection, we might want to use a separate database that's only used in automated testing. 
        
        * That way, we can keep our other dev database (or potentially production database) untouched. We just have a specific database for testing. That would be useful to set up. 

    * In the knexfile, we're connecting to a database file called `hobbits.db3`. We don't want to touch that database during our automated tests. We want to leave that database for manual testing or may that has real data in it. 
        
        * We want to work in a separate database when we're testing. We can do that pretty easily with Knex.

        * Inside the knexfile, take the code and put it into a sub-object called development. 

            * Wrap everything in another object called with the key, `development`.

        * Now that we have that in a sub-object of development, that's kind of considered the database environment. 
        
    * We can make additional environments. If we wanted to, we could use hobbits.db3 for development while we also use something different for testing. 

        * Make a testing environment and then copy all that code from development into it. Then change the name of the database file from hobbits to hobbits-test.

        * Now we have the ability to work from different database files if we need to, depending on the environment.

        ```
            module.exports = {
                development: {...},
                testing: {...},
            }
        ```

    * If you haven't already, install knex. `npm install knex`

    * Go into the console. Run the latest migration and specify the testing environment with `npx knex migrate:latest --env=testing`. 
        
        * Side Note: If you wanted to have it check the development environment, you would change the end to `--env=development`. 

        * After running the test migration, we now have hobbits.db3 as well as hobbits-test.db3

    * Seed the test environment as well. `npx knex seed:run --env=testing`

    * While it's easy to run these knex commands from the terminal, we're just running them manually. But what about when our app is running? How do we determine which database to connect to? It's not going to know whether it should connect to the hobbits database or the hobbits-test database. 

        * Look in the data/config file. This is where we can actually specify which database to connect to. 

        * Right now, we're just passing the entire config file to the instance of knex. That's because we weren't specifying environments before. Now that we have 2 different environments, we have to specify which one to use. 

        * In the exports, specify knexfile.development or knexfile.testing.

        * There's a problem with specifying an environment like this though: 
            
            * If you specify one, the other won't run. You need both environments. It's static; hardcoded. It'll never connect to the other environment. 

            * It's manual and you'd have to go back every time. 

    * How do we make Jest use the testing database instead, without hardcoding the environment? We want it to be more dynamic. We use an environment variable. We're now dealing in values that are different between environments. 

        * We could use `.env` library and save it in a .env file. 

        * An easier way when we're testing with Jest, we'll use a library called [Cross-Env](https://github.com/kentcdodds/cross-env). 
        
        * Cross-Env allows us to set environment variables inline when we run the script itself rather than using a .env file. We just prefix the actual script command with environment variables. Due to differences between how Windows and other OS's handle environment variables, using the Cross-Env library makes it more universal. 

        * Install Cross-Env. `npm install --save-dev cross-env`

        * Go into package.json and add the build script, making sure to reference Cross Env, then the key values for our environment variables (NODE_ENV=production) and then the script we want to run. 

            * In our package, when we call our start:watch commands, we can prefix those with Cross End. Let's create an environment variable called NODE_ENV and set it to development when we're running nodemon. 

            * Add the same thing to our tests and watch commands so that when we run Jest, we want the environment to be testing. 

            * For the start command, set it to production so that it's a little different from the watch command.

        * If you wanted to specify the port on other environment variables without a .env file, specify another port on an environment with PORT=5000 (or something like that). You just separate them with spaces.
            
            * What about for secret stuff? 
                
                * You can't set environment variables this way. If you have secret values, this is only for values that are not sensitive. 

                * If they are sensitive, you have to use .env files. 
    
    ```
    "scripts": {
        "test:watch": "cross-env NODE_ENV=testing PORT=5000 jest --watch",
        "test": "cross-env NODE_ENV=testing jest",
        "start:watch": "cross-env NODE_ENV=development nodemon index.js",
        "start": "cross-env NODE_ENV=production node index.js",
        "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
    },
    ```

    * Now that we have our environment variables setup in the package.json file, how do we use the environment variables in our config file? 
        
        * Instead of hardcoding .development, use square brackets, like we're looking up an item from an array, and then we pass `process.env.NODE_ENV`. That will then use the value of that environment variable as the database environment. 

        * If you haven't done this before, you can lookup a value in an object using a variable as the key name if it's wrapped in square brackets.

        * Now, if NODE_ENV is equal to testing, it's going to use the testing environment in the knexfile. If NODE_ENV is development, it's going to use the development environment.

        * If you run this up on Heroku, for example, and you call start, it sets it to production and then it's going to look for a production environment in the knexfile. Since it doesn't exist yet, you'll probably get an error. 

    * When we run our server with nodemon, we're going to connect to the dev database. If we run our tests with Jest, it's going to connect to the test database. 
        
        * If you start your app in production, like on Heroku with `npm start` to connect a production database which we haven't created/specified yet. You can specify that if you want a different database file for production. 

    ```
    const knex = require("knex")
    const knexfile = require("../knexfile")

    module.exports = knex(knexfile[process.env.NODE_ENV])
    ```

    

11. Since we're now set up to connect to a test database, let's create a test for an endpoint that already exists. In the hobbits router, the `.get("/")` just lists out all of the hobbits in our database. 

    * Create a new test file called hobbits.test.js inside the test folder. 

    * Import SuperTest and the server.

    * Since we're going to have several different tests in this file, let's wrap them in a describe block. 

        * Describe it as "Hobbits integration tests", give it a HOF

    * Write the new test inside the describe block
        
        * It/test and describe it

        * Async callback

        * Using a variable, make the supertest request with await 
        
        * Pass in the server to supertest

        * Make the HTTP request to hobbits
        
        * Make an assertion. 

            * What should we check for?

                * What's the status code? **Expect this on every test!**

                * What's the content type? **Expect this on every test!**

                * Did we receive a list of data? 

            * Expect the status code to be 200

            * Expect the type to be application/json

            * Expect the length of the res body to be more than 1 or return a total of 4 hobbits

            * Expect the res body at the index of 0 the name to be Sam

                * Since we have 4 different hobbits, we don't have to make sure we're getting each one specifically. We can just choose one. Let's check the name of the first one that gets returned and make sure it's not empty. 

                * Take a look in the seeds file. You'll see the data has Sam first. 

                * If you wanted to, you could do another one for a different index. No need to check the entire list, though. 

        * Run the test to see if it passes. `npm run test:watch`. Both the index test and the hobbits test should pass.

            * You may get a weird warning `a worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown.`

                The reason the warning is showing is because when knex  connects to our SQLite database, it keeps that connection open until the server stops. 
                
                It keeps that database connection open so when our test is running, our tests don't know to actually close that database connection. The connection just kind of hangs after the test has completed. Therefore, our test runner never actually stops.

            * **_Solution:_** <br>
                To fix this, all we have to do is go into our test file, import the config file. 
                    
                Then, if we use one of the Jest hooks, which is the afterALL() function. "Run this function after all of our tests are finished running." 
                
                Make it an asynchronous HOF
                
                Call await db.destroy

                This will close our database connection after all of the tests are running and it will get rid of that warning. Our teardown in now complete.

            ```
            // hobbits.test.js \\
            const supertest = require("supertest")
            const server = require("../index")
            const db = require("../data/config")

            afterAll(async () => {
                await db.destroy()
            })

            describe("hobbits integration tests", () => {
                it("GET /hobbits", async () => {
                    const res = await supertest(server).get("/hobbits")

                    expect(res.statusCode).toBe(200)
                    expect(res.type).toBe("application/json")
                    expect(res.body).toHaveLength(4)
                    expect(res.body[0].name).toBe("sam")
                    expect(res.body[2].name).toBe("pippin")
                })
            })        
            ```

12. Run a new test for getting a hobbit by the ID.
        
    * We have an endpoint for listing all the hobbits. We want to create another endpoint for getting a single hobbit by the ID. And we want a supporting test for it. We will also need to fill out our hobbits-model functions.
    
    * Since we're focusing on Test-Driven Development, the first thing we want to do is write the new test inside that describe block. 

        * Say that you're getting the hobbits by ID.

        * Expect a 200 status code

        * Expect the content type to be json

        * Expect the hobbit name to be Frodo

    * If you ran your test, it would fail right now. Expected a 200, received a 404 because the endpoint doesn't exist yet. 

    * Create the new endpoint in the hobbits router file. You can just copy the original endpoint and update it. Make sure you tag the id on the end of the path. 

        * Since we're not returning a list of the hobbits, get rid of the `res.json` call and replace it with a variable. 

        * Instead of `Hobbits.find()`, you'll want to change to the `findById()` method and pass through the ID from the params.

        * In the event the hobbit does not exist, return a 404 status.

        * Then just send it back to the response.

    * The `findById()` isn't doing anything yet. Go into the hobbits-model and under findById(), call return db hobbits where the ID is equal to the ID that we get passed as a parameter. End it with a `.first()`

        * When we call .first(), we're really calling `LIMIT 1 .SELECT`. The first method is going to return an array by destructuring the variable. `const [hobbit] = db("hobbits").where("id", id).limit(1).select()` turns into `const hobbit = db("hobbits").where(...).first()`.

    ```
    // HOBBITS TEST \\
    
    describe("hobbits integration tests", () => {
        it("GET /hobbits", async () => {...})

        it("GET /hobbits/:id", async () => {
            const res = await supertest(server).get("/hobbits/2")

            expect(res.statusCode).toBe(200)
            expect(res.type).toBe("application/json")
            expect(res.body.name).toBe("frodo")
        })
    })


    // HOBBITS ROUTER \\

    router.get("/:id", async (req, res, next) => {
        try {
            const hobbit = await Hobbits.findById(req.params.id)

            if(!hobbit) {
                res.status(404).json({
                    message: "Hobbit not found"
                })
            }
            res.json(hobbit)
        } catch(err) {
            next(err)
        }
    })


    // HOBBITS MODEL \\
    
    function findById(id) {
        return db("hobbits").where("id", id).first()
    }
    ```

13. Test for a hobbit that does not exist.

    * Copy the Get Hobbits By Id test. 

    * Add a note in the description that this test is for nonexistent hobbits. 

    * Provide an ID number that's large enough to not exist.

    * Only assert a 404 status code. It's usually enough to check for the error code. 


    ```
    // HOBBITS TEST \\
    
    describe("hobbits integration tests", () => {
        it("GET /hobbits", async () => {...})

        it("GET /hobbits/:id", async () => {...})

        it("GET /hobbits/:id (NOT FOUND)", async () => {
            const res = await supertest(server).get("/hobbits/50")

            expect(res.statusCode).toBe(404)
        })
    })



14. Create another endpoint for creating a hobbit. Currently, we have an endpoint to get a list of all hobbits and we have an endpoint to get individual hobbits by their ID. Now we want to create a POST endpoint for creating one. 
    
    * Create your variable and make a post request to hobbits. 

    * We need to send some data through a payload. We'll create a data variable that is an object for our new hobbit. Let's give it a name. 

    * Then we _send_ the payload through our supertest request and we say `.send()` and pass in the data variable. That will send it as the request body.

    * Make assertions

        * Since we're creating a new hobbit/resource, the status code should be a 201. 

        * Check for content type.

        * Check for the new hobbits name.

    * Create the actual endpoint on the router file.

        * Call one of the model functions. Since we're creating a new hobbit, use the `create()` function.

        * Pass the request body at the request data. Assign a variable with the Hobbits object to create it and pass in the request body. This is asynchronous, so make sure await is in it.

        * Return it with a status of 201 and pass in the hobbit data. 

    * Implement the create function in the model file.

        * The endpoint is asynchronous. Therefore, the function should start with await.

        * Call the database on the hobbits table

        * Then insert that data that is passed in through the params. It will return a list of new IDs. So we'll destructure that into a single ID by using a variable of ID inside square brackets.

        * Just return the new row that's inserted by the findById method and pass in the ID we received.

    * When the test runs, your tests should pass. But if you try testing again, one of your tests will fail because one of the tests expects the length of the hobbits list to be 4 but after adding Bilbo, the number has changed. Running the test is just going to keep incrementing the number of hobbits on the list.

    * How can we take the new hobbits into account each time to make that value more dynamic? Trick question! We don't change that length assertion. 

        Instead, we want to tackle the problem from a different perspective. We actually want to reset the database each time the test changes something. We essentially want each test to start with a fresh copy of the database.

        To reset the data in the database, we'll use seeding. In the hobbits test file just above the afterAll function, we'll create another hook. We'll use the `beforeEach()` function. It will be async. Inside the beforeEach, call await db and run the seed. 

        Now when we run the test, our tests will pass. Each individual test now has it's own fresh database to test against. It resets every time.

        Remember that our test runner is running against our testing database file, so it's reseeding the test database over and over. Our primary database is not even being touched at all. The `hobbits.db3` file is just staying untouched. 

        By applying the beforeEach hook, our tests are predictable; we know exactly what data is going to be in the database when we run a test. 

    * Save and test again. They should be passing no matter how many times you run them over and over again. 

        ```
        // HOBBITS TEST \\

        // resets the testing database for each test
        beforeEach(async () => {
            await db.seed.run()
        })
        
        describe("hobbits integration tests", () => {
            it("GET /hobbits", async () => {...})

            it("GET /hobbits/:id", async () => {...})

            it("POST /hobbits", async () => {
                const data = { name: "bilbo"}
                const res = await supertest(server).post("/hobbits").send(data)

                expect(res.statusCode).toBe(201)
                expect(res.type).toBe("application/json")
                expect(res.body.name).toBe("Bilbo")
            })
        })


        // HOBBITS ROUTER \\

        router.post("/", async (req, res, next) => {
            try {
                const hobbit = await Hobbits.create(req.body)
                res.status(201).json(hobbit)
            } catch(err) {
                next(err)
            }
        })


        // HOBBITS MODEL \\
        
        async function create(data) {
            const [id] = await db("hobbits").insert(data)
            return findById(id)
        }
        ```

## Random Questions
1. **Q:** How to Test for a 404? <br>
**A:** How do you write a test to ask for multiple outcomes with one assertion? You cannot. Your test should only be checking for one thing, for one return value. If you need to test for different outcomes, then maybe that would be time for a different/separate test. 

2. **Q:** Where Do we store test coverage if using jest.config? <br> 
**A:** If we run Jest with coverage flag `npm run test -- --coverage`, it will tell you which pieces of your code has been tested and which pieces have not been tested. It will give you kind of a summary in the command line. 

    A coverage folder gets generated when your run test coverage. If you look in that new coverage folder, under the LCOV report folder, there's an index.html file. It will give you an overview, line by line, of what's in your code. It will tell you what's being tested and what's not. 

    Viewing the index file on our browser, we can go into the hobbits model and we can see that our create model was tested at some point. We'd also see that both our find() and findById() methods were tested. But update() and remove() were never called so they were never tested.

    You can look in your test coverage to see if you need more tests to cover different things that you may have missed before. 

    You want to try to get as much test coverage as possible. Right now, we're at about 82% - 83% test coverage. You aim for 100% but that's not always realistic but you can try to get as close as you can. 

3. **Q:** What's a way to get better at problem solving in general? <br>
**A:** It just takes a lot of persistence. Don't get discouraged by errors in your console. Look at that as an opportunity to learn how to problem-solve a little better. 

    Seeing a lot of different errors and going through a lot of different scenarios, will really help out with your problem solving skills in general. The biggest thing with that is to just don't be afraid of errors. If you see an error, maybe that should get you kind of excited to delve in and figure out what's actually going on. 

4. **Q:** Have you heard of [Deno](https://deno.land/v1)? <br> 
**A:** It's sort of like Node 2.0. Deno was created by Ryan Dahl, the same person who created Node. 

5. **Q:** Is Typescript hard to learn?<br> 
**A:** No. Typescript is basically just JS with some additional syntax for types. Actually, any JS file is valid Typescript. Typescript is just a _superset_, so there's additional stuff on top of it that help with certain things.

6. **Q:** When you use Typescript, do you care about the resulting compiled file? <br>
**A:** Nope. The output of your typescript is going to look like garbage. However, it's going to work really well because that's optimized. It's not meant to look at, it's meant to run. So no, you don't have to worry about the output files.