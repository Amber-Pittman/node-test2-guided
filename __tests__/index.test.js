// test("a placeholder test", () => {
//     expect(2 + 2).toBe(4)
// })

const supertest = require("supertest")
const server = require("../index")

    test("GET /", async () => {
        // start by ARRANGING the test data we need
        const endpoint = "/"
        const status = 200

        // then we ACT on whatever we're testing
        const res = await supertest(server).get("/")
        //console.log(res)

        // ASSERT the response data
        expect(res.statusCode).toBe(status)
          // expect(res.headers("content-type")).toBe("application/json") 
        expect(res.type).toBe("application/json") // Same thing as ^^^
        expect(res.body.message).toBe("Welcome to our API")
        expect(res.body.message).toMatch(/api/i)

})