const express = require('express');
const fs = require('fs');
const app = express();

const fileUpload = require('express-fileupload');
const port = 3000;

app.use(fileUpload());

app.use(express.static('public'));

app.post('/post', (req, res) => {
  console.log('Post Event')

  if(!req.files) return res.sendStatus(403).send('File Not Found in request');
  if(req.files.file.size > 200000) return res.sendStatus(403).send('File Size Too Large Like Yo Mom');

  const buffer = req.files.file.data;
  const base64 = Buffer.from(buffer).toString('base64');
  
  fs.writeFile('temp.txt', base64, function (err) {
    console.log('Writing in Temp')
    if (err) return console.log(err);
  });

  const promise = new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const process = spawn('python', ['script.py']);

    process.stdout.on('data', function(data) {
      console.log(data.toString());
      res.send(data.toString());
      process.stdin.end();

      resolve();
    });
  })
  
  promise.then(() => {
    fs.truncate('temp.txt', 0, function (err) {
      console.log('Temp File content Deleted')
      if (err) return console.log(err);
    });
  })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})