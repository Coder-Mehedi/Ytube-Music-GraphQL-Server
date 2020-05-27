const { gql } = require("apollo-server");

module.exports = gql`
	type Video {
		id: String!
		title: String!
		thumbnail: String!
	}

	type PopularMusic {
		id: String!
		title: String!
		channelTitle: String!
		thumbnails: Thumbnails!
		statistics: Statistics!
	}

	type SearchMusic {
		id: String!
		title: String!
		channelTitle: String!
		thumbnails: Thumbnails!
	}

	type Thumbnails {
		high: String!
	}

	type Statistics {
		viewCount: String!
		likeCount: String!
		dislikeCount: String!
		commentCount: String!
	}

	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
		watched: [Video]!
	}

	input RegisterInput {
		username: String!
		email: String!
		password: String!
		confirmPassword: String!
	}

	type Query {
		getWatchedVideos: [Video]!
		getLikedVideos: [Video]!
		popularMusic: [PopularMusic]!
		searchMusic(artist: String!, title: String!): [SearchMusic]!
	}

	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		addWatch(videoId: String!, title: String!, thumbnail: String!): Video!
		addLike(videoId: String!, title: String!, thumbnail: String!): Video!
	}
`;
