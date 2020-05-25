const { ApolloServer } = require("apollo-server");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
	playground: true,
	introspection: true,
});

const PORT = process.env.PORT || 4000;
connectDB();
server
	.listen({ port: PORT })
	.then(({ port }) => console.log(`Server Started On Port ${port}`));
