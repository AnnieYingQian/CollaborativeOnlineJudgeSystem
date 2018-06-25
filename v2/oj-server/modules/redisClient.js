var redis = require('redis');
var client = redis.createClient();

function set(key, value, callback) {
    client.set(key, value, function(err, res) {
        if (err) {
            console.log(err);
            return;
        }

        callback(res);
    });
}

function get(key, callback) {
    client.get(key, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        callback(res);
    });
}

function expire(key, timeInSecond) {
    client.expire(key, timeInSecond);
}

function quit() {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print
}

