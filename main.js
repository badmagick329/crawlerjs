const { normalizeURL, getURLsFromHTML, crawlPage } = require('./crawl.js');
const { generateReport } = require('./report.js');
const { argv } = require('node:process');

function main() {
    if (argv.length < 3) {
        console.log(
            'Not enough args. Provide a BASE_URL to start crawling from'
        );
        process.exit(1);
    }
    const baseURL = argv[2];
    console.log(`Starting at ${baseURL}`);
    crawlPage(baseURL, baseURL, {}).then((pages) => {
        const report = generateReport(pages);
        console.log(report);
    });
}
main();
