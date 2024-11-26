const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const RSS_URL = 'https://swedish24.co.kr/rss';

async function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^가-힣a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function fetchFeeds() {
    const articles = [];
    let existingArticles = [];

    if (fs.existsSync('articles.json')) {
        existingArticles = JSON.parse(fs.readFileSync('articles.json', 'utf-8')).articles;
    }

    try {
        const feed = await parser.parseURL(RSS_URL);
        
        for (const item of feed.items) {
            const exists = existingArticles.some(article => 
                article.originalLink === item.link
            );

            if (!exists) {
                const slug = await generateSlug(item.title);
                articles.push({
                    id: slug,
                    title: item.title,
                    description: item.contentSnippet || item.description,
                    content: item.content,
                    date: item.pubDate,
                    originalLink: item.link,
                    source: 'swedish24',
                    slug: slug
                });
            }
        }

        const updatedArticles = [...articles, ...existingArticles]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 100);

        fs.writeFileSync(
            'articles.json',
            JSON.stringify({ articles: updatedArticles }, null, 2)
        );

        console.log(`Updated ${articles.length} new articles`);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        process.exit(1);
    }
}

fetchFeeds().catch(console.error);
