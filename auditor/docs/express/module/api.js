
/**
 * Module dependencies.
 */

var express   = require('express')
  , routes    = require('./routes')
  , user      = require('./routes/user')
  , mongoose  = require('mongoose')
  , crypto    = require('crypto')
  , http      = require('http')
  , path      = require('path')
  , load     = require('express-load');


String.prototype.ucfirst = function(){
    return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();
    } );
};

String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

/* Conect with Database
-------------------------------------- */ 
db = mongoose.connect('mongodb://admin:pw.sicp@198.61.211.102/sicp')

/* Setup
------------------------------------- */

var app = express();

var MemoryStore = express.session.MemoryStore,
    store = new MemoryStore({ reapInterval: 60000 * 10 });

app.configure(function(){
  app.set('port', process.env.PORT || 1000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({cookie: { path: '/', httpOnly: true, maxAge: 365*24*60*60*1000 }, store: store,secret:'Supercalifragilisticoexpialidoso',key: 'sid'}));
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


app.all('/login',function(req, res){

    if( req.method == 'POST'){     
      Account.loadActiveUser(req.body,function(user){   
          if( user.data !== null ){
              req.session.isLogged = true;
              req.session.account  = user.data;   
              req.session.user     = {user:user.data.users[0],account:user.data};   

              var name = user.data.users[0].name;
              var id   = user.data.users[0]._id;
              Log.register({account:user.data._id,user:id, msg:name + ' hizo Login'},function(){
                res.redirect('/dashboard');  
              });
              
          }else{              
            res.render('login/index.ejs', {controller:{name:'login'},error:' <div class="alert alert-error">  <button type="button" class="close" data-dismiss="alert">&times;</button>  No User Found with these creadentials try again</div>'}, function(err, str) {
                res.render('loginlay.ejs', {
                    body: str,
                    title:'iClic SMS App, Crea Campañas SMS, simple y fácil - Login '
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
             title:'iClic SMS App, Crea Campañas SMS, simple y fácil'
          });
      });
    }
});


app.all('/login',function(req, res){

  if( req.method == 'POST'){             
    Provider.loadActiveUser(req.body,function(user){       
      if( user.data !== null ){
        req.session.isLogged = true;
        req.session.user     = {user:user.data, type: user.type};

        if( user.type == 'Administrador'){
          res.redirect('/dashboard');
        }else if ( user.type == 'Proveedor' ){
          res.redirect('/dashboard2');
        }
        console.log(user.data.type[0]+' -- ' + user.type);
      }else{    
        res.render('login.ejs', {controller:{name:'login'},error:' <div class="alert alert-error">  <button type="button" class="close" data-dismiss="alert">&times;</button>  No User Found with these creadentials try again</div>'}
        , function(err, str) {
          res.render('loginlay.ejs', {
            body: str,
            title:'SICP'
          });    
        });
      }
    });
  }else{
    delete req.session.isLogged;
    delete req.session.user;

    res.render('login.ejs', {controller:{name:'login'}}, function(err, str) {
      res.render('loginlay.ejs', {
        body: str,
        title:'Auditor'
      });
    });
  }
});


/* Api
-------------------------------------------------------*/

 //  app.get('/user/add', function(req,res) {      
 //      res.contentType('application/json');      
 //      Provider.createUser(function(error, response) {
 //          res.send(response);
 //      });      
 //  });

app.post('/v1/', isLogin,function(req, res){
    res.contentType('application/json');
    res.send({code:0,msg:'server is ok'});
});

/*-------------------------------------------------------*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
