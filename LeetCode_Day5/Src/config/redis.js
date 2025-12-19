const { createClient } = require("redis");
// import { process } from './../../../LeetCode_Day2 copy/node_modules/ipaddr.js/lib/ipaddr.js.d';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: 16212
    }
});

module.exports=redisClient;