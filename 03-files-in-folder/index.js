const fs = require('fs');
const path = require('path');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    stdout.write(err);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        stdout.write(err);
        return;
      }
      if (stats.isFile()) {
        const fileInfo = path.parse(filePath);
        const fileSize = stats.size / 1024;
        console.log(`${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${fileSize}kb`);
      }
    });
  });
}); 
