var mongoose = require('mongoose'),
  crypto     = require('crypto'),
  model      = require('../Schemas');

var Schema    = mongoose.Schema
 , salt       = 'mySaltyString'
 , SHA2       = new (require('jshashes').SHA512)()
 , ObjectId   = Schema.ObjectId
 , Inventory  = model.Inventory
 , User       = model.User
 , Account    = model.Account
 , Log        = model.Log;
 
 //Location    = new ( require('../models/location').provider)();
 //Art    = new ( require('../models/art').provider)();

/* Model Class
--------------------------- */
provider = function(){

 
  this.getAll = function(data,account,callback){      
    //Inventory.find().exec(function(e,d){
    //  if(e){
    //    callback({code:100,msg:"Error al guardar la referencia"});
    //  }else{        
    //    callback({code:0,msg:"Data ok",data:d});
    //  }
    //});
    var max = data.row;
    
    if (typeof(data.idSupplier) == 'undefined') {
      Inventory.find({account:account, status : 0}).sort({'from': -1,'to':-1}).populate('location').populate('supplier').skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
      //console.log(err || docs)
        if(err){
          callback({code:100,msg:'Error',data:err});
          return true;
        }
        Inventory.count({account:account}).exec(function(e,rows){             
          var pages = Math.ceil( rows / max );             
          callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
        });        
      });
    }else{
      Inventory.find({account:account, status : 0 , supplier : data.idSupplier}).sort({'from': -1,'to':-1}).populate('location').populate('supplier').skip(max * (data.page - 1)).limit(max).exec(function(err,docs){
      //console.log(err || docs)
        if(err){
          callback({code:100,msg:'Error',data:err});
          return true;
        }
        Inventory.count({account:account}).exec(function(e,rows){             
          var pages = Math.ceil( rows / max );             
          callback({code:0,msg:'Data is ready',data:docs,pages:{current:data.page,total:pages,rows:rows}});
        });        
      });
    }
    
    
  }
  
  this.getAllByLocation = function(data,account, callback){
    var max = data.row;
    Inventory.find({account : account, location : data.location})
    .populate('location')
    .populate('supplier','name')
    .populate('art','name')
    .sort({'from': -1,'to':-1})
    .skip(max * (data.page -1)).limit(max).exec(function(err, docs){
      if (err) {
        callback({code : 100, msg : 'Error en el servidor'});
      }else{
        Inventory.count({account: account , location : data.location}).exec(function(e, rows){
          var pages = Math.ceil(rows / max);
          callback({code : 0 , msg : 'Data is ready', data: docs, pages:{current: data.page, total: pages,rows : rows}});
        })
      }
    });
  }
  
  this.getAllBySupplier = function(data, account, callback){
    
    if (typeof(data.row) == 'undefined') {
      Inventory.find({account : account, supplier : data.supplier}).exec(function(error, rows){
        if (error) {
          callback({code : 100, msg : 'Error en el server'})
        }else{
          //console.log(rows.length);
          if (rows.length > 0) {
            callback({code : 0, msg : 'Ok data ready', data : rows});
          }else{
            callback({code : 101, msg : 'No hay datos'});
          }
        }
      });
    }
    
  }
  
  this.getAllByArt = function (art,callback){
    Inventory.find({art : art}).exec(function(error, docs){
      if (error) {
        callback({code : 100, msg: 'Error en el server'});
      }else{
        if (docs.length > 0) {
          callback({code : 0, msg : 'ok data ready', data: docs});
        }else{
          callback({code : 101, msg : 'No hay datos'});
        }
      }
    });
  }

this.add = function(data,callback){
  var response = new Campaing(data);
  response.save(function(error,doc){
    if (error) {
      callback({code:100, msg:'Error en el server al guardar el arte'});
    }else{
      callback({code:0, msg:'ok', data:doc});
    }
  });
}

this.delete = function(data, callback){
  Inventory.findOne({_id : data.id}).exec(function(err, doc){
    if (err) {
      callback({code : 100, msg : 'Error en el server'});
    }else{
      var today = new Date();
      if (doc.from > today) {
        Inventory.remove({_id : data.id}).exec(function(error, doc2){
            callback({code : 0, msg:'Borrado completamente'});
        });
      }else{
        callback({code : 101, msg : 'Este arte ya se encuentra en exhibición'});
      }
    }
  });
}

