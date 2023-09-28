function generateReport(pages) {
    const sorted = sortPages(pages);
    let lines = [];
    for (const [p, c] of Object.entries(sorted)) {
        lines.push(`Found ${c} internal links to ${p}`);
    }
    return lines.join('\n');
}

function sortPages(pages) {
    return Object.fromEntries(
        Object.entries(pages).sort(([, a], [, b]) => b - a)
    );
}

module.exports = {
    generateReport,
    sortPages,
};
