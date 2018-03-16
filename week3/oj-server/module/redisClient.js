// singleton
var redis = require('redis');
// only one client is created
var client = redis.createClient();

// only call our own wrapper set and get to store and get to store and get values from redis
function set(key, value, callback) {
    // error is the first argument, so that we don't forget to handle the error
    client.set(key, value, function(err, res) {
        if (err) {
            console.log(err);
            return;
        } 
        callback(res);
    });
}

function get(key, callback) {
    // error is the first argument, so that we don't forget to handle the error
    client.get(key, function(err, res) {
        if (err) {
            console.log(err);
            return;
        } 
        callback(res);
    });
}

// only store the keys in timeInseconds seconds
// once expired, keys will be deleted
// since the cache is limited and may not be synchronized with database, data only valid during a period which depends application
function expire(key, timeInseconds) {
    client.expire(key, timeInseconds);
}

function quit() {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print // directly export the function in redis
}
