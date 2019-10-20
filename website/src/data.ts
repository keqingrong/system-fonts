import macos10_15 from '@keqingrong/system-fonts/data/macos/10.15.json';
import macos10_14 from '@keqingrong/system-fonts/data/macos/10.14.json';
import macos10_13 from '@keqingrong/system-fonts/data/macos/10.13.json';
import macos10_12 from '@keqingrong/system-fonts/data/macos/10.12.json';
import macos10_9 from '@keqingrong/system-fonts/data/macos/10.9.json';
import macos10_8 from '@keqingrong/system-fonts/data/macos/10.8.json';
import macos10_5 from '@keqingrong/system-fonts/data/macos/10.5.json';
import macos10_4 from '@keqingrong/system-fonts/data/macos/10.4.json';
import macos10_3 from '@keqingrong/system-fonts/data/macos/10.3.json';
import windows10 from '@keqingrong/system-fonts/data/windows/10.json';
import windows81 from '@keqingrong/system-fonts/data/windows/81.json';
import windows8 from '@keqingrong/system-fonts/data/windows/8.json';
import windows7 from '@keqingrong/system-fonts/data/windows/7.json';
import windowsVista from '@keqingrong/system-fonts/data/windows/vista.json';

interface IFontObject {
  /** Font family */
  fontFamily: string;
  /** Font name */
  fontName: string;
  /** Font file name */
  fileName: string;
  /** Font version */
  version: string;
}

interface IFontsObject {
  /** Date that the font list published */
  publishedDate?: string;
  /** Fonts that preinstalled in the OS */
  preinstalled?: IFontObject[];
  /** Fonts available for document support in the OS */
  document?: IFontObject[];
  /** Fonts available for download in the OS */
  downloadable?: IFontObject[];
  /** References */
  references?: string[];
}

interface IFontAssetObject {
  /** System type */
  os: string;
  /** System version */
  version: string;
  /** System codename */
  codename: string;
  /** Fonts included in the system */
  fonts: IFontsObject;
}

interface IFontItem {
  /** Unique key */
  key?: any;
  /** System type */
  os: string;
  /** System version */
  osVersion: string;
  /** System codename */
  osCodename: string;
  /** System full name */
  osFullName: string;
  /** Font family */
  fontFamily: string;
  /** Font name */
  fontName: string;
  /** Font file name */
  fileName: string;
  /** Font version */
  version: string;
}

function getFontList() {
  const assets: IFontAssetObject[] = [
    macos10_15 as any,
    macos10_14 as any,
    macos10_13 as any,
    macos10_12 as any,
    macos10_9 as any,
    macos10_8 as any,
    macos10_5 as any,
    macos10_4 as any,
    macos10_3 as any,
    windows10 as any,
    windows81 as any,
    windows8 as any,
    windows7 as any,
    windowsVista as any,
  ];
  const fontList: IFontItem[] = [];
  assets.forEach((fontItem, fontItemIndex) => {
    if (Object.keys(fontItem.fonts).length > 0) {
      const fontsObject = fontItem.fonts;
      [
        ...getFontItems(fontsObject.preinstalled),
        ...getFontItems(fontsObject.document),
        ...getFontItems(fontsObject.downloadable),
      ].forEach((item, index) => {
        fontList.push({
          // key: `${fontItemIndex}-${index}`,
          os: fontItem.os,
          osVersion: fontItem.version,
          osCodename: fontItem.codename,
          osFullName: `${fontItem.os || ''} ${fontItem.version || ''} ${fontItem.codename || ''}`.trim(),
          ...item,
        });
      });
    }
  });
  return fontList;
}

function getFontItems(fonts: IFontObject[] = []) {
  return fonts.map(item => item);
}

export {
  getFontList
}
