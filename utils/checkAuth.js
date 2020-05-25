const { AuthenticationError } = require("apollo-server");
const config = require("config");
const jwt = require("jsonwebtoken");
const JWT_SECRET = config.get("JWT_SECRET");

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, JWT_SECRET);
				return user;
			} catch (err) {
				throw new AuthenticationError("Invalid/Expired token");
			}
		}
		throw new Error("Authentication token must be 'Bearer [token]");
	}
	throw new Error("Authorization header must be provided");
};
