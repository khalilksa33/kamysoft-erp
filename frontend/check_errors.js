import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE FAILED:', response.status(), response.url());
    }
  });

  console.log('Navigating to http://localhost:3000/?simDomain=customer&simTenant=kamysoft-erp');
  await page.goto('http://localhost:3000/?simDomain=customer&simTenant=kamysoft-erp', { waitUntil: 'networkidle0', timeout: 10000 });
  console.log('Filling login form...');
  await page.type('input[type="text"]', 'admin');
  await page.type('input[type="password"]', 'admin123');
  console.log('Clicking login...');
  await page.evaluate(() => document.querySelector('button[type="submit"]').click());
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'frontend/screenshot2.png' });
  
  await browser.close();
})();
