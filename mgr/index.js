const fetch = require('node-fetch');
const download = require('./download.js');
const splitFile = require('split-file');
const exec = require('child_process').execFile;
const os = require('os');

const package = 'discord';
const packageRepo = 'http://tsc.theclashfruit.ga/';

fetch(packageRepo + package + '/meta.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    run(data.split_names.windows, data.version);
  });

/*
const file = fs.createWriteStream("file.jpg");
const request = http.get(packageRepo +, function(response) {
  response.pipe(file);
});
*/

async function run(files, version) {
  let splitNames    = [];
  let filesFinal    = [];
  let fileNameFinal = randomString(10);

  await files.forEach(async element => {
    filesFinal.push(element.replace('${version}', version));
    splitNames.push(os.tmpdir() + '/' + element.replace('${version}', version));
  });

  try {
    async function doDownload() {
      await download(packageRepo + package + '/' + filesFinal[0], os.tmpdir() + '/' + filesFinal[0])
      filesFinal.splice(0, 1)
      if(filesFinal.length >= 1) {
        doDownload()
      } else {
        splitFile.mergeFiles(splitNames, os.tmpdir() + '/' + fileNameFinal + '.exe')
          .then(() => {
            console.log('Done!');
            exec(os.tmpdir() + '/' + fileNameFinal + '.exe', function(err, data) {  
              console.log(err)
              console.log(data)             
            });
          })
          .catch((err) => {
            console.log('Error: ', err);
          });
      }
    }
    doDownload()
  } catch (e) {
    console.log('Download failed')
    console.log(e.message)
  }

  /*
  splitFile.mergeFiles(splitNames, __dirname + '/tmp/last.exe')
    .then(() => {
      console.log('Done!');
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  */
}

function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}