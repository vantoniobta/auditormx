/* Modules
--------------------------------------- */
  var express = require('express')
  , mongoose  = require('mongoose')
  , sys       = require('sys')
  , csv       = require('csv')
  , http      = require('http')
  , https     = require('https')
  , fs        = require('fs')
  , mv        = require('mv')
  , config    = require('./emailConfig')
  , model     = require('./Schemas');
  
  var Schema  = mongoose.Schema
  , ObjectId  =  Schema.ObjectId
  , Location  = model.Location
  , Account   = model.Account;

/* Conect with Database
-------------------------------------- */
db = mongoose.connect('mongodb://admin:pw.sicp@166.78.8.64/sicp')
//db = mongoose.connect('mongodb://admin:pw.sicp@166.78.8.64/dev')
//db = mongoose.connect('mongodb://127.0.0.1:27017/sicp')

/* Setup
------------------------------------- 
*/

readCsv = function(){
  this.files   = [];
  this.path    = './public/uploads/temp/';
  this.newPath = './public/uploads/process/';
  this.idAccount;

  this.init = function(){
    var that = this;
    fs.readdir(that.path, function(err, files){
      that.files = files;
      Account.find({}, function(err,docs){
        if (!err) {
            that.idAccount = docs[0]._id;
            that.processFiles();
          }
        });
    });
  }
  
  this.processFiles = function(){
    var that = this;
    //console.log(that.files);
    for (x = 0; x < that.files.length; x++) {
      //console.log(that.files[x]);
      var partFile = that.files[x].split('.');
      if (partFile[0] != '') {
        var supplier = partFile[0].split('--');
        that.processCsv( that.files[x], supplier[0], function(response){
          console.log(response);
          mv( that.path+response.file, that.newPath+response.file, function(err){
            //console.log('move file ok');
          });
          var text = 'El archivo terminó de ser procesado: <ul><li><b>'+response.rows+'</b> Registro(s) nuevos insertados</li><li><b>'+response.errors+'</b> Encontrado(s) con información incompleta</li></lu><hr>';
          text += 'Si se encontraron errores en alguno de los registros, deberá iniciar sesión en <a href="iclicauditor.com">iclicauditor</a> para corregirlos, estos aparecerán resaltados con una etiqueta amarilla';
          Account.findOne({_id:response.account},'users').exec(function(error,docs){        
            var users = docs.users;
            var max   = users.length;
            for(i=0; i < max; i++){
                var row = users[i];           
                if( typeof(row.supplier) != 'undefined' ||  row.supplier != '' )
                  if(row.order == 1 && row.supplier == response.supplier && row.role == 'supplier'){
                    that.sendMail(text,row.email,'Sitios agregados');
                  } 
            }
          });
          
          console.log('=================================');
        });
      }
    }
    //console.log('hola');
    that.readFolder();
  }
  
  this.sendMail = function(textMail,toEmail,subjectMail){
    var email   = require("emailjs/email");
    var server  = email.server.connect({
      user: config.user,
      password:config.password,
      host:config.host
    });
    
    var message = {
       text: " "+textMail+" ",
       from:    "contacto@iclicauditor.com",
       to:      toEmail,
       cc:      "",
       subject:  subjectMail,
       attachment: 
       [
          {data: textMail, alternative:true}
       ]
    };
    server.send(message, function(err, message) {
        console.log(err || message);
        if(!err){
            console.log({code:0,msg:message});
        }else{
            console.log({code:100,msg:err});
        }        
    });
  }
  
  this.readFolder = function(){
    var that = this;
    setTimeout(function(){
      that.init();
    },1000 * 60);
  }

  this.trim = function(myString)
  {
    return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
  }
  
  this.reformat = function(str){
    str = str.toLowerCase();
    words = str.split(" ");
    fstr="";
    for (x in words) {
      if (words[x]!="de") {
        fstr+=words[x].substring(0,1).toUpperCase();
        fstr+=words[x].slice(1);
      }
      else
        fstr+=words[x];
      fstr+=" ";
    }
    fstr = this.trim(fstr);
    return fstr;
  }
  
  this.processCsv = function(file,idSupplier, callback){
    var that = this;
    var errors = [];
    csv()
    .from.stream(fs.createReadStream(that.path+file))
    .transform( function(row){
      return row;
    })
    .on('record', function(row,index){
      if (index != 0) {
        var error = [];
        var statusRow = 1;
        for (x in row) {
          if (row[x] == '') {
            error.push(x);
          }
        }
        if (row[5]!='') {
          row[5]=that.reformat(row[5]);
        }
        if (row[8]!='') {
          row[8]=row[8].toLowerCase();
        }
        if (row[9]!='') {
          row[9]=row[9].toLowerCase();
        }
        if (row[12]!='') {
          row[12]=row[12].toLowerCase();
        }
        if (row[13]!='') {
          row[13]=row[13].toLowerCase();
        }
        if (error.length != 0) {
          errors.push(index);
          statusRow = 0;
        }
        Location.findOne({code:row[0],supplier : idSupplier}, function(err,doc){
          if (err) {
            console.log(err);
          }else{
            if (doc !== null) {
              doc.street = row[1];
              doc.neighbor  = row[2];
              doc.city = row[3];
              doc.zip  = row[4];
              doc.state = row[5];
              doc.ref_street  = [row[6],row[7]];
              doc.view_type = row[8];
              doc.measures  = {material: row[9],height:row[10],base:row[11]};
              doc.type = row[12];
              doc.light = row[13];
              doc.price = row[14];
              doc.save(function(data){console.log('ok')});
            }else{
              var location = new Location({
                supplier    :idSupplier ,
                  account   : that.idAccount,
                  code        :row[0], 
                  street      :row[1],
                  neighbor    :row[2],
                  city        :row[3],
                  zip         :row[4],
                  state       :row[5],
                  ref_street  :[row[6],row[7]],
                  view_type   :row[8],
                  measures    :{material: row[9],height:row[10],base:row[11]},
                  type        :row[12],
                  light       :row[13],
                  price       :row[14],
                  status      : statusRow
              });
              location.save(function(err,data){
                console.log(err);
                console.log(data);
              });
            }
          }
        });
        //console.log(index+' ++ '+errors.length);
        //console.log(row);
        //console.log('-------------------------------');
      }
    })

    .on('end', function(count){
      //  //mv( that.path+file, that.newPath+file, function(err){
    //  //  console.log('move file ok');
    //  //});
    //console.log('archivo procesado, lineas encontradas:'+count+"  Errores encontrados: "+ errors.length);
      callback({code:0,msg:'Archivo procesado',supplier:idSupplier, account : that.idAccount, rows: (count - 1), errors: errors.length, file: file});
    })

    .on('error', function(error){
      console.log(error.message);
    })
    //callback({code:0,msg:'archivo procesado '+idSupplier});
  }

  this.validarRow = function(row){
   
  }

  this.infoToday = function(){
    var that = this;
    var dateNow = new Date();
    var textMail = 'Este es un correo para informarle que el servicio de lectura de CSV Master<br> se encuentra en linea el dia de hoy ' + 
               dateNow.getDate() +'/'+ ( dateNow.getMonth() + 1) + '/' + dateNow.getFullYear();
    this.sendMail(textMail,'leyvicaz@gmail.com','Servicio de CSV');
    //console.log(txt);
  }
  
  this.serviceStart = function(){
      var that = this;
      var dateNow = new Date();
      var textMail = 'Este es un correo para informarle que el servicio de lectura de CSV Master <br> a iniciado' + 
               dateNow.getDate() +'/'+ ( dateNow.getMonth() + 1) + '/' + dateNow.getFullYear();
      this.sendMail(textMail,'leyvicaz@gmail.com','Servicio de CSV Master');
  }
  
  this.init();
}

mainInterval = setTimeout(function(){
  read = new readCsv();
  read.serviceStart();
},1000 * 60 );

serviceInfo = setInterval(function(){
  read.infoToday();
}, 1000 * 60 * 60 * 24 );

