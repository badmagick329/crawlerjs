const { test, expect } = require('@jest/globals');
const { normalizeURL, getURLsFromHTML } = require('./crawl.js');

test('The query params are ignored', () => {
    const t = normalizeURL('https://www.google.com/search?q=test');
    expect(t).toBe('https://www.google.com/search');
});

test('Trailing slash is ignored', () => {
    const t = normalizeURL('https://www.google.com/search/');
    expect(t).toBe('https://www.google.com/search');
});

test('http protocol returns the same result', () => {
    const t = normalizeURL('http://www.google.com/search/');
    expect(t).toBe('http://www.google.com/search');
});

test('Invalid URL should throw TypeError: Invalid URL', () => {
    expect(() => normalizeURL('google')).toThrow('Invalid URL');
    expect(() => normalizeURL('  google.com ')).toThrow('Invalid URL');
    expect(() => normalizeURL('google.com')).toThrow('Invalid URL');
});

test('a tag is picked up', () => {
    const testHtml =
        '<html><body><h1>hello world</h1><a href="https://google.com">google link</a></body></html>';
    const t = getURLsFromHTML(testHtml, 'https://google.com');
    expect(t).toStrictEqual(['https://google.com/']);
});

test('All a tag are picked up', () => {
    const testHtml =
        '<html><body><h1>hello world</h1>' +
        '<a href="https://google.com">google link</a>' +
        '<a href="https://www.youtube.com/results?search_query=javascript">youtube link</a>' +
        '<a href="/search">google search link</a>' +
        '</body></html>';
    const t = getURLsFromHTML(testHtml, 'https://google.com');
    expect(t).toStrictEqual([
        'https://google.com/',
        'https://www.youtube.com/results?search_query=javascript',
        'https://google.com/search',
    ]);
});

test('baseURL is used for relative path', () => {
    const testHtml =
        '<html><body><h1>hello world</h1><a href="/search">google link</a></body></html>';
    const t = getURLsFromHTML(testHtml, 'https://google.com');
    expect(t).toStrictEqual(['https://google.com/search']);
});
