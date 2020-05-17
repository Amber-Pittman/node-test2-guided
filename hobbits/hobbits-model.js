const db = require("../data/config")

async function create(data) {
	const [id] = await db("hobbits").insert(data)
	return findById(id)
}

async function update(id, data) {
	return null
}

function remove(id) {
	return null
}

function find() {
	return db("hobbits")
}

function findById(id) {
	return db("hobbits").where("id", id).first()
}

module.exports = {
	create,
	update,
	remove,
	find,
	findById,
}
