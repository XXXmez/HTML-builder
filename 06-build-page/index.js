//const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const buildHtmlName = 'index.html';
const buildStyleName = 'style.css';

const pathOuter = path.join(__dirname, 'project-dist');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const otherDir = path.join(__dirname, 'assets');

let strStyles = '';

// удаление директории // создание директории
async function createPathOuter(dir){
  await fsp.rm(dir, {force: true, recursive: true });
  await fsp.mkdir(dir);
}

// собираем html
async function htmlBuild(html) {
  for (let i = 0; i < html.length; i++) {
    let a = html[i].match(/(?<={{)(.*)(?=}})/);
    if (a != null) {
      let comp = await fsp.readFile(path.join(componentsDir, a[0]) + '.html', 'utf-8');
      html[i] = '\n'+comp;
    }
  }
}

async function wfs(arrs) {
  await fsp.writeFile(path.join(pathOuter, buildStyleName), arrs);
}

async function additionFile(additionName, dirOuter) {
  let addName = path.basename(additionName);
  let outDir = path.join(dirOuter, addName);
  let addInf = await fsp.stat(additionName);

  if (addInf.isDirectory()) {
    await createPathOuter(outDir);
    let arrAddFile = [];
    await fsp.readdir(additionName)
      .then((data) => (arrAddFile = data))
      .catch((err) => console.log(err));
    for(let i = 0; i < arrAddFile.length; i++) {
      let file = path.join(additionName, arrAddFile[i]);
      let fileStat = await fsp.stat(file);
      if (fileStat.isDirectory()) {
        await additionFile(file, outDir);
      } else if (fileStat.isFile()) {
        await fsp.copyFile(file, path.join(outDir, path.basename(file)));
      }
    }
  }
}

const build = async () => {
  // создание папки
  await createPathOuter(pathOuter);
  
  // сборка html
  let html = await fsp.readFile('./06-build-page/template.html', 'utf-8');
  html = html.split('\n');
  await htmlBuild(html);
  await fsp.writeFile(path.join(pathOuter, buildHtmlName), html.join(''));
  
  // сборка css
  let rd = await fsp.readdir(stylesDir, { withFileTypes: true });
  for(let i = 0; i < rd.length; i++) {
    let file = path.join(stylesDir, rd[i].name);
    if (rd[i].isFile() && path.parse(file).ext == '.css') {
      strStyles += await fsp.readFile(file) + '\n';
    }
  }
  await wfs(strStyles);

  // доп файлы
  await additionFile(otherDir, pathOuter);
  //console.log('-------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Конец');
};

build();