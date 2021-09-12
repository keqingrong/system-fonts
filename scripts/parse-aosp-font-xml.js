const path = require('path');
const fse = require('fs-extra');
const { parseFontsXml } = require('./aosp-utils');

async function main() {
  const versions = ['5.0', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0', '12.0'];

  for await (let version of versions) {
    const xmlFileName = path.resolve(
      __dirname,
      `../raw/aosp/${version}/fonts.xml`
    );
    const jsonFileName = path.resolve(xmlFileName, '../fonts.json');

    const json = await parseFontsXml(xmlFileName);

    await fse.ensureFile(jsonFileName);
    await fse.writeJSON(jsonFileName, json, { spaces: 2 });
  }
}

main().catch(err => console.error(err));
