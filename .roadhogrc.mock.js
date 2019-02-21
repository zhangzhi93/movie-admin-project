const fs = require('fs');
const path = require('path');
const mockPath = path.join(__dirname + '/mock');
const mock = {};

// fs.readdirSync(mockPath).forEach(file => {
//   Object.assign(mock, require('./mock/' + file));
// });
readDirSync(mockPath, './mock/');

function readDirSync(dirpath, name) {
  const pa = fs.readdirSync(dirpath);
  pa.forEach(function (file, index) {
    const info = fs.statSync(dirpath + "/" + file);
    let basepath = name;
    if (info.isDirectory()) {
      console.log("Directory: " + file)
      console.log("Directorypath: " + path.join(dirpath + "/" + file))
      basepath = basepath + file + '/';
      readDirSync(path.join(dirpath + "/" + file), basepath);
    } else {
      console.log("file: " + file)
      console.log("path: " + basepath + file)
      Object.assign(mock, require(basepath + file));
    }
  })
}

module.exports = mock;
