(function($) {
  
  String.prototype.clean = function(e,i,a){
    var evtobj    = window.event? event : e; // IE event or normal event
    var unicode   = evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualKey = String.fromCharCode(unicode);
    var expr      = new RegExp('[^A-Za-z\u00D1\u00F10-9\ '+a+']*',"gi");
    i.value       = this.replace(expr,''); //this.replace(/[^a-z\u00D1\u00F10-9]*/ig,'');
  };

  String.prototype.digits = function(e,i,a){
    var evtobj     = window.event? event : e; // IE event or normal event
    var unicode    =  evtobj.charCode? evtobj.charCode : evtobj.keyCode;
    var actualKey  = String.fromCharCode( unicode );
    var expr      = new RegExp('[^0-9{}.-]*',"gi");
     i.value      = this.replace(expr,''); //this.replace(/[^0-9]*/ig,''); 
  };
  
  Number.prototype.currency = function(c, d, t){
   var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
     return  s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };

   $.fn.alfanumeric = function(a) {    
    $(this).keyup(function(e) {
       this.value.clean(e,this,a);
    });

  };

  $.fn.digits = function(a) {  
    $(this).keyup(function(e) {
       this.value.digits(e,this,a);
    });
  };

  $.fn.currency = function(c, d, t) {    
    $(this).blur(function(e) {
        this.value = Number(this.value).currency(c, d, t);
    });
    $(this).keyup(function(e) {
      this.value.digits(e,this);
    });

  };

})(jQuery);