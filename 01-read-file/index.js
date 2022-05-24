const fs = require('fs');
const path = require('path');

const pathText = path.join(__dirname, 'text.txt');

let stream = new fs.ReadStream(pathText, 'utf-8');

stream.on('readable', () => {
  let data = stream.read();
  if (data != null ) console.log(data.trim());
});