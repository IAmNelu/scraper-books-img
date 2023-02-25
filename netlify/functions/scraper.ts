import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { chromium as playwright } from 'playwright-core';
import chromium from '@sparticuz/chromium';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // your server-side functionality
  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const context_p = await browser.newContext();
  const page = await context_p.newPage();
  await page.goto("https://example.com");
  const pageTitle = await page.title();
  await browser.close();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Hello ${pageTitle}`}),
  };
};

export { handler };
