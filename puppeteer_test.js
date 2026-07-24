const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('http://localhost:8089', { waitUntil: 'networkidle0' });
    
    // Login
    await page.type('input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for App to load
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Open financials submenu
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Financials') || b.textContent.includes('المالية'));
        if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 500));

    // Click on Financial Transactions
    await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Financial Transactions') || b.textContent.includes('حركات المالية'));
        if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
