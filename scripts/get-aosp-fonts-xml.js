const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const got = require('got');
const pipeline = promisify(stream.pipeline);

const fontsXmlURLs = [
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/android-s-beta-5/data/fonts/fonts.xml',
    '12',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/android11-release/data/fonts/fonts.xml',
    '11',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/android10-release/data/fonts/fonts.xml',
    '10',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/pie-release/data/fonts/fonts.xml',
    '9',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/oreo-release/data/fonts/fonts.xml',
    '8',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/nougat-release/data/fonts/fonts.xml',
    '7',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/marshmallow-release/data/fonts/fonts.xml',
    '6',
  ],
  [
    'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/lollipop-release/data/fonts/fonts.xml',
    '5',
  ],
];

const kitkatXmlURLs = [
  'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/kitkat-release/data/fonts/system_fonts.xml',
  'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/kitkat-release/data/fonts/vendor_fonts.xml',
  'https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/kitkat-release/data/fonts/fallback_fonts.xml',
].map(url => [url, '4.4']);

const delay = ms =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

const saveURL = async (url, fileName) => {
  await pipeline(got.stream(url), fs.createWriteStream(fileName));
};

const saveURLs = async urls => {
  for await (let item of urls) {
    const [url, version] = item;
    const output = path.resolve(__dirname, version, path.basename(url));

    console.log('start fetch', url);
    await fse.ensureFile(output);
    await saveURL(url, output);
    console.log('finish fetch', url);
    await delay(1000);
  }
};

const main = async () => {
  await saveURLs(fontsXmlURLs);
  await saveURLs(kitkatXmlURLs);
};

main().catch(err => console.error(err));
