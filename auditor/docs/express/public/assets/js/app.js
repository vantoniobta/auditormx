
 App = Class.extend({

 	
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
    }
 });
