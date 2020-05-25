const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
	watched: [
		{
			videoId: String,
			title: String,
			thumbnail: String,
		},
	],
	liked: [
		{
			videoId: String,
			title: String,
			thumbnail: String,
		},
	],
});

module.exports = model("User", userSchema);
