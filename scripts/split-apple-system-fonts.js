const path = require('path');
const { writeJsonSync } = require('./utils');
const data = require('./raw/iOS_13_macOS_Catalina.json');
const { preinstalled, document, downloadable } = data;

const iosFonts = { preinstalled: [], document: [], downloadable: [] };
const macosFonts = { preinstalled: [], document: [], downloadable: [] };

preinstalled.forEach(item => {
  const { iOS, macOS, ...rest } = item;
  if (iOS) {
    iosFonts.preinstalled.push(rest);
  }
  if (macOS) {
    macosFonts.preinstalled.push(rest);
  }
  if (iOS === false && macOS === false) {
    console.log(item.fontName);
  }
});

document.forEach(item => {
  const { iOS, macOS, ...rest } = item;
  if (iOS) {
    iosFonts.document.push(rest);
  }
  if (macOS) {
    macosFonts.document.push(rest);
  }
  if (iOS === false && macOS === false) {
    console.log(item.fontName);
  }
});

downloadable.forEach(item => {
  const { iOS, macOS, ...rest } = item;
  if (iOS) {
    iosFonts.downloadable.push(rest);
  }
  if (macOS) {
    macosFonts.downloadable.push(rest);
  }
  if (iOS === false && macOS === false) {
    console.log(item.fontName);
  }
});

const iosJson = {
  os: 'iOS',
  version: '13',
  codename: null,
  fonts: iosFonts,
  references: ['https://developer.apple.com/fonts/system-fonts/'],
};

const macosJson = {
  os: 'macOS',
  version: '10.15',
  codename: 'Catalina',
  fonts: macosFonts,
  references: ['https://developer.apple.com/fonts/system-fonts/'],
};

const iosFilename = path.resolve(__dirname, 'iOS_13.json');
const macosFilename = path.resolve(__dirname, 'macOS_Catalina.json');

writeJsonSync(iosJson, iosFilename);
writeJsonSync(macosJson, macosFilename);

console.log('done');
