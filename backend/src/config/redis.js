const { createClient } = require("redis");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.connect()
  .then(() => console.log("🔥 Redis connected"))
  .catch(console.error);

module.exports = redisClient;
