const fs = require('fs');
const path = require('path');
const pathDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathDir, (err,arrItem) => {
  arrItem.forEach(item => {
    let file = path.join(pathDir, item);
    fs.stat(file, (err, infoFile) => {
      if (err) {console.log(err);}
      if (infoFile.mode != 16822) {
        console.log(`--> Имя файла ${path.parse(file).name} --> расширение ${path.extname(file)} --> размер файла ${(infoFile.size / 1024).toFixed(2)} Кб `);
      }
    });
  });
});