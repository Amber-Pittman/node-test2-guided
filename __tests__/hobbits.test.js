const supertest = require("supertest")
const server = require("../index")

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