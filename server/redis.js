const redis = require('redis');

const redisClient = redis.createClient({
	// connection string format -> redis[s]://[[username][:password]@][host][:port][/db-number]:
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

(async () => {
	await redisClient.connect();
})();

module.exports = redisClient;