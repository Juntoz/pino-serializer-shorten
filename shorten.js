function shorten(str, options) {
    options = options || {};

    if (str.length > options.allowedMaxLength) {
        str = str.slice(0, options.first) + options.separator + str.slice(-options.last);
    }

    return str;
}

module.exports = shorten;