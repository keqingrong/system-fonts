const fs = require('fs');

/**
 * Writes an object to a JSON file.
 * @param {Object} json
 * @param {string} fileName
 */
function writeJsonSync(json, fileName) {
  const EOL = '\n';
  const data = JSON.stringify(json, null, 2) + EOL;
  fs.writeFileSync(fileName, data, 'utf-8');
}

module.exports = {
  writeJsonSync,
};
