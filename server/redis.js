const redis = require('redis');
const fs = require('fs');
const password = fs.readFileSync(process.env.REDIS_PASSWORD_FILE, 'utf-8');

const redisClient = redis.createClient({
	username: 'default',
	password: password,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
});

(async () => {
	await redisClient.connect();
})();

module.exports = redisClient;
