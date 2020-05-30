const { err, req, res, wrapErrorSerializer, wrapRequestSerializer, wrapResponseSerializer } = require('pino-std-serializers');
const _ = require('lodash');

function initOptions(options) {
    return _.merge({
        allowedMaxLength: 40,
        first: 10,
        last: 10,
        separator: '...',
        req: {
            enabled: true,
            parseCookie: true
        }
    }, options);
}

function get(options) {
    options = initOptions(options);

    var export_req = req;

    if (options.req.enabled) {
        export_req = wrapRequestSerializer(require('./customreq')(options));
    }

    return {
        err,
        req: export_req,
        res
    };
}

module.exports = get;