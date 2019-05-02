const AWS = require('aws-sdk');
const pg = require("pg");
AWS.config.update({ region: 'us-west-2' });


let dbConfig = {
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: process.env.post
};



exports.handler = async (event, context, callback) => {
    

};

