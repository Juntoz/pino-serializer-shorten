const shorten = require('./shorten');
const _ = require('lodash');
const cookie = require('cookie');

function setup(options) {
    return function fn(req) {
        // clone the req to not affect the original
        var creq = Object.assign({}, req);
        applyToObject(creq.headers, Object.keys(creq.headers), options);
        return creq;
    };
}

function applyToObject(object, keys, options) {
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = object[key];
        if (_.isString(value)) {
            if (key == 'cookie' && options.req.parseCookie) {
                var cookiesAsObj = cookie.parse(value);
                value = toCookieString(applyToObject(cookiesAsObj, Object.keys(cookiesAsObj), options));
            } else {
                value = shorten(value, options);
            }

            object[key] = value;
        }
    }

    return object;
}

function toCookieString(obj) {
    var result = [];
    for (const key in obj) {
        result.push(cookie.serialize(key, obj[key]));
    }

    return result.join('; ');
}

module.exports = setup;