const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Schema
const NinjaSchema = new Schema({
	name: String,
	age: String,
	belt: String,
});

const Ninja = model("Ninja", NinjaSchema);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	# This "Book" type defines the queryable fields for every book in our data source.
	type Ninja {
		name: String!
		age: String!
		belt: String!
		_id: String!
	}
	input NinjaUpdate {
		name: String
		age: String
		belt: String
		_id: String!
	}

	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		getNinjas: [Ninja]!
	}

	type Mutation {
		deleteNinja(_id: ID!): Ninja!
		updateNinja(updatedNinja: NinjaUpdate): Ninja!
		addNinja(name: String, age: String, belt: String): Ninja!
	}
`;
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		getNinjas: async () => {
			const ninjas = await Ninja.find({});
			return ninjas;
		},
	},
	Mutation: {
		addNinja: async (_, { name, age, belt }) => {
			const newNinja = new Ninja({ name, age, belt });
			const ninja = await newNinja.save();
			return ninja;
		},
		updateNinja: async (_, { updatedNinja }) => {
			const afterUpdate = await Ninja.findByIdAndUpdate(
				updatedNinja._id,
				updatedNinja,
				{ new: true }
			);
			return afterUpdate;
		},
		deleteNinja: async (_, { _id }) => {
			const deletedNinja = await Ninja.findByIdAndRemove(_id);
			return deletedNinja;
		},
	},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
mongoose
	.connect(
		"mongodb+srv://mehedi:mehedi@mehedi-mw5jy.mongodb.net/Ninja?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
	)
	.then(() => {
		console.log("MongoDB Database Connected");
		return server.listen({ port: 4000 });
	})
	.then((res) => console.log(`server running at ${res.url}`));
