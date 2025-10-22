const fs = require('fs');
const path = require('path');

const deleteFile = (relativePath) => {
  if (!relativePath) return;
  const filePath = path.isAbsolute(relativePath)
    ? relativePath
    : path.join(__dirname, '..', relativePath.replace(/^\//, ''));
  fs.unlink(filePath, (err) => {
    if (err) {
      console.warn('Failed to delete file:', filePath, err.message);
    } else {
      console.log('Deleted file:', filePath);
    }
  });
};

module.exports = deleteFile;