this.save = function(data, account,callback){
    //console.log('hola inventory');
    var that = this;
    var ids = [];
    var errors = [];
    var infLocation;
    data.arts = data.arts.filter(Boolean);
    Art.loadById(data.arts[0], function(art){ 
      if (art.code === 0) {
        //console.log(art);
        Location.updateRelease(art.art.to,data.location, function(location){
          if (location.code === 0) {
            that.loadByArt(-1,art.art, location.data._id, function(inventoryArt){
              if (inventoryArt.code === 0) {
                //console.log(location.price);
                var prices = that.getPrices(location.data.price, art.art.from,art.art.to);
                //console.log('-----');
                //console.log(location.data.price);
                //console.log(prices);
                var newInventory = new Inventory();
                newInventory.location = location.data._id;
                newInventory.supplier = location.data.supplier;
                newInventory.account  = location.data.account;
                newInventory.art      = art.art._id;
                newInventory.content  = art.art.content;
                newInventory.to       = art.art.to;
                newInventory.from     = art.art.from;
                newInventory.amounts  = {amountMinusIva : prices[2], amountIva : prices[1], amount : prices[0]};
                newInventory.save(function(err, doc){
                  if (err) {
                    callback({code: 100, msg:'Error en el server'})
                  }else{
                    callback({code: 0, msg: 'Datos agregados'});
                  }
                });
              }else{
                callback(inventoryArt);
              }
            });
          }else{
            callback(location);
          }
        });
      }else{
        callback(art);
      }
    });

    //Location.loadById(data.location, function(locationDoc){
    //  if (locationDoc.code === 0) {
    //    for (x in data.arts) {
    //      if (ids.indexOf(data.arts[x]._id) < 0) {
    //        ids.push(data.arts[x]._id);
    //        that.loadByArt(data.arts[x], locationDoc.data._id, function(respData){
    //          console.log(respData);
    //          if(respData.code === 0){
    //            Art.loadById(respData.data, function(resp){ 
    //              console.log(resp);
    //              if (resp.code === 0) {
    //                var newInventory = new Inventory();
    //                newInventory.location = locationDoc.data._id;
    //                newInventory.supplier = locationDoc.data.supplier;
    //                newInventory.account = locationDoc.data.account;
    //                newInventory.art         = resp.art._id;
    //                newInventory.content  = resp.art.content;
    //                newInventory.to          = resp.art.to;
    //                newInventory.from      = resp.art.from;
    //                newInventory.save();
    //              }
    //            });
    //          }
    //        });
    //      }
    //    }
    //    callback({code:0, msg : 'Agregado a sitios activos'});
    //  }else{
    //    callback(locationDoc);
    //  }
    //});
    
  }
  
  this.saveByState = function(data, account, callback){
    var that = this;
    var error = 0;
    var success = 0;
    var items = []
    var total = 0;
    
    Location.loadByState(data.state, function(response){
      if (response.code === 0) {
        if (response.data.length > 0) {
          Art.loadById(data.arts[0], function(responseArt){
            if (responseArt.code === 0) {
              total = response.data.length;
              for (var x = 0; x < response.data.length; x++) {
                //console.log(response.data[x].price);
                that.loadByArt(x, responseArt.art, response.data[x]._id, function(inventoryArt){
                  if (inventoryArt.code === 0) {
                    //console.log(inventoryArt.index + '-----');
                    var prices = that.getPrices(response.data[inventoryArt.index].price, responseArt.art.from,responseArt.art.to);
                    //console.log('-----');
                    //console.log(location.data.price);
                    //console.log(prices);
                    var newInventory = new Inventory();
                    newInventory.location = response.data[inventoryArt.index]._id;
                    newInventory.supplier = response.data[inventoryArt.index].supplier;
                    newInventory.account  = response.data[inventoryArt.index].account;
                    newInventory.art      = responseArt.art._id;
                    newInventory.content  = responseArt.art.content;
                    newInventory.to       = responseArt.art.to;
                    newInventory.from     = responseArt.art.from;
                    newInventory.amounts  = {amountMinusIva : prices[2], amountIva : prices[1], amount : prices[0]};
                    newInventory.save(function(err, doc){
                      if (err) {
                        error++;
                        items.push([{locationId : response.data[inventoryArt.index]._id, locationCode : response.data[inventoryArt.index].code}]);
                        if (items.length == response.data.length) {
                          
                          callback({code: 0, msg : 'Sitios agregados', data : {success : success, error : error, total : total}});
                        }
                      }else{
                        success++;
                        items.push([{locationId : response.data[inventoryArt.index]._id, locationCode : response.data[inventoryArt.index].code}]);
                        if (items.length == response.data.length) {
                          
                          callback({code: 0, msg : 'Sitios agregados', data : {success : success, error : error, total : total}});
                        }
                      }
                    });
                  }else{
                    error++;
                    //console.log(inventoryArt);
                    items.push([{locationId : response.data[inventoryArt.index]._id, locationCode : response.data[inventoryArt.index].code}]);
                    
                    if (items.length == response.data.length) {
                      
                      callback({code: 0, msg : 'Sitios agregados', data : {success : success, error : error, total : total}});
                    }
                  }
                });
              }
            }else{
              callback(responseArt);
            }
              
          });
        }else{
          callback({code : 101 , msg : 'No hay sitios que contratar'});
        }
      }else{
        callback(response);
      }
    });
  }

  this.loadByArt = function(index,art,location, callback){
    Inventory.find({art : art._id, location : location}).exec(function(err, doc){
      if (err) {
        callback({code: 100, msg: "Error en el servidor"});
      }else{
        if (doc.length < 1) {
          callback({code : 0,msg: 'no existe', data: art , index : index});
        }else{
          callback({code : 101, msg : 'Error este art ya fua agregado al sitio', index : index});
        }
      }
    });
  }
  
  this.getPrices = function(price,from,to){
    var priceFormat = price.replace(',','');
    /*Price for day*/
    var dateFrom = new Date(from);
    var dateTo = new Date(to);
    var diferences = dateTo.getDate() - dateFrom.getDate();
        diferences = diferences + 1;
    var priceForDay = parseFloat(priceFormat) / parseFloat(30);
    /*Amount of contract */
    var amount = parseFloat(priceForDay) * parseFloat(diferences);
    /*IVA*/
    var amountIva = (amount * 16)/100;
    /*Amount minus IVA*/
    var amountMinusIva = amount - amountIva;
    
    //console.log('price:' + priceFormat + 'Dia:'+ priceForDay + 'Importe:' + amount + 'iva:' + amountIva + 'import - iva:' + amountMinusIva);
    return [amount, amountIva, amountMinusIva];
  }

  this.getReport = function(data,account,callback){
    //console.log(data);
    var today = new Date();
    var dateStart = new Date(today.getFullYear(), parseInt(data.month), 1);
    var dateEnd = new Date(today.getFullYear(), parseInt(data.month) + 1, 0);
    //console.log(data);
    //console.log(dateStart + '----' + dateEnd);
    
    switch (data.type) {
      case 'places':
        Inventory.find({account : account, supplier: data.supplier, from : {'$gte' : dateStart , '$lt' : dateEnd}})
        .populate({
          path : 'location',
          options : {sort : 'code'}})
        
        .exec(function(err, docs){
          if (err) {
            callback({code: 100, msg:'Error en el server'})
          }else{
            if (docs != null) {
              callback({code:0, msg:'Datos encontrados', data : docs});
            }else{
              callback({code: 101, msg:'Not data found'});
            }
          }
        });
        break;
      case 'print' :
        break;
      default : callback({code: 101 , msg : 'No se especifico el tipo de reporte'});
        break;
    }
    //if (data.idSupplier) {
    //  Inventory.find({supplier : data.idSupplier}).populate('location').sort('from').exec(function(err,docs){
    //    if(err){
    //      callback({code:100,data:err});
    //    }
    //    else{
    //      callback({code: 0,data:docs});
    //    }
    //  });
    //}else{
    //  Inventory.find().populate('location').sort('from').exec(function(err,docs){
    //    if(err){
    //      callback({code:100,data:err});
    //    }
    //    else{
    //      callback({code: 0,data:docs});
    //    }
    //  }); 
    //}
    
  }

  this.formatDate = function (date){
    var dateTemp = date.split('-');

    return new Date(dateTemp[2],dateTemp[1]-1,dateTemp[0]);
  }

};

exports.provider = provider;


