import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    localStorage.setItem('nf.user', JSON.stringify({ email: 'demo@nextflix.app', name: 'Demo User', since: Date.now() }));
    localStorage.setItem('nf.currentProfile', JSON.stringify("p1"));
  });

  await page.goto('http://localhost:5174/#/browse', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  console.log(html);
  
  await browser.close();
})();
