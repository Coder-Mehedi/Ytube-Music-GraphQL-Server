const User = require("../../model/User");
const checkAuth = require("../../utils/checkAuth");
const axios = require("axios");
const API_KEY = "AIzaSyD3kwwIJVOaEdie8g_PJs5-dxl-OGZe-80";
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const getStats = async (videoId) => {
	const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;
	const res = await axios.get(statsUrl);
	return res.data.items[0].statistics;
};

module.exports = {
	Query: {
		getWatchedVideos: async (_, __, context) => {
			const { id } = checkAuth(context);
			const users = await User.findById(id);
			return users.watched;
		},
		getLikedVideos: async (_, __, context) => {
			const { id } = checkAuth(context);
			const users = await User.findById(id);
			return users.liked;
		},
		popularMusic: async () => {
			const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&chart=mostPopular&regionCode=US&videoCategoryId=10&maxResults=20&key=${API_KEY}`;
			const res = await axios.get(url);
			let musics = res.data.items;
			let listOfMusic = [];

			musics.forEach((music) => {
				const data = { ...music, thumbnails: {} };
				data.title = music.snippet.title;
				data.channelTitle = music.snippet.channelTitle;
				data.thumbnails.high = music.snippet.thumbnails.high.url;
				listOfMusic = [...listOfMusic, data];
			});
			return listOfMusic;
		},
		searchMusic: async (_, { artist, title }) => {
			const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${artist}-${title}&key=${API_KEY}`;

			const res = await axios.get(url);
			let musics = res.data.items;
			let listOfMusic = [];
			musics.forEach(async (music) => {
				const data = { ...music, thumbnails: {} };
				data.id = music.id.videoId;
				data.title = music.snippet.title;
				data.channelTitle = music.snippet.channelTitle;
				data.thumbnails.high = music.snippet.thumbnails.high.url;
				listOfMusic = [...listOfMusic, data];
			});
			// console.log(listOfMusic);
			return listOfMusic;
		},
	},

	Mutation: {
		addWatch: async (_, { videoId, title, thumbnail }, context) => {
			const { id } = checkAuth(context);
			const user = await User.findById(id);
			const found = user.watched.find((video) => video.videoId === videoId);
			if (found) {
				console.log(found);
				return;
			}
			user.watched.push({ videoId, title, thumbnail });
			await user.save();
			return { id: videoId, title, thumbnail };
		},
		addLike: async (_, { videoId, title, thumbnail }, context) => {
			const { id } = checkAuth(context);
			const user = await User.findById(id);
			user.liked.push({ videoId, title, thumbnail });
			await user.save();
			return { id: videoId, title, thumbnail };
		},
	},
};
