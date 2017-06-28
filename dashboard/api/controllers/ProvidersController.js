/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */ 
 
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

Number.prototype.toMoney = function(){
  return parseFloat(this).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

String.prototype.toDecimal = function(){
  return parseFloat(this.replace(/,/g,'')).toFixed(2)
  // return parseFloat(this).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

function calculator(customer,membership,date,balance,rate,nper,fe){

    // months names 
    var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    var data  = [];
    var now   = parseFloat(balance);
    var str   = '';   
    var m     = 0;
    var i     = nper;
    var imc   = 0;

    var initdate     = new Date(date);
    var init_day     = initdate.getDate();
    var init_month   = initdate.getMonth()+1;
    var init_year    = initdate.getFullYear();
    var payment_cost = 10.00;

    var cdate = new Date(init_year, init_month, init_day);

      while( i > 0 ){

        var date   =  cdate.getDate();
        var month  = cdate.getMonth()+1;
        var year   = cdate.getFullYear();
        var amort  = fe + payment_cost;  
        var im     = now * rate;
        var cap    = fe - im;
        var imc    = im + imc;
        var dif    = now - cap;
        var period = (m+1);
        var period_date = cdate; //date+'-'+month+'-'+year;

        var row = {
            membership_id:membership,
            customer_id:customer,
            number:period,
            date:period_date,
            balance:now.toFixed(2),
            amount:parseFloat(amort).toFixed(2),
            total: payment_cost + parseFloat(amort),
            difference: payment_cost + parseFloat(amort),
            monthly_interest:parseFloat(im).toFixed(2),
            capital:parseFloat(cap).toFixed(2),
            balance_diference:parseFloat(dif).toFixed(2),
            interest:parseFloat(imc).toFixed(2)
        }
        data.push(row);
        Periods.create(row).exec(function(e,r){
          console.log(e);
        });

       str += '</tr>';
       var now   = dif;
       var cdate = cdate.addMonths(1);
        
        m++;
        i--;
      }

     

  }

module.exports = {
  index: function (req, res){
    var user = JSON.stringify(req.session.user);
    return res.view({user:user});
  },
  get: function (req, res) {          
    var id  = req.body.id;
    Vw_customers.findOne(id).exec(function(e,data){
      // console.log(data);
      return res.json({code:0,msg:'ok',data:data});
    });
  },
  all: function (req, res) {          

    var rows    = req.query.rows;
    var keyword   = typeof(req.query.keyword) == 'undefined' ? null : req.query.keyword;
    var where = {};

    if( keyword ){
      var keyword = keyword.trim();
      where.or = [ 
      { like: {owner_name: '%'+keyword+'%'} }, 
      { like: {coowner_name: '%'+keyword+'%'} } ,
      { like: {phone: '%'+keyword+'%'} },
      { like: {mobile: '%'+keyword+'%'} },
      { like: {email: '%'+keyword+'%'} }
      ];
    }
    Vw_customers.find(where).limit(rows).exec(function(e,data){
      // console.log(e||data);
      return res.status(200).json({code:0,msg:'ok',data:data});     
    });
  }, 
   save: function (req, res) {     
    var data              = req.body.customer;
      
    Customers.findOne({id:data.id}).exec(function(e,u){ 

      if( typeof(u) == 'undefined' ){

          data.account          = 1,
          data.owner_name       = data.owner_name.trim();
          data.coowner_name     = data.coowner_name.trim();
          data.phone            = data.phone.trim();
          data.mobile           = data.mobile.trim();
          data.email            = data.email.trim();
          data.zip              = data.zip.trim();
          data.status           = 1;
          data.updated_user     = req.session.user.id;
          data.id               = data.id == '' ? 0 : data.id;
          data.cve              = data.cve.trim();
       
        Customers.create(data).exec(function(error,data){
            if(!error){
              return res.json({code:0,mode:'insert',msg:'ok',data:data}); 
            }else{
              return res.json({code:1,mode:'insert',msg:'Error',data:error});
            }
        });

      }else{

        u.owner_name     = data.owner_name.trim();
        u.coowner_name   = data.coowner_name.trim();
        u.phone          = data.phone.trim();
        u.mobile         = data.mobile.trim();
        u.email          = data.email.trim();
        u.zip            = data.zip.trim();
        u.street         = data.street;
        u.neighbor       = data.neighbor;
        u.city           = data.city;
        u.state          = data.state;
        u.country        = data.country;
        u.cve            = data.cve.trim();
        u.updated_user   = req.session.user.id;

        //update data ----------- 
        u.save(function(error,data){
          if(!error){
            return res.json({code:0,mode:'update',msg:'ok',data:data});     
          }else{
            return res.json({code:1,mode:'update',msg:'Error',data:data});     
          }
        });
      }       
    });    
  },

  delete : function(req, res){
    var id = req.body.id;
    Customers.destroy({id:id}).exec(function(error,data){
      if(!error){
        return res.json({code:0,mode:'delete',msg:'ok',data:data});     
      }else{
        // console.log( error );
        return res.json({code:1,mode:'delete',msg:'Error',data:error});     
      }
    });
  },

  membership: function(req, res){

    var data  = req.body.membership;
    var amort = req.body.calculator;

    var mode                = data.id.length > 0 ? 'update': 'insert' ;
    data.id                 = data.id.length > 0 ? data.id : 0 ;
    data.price              = data.price.toDecimal();
    data.admin_cost         = data.admin_cost.toDecimal();
    data.deposit            = data.deposit.toDecimal();
    data.deposit_agreed     = typeof(data.deposit_agreed)  == 'undefined' || data.deposit_agreed  == '' ? 0 : data.deposit_agreed.toDecimal();
    data.deposit_payment    = typeof(data.deposit_payment) == 'undefined' || data.deposit_payment == '' ? 0 : data.deposit_payment.toDecimal();
    data.monthly_payment    = typeof(data.monthly_payment) == 'undefined' || data.monthly_payment == '' ? 0 : data.monthly_payment.toDecimal();
    data.total              = typeof(data.total) == 'undefined' || data.total == '' ? 0 : data.total.toDecimal();
    data.balance            = data.balance.toDecimal();
    data.financed_total     = data.financed_total.toDecimal();
    data.interest           = data.interest.toDecimal();
    data.exchange_rate      = data.exchange_rate.toDecimal();
    data.exchange_rate      = isNaN(data.exchange_rate) ? 0.00 : data.exchange_rate;
    var tmpdate             = data.date.split('-');
    data.date               = new Date(tmpdate[2],parseInt(tmpdate[1]) - 1,tmpdate[0]);
    data.payment_method     = data.payment_method;

    Memberships.findOne(data.id).exec(function(e,m){

        if( typeof(m) == 'undefined' ){

          Memberships.create(data).exec(function(e,m){
            
            calculator(m.user_id,m.id,m.date,amort.balance,amort.rate,amort.nper,amort.fe);

            Vw_customers.findOne(m.user_id).exec(function(e,data){
              return res.json({code:0,msg:'ok',mode:mode,data:data});
            });            
          });

        }else{

            var mode             = data.id.length > 0 ? 'update': 'insert' ;
            m.id                 = data.id.length > 0 ? data.id : 0 ;
            m.price              = data.price.toDecimal();
            m.admin_cost         = data.admin_cost.toDecimal();
            m.deposit            = data.deposit.toDecimal();
            m.deposit_agreed     = typeof(data.deposit_agreed) == 'undefined' || data.deposit_agreed == '' ? 0 : data.deposit_agreed.toDecimal(); 
            m.deposit_payment    = typeof(data.deposit_payment) == 'undefined' || data.deposit_payment == '' ? 0 : data.deposit_payment.toDecimal();
            m.monthly_payment    = typeof(data.monthly_payment) == 'undefined' || data.monthly_payment == '' ? 0 : data.monthly_payment.toDecimal();
            m.total              = typeof(data.total) == 'undefined' || data.total == '' ? 0 : data.total.toDecimal();
            m.balance            = data.balance.toDecimal();
            m.financed_total     = data.financed_total.toDecimal();
            m.interest           = data.interest.toDecimal();
            m.interest_rate      = data.interest_rate;
            m.months             = parseInt(data.months);
            m.exchange_rate      = data.exchange_rate.toDecimal();
            m.exchange_rate      = isNaN(data.exchange_rate) ? 0.00 : data.exchange_rate;
            m.date               = new Date(tmpdate[2],parseInt(tmpdate[1]) -1 ,tmpdate[0]);
            m.payment_method     = data.payment_method;

          m.save(function(e,r){
            // console.log(e||r)
             Vw_customers.findOne(r.user_id).exec(function(e,data){
              // console.log(e||data);
              calculator(m.user_id,m.id,m.date,amort.balance,amort.rate,amort.nper,amort.fe);
              return res.json({code:0,msg:'ok',mode:mode,data:data});
            });      
            
          });
        }

    });
  },
  payment: function(req, res){
      return res.json({code:0,msg:'ok',mode:mode,data:req.body});
  }

};

