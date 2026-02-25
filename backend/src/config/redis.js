// const { createClient } = require("redis");

// const redisClient = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
// });

// redisClient.connect()
//   .then(() => console.log("🔥 Redis connected"))
//   .catch(console.error);

// module.exports = redisClient;

const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.connect()
  .then(() => console.log("🔥 Redis connected"))
  .catch(console.error);

module.exports = redisClient;