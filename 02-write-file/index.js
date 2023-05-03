const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), { flags: 'a' });

writeStream.on('error', (err) => {
  stdout.write(err);
});

stdout.write('Введите текст...\n');

stdin.addListener('data', data => {
  const newData = data.toString().toLowerCase().trim();
  if (newData === 'exit') {
    stdout.write('До свидания и удачи в изучении Node.js!');
    exit();
  } else {
    writeStream.write(`${data}\n`);
  }
  
});

process.addListener('SIGINT', () => exit(stdout.write('До свидания и удачи в изучении Node.js!')))