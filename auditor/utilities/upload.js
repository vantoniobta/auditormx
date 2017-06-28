var upload = {};

var fs = require('fs');
var mkdirp = require('mkdirp');


 
function fileMinusExt(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}
 
// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {
  cb(null, {
    'result': 'success',
    'id': id,
    'name': name,
    'path': path
  });
}

upload.photo = function(file, id, fileName, dirPath, callback){
  var filePath = dirPath + '/' + fileName;
  try {
    mkdirp.sync(dirPath, 0777);
  } catch (e) {
    console.log(e);
  }

  fs.readFile(file.path, function (err, data) {
    if (err) {
      callback( { "error": "could not read file" }, null )
    } else {
      fs.writeFile(filePath, data, function (err) {
        if (err) {
          callback( {'error': 'could not write file to storage'}, null )
        } else {
          processImage(id, fileName, filePath, function (err, data) {
            if (err) {
              callback( err, null )
            } else {
              console.log('Image processing complete!!!')
              callback( null, data )
            }
          });
        }
      })
    }
  })
  
}

module.exports = upload;