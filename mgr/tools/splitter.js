const splitFile = require('split-file');

splitFile.splitFileBySize(__dirname + '/file_to_split', 26214400)
  .then((names) => {
    console.log(names);
  })
  .catch((err) => {
    console.log('Error: ', err);
  });