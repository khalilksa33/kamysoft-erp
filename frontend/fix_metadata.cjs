const fs = require('fs');
let code = fs.readFileSync('src/LandingPage.jsx', 'utf8');

// 1. Add useEffect to React import
code = code.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");

// 2. Add URL routing logic below selectedArticle state
const hookCode = `const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#article-')) {
                const slug = hash.replace('#article-', '');
                const article = t.blogArticles.find(a => a.slug === slug);
                if (article) setSelectedArticle(article);
            } else if (!hash || hash === '#blog') {
                setSelectedArticle(null);
            }
        };
        
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Run on mount
        
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [t.blogArticles]);
    
    useEffect(() => {
        if (selectedArticle) {
            window.history.replaceState(null, '', \`#article-\${selectedArticle.slug}\`);
        } else {
            if (window.location.hash.startsWith('#article-')) {
                window.history.replaceState(null, '', '#blog');
            }
        }
    }, [selectedArticle]);`;

code = code.replace('const [selectedArticle, setSelectedArticle] = useState(null);', hookCode);

// 3. Add metadata to detailed view
const detailsBefore = `<div style={{ fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '16px', fontWeight: 'bold' }}>{selectedArticle.category}</div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>{selectedArticle.title}</h2>`;

const detailsAfter = `<div style={{ fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '16px', fontWeight: 'bold' }}>{selectedArticle.category}</div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>{selectedArticle.title}</h2>
                            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', alignItems: 'center' }}>
                                <span><i className="ri-calendar-line"></i> {selectedArticle.date}</span>
                                <span><i className="ri-time-line"></i> {selectedArticle.readTime}</span>
                                <span><i className="ri-user-line"></i> {currentLanguage === 'ar' ? 'بقلم:' : 'By:'} {selectedArticle.author}</span>
                            </div>`;

code = code.replace(detailsBefore, detailsAfter);

// 4. Add metadata to card view
const cardBefore = `<div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: '8px', fontWeight: 'bold' }}>{article.category}</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>`;

const cardAfter = `<div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: '8px', fontWeight: 'bold' }}>{article.category}</div>
                                        <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '12px', alignItems: 'center' }}>
                                            <span><i className="ri-calendar-line"></i> {article.date}</span>
                                            <span><i className="ri-time-line"></i> {article.readTime}</span>
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>`;

// we have to replace this for each card (though there is only one map loop)
code = code.replace(cardBefore, cardAfter);

fs.writeFileSync('src/LandingPage.jsx', code);
console.log("Success");
