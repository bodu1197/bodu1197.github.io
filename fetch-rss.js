const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const RSS_URL = 'https://swedish24.co.kr/rss';

async function generateSlug(title, link) {
    // URL에서 마지막 숫자만 추출
    const id = link.split('/').pop();
    
    // 숫자가 있으면 그것을 사용, 없으면 제목으로 slug 생성
    if (/^\d+$/.test(id)) {
        return id;
    }
    
    // 기존 방식으로 제목 기반 slug 생성
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
                const slug = await generateSlug(item.title, item.link);
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
            .sort((a, b) => new Date(b.date) - new Date(a.date));

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
