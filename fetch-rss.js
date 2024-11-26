const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

const RSS_URL = 'https://swedish24.co.kr/rss';

async function fetchFeeds() {
    try {
        console.log('Fetching RSS feed...');
        const feed = await parser.parseURL(RSS_URL);
        console.log('Feed fetched:', feed.items.length, 'items');
        
        const articles = feed.items.map(item => ({
            id: item.guid || item.link,
            title: item.title,
            description: item.contentSnippet || item.description,
            content: item.content,
            date: item.pubDate,
            originalLink: item.link,
            source: 'swedish24',
            slug: item.guid || item.link
        }));

        fs.writeFileSync(
            'articles.json',
            JSON.stringify({ articles }, null, 2)
        );

        console.log('Articles saved successfully');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fetchFeeds().catch(console.error);
