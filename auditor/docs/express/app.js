/**
 * Module dependencies.
 */

var express    = require('express')
  , routes     = require('./routes')
  , user       = require('./routes/user')
  , mongoose   = require('mongoose')
  , crypto     = require('crypto')
  , nodeExcel  = require('excel-export')
  , fs          = require('fs')
  , http       = require('http')
  , path       = require('path')
  , mkdirp     = require('mkdirp')
  , load       = require('express-load')
  , MongoStore = require('connect-mongo')(express);
  
var menu1 = [
"<a href='/locations'> Lugares </a>",
"<a href='/maps'> Mapas </a>",
"<a href='/sites'> Sitios </a>"];

var menu2 = ["<a href='/dashboard'> Dashboard</a>",
"<a href='/suppliers'> Proveedores </a>",     
"<a href='/sites'> Sitios </a>",
"<a href='/maps'> Mapas </a>",
"<a href='/arts'> Artes </a>",
"<a href='/reports'> Reportes</a>",
"<a href='/users'> Usuarios</a>"];
 var aclSupplier = ['dashboard','locations','maps','v1','error','settings','sites'];
 var roleUser    = {'admin':'Administrador','supplier':'Proveedor','auditor':'Auditor'};
  
String.prototype.ucfirst = function(){
    return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();
    } );
};

String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

/* Conect with Database
-------------------------------------- */ 

//var conf = {
//  db: {
//    db: 'sicp'
//    ,host: '127.0.0.1' //'127.0.0.1'
//    ,port: 27017  // optional, default: 27017
//    ,username: '' // optional
//    ,password: '' // optional
//    ,collection: 'sessions' // optional, default: sessions
//    ,clear_interval: 30
//  },
//  secret: 'Supercalifragilisticoexpialidoso'
//};

 var conf = {
   db: {
     db: 'sicp'
     ,host: '166.78.8.64' //'166.78.8.64'   '127.0.0.1'
     ,port: 27017  // optional, default: 27017
     ,username: 'admin' // optional
     ,password: 'pw.sicp' // optional
     ,collection: 'sessions' // optional, default: sessions
     ,clear_interval: 30
   },
   secret: 'Supercalifragilisticoexpialidoso'
 };

try{
   //db = mongoose.connect('mongodb://admin:pw.sicp@166.78.8.64/dev')
   db = mongoose.connect('mongodb://admin:pw.sicp@166.78.8.64/sicp')
   //db = mongoose.connect('mongodb://127.0.0.1:27017/sicp')
}catch(e){
  console.log('imposible conectarse a mongo')
}
/* Setup
------------------------------------- */

var app = express();  

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({cookie: { path: '/', httpOnly: true, maxAge: (60*60*24*365) }, store: new MongoStore(conf.db),secret:'Supercalifragilisticoexpialidoso',key: 'sid'}));
  app.use(app.router);
  // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

/* Enviroments
----------------------------------------- */
app.configure('development', function(){
  app.use(express.errorHandler());
});

process.on('uncaughtException', function (error) {
   console.log(error.stack);
});


/* Load models
-------------------------------------- */
load('config').then('models').into(app);

for(x in app.models ){
    var model = ( x.ucfirst() + ' = new ' + "app.models[x].provider()");
    eval(model);
}


/* Routes
---------------------------------- */
function isLogin (req, res, next){ 
  if( typeof( req.session.isLogged ) == 'boolean' ){
      res.locals.session = req.session.user;
      req.session.menu = menu1;
      req.session.role  = roleUser[req.session.user.user.role];      
      if (req.session.user.user.role != 'supplier') {
          req.session.menu = menu2;
          req.session.role  = roleUser[req.session.user.user.role];
      }else{
        var controller = (req.url).split('/');
          if(aclSupplier.indexOf(controller[1]) < 0){
            res.redirect('/error');
          }
      }
      next();
  }else{
    if( req.xhr){
      res.send("login");
    }else{
      res.redirect('/login');  
    }
  }
}

