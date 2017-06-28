var fs   = require('fs');
var _  = require('underscore');

var upload = require('./upload');

var private = {};

private.safeFilename = function(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}

private.fileExtension = function(fileName) {
  return fileName.split('.').slice(-1);
}

var Report = function(files, Model, PATH){
  this.files = files;
  this.Model = Model;
  this.UPLOAD_PATH = PATH;
  this.separator = ' ';
  this.file_list =  _.pluck(files, 'name')
} 

Report.prototype.fileUpload = function(file, doc){
  var id = doc.code
    //, fileName = file + "." + private.fileExtension(private.safeFilename(file.name))
    , fileName = file.name
    , dirPath = this.UPLOAD_PATH + '/provider_' + id + '/'

  upload.photo(file, id, fileName, dirPath, function(error, data){  
    return error == null
  })
}

Report.prototype.uploadFiles = function(doc){
  list_name = doc.files.split(this.separator)
  var memo = []
  for (var i in this.files){
    for (var j in list_name){
      if(this.files[i].name == list_name[j]){
        this.fileUpload( this.files[i], doc )
        
        memo.push(list_name[j])
        if (memo == list_name) return true
      }
    }
  }
  return memo == list_name
}

Report.prototype.saveInDB = function(data, callback){
  var that = this;
  this.Model.create(data).done(function(error, doc){
    if(error) {
      return callback(error)
    }else {
      console.log('agregado correctamente a la base de datos')
      if (! that.uploadFiles(doc)){
        // eliminar el registro por que no se subieron los archivos correctamente
        that.delete(doc.id, callback)
      }

      return callback(null, doc)
    }
  })
}

Report.prototype.existSendFile = function(files_string){
  var file_names = files_string.split( this.separator )
  for(var i in file_names)
     if ( _.indexOf(this.file_list, file_names[i]) < 0 ) return false 
  return true;
}

Report.prototype.delete = function(id, callback){
   this.Model.destroy({id:id},function(e){      
      return callback({'code':0,'msg':'Registro eliminado por error en la carga de archivos'}, null);
   });
}

module.exports = Report;