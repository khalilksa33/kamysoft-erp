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

  console.log('Navigating to https://demo.26i.uk/');
  await page.goto('https://demo.26i.uk/', { waitUntil: 'networkidle0', timeout: 10000 });
  console.log('Clicking login...');
  await page.evaluate(() => document.querySelectorAll('button')[1].click());
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'frontend/screenshot2.png' });
  
  await browser.close();
})();
