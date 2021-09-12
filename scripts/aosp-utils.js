const fs = require('fs/promises');
const { DOMParser } = require('xmldom');

async function parseFontsXml(fileName) {
  const xmlData = await fs.readFile(fileName, 'utf8');
  const doc = new DOMParser().parseFromString(xmlData);
  const familyset = doc.documentElement;
  const familyNames = [];
  const familyFallbacks = [];
  const aliases = [];

  Array.from(familyset.childNodes).forEach(node => {
    const { nodeName, attributes, childNodes } = node; // family, alias, text

    const fontFamily = {
      // type: nodeName,
    };
    const fonts = [];
    if (attributes && attributes.length > 0) {
      Array.from(attributes).forEach(({ name, value }) => {
        fontFamily[name] = value;
      });
    }
    if (childNodes && childNodes.length > 0) {
      Array.from(childNodes).forEach(child => {
        // font, text
        if (child.nodeName === 'font') {
          const font = {
            // type: child.nodeName,
          };

          if (child.attributes && child.attributes.length > 0) {
            Array.from(child.attributes).forEach(attr => {
              font[attr.nodeName] = attr.nodeValue;
            });
          }
          if (child.childNodes && child.childNodes.length > 0) {
            // text
            font.name = child.childNodes[0].nodeValue.trim();
            // TODO: VF font, like MiLanProVF.ttf
          }

          fonts.push(font);
        }
      });
    }
    fontFamily.fonts = fonts;

    if (fonts.length === 0) {
      delete fontFamily.fonts;
    }

    switch (nodeName) {
      case 'family': {
        if (fontFamily.name) {
          familyNames.push(fontFamily);
        }
        if (fontFamily.lang) {
          familyFallbacks.push(fontFamily);
        }
        break;
      }
      case 'alias': {
        aliases.push(fontFamily);
        break;
      }
    }
  });

  return {
    familyNames,
    familyFallbacks,
    aliases,
  };
}

module.exports = {
  parseFontsXml
}
