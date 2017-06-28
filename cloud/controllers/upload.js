const fs          = require('fs');
const gm          = require('gm').subClass({imageMagick: true});
const randtoken   = require('rand-token');
const util        = require('util');    
const qt          = require('quickthumb');
const mv          = require('mv');
const path        = require('path');
const pkgcloud    = require('pkgcloud');
const mime        = require('mime');

// curl -i -X POST -H "Content-Type: multipart/form-data" -F "width=200"  -F "height="  -F "image=@/Users/ferso/Desktop/Screen Shot 2016-05-29 at 11.55.56 PM.png;type=image/png" http://localhost:8890

sizeFormat = function (bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000; // or 1024 for binary
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

toCDN = function(rute,name,cb){
  var size   = fs.statSync(rute)["size"];
  var client = pkgcloud.providers.rackspace.storage.createClient({
    username : tenant.config.cdn.username,
    apiKey   : tenant.config.cdn.apikey,
    region   : tenant.config.cdn.region
  });
  var readStream  = fs.createReadStream(rute);
  var writeStream = client.upload({ 
    container     : tenant.config.cdn.container,
    remote        : name,
    size          : size
  });
  writeStream.on('error', function(err) {
    cb({code:100});
  });
  writeStream.on('success', function(file) {    
    cb({code:0,file:file});
  });
  readStream.pipe(writeStream);
}

module.exports = {

 index: function (req, res){

  if( req.method == 'POST'){

      if( req.files.length > 0 ){
        console.log(req.files[0]);

        var response    = {};
        var start_timer = new Date().getTime();
        var width       = typeof(req.body.width)  == 'undefined' || req.body.width  == '' || req.body.width  == 0 ? null : req.body.width;
        var height      = typeof(req.body.height) == 'undefined' || req.body.height == '' || req.body.height == 0 ? null : req.body.height;
        var extensions  = {'image/png':'png','image/jpeg':'jpg','image/jpg':'jpg','image/gif':'gif'};
        var field       = req.files[0].fieldname;
        var file_name   = req.files[0].originalname;    
        var tmp_file    = req.files[0].path;
        var file_mime   = req.files[0].mimetype;
        var size        = req.files[0].size;
        var token       = randtoken.generate(32);
        var base_dir    = fs.realpathSync( path.join(__dirname,'../uploads') );
        var final_name  = ''.concat(token,'.', extensions[file_mime]);
        var thumb_dir   = fs.realpathSync( path.join( base_dir,'thumbs'));
        var thumb_name  = ''.concat('thumb-',final_name);

        //response parameters
        response.code          = 0;
        response.msg           = 'ok';
        response.original_name = file_name;
        response.name          = final_name;
        response.thumb_name    = thumb_name;
        response.date          = new Date();
        response.original_size = sizeFormat(size,2);
        response.url           = tenant.config.cdn.url;

        //resizing image for thumbnail
        var thumb_path = thumb_dir+'/'+thumb_name;
        gm(tmp_file, function(err, features){
          if (err) throw err;
          console.log(features);
        })
        gm(tmp_file)
        .resize(width,height)
        .write(thumb_path, function (err) {
            //define file path
            var thumb_path = thumb_dir+'/'+thumb_name;
            //write resized image (thumbnail)
            // fs.writeFileSync(thumb_path, stdout, 'binary');
            //file new optimized
            final_path = base_dir+'/'+final_name;
            //readStream
            var readStream = fs.createReadStream(tmp_file);
            //optimize image from original
            //--------------------------------------------------------------
            gm(tmp_file).quality(90).write(final_path, function (err) {

              //optimized size file
              response.size = sizeFormat(fs.statSync(final_path)["size"]);

              try{                        
                //upload original optimized image
                toCDN(final_path,final_name,function(r){
                    //upload thumbnail to cdn
                    toCDN(thumb_path,thumb_name,function(r){
                        //delete original file uploaded to clear temps files
                        fs.unlinkSync(tmp_file);                        
                        //process timer
                        var end_timer  = new Date().getTime();
                        response.timer = ((end_timer - start_timer)/60).toFixed(2) + 's';
                        response.code  = r.code;

                        //response for action
                        console.log(response);
                        res.json(response);
                    });
                });
              }catch(e){
                //response on error;
                response      = {};
                response.code = 100;
                response.msg  = 'Ups!! something wrong occurr in the process try again'
              }
            });            
            //--------------------------------------------------------------
        });
      }else{
           res.status(500).json({code:100,msg:'No files recived'});
      }
    }else{
       res.status(500).json({code:100,msg:'Invalid method, request must be POST'});
    }
  }
};