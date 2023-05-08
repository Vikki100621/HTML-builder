const fs = require("fs");
const path = require("path");
const pathMainFolder = path.join(__dirname, "project-dist");
const pathCssFolder = path.join(__dirname, "styles");
const outputCss = path.join(pathMainFolder, "style.css");
const writeStreamCss = fs.createWriteStream(outputCss);
const pathComponentsFolder = path.join(__dirname, "components");
const pathSourceFolder = path.join(__dirname, "assets");
const pathTargetFolder = path.join(__dirname, "project-dist/assets");

fs.mkdir(pathMainFolder, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }
});

fs.readdir(pathCssFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const sourcePath = path.join(pathCssFolder, file.name);
    const typeOfFile = path.extname(sourcePath);
    if (typeOfFile === ".css") {
      fs.createReadStream(sourcePath, "utf8").addListener("data", (data) => {
        writeStreamCss.write(data);
      });
    }
  });
});

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) reject(err);
      else resolve(content);
    });
  });
};

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

readFile(path.join(__dirname, "template.html"))
  .then((indexContent) => {
    fs.readdir(pathComponentsFolder, { withFileTypes: true }, (err, files) => {
      if (err) console.error(err);
      else {
        const promises = files
          .filter((file) => file.isFile())
          .map((file) => {
            return readFile(path.join(pathComponentsFolder, file.name))
              .then((content) => {
                return { name: file.name, content };
              })
              .catch((err) => console.error(err));
          });

        Promise.all(promises)
          .then((contentfiles) => {
            contentfiles.forEach((component) => {
              const tegs = `{{${component.name.slice(0, -5)}}}`;
              const replace = component.content;
              indexContent = indexContent.replace(
                new RegExp(tegs, "g"),
                replace
              );
            });
            return writeFile(
              path.join(__dirname, "project-dist/index.html"),
              indexContent
            );
          })
          .catch((err) => console.error(err));
      }
    });
  })
  .catch((err) => console.error(err));

const copyDirectory = (source, target) => {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(source, file.name);
        const targetPath = path.join(target, file.name);

        if (file.isDirectory()) {
          copyDirectory(sourcePath, targetPath);
        } else {
          fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      });
    });
  });
};

copyDirectory(pathSourceFolder, pathTargetFolder);
