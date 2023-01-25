const mongoose = require("mongoose")
const createServer = require("../index")

beforeEach((done) => {
	mongoose.connect(
		"mongodb://localhost:27017/smdcloud",
		{ useNewUrlParser: true },
		() => done()
	)
})

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
})

const app = createServer()

test("GET /api/accounts/", async () => {

	const post = await Post.create({
		title: "Post 1",
		content: "Lorem ipsum",
	})

	await supertest(app)
		.get("/api/accounts/")
		.expect(200)
		.then((response) => {
			expect(response.body._id).toBe(post.id)
			expect(response.body.title).toBe(post.title)
			expect(response.body.content).toBe(post.content)
		})
})
