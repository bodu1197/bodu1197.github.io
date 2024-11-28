<?php
header('Content-Type: application/xml; charset=utf-8');

// JSON 파일 경로
$jsonFile = 'path/to/your/data.json'; // 실제 JSON 파일 경로로 변경

// JSON 파일 읽기
$jsonData = file_get_contents($jsonFile);

// JSON 데이터 파싱
$data = json_decode($jsonData, true);

// XML 헤더 출력
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <?php
    // 각 아티클에 대해 URL 추가
    foreach ($data['articles'] as $article) {
        echo '<url>';
        echo '<loc>' . htmlspecialchars($article['originalLink']) . '</loc>';
        echo '<changefreq>daily</changefreq>'; // 변경 빈도
        echo '<priority>0.5</priority>'; // 우선순위
        echo '</url>';
    }
    ?>
</urlset>
