var mongoose = require('mongoose'),
  crypto     = require('crypto')

var Schema = mongoose.Schema
 , salt = 'mySaltyString'
 , SHA2 = new (require('jshashes').SHA512)()
 , ObjectId = Schema.ObjectId;

function encodePassword( pass ){  
  return SHA2.b64_hmac(pass, salt )
}

function getHash(n){
  return crypto.randomBytes(n).toString('hex');
}

function check(data, callback) {
    mongoose.model('User', Users).count(data, function (err, count) {
        callback(err, count);
    });
}

function validate(email, confirm, callback) {
    check({email: email}, function (err, exists) {
        if (err) {
            return callback(err);
        }
        callback(err,exists);
    });
}

Users = new Schema({
   name     :{ type: String, required: true }
  ,email    :{ type: String, required: true }
  ,password :{ type: String, required: true}
  ,phone    :{ type: String, default: '' }
  ,role     :{ type: String, default:'admin' } //root,admin,auditor,supplier
  ,lang     :{ type: String, default:'es' } //en|es
  ,status   :{ type: Number, default: 0 }
  ,order    :{ type: Number, default: 0  }  
  ,supplier :{ type: String }
  ,key      :{ type: String }
  ,token    :{ type: String } 
  ,created  :{ type: Date, default: Date.now }   
});

Accounts = new Schema({
    name     :{ type: String, required: true, default: '' }
   ,rfc      :{ type: String, default: '' }
   ,address  :{ type: String, default: '' }
   ,website  :{ type: String, default:'' }
   ,phone    :{ type: String, default:'' }
   ,city     :{ type: String, default:'' }         
   ,state    :{ type: String, default:'' } 
   ,country  :{ type: String, default:'MX' }
   ,billing  :{ type: Number, default:0 }
   ,count    :{ type: Number, default:0 }
   ,token    :{ type: String } 
   ,key      :{ type: String}
   ,secret   :{ type: String}
   ,prices    :{  type: Object }
   ,cname    :{ type: String}
   ,users    :[Users]
   ,status   :{ type: Number, default: 0 }
   ,type     :{ type: String, required: true, default: 'basic' }
   ,created  :{ type: Date, required: true, default: Date.now }
});

Logs = new Schema({   
   account  :[{ type: ObjectId, ref: 'Accounts' }]
  ,user     :[{ type: ObjectId, ref: 'Users' }]
  ,msg      :{  type: String } 
  ,created  :{  type: Date, default: Date.now }
});

Statuses = new Schema({   
   location     :{  type: ObjectId, ref: 'Locations' }
  ,supplier     :{  type: ObjectId, ref: 'Suppliers'}
  ,code         :{  type: String }
  ,status       :{  type: String }
  ,coords       :{  type: Array }  
  ,users        :{  type: Object }
  ,description  :{  type: String }
  ,date         :{  type: Date }
  ,images       :{  type: Array } 
  ,created      :{  type: Date, default: Date.now }
});

Inventories = new Schema({

  location     :{  type: ObjectId, ref: 'Locations' }
  ,supplier    :{  type: ObjectId, ref: 'Suppliers'}
  ,account     :{  type: ObjectId, ref: 'Accounts', required: true }
  ,art         :{  type: ObjectId, ref: 'Arts' }
  ,content     :{  type: String}
  ,from        :{  type: Date }   
  ,to          :{  type: Date }
  ,images      :{  type: Array }
  ,status      :{type: Number, default:0}
  ,amounts     :{ type : Object}
  ,created     :{  type: Date, default: Date.now }
});

Arts = new Schema({
  account   :{  type: ObjectId, ref: 'Accounts', required: true } 
  ,name        :{  type: String}
  ,versions   :{  type: Array}
  ,from         :{  type: Date }   
  ,to             :{  type: Date }
});

Locations = new Schema({   
   supplier    :{  type: ObjectId, ref: 'Suppliers', required: true }
  ,account   :{  type: ObjectId, ref: 'Accounts', required: true }  
  ,code        :{  type: String } 
  ,street      :{  type: String } 
  ,neighbor    :{  type: String } 
  ,city        :{  type: String }
  ,zip         :{  type: String }
  ,state       :{  type: String }   
  ,ref_street  :{  type: Array }   
  ,view_type   :{  type: String }
  ,measures    :{  type: Object }
  ,price       :{  type: String }
  ,light       :{  type: String }
  ,type        :{  type: String }
  ,beneficiary :{  type: String }
  ,manufactoring_details:{  type: String}
  ,shipping_adress:{ type: String}
  ,active      :{  type: Number, default: 0} 
  ,images      :{  type: Array }
  ,coords      :{  type: Object}
  ,date         :{type: Date}
  ,release     :{type: Date, default: Date.now}
  ,contracted  :{type: Number, default:0}
  ,status      :{type: Number, default:0}
  ,created     :{  type: Date, default: Date.now }
});

var Suppliers = new Schema({
   name         :{ type: String, required: true }
  ,rfc          :{ type: String }
  ,address      :{ type: String, required: true }
  ,work_address :{ type: String }
  ,owner        :{ type: String }
  ,phone        :{ type: String }
  ,email        :{ type: String }
  ,locations    :{ type: Array }
  ,account      :{ type: ObjectId, ref: 'Accounts', required: true }
  ,created      :{ type: Date, required: true, default: Date.now }
});

var Log              = mongoose.model('Logs',Logs);
var Account          = mongoose.model('Accounts',Accounts);
var Supplier         = mongoose.model('Suppliers',Suppliers);
var Location         = mongoose.model('Locations',Locations);
var Inventory        = mongoose.model('Inventories',Inventories);
var Art        = mongoose.model('Arts',Arts);
var Status           = mongoose.model('Statuses',Statuses);



module.exports.Account   = Account;
module.exports.Log       = Log;
module.exports.Supplier  = Supplier;
module.exports.Location  = Location;
module.exports.Inventory = Inventory;
module.exports.Art = Art;
module.exports.Status    = Status;




