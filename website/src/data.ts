import ios13 from '@keqingrong/system-fonts/data/ios/13.json';
import macos11 from '@keqingrong/system-fonts/data/macos/11.0.json';
// import macos10_15 from '@keqingrong/system-fonts/data/macos/10.15.json';
// import macos10_14 from '@keqingrong/system-fonts/data/macos/10.14.json';
// import macos10_13 from '@keqingrong/system-fonts/data/macos/10.13.json';
// import macos10_12 from '@keqingrong/system-fonts/data/macos/10.12.json';
// import macos10_9 from '@keqingrong/system-fonts/data/macos/10.9.json';
// import macos10_8 from '@keqingrong/system-fonts/data/macos/10.8.json';
// import macos10_5 from '@keqingrong/system-fonts/data/macos/10.5.json';
// import macos10_4 from '@keqingrong/system-fonts/data/macos/10.4.json';
// import macos10_3 from '@keqingrong/system-fonts/data/macos/10.3.json';
import windows10 from '@keqingrong/system-fonts/data/windows/10.json';
// import windows81 from '@keqingrong/system-fonts/data/windows/81.json';
// import windows8 from '@keqingrong/system-fonts/data/windows/8.json';
// import windows7 from '@keqingrong/system-fonts/data/windows/7.json';
// import windowsVista from '@keqingrong/system-fonts/data/windows/vista.json';

interface FontObject {
  /** Font family */
  fontFamily: string | null;
  /** Font name */
  fontName: string | null;
  /** Font file name */
  fileName: string | null;
  /** Font version */
  version: string | null;
}

interface FontsObject {
  /** Date that the font list published */
  publishedDate?: string;
  /** Fonts that preinstalled in the OS */
  preinstalled?: FontObject[];
  /** Fonts available for document support in the OS */
  document?: FontObject[];
  /** Fonts available for download in the OS */
  downloadable?: FontObject[];
  /** References */
  references?: string[];
}

interface FontAssetObject {
  /** System type */
  os: string;
  /** System version */
  version: string | null;
  /** System codename */
  codename: string | null;
  /** Fonts included in the system */
  fonts: FontsObject;
}

interface FontItem {
  /** Unique key */
  key?: any;
  /** System type */
  os: string;
  /** System version */
  osVersion: string | null;
  /** System codename */
  osCodename: string | null;
  /** System full name */
  osFullName: string;
  /** Font family */
  fontFamily: string | null;
  /** Font name */
  fontName: string | null;
  /** Font file name */
  fileName: string | null;
  /** Font version */
  version: string | null;
}

function getFontList() {
  const assets: FontAssetObject[] = [
    ios13,
    macos11,
    // macos10_15,
    // macos10_14,
    // macos10_13,
    // macos10_12,
    // macos10_9,
    // macos10_8,
    // macos10_5,
    // macos10_4,
    // macos10_3,
    windows10,
    // windows81,
    // windows8,
    // windows7,
    // windowsVista,
  ];
  const fontList: FontItem[] = [];
  assets.forEach((fontItem, fontItemIndex) => {
    if (Object.keys(fontItem.fonts).length > 0) {
      const fontsObject = fontItem.fonts;
      [
        ...getFontItems(fontsObject.preinstalled),
        ...getFontItems(fontsObject.document),
        ...getFontItems(fontsObject.downloadable),
      ].forEach((item, index) => {
        fontList.push({
          key: `${fontItemIndex}-${index}`,
          os: fontItem.os,
          osVersion: fontItem.version,
          osCodename: fontItem.codename,
          osFullName: `${fontItem.os || ''} ${fontItem.version || ''} ${
            fontItem.codename || ''
          }`.trim(),
          ...item,
        });
      });
    }
  });
  return fontList;
}

function getFontItems(fonts: FontObject[] = []) {
  return fonts.map(item => item);
}

export { getFontList };
