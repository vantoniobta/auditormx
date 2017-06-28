var _ = require('underscore');

var notifications = {}
  , private = {};

private.createHTMLmail = function(data, file_name){
  var fs = require('fs');
  var ejs = require('ejs');


  var dirTemplates = __dirname.replace('utilities', '') + '/mails/'
  var compiled = ejs.compile(fs.readFileSync( dirTemplates + file_name , 'utf8'));
  return  compiled(data)
  return  String( compiled(data) );
}

//var data = { title : 'EJS', text : 'Hello, World!' }
//var file_path = 'test.ejs'
//return console.log( private.createHTMLmail(data, file_path) )

notifications.mail = function(data, template, attachment){
  var email   = require("emailjs/email");
  var server  = email.server.connect({
     user: "auditor@iclic.mx", 
     password: "ScWAVS8-xPaZ6KHvwISoTQ", 
     host: "smtp.mandrillapp.com",
     port: 587
     // ssl:     true
  });
  
  var html = private.createHTMLmail(data.text, template)
  var message = {
      text:   html
    , from:    "Iclic Auditor <auditor@iclic.mx>"
    , to:      data.mail
    , subject: data.subject
    , attachment: [ 
      { data: html, alternative : true }
    ]
  }

  if (attachment){
    message.attachment.push(attachment)
    
  }

  server.send(message, function(error, data) { 
      //console.log(err || message); 
      if (error) {
        return console.log(error)
        //return { status:'error', mail: message.to, msg: error }
      }
      if (message) {
        return console.log('Correo enviado a ' + data.header.to )
        //return { status:'ok', mail: data.header.to, msg: 'Correo enviado correctamente' }
      }
  });
  
}


module.exports = notifications;