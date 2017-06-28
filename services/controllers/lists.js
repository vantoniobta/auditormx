
const fs          = require('fs');
const mv          = require('mv');
const mime        = require('mime');
const pkgcloud    = require('pkgcloud');

var xlstojson     = require("xls-to-json-lc");
var xlsxtojson    = require("xlsx-to-json-lc");

var asyncLoop     = require('node-async-loop');
var concat        = require('unique-concat');




slugify = function (text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
 function clean_object(obj){ //delete null excel
     for(key in obj){
       if(!obj[key]){
          delete obj[key];
          }
     }
        return obj;
 }

 function diffArray(a, b) {
      var seen = [], diff = [];
          for ( var i = 0; i < b.length; i++)
              seen[b[i].key] = true;
          for ( var i = 0; i < a.length; i++)
              if (!seen[a[i].key])
                  diff.push(a[i]);
      return diff;
}


function removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }
 
sizeFormat = function (bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000; // or 1024 for binary
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
var getExtension = function(filename){
  return filename.split('.').pop();
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
    cb({code:0,file:file,url: tenant.config.cdn.url});
  });
  readStream.pipe(writeStream);
}
module.exports = {
   index: function (req, res) {
    res.json({code:0,msg:'ok'})
   },
   all: function(req, res){
      //list DataChooser
      var where    = {}
      Lists.tenant('auditor-'+req.query.tenant).find().exec(function(e,r){
         if (!e) {
              for(var i=0; i<r.length; i++){
                delete r[i].locations;
              }
            res.json({code:0,msg:'ok',data:r});
        }else{
             res.json({code:100,msg:'error! database null in auditor-tenant', error: e});
         }
      });
   },
   // auto: function(req, res){
   //  // console.log(req.body.id)
   //  Lists.tenant('auditor-'+req.body.id).find({}).exec(function(e,r){
   //   // console.log(r)
   //    var test = JSON.stringify(r);
   //    console.log(test)
   //  })
   // },
    table_one: function(req,res){
       var array_n  = [];
       var array_nx = [];
       var pos      = [];
       var rows    = req.query.rows;
       var page    = req.query.page;
       Locations.tenant('auditor-'+req.query.tenant).find().exec(function(e,r){ //example
        var total = r.length;
        var pages = Math.ceil(total/rows);
        var tc    =  [];

         if (r.length == 0) {
              return res.json({code:0,msg:'ok',data:[],pages:{current_page:page,rows:rows,count:total}});
         }else{
              for(var i=0; i<10; i++){
                tc.push(r[i])
              }
              return res.json({code:0,msg:'ok',data:tc,pages:{current_page:page,rows:rows,count:total}});
         }
       })



       //.............................forma 2.......
       // Lists.tenant('auditor-'+req.query.tenant).find({}).exec(function(e,r){ 
       //      for(var x=0; x<r.length; x++){
       //        array_n.push(r[x].locations);
       //      }
       //       array_n.forEach(function(value){
       //        console.log(value)
       //       })
       //     // var unique = removeDuplicates(array_n, "key");

       //      // for(var y=0; y<unique.length; y++){
       //      //   console.log(unique[y])
       //      //   return res.json({code:0,msg:'ok',data:unique[y],pages:{current_page:page,rows:rows}});
       //      // }
         
       //       //return res.json({code:0,msg:'ok',data:unique[y],pages:{current_page:page,rows:rows}});
       // })
  },
   table: function(req, res){
      var rows    = req.query.rows;
      var page    = req.query.page;
      Lists.tenant('auditor-'+req.query.tenant).findOne({id:req.query.id}).exec(function(e,r){
      var total =  r.locations.length;
       var pages = Math.ceil(total/rows);
       var tc2    =  [];
         if (r.locations.length == 0) {
              return res.json({code:0,msg:'ok',data:[],pages:{current_page:page,rows:rows,count:total}});
         }else{
                  for(var i=0; i<10; i++){
                    tc2.push(r.locations[i])
                  }
                  return res.json({code:0,msg:'ok',data:tc2,pages:{current_page:page,rows:rows,count:total}});
         }
      })
   },
   files: function(req, res){
    var rows    = req.query.rows;
      var page    = req.query.page;
      Files.tenant('auditor-'+req.query.tenant).count({list:req.query.id}).exec(function(e,c){
         Files.tenant('auditor-'+req.query.tenant).find({list:req.query.id}).exec(function(e,r){
            var total = c ;
            var pages = Math.ceil(total/rows);
             return res.json({code:0,msg:'ok',data:r,pages:{current_page:page,rows:rows,count:total}});
         });
      });
   },
   save:function(req,res){
      var body = req.body;
      if( body.id == '' ){
         Lists.tenant('auditor-'+body.tenant).create({
            name : body.name,
            status : 1,
            active : 1,
            locations: []
         }).exec(function(e,list){
            // console.log(e||list)
            return res.json({code:0,msg:'ok',mode:'insert',data:list});
         });
      }else{
         Lists.tenant('auditor-'+body.tenant).findOne(body.id).exec(function(e,list){
            list.name = body.name;
            list.save(function(e,list){
                return res.json({code:0,msg:'ok',mode:'update',data:list});
            });
         });
      }
   },
   upload:function(req,res){
      var conv      = [];
      var datos_db  = [];
      var nuevo     = [];
      var n_w       = [];
      var tb        = [];
      var testing   = [];
      var testing2   = [];
      //----------------
      var key_up    = [];
      var new_one   = [];
      var new_key   = [];
      var key_final = [];
      var add_key   = [];

      var chunks    = [];
      var tab_loc   = [];

      var ids       = req.body.id;
      var body      = req.body;
      var tmpfile   = req.files[0].path;
      var extension = getExtension(req.files[0].originalname);
      var time      = new Date().getTime();
      var filename  = slugify(req.files[0].originalname.replace(extension,''));
      var filename  = filename +'-'+ time+ '.'+extension;
      var mimeform  = mime.lookup(tmpfile);
      //-----------------------------------------------------------------------

        var update_table= function(sql){
              var data         = {};
              data.key         = sql.key;
              data.address     = sql.address;
              data.neigborhud  = sql.neigborhud;
              data.city        = sql.city;
              data.state       = sql.state;
              data.country     = sql.country;
              data.zip         = sql.zip;
              data.company     = sql.company;
              data.tipo        = sql.tipo;
              data.start_date  = sql.start_date;
              data.end_date    = sql.end_date;
              Locations.tenant('auditor-'+body.tenant).findOne({key:data.key}).exec(function(e,r){
                    if (r) {
                          for( var i in r) {
                                if( r[i].key == data.key ){
                                  var valor       = i;
                                  r[i].address    = data.address;
                                  r[i].neigborhud = data.neigborhud;
                                  r[i].city       = data.city;
                                  r[i].state      = data.state;
                                  r[i].country    = data.country;
                                  r[i].zip        = data.zip;
                                  r[i].company    = data.company;
                                  r[i].tipo       = data.tipo;
                                  r[i].start_date = data.start_date;
                                  r[i].end_date   = data.end_date;
                                      r.save(function(e,r){
                                      if (!e) {
                                      console.log('------------se actualizo en locations----------');
                                      //console.log(r.locations[valor]);
                                      }else{
                                      console.log('------------Error al actualizar en locations----------');
                                      }
                                      })
                                }
                          }
                    }
              })
  }

      //----------------------read file excel-----------------------------------txt
      var exceltojson;
       if(filename.split('.')[filename.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
              exceltojson({ input: tmpfile,output: null, lowerCaseHeaders:true }, function(err, result){
                if (!err) {
                         toCDN(tmpfile,filename,function(r){
                                         Files.tenant('auditor-'+body.tenant).create({
                                            name : filename,
                                            src : r.url+'/'+filename,
                                            extension:extension,
                                            mime : mimeform,
                                            list:body.id,
                                            progress:'waiting'
                                         }).exec(function(e,list){
                                          //..........................
                                                  var x_vacios = result.map(function(item){ //
                                                    return clean_object(item);
                                                  });           
                                                   Lists.tenant('auditor-'+body.tenant).find({id:ids}).exec(function(e,r){ //query mongo
                                                                 datos_db=r; //datos de la base de datos
                                                                      for(var i=0; i<datos_db.length; i++){
                                                                        conv=datos_db[i].locations
                                                                        for(var w=0; w<conv.length; w++){
                                                                            for(var j=0; j<x_vacios.length; j++){
                                                                                  if(x_vacios[j].key==conv[w].key){
                                                                                     nuevo.push(x_vacios[j]); //  keys que existe
                                                                              } 
                                                                         }
                                                                    }
                                                              }
                                                             //console.log(nuevo)
                                                              //------------------OPTIENE LOS KEYS NUEVO .-----------------------
                                                              for(var k=x_vacios.length -1; k>=0; k--){ 
                                                                          for(var l=0; l<nuevo.length; l++){
                                                                                if(x_vacios[k] && (x_vacios[k].key === nuevo[l].key)){
                                                                                   n_w=x_vacios.splice(k,1) //
                                                                                  
                                                                                }
                                                                        }
                                                                }
                                                                //------------------validar vacio.-----------------------------------------
                                                                n_w=x_vacios;
                                                                         for(var x7=0; x7<n_w.length; x7++) {
                                                                                    if (n_w[x7].key){
                                                                                         testing.push(n_w[x7]) //testing array donde ya no tiene campos vacios ->valores nuevos a insertar
                                                                                      }
                                                                             }

                                                                             const newArr = testing.forEach(function (item) {  //testing valores nuevos que no existen , 
                                                                              item.status = 'NO DEFINIDO'
                                                                              return item
                                                                            })

                                                                   //query mongo
                                                                   Lists.tenant('auditor-'+body.tenant).findOne({id:ids}).exec(function(error,doc){
                                                                              for(var t=0; t<testing.length; t++){
                                                                                    doc.locations.push(testing[t]);
                                                                                 }
                                                                                
                                                                                                 doc.save(function(err,dc){ //----------------------save_one-------------------------------------
                                                                                                        if(!err){

                                                                                                                  Locations.tenant('auditor-'+body.tenant).find({}).exec(function(ev,ru){ //----------------------tabla location----------------------
                                                                                                                        if(ru.length==0){

                                                                                                                              Locations.tenant('auditor-'+body.tenant).create(testing).exec(function(ex3,u3){
                                                                                                                                console.log('se inserto en locations')
                                                                                                                              })

                                                                                                                          }else{
                                                                                                                                  Locations.tenant('auditor-'+body.tenant).find({}).exec(function(ex4,u4){
                                                                                                                                    chunks=u4; //optener key que no existen en la tabla location
                                                                                                                                          for(var c=0; c<chunks.length; c++){
                                                                                                                                              for(var c2=0; c2<doc.locations.length; c2++){
                                                                                                                                                  if(doc.locations[c2].key==chunks[c].key){
                                                                                                                                                    key_up.push(doc.locations[c2]); // [key_up] -> key que si existe en la tabla locations
                                                                                                                                                  }
                                                                                                                                              }
                                                                                                                                          }
                                                                                                                                          //console.log(result)
                                                                                                                                            for(var c3=0; c3<result.length; c3++){
                                                                                                                                               if(result[c3].key){
                                                                                                                                                 new_one.push(result[c3]) //excel
                                                                                                                                               }
                                                                                                                                            }

                                                                                                                                           var tic=diffArray(new_one,key_up) //optener diferecia 
                                                                                                                                           Locations.tenant('auditor-'+body.tenant).create(tic).exec(function(ec,rc){
                                                                                                                                            //console.log('....................se inserto en la tabla locations..................................')
                                                                                                                                           })
                                                                                                                                           
                                                                                                                                       
                                                                                                                                  })
                                                                                                                              
                                                                                                                          }                                                                                                                
                                                                                                                  })  //----------------------tabla location---------------------
                                                                                                               
                                                                                                                             Files.tenant('auditor-'+body.tenant).update({name:filename}, {$set:{progress:'completed'}}).exec(function(e1, r1){
                                                                                                                             })

                                                                                                             //-----------------------------------------------------------
                                                                                                                                 if(nuevo.length==0){
                                                                                                                                    console.log('No existe key para axtualizar en lists')
                                                                                                                                 }else{  //actualizar todos los key que ya existen 
                                                                                                                                               for(var n=0; n<nuevo.length; n++){
                                                                                                                                                   for(var x3=0; x3<doc.locations.length; x3++){
                                                                                                                                                            if(nuevo[n].key==doc.locations[x3].key){
                                                                                                                                                                     doc.locations[x3].key          =  nuevo[n].key
                                                                                                                                                                     doc.locations[x3].address      =  nuevo[n].address
                                                                                                                                                                     doc.locations[x3].neigborhud   =  nuevo[n].neigborhud
                                                                                                                                                                     doc.locations[x3].city         =  nuevo[n].city
                                                                                                                                                                     doc.locations[x3].state        =  nuevo[n].state
                                                                                                                                                                     doc.locations[x3].country      =  nuevo[n].country
                                                                                                                                                                     doc.locations[x3].zip          =  nuevo[n].zip
                                                                                                                                                                     doc.locations[x3].company      =  nuevo[n].company
                                                                                                                                                                     doc.locations[x3].tipo         =  nuevo[n].tipo
                                                                                                                                                                     doc.locations[x3].start_date   =  nuevo[n].start_date
                                                                                                                                                                     doc.locations[x3].end_date     =  nuevo[n].end_date
                                                                                                                                                                     doc.locations[x3].status       =  '1';
                                                                                                                                                                  } //if
                                                                                                                                                        }//doc.locations                                                                                 
                                                                                                                                               }//for nuevo
                                                                                                                                                       doc.save(function(e,r){
                                                                                                                                                                    if(!e){
                                                                                                                                                                           console.log(r)
                                                                                                                                                                           //.............Estatus................
                                                                                                                                                                             Files.tenant('auditor-'+body.tenant).update({name:filename}, {$set:{progress:'completed'}}).exec(function(eer, rre){
                                                                                                                                                                              console.log('........................Estatus..................................')
                                                                                                                                                                              console.log(rre)
                                                                                                                                                                             })
                                                                                                                                                                           //.............................
                                                                                                                                                                    }
                                                                                                                                                        })
                                                                                                                                      } //else
                                                                                              //-----------------------------------------------------------
                                                                                             
                                                                                                  }else{
                                                                                                         console.log(err)
                                                                                          }                                            
                                                                               }) //-----------------------save_one------------------------------------
                                               
                                                                  })  //query mongo+
                                
                                                             })
                                                            //..........................
                                                            return res.json({code:0,msg:'ok',data:[]});
                                                });
                                    });
                           
                }else{
                   console.log("---------error excel!!---------")
                }
        })

   },
   remove:function(req,res){
      List.tenant('auditor-'+req.body.tenant).remove({id:req.body.id}).exec(function(e,r){
         return res.json({code:0,msg:'ok',data:r});
      });
   },
   removefiles:function(req,res){
      Files.tenant('auditor-'+req.body.tenant).remove({id:req.body.id}).exec(function(e,r){
         return res.json({code:0,msg:'ok',data:r});
      });
   },
     group:function(req,res){
      console.log('ok')
   },
    viewall:function(req,res){
      var key = req.body.id;
      var px = req.body.ids;
      Lists.tenant('auditor-'+req.body.tenant).findOne({id:px}).exec(function(e,r){

        var data = r.locations;
        var pdc = [];

        for(var x=0; x<data.length; x++){
            if(data[x].key==key){
               pdc.push(data[x]);
               return res.json({code:0,msg:'ok',data:pdc});
               console.log(pdc)
            }
        }
      })
       // Locations.tenant('auditor-'+req.body.tenant).find({key:key}).exec(function(e,r){
       //  return res.json({code:0,msg:'ok',data:r});
       // })
   }
};

