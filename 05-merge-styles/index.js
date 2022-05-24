// Импорт всех требуемых модулей
// const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const dirStyles = path.join(__dirname, 'styles');
const dirBuildStyle = path.join(__dirname, 'project-dist');
const buildStyleName = 'bundle.css';

let strStyles = '';

async function wfs(arrs) {
  await fsp.writeFile(path.join(dirBuildStyle, buildStyleName), arrs);
}

const StyleBuilder = async() => {
  let rd = await fsp.readdir(dirStyles, { withFileTypes: true });
  for(let i = 0; i < rd.length; i++) {
    let file = path.join(dirStyles, rd[i].name);
    console.log(rd[i].isFile() && path.parse(file).ext == '.css', ' -->  ', rd[i].name);
    if (rd[i].isFile() && path.parse(file).ext == '.css') {
      strStyles += await fsp.readFile(file) + '\n';
    }
  }
  await wfs(strStyles);
  console.log('-------------------------------------------> Ждем конец');
};
StyleBuilder();