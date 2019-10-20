const puppeteer = require('puppeteer');
const path = require('path');
const { writeJsonSync } = require('./utils');

const fontListURLs = [
  ['https://support.apple.com/en-us/HT210192', 'macOS 10.15 Catalina'],
  ['https://support.apple.com/en-us/HT208968', 'macOS 10.14 Mojave'],
  ['https://support.apple.com/en-us/HT207962', 'macOS 10.13 High Sierra'],
  ['https://support.apple.com/en-us/HT206872', 'macOS 10.12 Sierra'],
];

puppeteer.launch({
  headless: false,
  ignoreHTTPSErrors: true,
}).then(async browser => {
  const page = await browser.newPage();
  page.setJavaScriptEnabled(false);
  console.log(`Open a new page...`);

  for await (const urlItem of fontListURLs) {
    const fileName = path.resolve(__dirname, `${urlItem[1].replace(/\s/g, '.')}.json`);
    const fontList = await getFontListFromPage(page, urlItem[0]);
    if (fontList.length > 0) {
      const formattedFontList = normalize(fontList);
      writeJsonSync(formattedFontList, fileName);
      console.log(`"${urlItem[0]}" has saved as "${fileName}"`);
    } else {
      console.log(`"${urlItem[0]}" is empty, please check it...`);
    }
  }

  await browser.close();
}).catch((err) => {
  console.error(err);
})

/**
 * Get a font list from a url
 * @param {Page} page
 * @param {string} url
 * @returns {Object[]}
 */
async function getFontListFromPage(page, url) {
  await page.goto(url, {
    timeout: 30 * 1000,
    waitUntil: 'domcontentloaded'
  });
  const fonts = await page.evaluate(() => {
    const fontList = [];
    const $lists = Array.from(document.querySelectorAll('.grid2col > div > ul'));
    $lists.forEach(($list) => {
      const $items = Array.from($list.querySelectorAll('li'));
      $items.forEach(($item) => {
        if ($item) {
          // Al Bayan Bold 13.0d1e6
          fontList.push($item.innerText.trim());
        }
      })
    });
    return fontList;
  });

  return fonts;
}

/**
 * Normalize the font list
 * "Al Bayan Bold 13.0d1e6" => { fontName: "Al Bayan Bold", version: "13.0d1e6" }
 * @param {string[]} fonts
 * @returns {Object[]}
 */
function normalize(fonts) {
  const formattedFontList = [];
  fonts.forEach((fullFontName) => {
    const versionTagIndex = fullFontName.toLowerCase().indexOf('version');
    const uhSuffixRegEx = /\suh$/i;
    let fontName = null;
    let version = null;
    if (versionTagIndex > 0) {
      // "Arial Bold Version 5.01.2x" => "Arial Bold", "Version 5.01.2x"
      // "Noto Sans Gothic Version 1.03 uh" => "Noto Sans Gothic", "Version 1.03 uh"
      fontName = fullFontName.slice(0, versionTagIndex - 1);
      version = fullFontName.slice(versionTagIndex);
    } else if (uhSuffixRegEx.test(fullFontName)) {
      // "Noto Sans Gothic 1.03 uh" => "Noto Sans Gothic", "1.03 uh"
      version = fullFontName.replace(uhSuffixRegEx, '').split(' ').pop() + ' uh';
      fontName = fullFontName.replace(version, '').trim();
    } else {
      // "PingFang SC Semibold 13.0d1e3" => "PingFang SC Semibold", "13.0d1e3"
      // "Savoye LET Plain:1.0 13.0d2e4" => "Savoye LET Plain:1.0", "13.0d2e4"
      version = fullFontName.split(' ').pop();
      fontName = fullFontName.replace(version, '').trim();
    }
    // TODO: "STIX Two Math 2.00 b137" => "STIX Two Math", "2.00 b137"
    formattedFontList.push({
      fontFamily: null,
      fontName: fontName,
      fileName: null,
      version: version
    })
  })

  return formattedFontList;
}
