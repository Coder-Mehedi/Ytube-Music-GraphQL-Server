const userResolver = require("./users");
const videoResolver = require("./videos");

const rootResolver = {
	Query: {
		...videoResolver.Query,
	},
	Mutation: {
		...userResolver.Mutation,
		...videoResolver.Mutation,
	},
};

module.exports = rootResolver;
