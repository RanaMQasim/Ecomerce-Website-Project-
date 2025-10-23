const fs = require('fs');
const path = require('path');

const deleteFile = (relativePath) => {
  try {
    if (!relativePath) return;
    let filePath = String(relativePath).trim();
    filePath = filePath.replace(/^https?:\/\/[^\/]+/i, '');
    filePath = filePath.replace(/^\/+/, '');
    if (!filePath.startsWith('upload/images/')) {

      filePath = path.join('upload/images', path.basename(filePath));
    }

    const absolutePath = path.join(__dirname, '..', filePath);
    fs.rm(absolutePath, { force: true }, (err) => {
      if (err) {
        console.warn(' deleteFile warning:', err.message);
      } else {
        console.log(' Deleted (or already gone):', absolutePath);
      }
    });
  } catch (err) {
    console.error('deleteFile error:', err);
  }
};
module.exports = deleteFile;