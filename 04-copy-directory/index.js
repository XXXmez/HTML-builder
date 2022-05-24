//const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const pathOuter = path.join(__dirname, 'files-copy');

async function createPathOuter(dir){
  await fsp.rm(dir, {force: true, recursive: true });
  await fsp.mkdir(dir);
}

// копируем и папки и файлы
async function additionFile(additionName, dirOuter) {
  let addInf = await fsp.stat(additionName);

  if (addInf.isDirectory()) {

    await createPathOuter(dirOuter);
    let arrAddFile = [];
    await fsp.readdir(additionName)
      .then((data) => (arrAddFile = data))
      .catch((err) => console.log(err));

    for(let i = 0; i < arrAddFile.length; i++) {
      let file = path.join(additionName, arrAddFile[i]);
      let nameFile = path.basename(file);

      let fileStat = await fsp.stat(file);
      if (fileStat.isDirectory()) {
        await additionFile(file, path.join(dirOuter, path.basename(file)));
      } else if (fileStat.isFile()) {
        await fsp.copyFile(file, path.join(dirOuter, nameFile))
          .catch((err) => console.log(err));
      }
    }
  }
}

const build = async () => {
  await additionFile(filesDir, pathOuter);
};

build();