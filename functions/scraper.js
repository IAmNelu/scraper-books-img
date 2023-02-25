const { chromium: playwright } = require('playwright-core');
const chromium = require('@sparticuz/chromium');
// const puppeteer = require('puppeteer-core');
// const chromium = require('@sparticuz/chromium');
const url = 'https://www.amazon.fr';
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 100;
}



exports.handler = async function (event, context) {
  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: process.env.CHROME_EXE || await chromium.executablePath(),
    headless: true
  });
  const context_ = await browser.newContext();
  const page = await context_.newPage();
  await page.goto(url);
  const delay = getRandomInt(50);
  await page.locator('.nav-input.nav-progressive-attribute').type('type script', { delay: delay });
  await page.keyboard.press('Enter', { delay: delay });
  await page.waitForSelector('.s-image');
  const links = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll('.s-image')].map((img, i) => {
      const src = img.src;
      return `${src}`;
    });
  }, resultsSelector);
  await browser.close();
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Ok',
      page: {
        links
      }
    })
  };
};
