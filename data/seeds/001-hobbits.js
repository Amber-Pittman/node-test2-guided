exports.seed = async function(knex) {
	await knex("hobbits").truncate()
	await knex("hobbits").insert([
		{ name: "sam" }, // index 0 ID 1
		{ name: "frodo" }, // index 1 ID 2
		{ name: "pippin" }, // index 2 ID 3
		{ name: "merry" }, // index 3 ID 4
	])
}
