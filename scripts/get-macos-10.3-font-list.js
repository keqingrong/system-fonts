const puppeteer = require('puppeteer');
const path = require('path');
const { writeJsonSync } = require('./utils');

const fontListURLs = [
  ['https://support.apple.com/en-us/HT1538', 'OS X 10.4 Tiger'],
  ['https://support.apple.com/en-us/HT2444', 'OS X 10.3 Panther'],
];

puppeteer
  .launch({
    headless: false,
    ignoreHTTPSErrors: true,
  })
  .then(async browser => {
    const page = await browser.newPage();
    page.setJavaScriptEnabled(false);
    console.log(`Open a new page...`);

    for await (const urlItem of fontListURLs) {
      const fileName = path.resolve(
        __dirname,
        `${urlItem[1].replace(/\s/g, '.')}.json`
      );
      const fontList = await getFontListFromPage(page, urlItem[0]);
      if (fontList.length > 0) {
        writeJsonSync(fontList, fileName);
        console.log(`"${urlItem[0]}" has saved as "${fileName}"`);
      } else {
        console.log(`"${urlItem[0]}" is empty, please check it...`);
      }
    }

    await browser.close();
  })
  .catch(err => {
    console.error(err);
  });

/**
 * Get a font list from a url
 * @param {Page} page
 * @param {string} url
 * @returns {Object[]}
 */
async function getFontListFromPage(page, url) {
  await page.goto(url, {
    timeout: 30 * 1000,
    waitUntil: 'domcontentloaded',
  });
  const fonts = await page.evaluate(() => {
    const fontList = [];
    const $rows = Array.from(
      document.querySelectorAll('#tableWraper > table > tbody > tr')
    );
    $rows.forEach($row => {
      const $cells = Array.from($row.querySelectorAll('td'));
      if (
        $cells.length > 0 &&
        $cells[0] &&
        !$cells[0].innerText.startsWith('Package:')
      ) {
        fontList.push({
          fontFamily: null,
          fontName: null,
          fileName: $cells[0].innerText.trim(),
          version: null,
        });
      }
    });
    return fontList;
  });

  return fonts;
}
