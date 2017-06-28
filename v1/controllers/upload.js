const fs       = require('fs')
const uid      = require('rand-token').uid
const request  = require('request')
const async    = require('async')
const colors   = require('colors')


// Check for Empty Documents in Mongo Consults
var checkResponse = function(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false
  }
  return true
};

module.exports = {


  index: function(req,res){
    const account_db      = String(req.body.account_db)
    const status_id       = String(req.body.status_id)
    const tmp_array       = JSON.parse(req.body.tmp_array)

    var single_path,
        single_id,
        single_type;

    if(req.method != 'POST'){
      return res.json({code:500,msg:'Invalid Method, Please send POST requests'})
    }else{


      Status.tenant(account_db).findById(status_id).exec(function(e,d){
        if( checkResponse(d) == false ){
          // Assign all images with temp data
          d[0].images = tmp_array
          //Save the images with the tmp data
          Status.tenant(account_db).update( status_id, {$set:{images:d[0].images}} ).exec(function(e,d){
            //Start counter & iterate throught tmp images to upload to Rackspace
            var i = 0;
            var requestResize = function(i, tmp_array){
            if(i < tmp_array.length){
              console.log(' ')
              console.log(' ')
              console.log( colors.black.bgGreen(' Image No. '+(i+1)+'             Status: '+status_id+' ') )

              single_path = tmp_array[i].path
              single_id   = tmp_array[i]._id
              single_type = tmp_array[i].type

              // formData for the Uploads Request
              var formData = {
                width: 200,
                height: 200,
                qlty: 50,
                tmp_path: single_path,
                file: fs.createReadStream(single_path)  
              }

              // Nested Async Waterfall to upload Images to Rackspace
              async.waterfall([
                // First Function, send current formData
                function(callback) {
                  request.post({url:'http://cloud.iclicauditor.com/upload', formData: formData}, function optionalCallback(err, response, body) {
                    if (err) {
                      console.error('upload failed: '+err)
                    }else{
                      // Get Img Paths
                      var compressed_data = JSON.parse(body)
                      var img_url         = compressed_data.url+'/'+compressed_data.name
                      var img_thumb       = compressed_data.url+'/'+compressed_data.thumb_name
                      // Send Compressed Images URLS to 2nd Function
                      callback(null, img_url,img_thumb)
                    }
                  })
                },
                // Second Function, updated Images Subdocument Paths
                function(img_url,img_thumb,callback) {
                  Status.tenant(account_db).findOne(status_id).exec(function(e,data){
                    var images = data.images
                    // Match past path name and Update It
                    for(var x in images){
                      if( images[x]._id == single_id ){
                        data.images[x].path      = img_url;
                        data.images[x].thumb     = img_thumb;
                        data.images[x].updatedAt = new Date();
                        // Save new Path and thumb
                        data.save(function(err,doc){
                          console.log(colors.yellow.underline.dim(single_path));
                          console.log(colors.red.underline.dim(img_url));
                          fs.unlinkSync(single_path);
                          callback(null, ' DONE Image No. '+(i+1)+'                   Token: '+single_id+' ');
                        });
                      };
                    };

                  })
                }
                // Final Callback & Result
              ], function (err, result) {
                console.log( colors.black.bgGreen(' //'+result+'// ') )
                i++
                requestResize(i,tmp_array)
              })
              // END ASYNC

              }else{
                console.log(' ')
                console.log('                         FINISHED COMPRESSING IMAGES                     '.underline.inverse.bold.red)
                res.json({code:0,msg:'Images Uploaded',status_id:status_id})
              }
            };
            requestResize(i,tmp_array)

          })

        }else{
          res.json({ code: 400, msg: 'There was a problem, please try again'})
        }

      })
    
    }

  },


};