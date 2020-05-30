const getSerializers = require('../index');

function getInReq() {
    return {
        "id": 1,
        "method": "GET",
        "url": "/token/1",
        "headers": {
            "authorization": "Bearer 12345678901234567890123456789012345678901234567890",
            "user-agent": "PostmanRuntime/7.25.0",
            "accept": "*/*",
            "cache-control": "no-cache",
            "postman-token": "492ac79a-c20d-4ab3-ba00-9f6bae1e8c15",
            "host": "localhost:3000",
            "accept-encoding": "gzip, deflate, br",
            "connection": "keep-alive",
            "cookie": `.AspNetCore.Cookies=CfDJ8DVa95S6dSJInuv1bB_0X5SXNHo7j_pXq7xvhaz71trWk
                       ciUTIfhfZeuHA6SZtgY6kn6Jdq-V3LhpkKtX6TLdQUaRyd_9p0OC7cykE7GH6eCCFHZzF
                       hIbMCtW31d5FtFR1_X0Q8Xy-U2BBdYR6sA08OhNF0XGaCICp17MBt20Ngf67oTjlZxAjh
                       gBJYtX_376RU-kVlKI7OLTWj12CNm_l7eQl0P67nP163Q8razQBHiwixpKYKZjeSgNB-
                       ve-2S1J83n8M96Yj6MzXltgY64CcwMyOv7eDkx7AcjjarvBsbrn2KyLpeh-OxBaTy4n0y
                       O0pKNjHD5OZrz5AZCA64X_Qp3shQnw_bKds9cqK_HM7nk5YFk9Yw_axDjrYvkiZXfkeafm
                       58iOQ-jcbexIp4IKTcEwxRECphq9hZRl6EbwCT9_wVlIrahSL1eQu0MKhQI6wjfHPKgPtV
                       MhCdzClZ5W7eoXI6Ug6VruC8-gDBr2jn5uuPuGxp8PnTtnWrpDidRp12tADd80tdXF6MKc6
                       juc9HGtgzmg248__SBtMTh__YmgNed9aDzUt5mgEwTreIG2zUM0ewwSCwVvghZ-z5vzC_E
                       NrZR54TO5na2uXULcJWn7HZucFVIlbh8GIGOeXiG86OWM1q5oNH78U2DXwJdM1aL7vC2XQ
                       njMuevUYwi4f86XxO6wjy0DI4h_xUjrDKOg; MyCookie=123456789012345678901234
                       56789012345678901234567890`
        }
    };
}

test('default options', async() => {
    var sers = getSerializers();

    var outReq = sers.req(getInReq());

    // less than 40 chars, equal
    expect(outReq.headers.host).toBe('localhost:3000');
    // more than 40 chars, shorten
    expect(outReq.headers.authorization).toBe('Bearer 123...1234567890');
    // parseCookie: true >> cookies should be parsed and shorten too
    expect(outReq.headers.cookie).toBe('.AspNetCore.Cookies=CfDJ8DVa95...h_xUjrDKOg; MyCookie=1234567890...1234567890');
});

test('other options', async() => {
    var sers = getSerializers({
        allowedMaxLength: 20,
        first: 5,
        last: 5,
        separator: '---'
    });

    var outReq = sers.req(getInReq());

    // more than X chars, shorten
    expect(outReq.headers['user-agent']).toBe('Postm---.25.0');
    expect(outReq.headers.authorization).toBe('Beare---67890');
    expect(outReq.headers['postman-token']).toBe('492ac---e8c15');
    // parseCookie: true >> cookies should be parsed and shorten too
    expect(outReq.headers.cookie).toBe('.AspNetCore.Cookies=CfDJ8---rDKOg; MyCookie=12345---67890');
});

test('parseCookie false', async() => {
    var sers = getSerializers({
        req: {
            parseCookie: false
        }
    });

    var outReq = sers.req(getInReq());

    expect(outReq.headers.cookie).toBe('.AspNetCor...1234567890');
});