const fs = require('fs');

/**
 * Writes an object to a JSON file.
 * @param {Object} json
 * @param {string} fileName
 */
function writeJsonSync(json, fileName) {
  const data = JSON.stringify(json, null, 2);
  fs.writeFileSync(fileName, data, 'utf-8');
}

module.exports = {
  writeJsonSync
}