/* Routes
---------------------------------- */
app.all('/error',isLogin, function(req,res){
  res.render('error.ejs', {}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.all('/login',function(req, res){
    if( req.method == 'POST'){     
      Account.loadActiveUser(req.body,function(user){   
          if( user.data !== null ){
              //console.log('hola');
              req.session.isLogged = true;
              req.session.account  = user.data;
              var userIndex = 0;
              for(x=0; x<user.data.users.length;x++){
                if(req.body.user_email == user.data.users[x].email)
                {
                  userIndex = x;
                  break;
                }
              }
              req.session.user = {user:user.data.users[userIndex],account:user.data};        
              var name = user.data.users[userIndex].name;
              var id   = user.data.users[userIndex]._id;
              Log.register({account:user.data._id,user:id, msg:name + ' hizo Login'},function(){
                if (req.session.user.user.role == 'supplier') {
                  res.redirect('/locations');
                }else{
                  res.redirect('/dashboard');  
                }
              });
              
          }else{              
            res.render('login/index.ejs', {controller:{name:'login'},error:' <div class="alert alert-error">  <button type="button" class="close" data-dismiss="alert">&times;</button>'+user.msg+'</div>'}, function(err, str) {
                res.render('loginlay.ejs', {
                    body: str,
                    title:'iClic SMS App, Crea Campañas SMS, simple y fácil - Login ',
                    dir: ''
                });
            });
          } 
      });
    }else{
      delete req.session.isLogged;
      delete req.session.user;
      res.render('login/index.ejs', {controller:{name:'login'}}, function(err, str) {
          res.render('loginlay.ejs', {
              body: str,
             title:'iClic SMS App, Crea Campañas SMS, simple y fácil',
             dir: ''
          });
      });
    }
});

app.all('/login/recovery', function(req,res){
  
  if (req.method == 'POST') {
    var host = req.headers.host;
    Account.loadUserEmail(req.body.user_email,host, function(response){
        
        var alertClass = response.code == 0 ? 'alert-success' : 'alert-error';
        res.render('login/recovery.ejs', {controller:{name:'recovery'},error:' <section><div class="alert '+alertClass+'">  <button type="button" class="close" data-dismiss="alert">x</button>'+response.msg+'</div></section>'}, function(err, str) {    res.render('loginlay.ejs', {
            body: str,
            title:'iClic Auditor',
            dir: '../'
          });    
        });
      
    });
  }else{
    var error = req.query.msg ? '' : 'hide';
    res.render('login/recovery.ejs', {controller:{name:'recovery'},error:' <section><div class="alert alert-error '+error+'">  <button type="button" class="close" data-dismiss="alert">&times;</button>'+req.query.msg+'</div></section>'}, function(err, str) {    res.render('loginlay.ejs', {
        body: str,
        title:'iClic Auditor',
        dir: '../'
      });
    });
  }
});

app.get('/login/recovery', function(req,res){
  res.render('login/recovery.ejs', {controller:{name:'recovery'},error:' <section><div class="alert alert-error hide">  <button type="button" class="close" data-dismiss="alert">&times;</button>El email no existe en nuestra base de datos</div></section>'}, function(err, str) {    res.render('loginlay.ejs', {
      body: str,
      title:'Auditor',
      dir: '../../'
    });
  });
  
});
app.all('/login/recovery/new/', function(req,res){
    
    if (req.method == 'POST') {
        var host = req.headers.host;
        Account.newPassword(req.body,host,function(response){
            var alertClass = response.code == 0 ? 'alert-success' : 'alert-error';
           res.render('login/newpassword.ejs', {controller:{name:'recovery'},error:' <section><div class="alert '+alertClass+'">  <button type="button" class="close" data-dismiss="alert">&times;</button> '+response.msg+'</div></section>', key: req.query.key, code: req.query.code}, function(err, str) {    res.render('loginlay.ejs', {
                    body: str,
                    title:'Auditor',
                    dir: '../../../'
                });
            }); 
        });
    }else{
        Account.searchKeyRecovery(req.query.key,req.query.code, function(response){
           if(response.code == 0 ){
                res.render('login/newpassword.ejs', {controller:{name:'recovery'},error:' <section><div class="alert alert-error hide">  <button type="button" class="close" data-dismiss="alert">&times;</button>El email no existe en nuestra base de datos</div></section>', code: response.data._id}, function(err, str) {    res.render('loginlay.ejs', {
                        body: str,
                        title:'Auditor',
                        dir: '../../../'
                    });
                });
            }else{
                res.redirect('/login/recovery?msg='+response.msg);
            } 
        });
    }
});

app.get('/',isLogin, function(req, res){
   res.redirect('/dashboard');
});


app.get('/createuser', function(req, res){
    Account.tempCreateAccount({
         name     :'Erick Fernando Santigo',
         email    :'erickfernando@gmail.com',
         password :'casa',
         status   :1
    },function(resp){
      res.send(resp);
    });
});

/*Routes menus
---------------------------------------------------------------*/
app.get('/dashboard',isLogin, function(req, res){   
   role = req.session.role;
   console.log(role);
   if( role == 'Proveedor'){
      res.render('dashboard/index2.ejs', {}, function(err, str) {
         res.render('layout.ejs', {
            userName : req.session.user.user.name,
            body: str,
            role : req.session.role,
            menu:req.session.menu
         });
      });
  }else if( role == 'Administrador'){
      res.render('dashboard/index.ejs', {}, function(err, str) {
         res.render('layout.ejs', {
            userName : req.session.user.user.name,
            body: str,
            role : req.session.role,
            menu:req.session.menu
         });
      });
  }
  
});


app.get('/suppliers',isLogin, function(req, res){
   res.render('suppliers/index.ejs', {}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.get('/sites', isLogin, function(req, res){
   res.render('sites/index.ejs', {supplier:req.session.user.user.supplier,role : req.session.user.user.role}, function(err, str){
      res.render('layout.ejs', {
         userName : req.session.user.user.name,
         body : str,
         role : req.session.role,
         menu: req.session.menu
      });
   });
});

app.get('/locations',isLogin, function(req, res){
   res.render('locations/index.ejs', {supplier:req.session.user.user.supplier,role : req.session.user.user.role}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});


app.get('/maps',isLogin, function(req, res){
   res.render('maps/index.ejs', {role : req.session.user.user.role, id : req.session.user.user.supplier}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.get('/arts',isLogin, function(req, res){
   res.render('arts/index.ejs', {role : req.session.user.user.role, id : req.session.user.user.supplier}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});


app.get('/reports',isLogin, function(req, res){
   res.render('report/index.ejs', {}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.get('/users',isLogin, function(req, res){
   res.render('users/index.ejs', {}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.get('/settings',isLogin, function(req, res){
    var showInput = req.session.user.user.role == 'admin' ? '':'hide';
    
   res.render('settings/index.ejs', {userID : req.session.user.user._id, input: showInput}, function(err, str) {
      res.render('layout.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

app.get('/reports2',isLogin, function(req, res){
   res.render('report.ejs', {}, function(err, str) {
      res.render('supplierLay.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu,
      });
  });
});

app.get('/tickets',isLogin, function(req, res){
   res.render('tickets.ejs', {}, function(err, str) {
      res.render('supplierLay.ejs', {
          userName : req.session.user.user.name,
          body: str,
          role : req.session.role,
          menu:req.session.menu
      });
  });
});

/* Api
-------------------------------------------------------*/

//  app.get('/user/add', function(req,res) {      
//      res.contentType('application/json');    
//      Provider.createUser(function(error, response) {
//          res.send(response);
//      });      
//  });
//  
//  app.get('/user/find',isLogin, function(req,res) {      
//      res.contentType('application/json');      
//      Provider.findUsers(function(error, response) {
//          res.send(response);
//      });      
//  });
//
//  app.get('/account/add', function(req,res) {      
//      res.contentType('application/json');      
//      Provider.createType(function(error, response) {
//          res.send(response);
//      });      
//  });
//
//app.get('/users/all', function(req,res){
//  Provider.allUsers({}, function(error, docs) {
//    // console.log(docs);
//    // for(x in docs){
//    //   console.log(docs[x].account.name);
//    // }
//
//    res.send(req.body);
//  });
//});
/*Users
------------------------------------------------*/
app.all('/v1/users/all',isLogin, function(req, res){
    res.contentType('application/json');    
    var account    = req.session.account._id;     
    Account.getAllUsers(account,req.body,function(resp){
      res.send(resp);
    });
});

app.post('/v1/user/load',isLogin, function(req, res){
    res.contentType('application/json');
    Account.loadUser(req.body._id, function(resp){
      res.send(resp);
    });
});

app.post('/v1/users/save',isLogin, function(req, res){
    res.contentType('application/json');    
    var account    = req.session.account._id;     
    Account.save(account,req.body, function(resp){
      res.send(resp);
    });
    //res.send({code:100,msg:'error'});
    //console.log(req.body);
});

app.post('/user/delete',isLogin, function(req, res){
    res.contentType('application/json');
    var account    = req.session.account._id;
    //console.log(req.body.user.email);
    try {
        Account.deleteUser(account,req.body, function(resp){
            res.send(resp);
        });
    } catch(e) {
        res.send({code:100,msg:'Error server'});
        console.log(e);
    }
    //res.send({code:100,msg:'Error server'});
});

//app.get('/v1/suppliers/all/count',isLogin, function(req, res){
//    res.contentType('application/json');    
//    var account    = req.session.account._id;     
//    Supplier.getAllCount(account,function(resp){
//      var total = Math.ceil(resp.count/10);
//        res.send({code:resp.code,count:total});
//    });
//});

/*Supplier
------------------------------------------*/

app.post('/v1/suppliers/all',isLogin, function(req, res){
    res.contentType('application/json');    
    var account    = req.session.account._id;
      Supplier.getAll(account,req.body,function(resp){
      res.send(resp);
    });
    
});

app.post('/v1/supplier/load',isLogin, function(req, res){
    res.contentType('application/json');
    Supplier.load(req.body._id, function(resp){
      res.send(resp);
    });
});

app.post('/v1/supplier/load/logo',isLogin, function(req, res){
    res.contentType('application/json');
    var supplier;
    if (req.body.idSupplier) {
      supplier = req.body.idSupplier;
    }else{
      supplier = req.session.user.user.supplier;
    }
    var path ='./public/uploads/logos/'+supplier;
    var pathSrc = '/uploads/logos/'+supplier+'/';
    var urls = [];
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file,index){
        urls.push(pathSrc+file);
        res.send({code:0,msg:'ok', url : urls});
      }); 
    }else{
      res.send({code:100,msg:'Not found'});
    }
});

app.post('/v1/suppliers/save',isLogin, function(req, res){
    res.contentType('application/json');    
    var account    = req.session.account._id;     
    Supplier.save(account,req.body, function(resp){
      res.send(resp);
    });
});

app.post('/v1/supplier/delete',isLogin, function(req, res){
    res.contentType('application/json');
    var account    = req.session.account._id; 
    Supplier.delete(req.body.id,account, function(resp){
      res.send(resp);
    });
});

app.get('/suppliers/location/panel',isLogin, function(req, res){
   res.render('suppliers/locations.ejs',{}, function(err, str) {
      res.render('empty.ejs', {      
          body: str 
      });
  });
});

app.get('/suppliers/form',isLogin, function(req, res){
   res.render('suppliers/new_supplier_form.ejs',{}, function(err, str) {
      res.render('empty.ejs', {      
          body: str 
      });
  });
});

/*Locations
------------------------------------------------*/
app.post('/v1/location/all', isLogin,function(req, res){
    res.contentType('application/json');
    
    var account    = req.session.account._id;
    if( typeof(req.body.idSupplier) == 'undefined'){
      Location.getAll(req.session.user.user.supplier,req.body,function(resp){
        res.send(resp);
      });    
    }else{
       Location.getAll(req.body.idSupplier,req.body,function(resp){
        res.send(resp);
      }); 
    }
});

app.post('/v1/location/contract', isLogin, function(req, res){
  res.contentType('application/json');
  var account    = req.session.account._id;
  Location.contract(req.body,account, function(response){
    res.send(response);
  });
});

app.post('v1/location/delete', isLogin, function(req, res){
  res.contentType('application/json');
  console.log(req.body);
});

app.post('/v1/location/load', isLogin,function(req, res){
    res.contentType('application/json');
    var account    = req.session.account._id;
    Location.load(req.body.id,function(resp){
      res.send(resp);
    });    
});

app.post('/v1/location/save', isLogin,function(req, res){
    res.contentType('application/json');
    var account    = req.session.account._id;
    Location.save(req.body,account, function(resp){
      res.send(resp);
    });    
});

app.post('/v1/location/release', isLogin, function(req, res){
   res.contentType('application/json');
   var account = req.session.account._id;
   console.log(req.body);
   if (typeof(req.body.keyword) != 'undefined') {
      Location.searchByKeyword(req.body,account, function(resp){
         res.send(resp);
      });
   }else{
      Location.getAllByDateRelease(req.body,account, function(resp){
         res.send(resp);
      });
   }
});

app.get('/locations/form',isLogin, function(req, res){
   res.render('suppliers/new_location_form.ejs',{}, function(err, str) {
      res.render('empty.ejs', {      
          body: str 
      });
  });
});


app.post('/v1/location/status', isLogin,function(req, res){
    res.contentType('application/json');
    var account    = req.session.account._id;
    Status.lastByLocation(req.body._id, function(resp){
      res.send(resp);
    });    
});

/* Maps
----------------------------------------------------------- */
app.post('/v1/maps/form', isLogin,function(req, res){
    res.render('maps/form.ejs',{}, function(err, str) {
      res.render('empty.ejs', {      
          body: str 
      });
  });
});

/*Arts
------------------------------------------------------------*/

app.post('/v1/art/delete', isLogin, function(req, res){
   res.contentType('application/json');
   
   Art.delete(req.body.id, function(resp){
      res.send(resp);
   });
});
app.get('/v1/art/form',isLogin, function(req, res){
   res.render('arts/new_arts_form.ejs',{}, function(err, str){
      res.render('empty.ejs',{
         body: str
      });
   });
});

app.post('/v1/art/save', isLogin, function(req, res){
   var account = req.session.account._id;
   res.contentType('application/json');
   //console.log(req.body);
   Art.save(req.body, account, function(resp){
      res.send(resp);
   });
});

app.post('/v1/art/all', isLogin,function(req, res){
   res.contentType('application/json');
    
   var account    = req.session.account._id;
   Art.getAll(account,req.body,function(resp){
      res.send(resp);
   });
    //if( typeof(req.body.idSupplier) == 'undefined'){
    //  Location.getAll(req.session.user.user.supplier,req.body,function(resp){
    //    res.send(resp);
    //  });    
    //}else{
    //   Location.getAll(req.body.idSupplier,req.body,function(resp){
    //    res.send(resp);
    //  }); 
    //}
});

app.post('/v1/art/load', isLogin, function(req, res){
   res.contentType('application/json');
   Art.loadById(req.body, function(resp){
      res.send(resp);
   });
});

/* save location to inventory
----------------------------------------------------------- */


app.post('/v1/maps/coords',isLogin,function(req,res){
  res.contentType('application/json');
  Location.getCoord(req.body, function(resp){
    res.send(resp);
  });
});


//app.get('/inventory', function(req, res){
//  Inventory.getAll(function(e){
//      res.send(e);
//  });
//});

app.post('/v1/inventory/all',isLogin, function(req, res){
  res.contentType('application/json');
  var account    = req.session.account._id;
   Inventory.getAll(req.body, account, function(resp){
      res.send(resp);
   });
});

app.post('/v1/inventory/delete', isLogin, function(req, res){
  res.contentType('application/json');
  var account    = req.session.account._id;
   if (req.session.user.user.role != 'supplier') {
      Inventory.delete(req.body, function(resp){
         res.send(resp);
      });
   }else{
      res.send({code:101,msg : 'Solo el adminintrador puede realizar esta acción'});
   }
});

app.post('/v1/inventory/form', isLogin, function(req, res){
   res.render('sites/add_art_form.ejs',{}, function(err, str){
      res.render('empty.ejs',{
         body: str
      });
   });
});

app.post('/v1/inventory/location', isLogin, function(req, res){
  res.contentType('application/json');
  var account    = req.session.account._id;
   Inventory.getAllByLocation(req.body, account, function(resp){
      res.send(resp);
   });
});

app.post('/v1/inventory/save', isLogin,function(req, res){
  res.contentType('application/json');
  var account    = req.session.account._id;
  if (typeof(req.body.state) != 'undefined') {
      Inventory.saveByState(req.body,account, function(resp){
         res.send(resp);
      });
  }else{
    Inventory.save(req.body,account, function(resp){
      res.send(resp);
    });  
  }

});

app.post('/v1/inventory/report',isLogin, function(req, res){
   res.contentType('application/json');
   var account = req.session.account._id;
  Inventory.getReport(req.body, account, function(response){
    res.send(response);
  });
});

app.get('/v1/inventory/export', isLogin, function(req, res){
   res.setHeader('Content-Type', 'application/vnd.openxmlformats');
   res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
   var account = req.session.account._id;
   //console.log(req.query);
   Inventory.getReport(req.query, account, function(response){
      var conf ={};
      conf.cols = [
         {caption:'No', type:'number'},
         {caption:'CLAVE DEL SITIO', type:'string'},//code of site
         {caption:'CUENTA CON LUZ', type:'string'},//ligth
         {caption:'CALLE Y NO', type:'string'},//adress
         {caption:'COLONIA', type:'string'},//neighbor
         {caption:'MUNICIPIO/DELEGACION', type:'string'},//city
         {caption:'C.P.', type:'string'},//zip
         {caption:'ENTIDAD FEDERATIVA', type:'string'},//state
         {caption:'ENTRE CALLE 1', type:'string'},//street_ref_1
         {caption:'ENTRE CALLE 2', type:'string'},//street_ref_2
         {caption:'MEDIDAS', type:'string'},//measures
         {caption:'DETALLES DEL CONTENIDO', type:'string'},//content
         {caption:'PERIODO DE EXHIBICION', type:'string'},//date
         {caption:'VALOR UNITARIO', type:'number'},//amountUnit
         {caption:'IVA', type:'number'},//amountIva
         {caption:'TOTAL', type:'number'}//amount
	  ];
      
      conf.rows = [];
      for (var x = 0; x < response.data.length; x++) {
         var dateTemp = response.data[x].from;
         var dateFrom = dateTemp.getDate() +'/' + (dateTemp.getMonth() + 1) + '/' + dateTemp.getFullYear();
         dateTemp = response.data[x].to;
         var dateTo = dateTemp.getDate() +'/' + (dateTemp.getMonth() + 1) + '/' + dateTemp.getFullYear();
         conf.rows.push([
            x + 1,
            response.data[x].location.code,
            response.data[x].location.light == 'con luz' ? 'SI' : 'NO',
            response.data[x].location.street,
            response.data[x].location.neighbor,
            response.data[x].location.city,
            response.data[x].location.zip,
            response.data[x].location.state,
            response.data[x].location.ref_street[0],
            response.data[x].location.ref_street[1],
            response.data[x].location.measures.base+'x'+response.data[x].location.measures.height,
            response.data[x].content,
            dateFrom+' AL '+dateTo,
            response.data[x].amounts.amountMinusIva.toFixed(2),
            response.data[x].amounts.amountIva.toFixed(2),
            response.data[x].amounts.amount.toFixed(2)
         ]);
         
      }
      
      var result = nodeExcel.execute(conf);
      res.end(result, 'binary');
      
  });
   
});

app.post('/upload/csv',function(req,res){
  //console.log(req.files);
  //res.send({code:0,msg:'ok'});
  uploadCsv(req,function(response){
    if(response.code === 0){
      var str = '<script> parent.finishform({code:0,msg:"<h4>Archivo cargado correctamente.<h4> Se le notificará via correo electrónico cuando se haya terminado de procesar"}) </script>';
    }else{
      if(response.code === 102){
        var str = '<script> parent.finishform({code:101,msg:"Este archivo no esta en el formato requerido"}) </script>';  
      }else{
        if (response.code === 101) {
          var str = '<script> parent.finishform({code:101,msg:"Este archivo ya se encuentra en el servidor. <br>Si el archivo es nuevo pruebe lo siguiente:<ul><li>Cambie el nombre del archivo antes de subirlo</li><li>Intentenlo nuevamnete</li></ul>"}) </script>'; 
        }else{
          if (response.code === 100) {
            var str = '<script> parent.finishform({code:100,msg:"Error  al subir el archivo, intente nuevamente"}) </script>';
          }
        }
      }
    }
      res.send(str);
  });
});

app.post('/upload/logo',function(req,res){
  //console.log(req.files);
  //res.send({code:0,msg:'ok'});
  uploadLogo(req,function(response){
    var str = '';
    if(response.code === 0){
      str = '<script> parent.finishform({code:0,msg:"<h4>Archivo cargado correctamente.<h4> Recargar la pagina para ver el nuevo logo"}) </script>';
    }else{
      str = '<script> parent.finishform({code:100,msg:"Error  al subir el archivo, intente nuevamente"}) </script>';
    }
      res.send(str);
  });
});

/* Public Api
------------------------------------------------ */

function getParams(req){

    if( req.params.length > 0 ){
        return req.params;
    }
    if( req.query.length > 0 ){
        return req.params;
    }
    if( req.body.length > 0 ){
        return req.params;
    }
}

app.post('/api/v1/signup', function(req, res){
    res.contentType('application/json');
    Account.loadKey(req.body.key,function(resp){
      res.send(resp);
    });
  
}); 

app.all('/api/v1/emit', function(req, res){
    res.contentType('application/json');   
    if( req.method == 'POST'){
        Account.loadToken(req.body, function(resp){
            res.send(resp);
        });     
    }else{
      res.send({code:0,msg:'data was recive',data: req.query }); 
    }
});

app.get('/api/v1/locations', function(req,res){
    res.contentType('application/json');
    Location.searchByToken(req.query.token,function(r){
      res.send(r); 
    });
});

app.post('/api/v1/uploadfile', function(req,res){
    res.contentType('application/json');
    try {
    Account.loadByToken(req.body.token,function(response){
      if (response.code === 0) {
        if (response.user.role === 'supplier') {
          Location.load(req.body.id, function(location){
            if (location.code === 0) {
              uploadFile(req,function(file){
                  if (file.code === 0) {
                    location.data.images.push( {file:file.name,lat:req.body.latitud,lng:req.body.longitud,stamp:req.body.timestamp} );
                    //console.log(location.data.images.length)
                    if (location.data.images.length == 3) {
                      location.data.active = 1;
                    }
                    location.data.save(function(err,doc){
                      if (err) {
                        res.send({code:100,msg:'Error en el server'});
                      }else{
                        res.send({code:0,msg:'Imagen guardada'});
                      }
                    });
                  }
              });
            }else{
              res.send({code:102,msg:'Id de reporte no encontrado'});
            }
          });
        }else{
          Status.loadById(req.body.id,function(r){
            if (r.code === 0 ) {   
              uploadFile(req,function(file){
                  if (file.code === 0) {
                    r.status.images.push( {file:file.name,lat:req.body.latitud,lng:req.body.longitud,stamp:req.body.timestamp} );
                    r.status.save(function(err,doc){
                      if (err) {
                        res.send({code:100,msg:'Error en el server'});
                      }else{
                        res.send({code:0,msg:'Imagen guardada'});
                      }
                    });
                  }
              });
            }else{
              res.send({code:102,msg:'Id de reporte no encontrado'});
            }
          });
        }
      }else{
        res.send({code:0,msg:'Token invalido',data:user});
      }
    });
    } catch(e) {
        res.send({error:e});
    }
});

function uploadFile(req, callback){

  var filetmp  = req.files.image.path;
  var filename = req.files.image.filename;
  var ext      = filename.split('.').slice(-1)[0];
  var f        = new Date();
  var r        = mkdirp(__dirname+'/public/uploads/'+f.getFullYear()+'/'+f.getMonth());

  fs.readFile(filetmp, function (err, data) {        
    var filename = Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2) +'.'+ext ;
    var newPath  = __dirname + '/public/uploads/'+f.getFullYear()+'/'+f.getMonth()+'/'+filename;
    fs.writeFile(newPath, data, function (err) {
     if(!err){
        callback({code:0,msg:'ok',name: f.getFullYear()+'/'+f.getMonth()+'/'+filename});       
      }else{
         callback({code:100,msg:'Error al subir la imagen'});
      }
    
    });
  });  
}

function uploadCsv(req, callback) {
  var account = req.session.user.account._id;
  var supplier = req.session.user.user.supplier;
  var filetmp  = req.files.file.path;
  var filename = req.files.file.filename;
  var ext      = filename.split('.').slice(-1)[0];
  var f        = new Date();
  var r        = mkdirp(__dirname+'/public/uploads/temp');

  fs.readFile(filetmp, function (err, data) {
    var newFilename = req.session.user.user.supplier+'--'+req.files.file.name ;
    var newPath  = __dirname + '/public/uploads/temp/'+newFilename;
    if (ext == 'csv' || ext == 'CSV') {
      fs.exists(newPath,function(resp){
        //console.log(resp);
        if (resp) {
          callback({code:101,msg:'Este archivo ya existe en el sistema'});
        }else{
          fs.writeFile(newPath, data, function (err) {
            if(!err){
               callback({code:0,msg:'ok'});       
             }else{
                callback({code:100,msg:'Error al subir archivo'});
             }
          }); 
        }
      });
    }else{
      callback({code:102, msg:'Extensión no permitida'});
    }
  });
}

function uploadLogo(req, callback){
  var supplier = req.session.user.user.supplier;
  var filetmp  = req.files.file.path;
  var filename = req.files.file.filename;
  var ext      = filename.split('.').slice(-1)[0];
  var pathFolder = './public/uploads/logos/'+supplier;
  var r        = mkdirp(__dirname + '/public/uploads/logos/'+supplier);
  deleteFileFolder(pathFolder);

  fs.readFile(filetmp, function (err, data) {
    var newPath  ='./public/uploads/logos/'+supplier+'/'+filename;
      fs.writeFile(newPath, data, function (err) {
        if(!err){
           callback({code:0,msg:'ok'});       
         }else{
            console.log(err);
            callback({code:100,msg:'Error al subir archivo'});
         }
      }); 
    });
}

function deleteFileFolder (path) {
  console.log(path);
  if( fs.existsSync(path) ) {
    console.log('delete');
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      fs.unlinkSync(curPath);
    });
  }
}

/*-------------------------------------------------------*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
