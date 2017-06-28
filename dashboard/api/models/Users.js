/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt    = require('bcrypt');
var crypto    = require('crypto');
var randtoken = require('rand-token');

module.exports = { 
  attributes: {
    account:'number',
  	uuid:'string',
    code:'string',
  	name:'string',
  	email:'string',
  	password:'string',
    status:'integer',
    role:'string',   
    api:'object',
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.api;
      return obj;
    }   
  },
   
  beforeCreate: function (values, cb) {
    var token_private  = randtoken.generate(32);
    var token_public   = randtoken.generate(32);
    var secret_private = crypto.createHash('sha256').update( ( randtoken.generate(32)).toString() ).update('salt').digest('hex'); 
    var secret_public  = crypto.createHash('sha256').update( ( randtoken.generate(32)).toString() ).update('salt').digest('hex'); 

    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
        values.api = { 
          private:{
           token:token_private,
           secret:secret_private,
           },
           public:{
             token:token_public,
             secret:secret_public
           }
        }
      
      cb();
    });
  }
};


// module.exports = {
//     // autoPk: false,
//     // identity: 'users',
//     // autoCreatedAt: false,
//     // autoUpdatedAt: false,
//     tableName: 'users',
//     //schema: 'true',
//     // TODO remove user name for now !
//     attributes:
//     {
//         // user_id:
//         // {
//         //  type: 'integer',
//         //  maxLength: 4,
//         //  size: 4,
//         //  primaryKey: true,
//         //  autoIncrement: true,
//         //  index: true
//         // },
//         user_username:
//         {
//             type: 'string',
//             maxLength: 50,
//             size: 50,
//             required: false,
//             //unique: true
//         },
//         user_email:
//         {
//             type: 'string',
//             maxLength: 100,
//             size: 100,
//             required: true,
//             unique: true,
//             email: true,
//         },
//         user_password:
//         {
//             type: 'string',
//             maxLength: 100,
//             size: 100,
//             required: true
//         },
//         user_group_id:
//         {
//             type: 'integer',
//             maxLength: 4,
//             size: 4,
//             required: true,
//             defaultsTo: 2

//         },
//         account_type:
//         {
//             type: 'string',
//             enum: ['personal', 'corporation'],
//             required: true,
//             defaultsTo: 'personal'
//         },
//         last_login:
//         {
//             type: 'datetime'
//         },
//         registration_date:
//         {
//             type: 'datetime'
//         },
//         toJSON: function ()
//         {
//             var obj = this.toObject();
//             delete obj.user_password;
//             delete obj._csrf;
//             return {};
//         }
//     },
//     types:
//     {
//         // TODO use passwords validations   
//         password: function (password)
//         {
//             return user_password === this.password_confirmation;
//         }
//     },
//     beforeUpdate: function (values, next)
//     {
//         if (validator.notEmpty(values.user_password) == true)
//         {
//             if (values.user_password != values.password_confirmation)
//             {
//                 return next(
//                 {
//                     err: ["Password doesn't match password confirmation."]
//                 });

//             }
//             require('bcrypt').hash(values.user_password, 10, function passwordEncrypted(err, encryptedPassword)
//             {
//                 if (err) return next(err);
//                 values.user_password = encryptedPassword;
//                 next();
//             });
//         }
//         else
//         {
//             next();
//         }
//     },
//     // save: function (errCall)
//     // {
//     //  console.log('save called');
//     //  // delete this.user_password;
//     //  return this.save(errCall);
//     // },
//     // toObject: function ()
//     // {
//     //  var obj = this;
//     //  console.log(this);
//     //  return {};
//     // },
//     beforeCreate: function (values, next)
//     {
//         if (!values.user_password || values.user_password != values.password_confirmation)
//         {
//             return next(
//             {
//                 err: ["Password doesn't match password confirmation."]
//             });

//         }
//         require('bcrypt').hash(values.user_password, 10, function passwordEncrypted(err, encryptedPassword)
//         {
//             if (err) return next(err);
//             values.user_password = encryptedPassword;
//             next();
//         });
//     }


// };