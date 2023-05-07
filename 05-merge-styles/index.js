const fs = require("fs");
const path = require("path");
const pathTargetFolder = path.join(__dirname, "project-dist");
const pathSourceFolder = path.join(__dirname, "styles");
const output = path.join(pathTargetFolder, "bundle.css");
const writeStream = fs.createWriteStream(output);

fs.readdir(pathSourceFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const sourcePath = path.join(pathSourceFolder, file.name);
    const typeOfFile = path.extname(sourcePath);
    if (typeOfFile === ".css") {
      fs.createReadStream(sourcePath, "utf8").addListener("data", (data) => {
        writeStream.write(data);
      });
    }
  });
});
