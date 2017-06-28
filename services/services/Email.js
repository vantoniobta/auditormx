/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const nodemailer = require("nodemailer");


module.exports = {
   setTransport : function(config){
      var smtp = {
         host           :config.smtp.host,
         port           :config.smtp.port,
         ignoreTLS      :true,
         auth: {
            user:config.smtp.user,
            pass:config.smtp.pass
         }
      };
      return nodemailer.createTransport(smtp);
   },
   test: function (config,to,cb){
      var mailData = {
         from  : config.smtp.user,
         to    : to,
         subject: 'Testing Services Email',
         text  : 'This is a testing from Auditor Services',
         html  : 'This is a testing from Auditor Services'
      };
      Email.setTransport(config).sendMail(mailData, function(error, info){
         if(error){
            console.log(error);
            return cb(error,info);
         }else{
           // console.log('Message sent: ' + info.response);
           return cb(error,info);
         };
      });
   },
   signup: function (config,to,key,cb){
    var domain = 'http://iclicauditor.com';
    var mailData = {
         from  : config.smtp.user,
         to    : to,
         subject: 'Testing Services Email',
         text  : 'This is a testing from Auditor Services',
         html  : '<div style="border:1px solid #ccc; padding:30px; border-bottom:4px solid #C82647; border-radius:4px;"><img src="'+domain+'/images/logo-auditor-150x60.png" /> <h3>Iclic Auditor Active Account</h3><p>Para activar su cuenta y accesar al servicio debes hacer click al siguiente link para acompletar los datos </p><p><a href="'+domain+'/login/activate?key='+key+'">'+domain+'/login/activate?key='+key+'</a></p></div>'
      };
      Email.setTransport(config).sendMail(mailData, function(error, info){
         if(error){
            console.log(error);
            return cb(error,null);
         }else{

           return cb(error,info);
         };
      });
   },
   invite: function (config,to,name,cb){

      var msg         = 'Te he dado de alta en la cuenta ';
      var mailData = {
      from  : config.smtp.from,
      to    : to,
      subject: 'Iclic Auditor - Account invite',
      text  : msg,
      html  : msg + '<strong>'+name+'</strong>'
      };
      Email.setTransport(config).sendMail(mailData, function(error, info){
      if(error){
         console.log(error);
         return cb(true,null);
      }else{
        console.log('Message sent: ' + info.response);
        return cb(null,true);
      };
   });
   }
};

