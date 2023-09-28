const { test, expect } = require('@jest/globals');
const { sortPages, generateReport } = require('./report.js');

test('Page are sorted by count', () => {
    const testPages = {
        a: 3,
        b: 1,
        c: 0,
        d: 5,
    };
    const t = sortPages(testPages);
    expect(t).toStrictEqual({
        d: 5,
        a: 3,
        b: 1,
        c: 0,
    });
});

test('Report is sorted and formatted correctly', () => {
    const testPages = {
        a: 3,
        b: 1,
        c: 0,
        d: 5,
    };
    const t = generateReport(testPages);
    const expLines = [];
    expLines.push('Found 5 internal links to d');
    expLines.push('Found 3 internal links to a');
    expLines.push('Found 1 internal links to b');
    expLines.push('Found 0 internal links to c');
    expect(t).toBe(expLines.join('\n'));
});
