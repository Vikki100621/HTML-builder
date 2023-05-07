const fs = require("fs");
const path = require("path");
const pathSourceFolder = path.join(__dirname, "files");
const pathTargetFolder = path.join(__dirname, "files-copy");

fs.mkdir(pathTargetFolder, { recursive: true }, (err) => {
  if (err) {
    stdout.write(err);
    return;
  }
  fs.readdir(pathTargetFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      stdout.write(err);
      return;
    }
    files.forEach((file) => {
      const targetPath = path.join(pathTargetFolder, file.name);
      fs.unlink(targetPath, (err) => {
        if (err) {
          stdout.write(err);
          return;
        }
      });
    });
  });
  fs.readdir(pathSourceFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      stdout.write(err);
      return;
    }
    files.forEach((file) => {
      const sourcePath = path.join(pathSourceFolder, file.name);
      const targetPath = path.join(pathTargetFolder, file.name);
      if (file.isDirectory()) {
        copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFile(sourcePath, targetPath, (err) => {
          if (err) {
            stdout.write(err);
            return;
          }
        });
      }
    });
  });
});
