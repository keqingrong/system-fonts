const puppeteer = require('puppeteer');
const path = require('path');
const { writeJsonSync } = require('./utils');

const fontListURLs = [
  'https://docs.microsoft.com/en-us/typography/fonts/windows_7_font_list',
  'https://docs.microsoft.com/en-us/typography/fonts/windows_8_font_list',
  'https://docs.microsoft.com/en-us/typography/fonts/windows_81_font_list',
  'https://docs.microsoft.com/en-us/typography/fonts/windows_10_font_list',
  'https://docs.microsoft.com/en-us/typography/fonts/windows_11_font_list',
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

    for await (const url of fontListURLs) {
      const fileName = path.resolve(__dirname, `${url.split('/').pop()}.json`);
      const fontList = await getFontListFromPage(page, url);
      if (fontList.length > 0) {
        const formattedFontList = normalize(fontList);
        writeJsonSync(formattedFontList, fileName);
        console.log(`"${url}" has saved as "${fileName}"`);
      } else {
        console.log(`"${url}" is empty, please check it...`);
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
    const $tables = Array.from(document.querySelectorAll('table'));
    $tables.forEach($table => {
      const $rows = Array.from($table.querySelectorAll('tbody > tr'));
      $rows.forEach($row => {
        const $cells = Array.from($row.querySelectorAll('td'));
        const fontItem = [];
        $cells.forEach($cell => {
          fontItem.push($cell ? $cell.innerText.trim() : null);
        });
        if (fontItem.length > 0) {
          fontList.push(fontItem);
        }
      });
    });
    return fontList;
  });

  return fonts;
}

/**
 * Normalize the font list
 * @param {string[][]} fonts
 * @returns {Object[]}
 */
function normalize(fonts) {
  const formattedFontList = [];
  let lastFontFamily = null;

  fonts.forEach(row => {
    if (row[0]) {
      lastFontFamily = row[0];
    }

    formattedFontList.push({
      fontFamily: lastFontFamily,
      fontName: (row[1] || '').replace('*', '').trim(),
      fileName: (row[2] || '').toLowerCase(),
      version: row[3] || '',
    });
  });

  return formattedFontList;
}
