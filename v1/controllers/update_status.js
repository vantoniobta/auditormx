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

  index: function (req, res) {

    // Declare Variables
    const req_method      = req.method
    const api_token_g     = 'BlmT5vSl9CsU3Q590PC8vMV9AKzgNtl6'
    const api_token       = String(req.body.api_token)
    const sent_images     = req.files
    const user_token      = String(req.body.user_token)
    var req_type          = String(req.body.req_type)
    var status_id         = req.body.status_id
    if( typeof status_id == undefined || status_id == null ){
      status_id = null
    }else{
      status_id = String(status_id)
    }


    if(req_method != 'POST'){
      return res.json({code:500,msg:'Invalid Method, Please send POST requests'})
    }else{

      //Check If User & Api Tokens Are Defined
      if( api_token == 'undefined' || user_token == 'undefined'){
        return res.json({ code:100 ,msg:'No data Received' })
      }else{
        // Check if Api Token Matches
        if(api_token_g == api_token){

          // Declare Variables
          var account_db,
              status_token

          // Find if the User login Token Exists
          Tokens.tenant('auditor-master').findOne({token:user_token}).exec(function(e,r){

            if( checkResponse(r) == false ){
              //Save the Tenant ID so we can Query in that database
              account_db   = 'auditor-'+String(r.tenant)

              var i = 0,
                  fieldname,
                  tmp_path,
                  tmp_id,
                  tmp_data = {},
                  img_extension,
                  new_path,
                  single_path,
                  single_id,
                  single_type,
                  qty_images = sent_images.length


              async.waterfall([
                function(callback){
                  if( status_id == null ){
                    status_token = uid(12)
                    Status.tenant(account_db).create({type:req_type,user_token:user_token,status_token:status_token,images:[]}).exec(function(e,d){
                      if( checkResponse(d) == false ){
                        status_id  = String(d[0]._id)
                        callback(null,status_id,status_token,'CREATE')
                      }else{
                        console.log('cant create status')
                      }
                    })
                  }else{
                    Status.tenant(account_db).findOne(status_id).exec(function(e,d){
                      if( checkResponse(d) == false ){
                        status_token  = String(d.status_token)
                        callback(null,status_id,status_token,'UPDATE')
                      }else{
                        console.log('cant find status')
                      }
                    })
                  }
                },
                // First Callback to get Array With All Images & Data
                function(status_id,status_token,insert_type,callback){
                  var tmp_array = [];
                  var i = 0;

                  var iterateTmpImages = function(i,sent_images,tmp_array){
                    if (i < qty_images){
                      console.log('iterating '+i)
                      //Get data
                      fieldname     = sent_images[i].fieldname
                      tmp_path      = sent_images[i].path
                      tmp_id        = uid(8)
                      img_extension = (sent_images[i].mimetype).split("/")[1]
                      new_path      = tmp_path+'.'+img_extension
                      tmp_data      = {_id:tmp_id,type:fieldname,createdAt:new Date(),updatedAt:new Date(),path:new_path}

                      //Rename File to Add Extension
                      fs.rename(tmp_path, new_path, function (err) {
                        if (err) throw err
                        // Update Temp File Path
                        tmp_path                    = new_path
                        tmp_array[tmp_array.length] = tmp_data

                        i++
                        iterateTmpImages(i,sent_images,tmp_array)
                      })

                    }else{
                      res.json({code:0,msg:'ok',status_id:status_id})
                      callback(null, tmp_path,tmp_array,insert_type)
                    }
                  };
                  iterateTmpImages(i,sent_images,tmp_array)
                },
                // Second Callback, pass the data arrays
                function(tmp_path,tmp_array,insert_type,callback){
                  //Find the status to update
                  Status.tenant(account_db).findById(status_id).exec(function(e,d){
                    if( checkResponse(d) == false ){

            // -----  //Only Update new Images Sent, so we don't rewrite & reupload them
                      var qry_images    = d[0].images
                      var new_images    = d[0].images
                      var curr_length   = qry_images.length
                      var update_length = tmp_array.length
                      
                      var ii = 0
                      var updateImages = function(ii,curr_length){
                        
                        if( insert_type == 'UPDATE' && ii < curr_length ){
                          if( update_length < curr_length && (ii+1) == curr_length ){
                            var arrtype = 'null';
                          }else{
                            var arrtype = tmp_array[ii].type;
                          }

                          var getIndex = qry_images.map(function(e) { return e.type; }).indexOf(arrtype)

                          if( getIndex === (-1) ){                  
                            ii++
                            updateImages(ii,curr_length)
                          }else{
                            new_images.splice(getIndex, 1)
                            ii++
                            updateImages(ii, (curr_length-1) )
                          }
                        }
                      };
                      updateImages(ii,curr_length);

                      // Add new images
                      d[0].images = new_images
                      for(var x in tmp_array){
                        (d[0].images).push(tmp_array[x]);
                      };
            // -----  //Only Update new Images Sent, so we don't rewrite & reupload them <---- END

                      //Save the images with the tmp data
                      Status.tenant(account_db).update( status_id, {$set:{images:d[0].images}} ).exec(function(e,d){
                        //Start counter & iterate throught tmp images to upload to Rackspace
                        var i = 0;
                        var requestResize = function(i, tmp_array){
                        if(i < tmp_array.length){
                          console.log(' ')
                          console.log(' ')
                          console.log( colors.black.bgGreen(' Image No. '+(i+1)+'         Status: '+status_id+'       TYPE: '+insert_type+' ') )

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
                                  callback(null, img_url,img_thumb,insert_type)
                                }
                              })
                            },


                            // Second Function, updated Images Subdocument Paths
                            function(img_url,img_thumb,insert_type,callback) {
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
                                      callback(null, ' DONE Image No. '+(i+1)+'           Type: '+single_type+'              Token: '+single_id+' ');
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
                          // END ASYNC Nested Waterfall





                          }else{
                            console.log(' ')
                            console.log('                         FINISHED COMPRESSING IMAGES                     '.underline.inverse.bold.red)
                          }
                        };
                        requestResize(i,tmp_array)
                      })

                    }else{
                      res.json({ code: 400, msg: 'There was a problem, please try again'})
                    }
                  })
                  callback(null, 'TEMPORARY DATA UPLOADED')
                }

              ],function(err, result){
                 console.log( colors.underline.inverse.bold.red(' //            '+result+'            // ') )
              })

              // END ASYNC 1st Waterfall
            }else{
              res.json({ code: 300, msg: 'User Token Not found' })
            }
          })// Find if the User login Token Exists
        }else{
          res.json({ code: 200 ,msg: 'Invalid Api Token' })
        }
      }

    }
    

  },






  test: function (req, res) {
    var formData = {
      width: 200,
      file: fs.createReadStream('/Users/saraileon/Desktop/Screen Shot 2016-06-06 at 11.31.19.png'),  
    }

    request.post({url:'http://cloud.iclicauditor.com/upload', formData: formData}, function optionalCallback(err, response, body) {
      console.log( JSON.parse(body) )
      if (err) {
        console.error('upload failed:')
        res.json(JSON.parse(err))
      }else{
        res.setHeader('Content-Type', 'application/json');
        res.json({code:0,msg:'ok', data:JSON.parse(body)})
      }     
    })
  },


  delete : function(req, res){ 
    var type = 'near';

    Status.tenant('auditor-2453626215727118').findOne('575996b566f4c1b9655e52ba').exec(function(e,r){
      var images = r.images
  
      for(var x in images){
        if( images[x].type == type ){

          var z = images.indexOf(type)
          var removeIndex = images.map(function(item) {
            res.json({data:item.type, z:z});
            return item.type;
          }).indexOf(type);
          ~removeIndex && images.splice(removeIndex, 1);

          r.images = images;
          // r.save(function(err,doc){
          //   res.json(doc);
          // });
        }
      }


    })
  },



};
