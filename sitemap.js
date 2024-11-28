// JSON 파일 경로
const jsonFilePath = 'articles.json'; // 실제 JSON 파일 경로로 변경

// 사이트맵 생성 함수
async function generateSitemap() {
    try {
        const response = await fetch(jsonFilePath);
        const data = await response.json();

        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        data.articles.forEach(article => {
            sitemap += '  <url>\n';
            sitemap += `    <loc>${article.originalLink}</loc>\n`;
            sitemap += `    <lastmod>${article.date}</lastmod>\n`;
            sitemap += '    <changefreq>daily</changefreq>\n';
            sitemap += '    <priority>0.5</priority>\n';
            sitemap += '  </url>\n';
        });

        sitemap += '</urlset>';

        // 사이트맵을 파일로 다운로드
        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('사이트맵 생성 실패:', error);
    }
}

// 페이지 로드 시 사이트맵 생성
document.addEventListener('DOMContentLoaded', generateSitemap);
