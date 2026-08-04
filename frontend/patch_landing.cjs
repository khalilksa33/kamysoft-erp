const fs = require('fs');

const file = 'src/LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// First replace: inside selectedArticle
const target1 = `                            <div style={{ fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '16px', fontWeight: 'bold' }}>{selectedArticle.category}</div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>{selectedArticle.title}</h2>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: marked.parse(selectedArticle.content) }} />`;

const replace1 = `                            <div style={{ fontSize: '14px', color: 'var(--accent-cyan)', marginBottom: '16px', fontWeight: 'bold' }}>{selectedArticle.category}</div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>{selectedArticle.title}</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', alignItems: 'center' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-calendar-line"></i> {selectedArticle.date}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-time-line"></i> {selectedArticle.readTime}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i className="ri-user-line"></i> {selectedArticle.author}</span>
                                <button 
                                    onClick={() => {
                                        const url = \`\${window.location.origin}\${window.location.pathname}#article-\${selectedArticle.slug}\`;
                                        navigator.clipboard.writeText(url);
                                        alert(currentLanguage === 'ar' ? "تم نسخ الرابط!" : "URL copied to clipboard!");
                                    }}
                                    className="btn btn-secondary" 
                                    style={{ padding: '4px 12px', fontSize: '12px', marginLeft: currentLanguage === 'ar' ? '0' : 'auto', marginRight: currentLanguage === 'ar' ? 'auto' : '0' }}
                                >
                                    <i className="ri-link"></i> {currentLanguage === 'ar' ? "نسخ الرابط" : "Copy URL"}
                                </button>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px' }} dangerouslySetInnerHTML={{ __html: marked.parse(selectedArticle.content) }} />`;

content = content.replace(target1, replace1);

// Second replace: in the article card
const target2 = `                                        <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: '8px', fontWeight: 'bold' }}>{article.category}</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                                            {article.title}
                                        </h3>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                                            {article.desc}
                                        </p>`;

const replace2 = `                                        <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', marginBottom: '8px', fontWeight: 'bold' }}>{article.category}</div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                                            {article.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px' }}>
                                            <span><i className="ri-calendar-line"></i> {article.date}</span>
                                            <span><i className="ri-time-line"></i> {article.readTime}</span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                                            {article.desc}
                                        </p>`;

content = content.replace(target2, replace2);

fs.writeFileSync(file, content);
console.log('Successfully updated LandingPage.jsx');
