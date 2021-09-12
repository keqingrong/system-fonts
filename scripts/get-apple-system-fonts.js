const puppeteer = require('puppeteer');
const path = require('path');
const { writeJsonSync } = require('./utils');

const systemFontsURL = 'https://developer.apple.com/fonts/system-fonts/';
const output = 'iOS_13_macOS_Catalina.json';

puppeteer
  .launch({
    headless: false,
    ignoreHTTPSErrors: true,
  })
  .then(async browser => {
    const page = await browser.newPage();
    page.setJavaScriptEnabled(false);
    console.log(`Open a new page...`);

    const fileName = path.resolve(__dirname, output);

    const data = await getFontDataFromPage(page, systemFontsURL);
    const { preinstalled, document, downloadable } = data;
    const formatted = {
      preinstalled: normalize(preinstalled),
      document: normalize(document),
      downloadable: normalize(downloadable),
    };

    writeJsonSync(formatted, fileName);

    await browser.close();

    console.log(`Done...`);
  })
  .catch(err => {
    console.error(err);
  });

async function getFontDataFromPage(page, url) {
  await page.goto(url, {
    timeout: 30 * 1000,
    waitUntil: 'domcontentloaded',
  });
  const fonts = await page.evaluate(() => {
    const getDataFromTable = tableId => {
      const fontList = [];
      const $table = document.getElementById(tableId);
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
      return fontList;
    };
    const preinstalledData = getDataFromTable('preinstalled');
    const documentData = getDataFromTable('document');
    const downloadableData = getDataFromTable('downloadable');
    return {
      preinstalled: preinstalledData,
      document: documentData,
      downloadable: downloadableData,
    };
  });

  return fonts;
}

/**
 * Normalize the font list
 * [ 'Academy Engraved LET Plain:1.0', '13.0d1e2', '●', '' ]
 * =>
 * { fontName: "Al Bayan Bold", version: "13.0d1e6", iOS: true, macOS: false }
 * @param {string[]} fonts
 * @returns {Object[]}
 */
function normalize(fonts) {
  return fonts.map(arr => {
    const [fontName, version, iOS, macOS] = arr;
    return {
      fontFamily: null,
      fontName,
      fileName: null,
      version,
      iOS: iOS.length > 0,
      macOS: macOS.length > 0,
    };
  });
}
