$.fn.disableSelection = function() {
    return this
             .attr('unselectable', 'on')
             .css('user-select', 'none')
             .on('selectstart', false);
};

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMySQLDatetime = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};
Date.prototype.toMySQLDate = function() {
   return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) ;
};

var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);


    
 Core = Class.extend({

    config : function(options){
      console.log(options);
    },
 	
    isLogged: function(result,callback){      	 	
      	if(result == 'login'){
      		window.location.href = '/login';
      		return true;
      	}
      	callback.call(result);
    },

    panels : function(){

	    var viewportWidth  = $(window).width();
	    var viewportHeight = $(window).height();
	    var navHeight      = $('#mainNavigator').height();

      var panelHeigth    = viewportHeight - ( navHeight + 165 + $('.boxFooter').height() );
      window.rowsmax     = Math.ceil( panelHeigth / 120 );
	    $('.boxcontainer .innercontent').height( panelHeigth );	
    },

    isAdmin : function(){
      return [1,2,3,11].indexOf( parseInt( this.opts.role ) ) > -1;
    }
 });
