const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function normalizeURL(url) {
    const nURL = new URL(url);
    return `${nURL.protocol}//${nURL.hostname}${
        nURL.pathname.endsWith('/')
            ? nURL.pathname.slice(0, nURL.pathname.length - 1)
            : nURL.pathname
    }`;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const anchors = Array.from(dom.window.document.querySelectorAll('a'));
    const absoluteLinks = anchors.map((a) => {
        return a.href.startsWith('/') ? `${baseURL}${a.href}` : a.href;
    });
    return absoluteLinks;
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function crawlPage(baseURL, url, pages) {
    const base = new URL(baseURL);
    const current = new URL(url);
    if (current.hostname !== base.hostname) {
        return pages;
    }
    const normalised = normalizeURL(url);
    if (normalised in pages) {
        pages[normalised]++;
        return pages;
    }
    pages[normalised] = baseURL === normalised ? 0 : 1;
    await sleep(50);
    console.log(`Visiting ${normalised}`);
    const resp = await fetch(normalised);
    if (resp.status !== 200) {
        console.log(`Got an error at ${normalised}`);
        return pages;
    }
    if (!resp.headers.get('content-type').startsWith('text/html')) {
        console.log(`Did not get text/html at ${normalised}`);
        return pages;
    }
    const text = await resp.text();
    const links = getURLsFromHTML(text, baseURL);
    for (const link of links) {
        pages = await crawlPage(baseURL, link, pages);
    }
    return pages;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
};
