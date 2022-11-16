module.exports = {
	accessToken: String,
	accessTokenExpiresAt: {
		type : Date,	
	},
	refreshToken: String,
	refreshTokenExpiresAt: Date,
	expiryTime: String,
	expiryStatus: false,
	client: Object,
	user: Object
};
