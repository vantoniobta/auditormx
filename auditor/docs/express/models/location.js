var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  model      = require('../Schemas');

var Schema  = mongoose.Schema
 , salt     = 'mySaltyString'
 , SHA2     = new (require('jshashes').SHA512)()
 , ObjectId = Schema.ObjectId
 , User     = model.User
 , Account  = model.Account
 , Log      = model.Log
 , Location = model.Location
 , Status   = model.Status
 , Supplier = model.Supplier;

/* Conect with Database
-------------------------------------- */
Account      = new ( require('../models/account').provider)();
Inventory    = new ( require('../models/inventory').provider)();

/* Model Class
--------------------------- */
provider = function(){

   /*@getAll
 ------------------------------------------*/
  this.getAll = function(id,data,callback){
    var max    = data.rows;
    if (data.noMaxRow) {
      //code
    }else{
      //console.log(id + 'Supplier');
      Location.find({supplier:id}).populate('supplier').sort({'status': 1,'code':1}).skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
         //console.log(err || docs)
           if(err){
             callback({code:100,msg:'Error',data:err});
             return true;
           }
           Location.count({supplier:id}).exec(function(e,rows){             
             var pages = Math.ceil( rows / max );             
             callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
           });        
       });  
    }
  }
  
  this.getAllByDateRelease = function(data, account, callback){
   var max = data.rows;
   var today = new Date();
   
   var condition = {account : account, release : {'$gt' : today}};
   if (typeof(data.supplier) != 'undefined' && data.supplier != '' && data.supplier != '1') {
      condition.supplier = data.supplier;
   }
   
   //if (typeof(data.idSupplier) != 'undefined') {
   //   Location.find({account : account,supplier : data.idSupplier, release : {'$gt' : today}}).
   //   populate('supplier').
   //   sort({code: 1}).
   //   skip(max * (data.page - 1)).
   //   limit(max).exec(function(err, docs){
   //      if (err) {
   //         callback({code: 100, msg : 'Error en server'})
   //      }else{
   //         Location.count({account: account,supplier : data.idSupplier, release :{'$gt' : today}}).exec(function(err, rows){
   //            console.log(rows);
   //            var pages = Math.ceil(rows / max);
   //            callback({code : 0, msg : 'Data is ready', data: docs, pages : {current : data.page, total : pages, rows: rows}});
   //         });
   //      }  
   //   });
   //}else{
      Location.find(condition)
      .populate('supplier')
      .sort({code: 1, supplier: 1})
      .skip(max * (data.page - 1))
      .limit(max).exec(function(err, docs){
         if (err) {
            callback({code: 100, msg : 'Error en server'})
         }else{
            Location.count(condition).exec(function(err, rows){
               console.log(rows);
               var pages = Math.ceil(rows / max);
               callback({code : 0, msg : 'Data is ready', data: docs, pages : {current : data.page, total : pages, rows: rows}});
            });
         }
      });
   //}
   
  }
  
  this.searchByKeyword = function(data,account, callback){
      var max = data.rows;
      //console.log(data);
      var condition = {account : account, code : {$regex : data.keyword}};
      if (typeof(data.supplier) != 'undefined' && data.supplier != '' && data.supplier != '1') {
         condition.supplier = data.supplier;
      }
      
      //if (typeof(data.idSupplier) != 'undefined') {
      //   Location.find({account : account,supplier: data.idSupplier, code : {$regex : data.keyword} })
      //   .populate('supplier')
      //   .sort({code: 1})
      //   .skip(max * (data.page - 1))
      //   .limit(max).exec(function(err, docs){
      //      if (err) {
      //         callback({code: 100, msg : 'Error en server'})
      //      }else{
      //         Location.count({account: account,  code : {$regex : data.keyword}  }).exec(function(err, rows){
      //            console.log(rows);
      //            var pages = Math.ceil(rows / max);
      //            callback({code : 0, msg : 'Data is ready', data: docs, pages : {current : data.page, total : pages, rows: rows}});
      //         });
      //      }
      //   });  
      //}else{
         Location.find(condition)
         .populate('supplier')
         .sort({code: 1})
         .skip(max * (data.page - 1))
         .limit(max).exec(function(err, docs){
            if (err) {
               callback({code: 100, msg : 'Error en server'})
            }else{
               Location.count(condition).exec(function(err, rows){
                  console.log(rows);
                  var pages = Math.ceil(rows / max);
                  callback({code : 0, msg : 'Data is ready', data: docs, pages : {current : data.page, total : pages, rows: rows}});
               });
            }
         });  
      //}
  }

  // this.getAllByAccount = function(id,data,callback){
  //   max   = data.rowMaxPage;
  //   skip  = data.page; 
  //  Location.find({account:id,active:1}).populate('supplier').sort('-_id').sort('-_id').skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
  //    //console.log(err || docs)
  //      if(err){
  //        callback({code:100,msg:'Error',data:err});
  //        return true;
  //      }
  //      Location.count({supplier:id}).exec(function(e,rows){             
  //        var pages = Math.ceil( rows / max );             
  //        callback({code:0,msg:'Data is ready',data:docs,pages:pages,rows:rows});
  //      });        
  //  });
  //}
  //
  //this.getAllCountByAccount = function(id,callback){
  //  Location.count({account:id}, function(err,count){
  //    if(err){
  //      callback({code:100,count:0});
  //    }
  //    else{
  //      callback({code:0,count:count});
  //    }
  //  });
  //}
  //
  //this.getAllCount = function(id,callback){
  //  Location.count({supplier:id}, function(err,count){
  //    if(err){
  //      callback({code:100,count:0});
  //    }
  //    else{
  //      callback({code:0,count:count});
  //    }
  //  });
  //}


  /*@load
 ------------------------------------------*/
  this.load = function(id,callback){
     Location.findOne({_id:id}).populate('supplier','name').exec(function(error,doc){       
        callback({code:0,msg:'Find ok',data:doc});       
    });
  }
  /*@loadCode
  -----------------------------------------*/
  this.loadByCode = function(code, callback){
    Location.findOne({'code':code}).exec(function(error,doc){
      if (error) {
         callback({code:100,msg:'Error en el server'});
      }else{
         if (doc !== null) {
            callback({code:0,msg:'ok',data:doc});
         }else{
            callback({code:102,msg:'Código de publicación no encontrado'});
         }
      }
    });
  }

 /*@loadId
 ------------------------------------------*/
 this.loadById = function(id, callback){
    Location.findOne({_id:id}).exec(function(error,doc){
      if (error) {
         callback({code:100,msg:'Error en el server'});
      }else{
         if (doc !== null) {
            callback({code:0,msg:'ok',data:doc});
         }else{
            callback({code:102,msg:'id no existe'});
         }
      }
    });
  }
  
  this.loadByState = function(state, callback){
   Location.find({state : state}).exec(function(error, docs){
      if (error) {
         callback({code: 100 , msg : 'Error en el server'});
      }else{
         callback({code : 0, msg : 'ok', data : docs});
      }
   });
  }

 /*@save
 ------------------------------------------*/
  this.save = function(data,account,callback){
      var that   = this;
      var id     = data._id;
      var status = 1;
      data.supplier.account = account;   
      console.log(data);
    switch(data.status){  
        case 'update':
          data.status = 1;

            delete data._id; 
      
            Location.update({ _id:id }, { $set: data }).exec(function(error,resp){
              if(error){
                  callback({code:100,msg:'There was an Error',data:error});
              }else{           
                   callback({code:0,msg:'Updating ok',data:resp}); 
              } 
            });

        break;
        default:
        data.account = account;
        data.price   = data.price.replace(',','');

        var response = new Location(data);
            response.save(function(error,doc){
                if(error){
                  callback({code:100,msg:'Server Error',data:error});
                }else{
                  callback({code:0,msg:'Save Ok',data:doc});
                }
            });
        break;
    }
      
  }

  /*@delete
 ------------------------------------------*/
  this.delete = function(data,callback){
    var id = data.split('-')[0];
    var email = data.split('-')[1];
    console.log(email);
      Location.remove({ _id:id }).exec(function(error,doc){
         callback({code:0,msg:'Delete of user ok',data:doc});
      });
  }
  
  this.deleteBySupplier = function(supplier, callback){
    Location.remove({supplier : supplier}).exec(function(error, doc){
      if (error) {
         callback({code : 100, msg:'Error en el server'});
      }else{
         callback({code: 0, msg : 'Todas las ubicaciones borradas'});
      }
    });
  }
  
  this.searchByToken = function(token,callback){  

   Account.loadByToken(token,function(r){      
      if(r.code == 0 ){  
        Location.find({supplier:r.user.supplier},{'_id': 0,'code':1,'active': 1}).sort({'avtive' : -1}).exec(function(error,docs){
            if (error) {
               callback({code:100,msg:'error en el server'})
            }else{
               if(docs){
   
                 callback({code:0,msg:'ok',data:docs});
                 return true;
   
               }else{
                  callback({code:101,msg:'No hay locations registradas para este usuario'});
               }
            }
         });   

      }else{
        callback(r);
      }
    });
  }
  
  this.getCoord = function(data,callback){
      if (data.idSupplier) {
         Location.find({supplier:data.idSupplier}).exec(function(error,docs){
            callback({code:0,msg:'ok',data:docs});
         });
      }else{
         Location.find({}).exec(function(error,docs){
            callback({code:0,msg:'ok',data:docs});
         });
      }
  }
  
   this.contract = function(data, account, callback){
    var that = this;
    var error = 0;
    var success = 0;
    var items = []
    var total = 0;
    var condition = {account : account};
    var release = new Date();
    release.setDate(release.getDate() + parseInt(30));
    console.log(release);
    
    if (data.state != '-1') {
      condition.state = data.state;
    }
    if (data.supplier != '1') {
      condition.supplier = data.supplier;
    }
    console.log(condition);
    console.log('------------');
    Location.find(condition).exec(function(err, respLocation){
      if (err) {
        callback({code : 0, msg : 'Error en el server'});
      }else{
        if (respLocation.length > 0) {
          total = respLocation.length;
          for (var x = 0; x < respLocation.length; x++) {
            that.updateRelease(release,respLocation[x]._id, function(resp){
              if (resp.code == 0) {
                success++;
                items.push(['Success']);
                if (items.length == respLocation.length) {
                  callback({code: 0, msg : 'Sitios agregados', data : {success : success, error : error, total : total}});
                }
              }else{
                error++;
                items.push(['Error']);
                if (items.length == respLocation.length) {
                  callback({code: 0, msg : 'Sitios contratados', data : {success : success, error : error, total : total}});
                }
              }
            });
          }
        }
        else{
          callback({code:101, msg : 'No hay sitios para contratar con estos parametros'});
        }
      }
    });
  }
  
  this.updateRelease = function(date,id,callback){
    Location.findOne({_id:id}).exec(function(error,doc){
      if (error) {
         callback({code:100, msg:'Error en el server'});
      }else{
         //var dateParts = date.split('-');
         //doc.release = new Date(dateParts[2],dateParts[1] - 1,dateParts[0]);
         if (doc.release < date) {
            doc.release = date;
         }
         if (typeof(doc.release) == 'undefined') {
            doc.release = date;
         }
         doc.save(function(error, newDoc){
            if (error) {
               callback({code:100,msg:'Error en el server',msgRoot:'Error al actualizar fecha de release en location'});
            }else{
               callback({code:0,msg:'ok', data: newDoc});
            }
         });
      }
    });
  }
  
};

exports.provider = provider;


