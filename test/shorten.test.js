var shorten = require('../shorten');

test('shorten', async() => {
    var opts = { allowedMaxLength: 5, first: 1, last: 1, separator: '...' };

    expect(shorten('1234567', opts)).toBe('1...7');
    expect(shorten('', opts)).toBe('');
    expect(shorten('12345', opts)).toBe('12345');
    expect(shorten('12345 67890', opts)).toBe('1...0');
});

test('shorten opts null', async() => {
    var opts = null;

    expect(shorten('1234567', null)).toBe('1234567');
    expect(shorten('1234567', {})).toBe('1234567');
});