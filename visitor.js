async function updateVisitors() {
    try {
        const currentPage = window.location.pathname;
        const isArticle = currentPage.includes('article.html');
        const articleId = isArticle ? new URLSearchParams(window.location.search).get('id') : null;
        
        const response = await fetch('visitors.json');
        const data = await response.json();
        
        const today = new Date().toISOString().split('T')[0];
        
        // 페이지별 방문자 추적
        const pageKey = isArticle ? `article-${articleId}` : 'index';
        
        const updateData = {
            total: data.total + 1,
            daily: {
                ...data.daily,
                [today]: (data.daily[today] || 0) + 1
            },
            pages: {
                ...data.pages,
                [pageKey]: (data.pages[pageKey] || 0) + 1
            },
            lastUpdated: today
        };

        // GitHub API로 업데이트
        await fetch('https://api.github.com/repos/bodu1197/swedish-rss/contents/visitors.json', {
            method: 'PUT',
            headers: {
                'Authorization': 'token YOUR_GITHUB_TOKEN',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Update visitor count for ${pageKey}`,
                content: btoa(JSON.stringify(updateData, null, 2)),
                sha: data.sha
            })
        });

        // 화면에 표시
        document.getElementById('total-visitors').textContent = updateData.total.toLocaleString();
        document.getElementById('today-visitors').textContent = (updateData.daily[today] || 0).toLocaleString();
    } catch (error) {
        console.error('방문자 수 업데이트 실패:', error);
    }
}
