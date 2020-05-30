# pino-serializer-shorten
Create a custom wrapper serializer for pino to reduce the footprint of the `req` object.

What it basically does is to shorten the values that comes in the `req.headers` object.

For now.

The idea is that, in the future, we can also extend it to filter `err` and `res` objects, and other fields as well.

## How to install?
```
npm i @juntoz/pino-serializer-shorten
```

## How to use?
First require the package.

The entrypoint is a method that accepts an `options` object and returns the serializers object as `pino-http` requires.

```
const getSerializers = require('@juntoz/pino-serializer-shorten');

var kpl = require('koa-pino-logger')({
    // ... other options
    serializers: getSerializers(options)
});

koaApp.use(kpl);
```

This package uses the official `pino-std-serializers` package, so it should be fully compliant with `pino` and `pino-http`.

NOTE: my app uses `koa`, so I have not tried it in other type of applications using `pino`.

### Options
The options object default values and structure is:
```
{
    // max length that the serializer allows. If the string is bigger, it shortens its length. Default 40 chars.
    allowedMaxLength: 40,
    // when the string exceeds the max length, present the first X characters. Default 10 chars.
    first: 10,
    // when the string exceeds the max length, present the last X characters. Default 10 chars.
    last: 10,
    // when the string exceeds the max length, separate the first and last characters with this string. Default '...'.
    separator: '...',
    // configuration for the req serializer
    req: {
        // enabled? Default true. If not enabled, it will use the default pino-std-serializers.req serializer.
        enabled: true,
        // whether to parse the cookie header. Default true.
        parseCookie: true
    }
}
```

## Parsing the cookie
When the setting `req.parseCookie == true`, the library will detect the `req.headers.cookie` field and it will apply a special logic.

Each request could receive multiple cookies, therefore it may be important to know what is inside, while still keeping your logs short.

If the setting is true, it will apply the same settings to each cookie and return the short version of each value.

If the setting is false, it will treat the field as a simple string and apply the shorten logic.

For example, for this `req.headers.cookie`

```
{
    "headers": {
        // ...
        "cookie": `.AspNetCore.Cookies=CfDJ8DVa95S6dSJInuv1bB_0X5SXNHo7j_pXq7xvhaz71trWk ciUTIfhfZeuHA6SZtgY6kn6Jdq-V3LhpkKtX6TLdQUaRyd_9p0OC7cykE7GH6eCCFHZzF hIbMCtW31d5FtFR1_X0Q8Xy-U2BBdYR6sA08OhNF0XGaCICp17MBt20Ngf67oTjlZxAjh gBJYtX_376RU-kVlKI7OLTWj12CNm_l7eQ; MyCookie=123456789012345678901234 56789012345678901234567890`
    }
};
```

If true, it will come up as:
```
cookie: .AspNetCore.Cookies=CfDJ8..._l7eQ; MyCookie=12345...67890
```
where each cookie is kept and the contents are shortened.

If false, on the other hand, it will treat it as a simple string
```
cookie: .AspN...67890
```
## Test
Use this
```
npm test
```
The tests are basically verifying that the conversion logic works. It does not seem to require any test involving `pino` or `pino-http`.

# The Future
What other features are in the pipeline?
1. Extend to `err` and `res` objects, although these two are not that large usually.
2. Select which headers to apply the shortened logic and which should not.
3. Select which root fields to apply this logic.
4. Parsing Cookies to have its own settings of shortening.
5. Try to make it more performant (run some benchmarks, tune the logic, not use lodash or cookie readers, etc).
6. Remove all headers instead of shorten them.