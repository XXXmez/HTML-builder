const fs = require('fs');
const path = require('path');

const { stdout, stdin } = process;

const pathText = path.join(__dirname, 'text.txt');

fs.writeFile(pathText, '', (err) => {
  if (err) console.log(err);
});

stdout.write('Привет друг! Вводи текст для записи...   ');

stdin.on('data', (data) => {
  let str = data.toString().trim();
  console.log(str);
  if (str == 'exit') {
    stdout.write('Текст записан, пока друг!');
    process.exit();
  } else {
    fs.appendFile(pathText, str + '\n', (err) => {
      if (err) console.log(err);
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('Текст записан, пока друг!');
  process.exit();
});