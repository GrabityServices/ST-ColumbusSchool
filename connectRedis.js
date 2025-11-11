const redis = require("redis");
const client = redis.createClient({
   username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on("error", (err) => console.log("Redis Client Error", err));
async function Connected() {
  await client.connect().then(() => console.log("Redis connected"));
}

Connected()
module.exports = client;