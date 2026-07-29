const fs = require('fs');
let content = fs.readFileSync('src/LandingPage.jsx', 'utf8');

if (!content.includes('marked')) {
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { marked } from 'marked';\nimport { enArticles, arArticles } from './data/blogArticles';"
    );
}

content = content.replace(
    /dangerouslySetInnerHTML={{ __html: selectedArticle\.content\.replace\(\/\\n\/g, '<br\/>'\) }}/g,
    "dangerouslySetInnerHTML={{ __html: marked.parse(selectedArticle.content) }}"
);

content = content.replace(/blogArticles:\s*\[[\s\S]*?\]/g, (match, offset) => {
    return offset < content.length / 2 ? 'blogArticles: enArticles' : 'blogArticles: arArticles';
});

fs.writeFileSync('src/LandingPage.jsx', content);
