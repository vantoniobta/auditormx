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
    const api_token_g = 'BlmT5vSl9CsU3Q590PC8vMV9AKzgNtl6'
    const app_token   = String(req.body.token)
    const api_token   = String(req.body.api_token)
    const sent_images     = req.files
    var req_type          = String(req.body.req_type)

    // console.log(req.body)


    if(req_method != 'POST'){
      return res.json({code:500,msg:'Invalid Method, Please send POST requests'})
    }else{

      //Check If User & Api Tokens Are Defined
      if( app_token == 'undefined' || api_token == 'undefined'){
        return res.json({ code:100 ,msg:'No data Received' })
      }else{
        // Check if Api Token Matches
        if(api_token_g == api_token){

          // Declare Variables
          var status_id,
              account_db,
              status_token,
              tenantid;

          // Find if the User login Token Exists
          Accounts.tenant('auditor-master').findOne({'apps.token':app_token}).exec(function(e,r){
            if( checkResponse(r) == false ){
              //Save the Tenant ID so we can Query in that database
              tenantid     =  String(r._id)
              account_db   = 'auditor-'+String(tenantid)
              status_token = uid(32)
              //Create New Status and Save the ID of document Created
              Status.tenant(account_db).create({tenant:tenantid,type:req_type,app_token:app_token,token:status_token,images:[]}).exec(function(e,d){
                
                if( checkResponse(d) == false ){
                  status_id  = String(d[0]._id)

                  // Declare Variables
                  var i = 0,
                      fieldname,
                      originalname,
                      tmp_path,
                      tmp_id,
                      tmp_data = {},
                      status_id,
                      img_extension,
                      new_path,
                      qty_images = sent_images.length

                  //Iterate though the images Sent
                  async.waterfall([
                    // First Callback to get Array With All Images & Data
                    function(callback){
                      var tmp_array = [];
                      var i = 0;
                      var iterateTmpImages = function(i,sent_images,tmp_array){
                        if (i < qty_images){
                          console.log('iterating '+i)
                          //Get data
                          fieldname     = sent_images[i].fieldname
                          originalname  = sent_images[i].originalname
                          tmp_path      = sent_images[i].path
                          tmp_id        = uid(8)
                          img_extension = (sent_images[i].mimetype).split("/")[1]
                          new_path      = tmp_path+'.'+img_extension //'/'+tmp_path.split("/")[1]+'/'+originalname  //tmp_path+'.'+img_extension
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
                          callback(null, tmp_path,tmp_array)
                        }
                      };
                      iterateTmpImages(i,sent_images,tmp_array)
                    },
                    // Second Callback, pass the data arrays
                    function(tmp_path,tmp_array, callback){
                      
                      


                      var upload_form = {
                        account_db : account_db,
                        status_id  : status_id,
                        tmp_array  : JSON.stringify(tmp_array)
                      }
                      // Request Upload Controller to Get TEMP images into Rackspace and update database
                      request.post({url:'http://localhost:8889/upload', formData: upload_form}, function optionalCallback(err, response, body) {
                      
                        if (err) {
                          console.error('upload failed: '+err)
                        }else{
                          console.log(JSON.parse(body));
                        }
                      })

                      callback(null, 'TEMPORARY DATA UPLOADED ID: '+status_id)





                    }],
                  function(err, result){
                    console.log( colors.underline.inverse.bold.red(' //            '+result+'            // ') )
                  })
                  // END ASYNC

                // Error Handlings
                }else{
                  res.json({ code: 400, msg: 'There was a problem, please try again'})
                }
              })  //Create New Status and Save the ID of document Created END <--------
            }else{
              res.json({ code: 300, msg: 'App Token Not found' })
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
      file: fs.createReadStream('/Volumes/Macintosh HD/Users/saraileon/Documents/gcasas/wetransfer-056018/Lideres de area.JPG'),  
    }

    request.post({url:'http://cloud.iclicauditor.com/upload', formData: formData}, function optionalCallback(err, response, body) {
      console.log(body)
      if (err) {
        console.error('upload failed:')
        res.json(JSON.parse(err))
      }else{
        res.json( JSON.parse(body) )
      }     
    })
  },


  delete : function(req, res){ 
    var type = 'near';

    Status.tenant('auditor-2453626215727118').findOne('5758910b8959cc955b594577').exec(function(e,r){
      var images = r.images
  
      for(var x in images){
        if( images[x].type == type ){

          var removeIndex = images.map(function(item) {  
            return item.type;
          }).indexOf(type);
          ~removeIndex && images.splice(removeIndex, 1);

          r.images = images;
          r.save(function(err,doc){
            res.json(doc);
          });
        }
      }


    })
  },



};
