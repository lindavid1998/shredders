import "dotenv/config";
import { CronJob } from "cron";
import fs from "fs";
import redis from "redis";

const pingRedis = async () => {
  try {
    // Create a separate client just for this ping process
    const pingClient = redis.createClient({
      username: "default",
      password: fs.readFileSync(process.env.REDIS_PASSWORD_FILE, "utf-8"),
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    await pingClient.connect();
    console.log("connected to redis");

    const key = "ping";
    await pingClient.set(key, "pong");
    console.log("added", await pingClient.get(key));

    await pingClient.del(key);
    console.log("deleted", key);

    await pingClient.quit();
    console.log("Connection closed gracefully");
  } catch (error) {
    console.log(error);
    console.log("Error pinging Redis");
  }
};

const job = new CronJob(
  // '* * * * * *', // cronTime
  "0 0 * * 0", // cronTime, weekly at 00:00 on Sunday
  function () {
    pingRedis();
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);
