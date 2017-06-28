
(function($){	
	
	$.fn.showAlert  = function(options) {
		var that = this;

		$(that).show();

		var defaults = { 			 			
			 time  : 20 ,
			 hide : 'fadeOut',		 				 
			 onStart: function() {},
			 onComplete: function(){},
			 onBeforeSend: function(){},
			 onFail : function(){},
			 onCancel : function(){},
		}

		/*--- final options merge -- */ 
		this.opts = $.extend(defaults, options);

		setTimeout(function(){
			$(that).fadeOut();
		},( this.opts.time * 1000 ) );	
				
	    // this.opts.onStart.call(this);
		return this;		
	}

})(jQuery);  