	
	
	YagamiBox = new function() {
		
		this.init = function( options ){

			var defaults = { 
			 
			 id    : 'TheLigthBox',			 
			 width : '500px',
			 height :'500px',
			 url : null,
			 auto : true,
			 data : {},
			 headers: true,
			 title : 'My Window',
			 animated:false,
			 autohide : false,		 
			 afterOpen: function(){},
			 onBeforeOpen: function(){},
			 onLoaded: function(){},
			 afterLoaded:function(){},
			 onBeforeLoaded:function(){},
			 onBeforeClose:function(){},
			 onCheckBoxMain: function(){}
		}
		
			//the options extends
			this.opts = $.extend(defaults, options);

			//open the model
			this.open();
			return this;
		}

		this.open = function(){

			//this level
			var that = this;

			var body = document.body,
			    html = document.documentElement;

			var height = Math.max( body.scrollHeight, body.offsetHeight, 
			                       html.clientHeight, html.scrollHeight, html.offsetHeight );


			var width = Math.max( body.scrollWidth, body.offsetWidth, 
			                       html.clientWidth, html.scrollWidth, html.offsetWidth );

			//theviewPort
		    var theviewPort 	  = {w:width+20,h:height};

			//onBeForeOpen callback
			this.opts.onBeforeOpen.call(this,{}); 

			var overlay 		  = document.createElement("div");
			overlay.className     = 'yagami-overlay';
			overlay.style.width   = theviewPort.w  +'px';
			overlay.style.height  = theviewPort.h +'px';
			overlay.style.display = 'node';
			document.body.appendChild(overlay);
			
			var thewindow 	       = document.createElement("div"); 
			thewindow.className    = 'yagami';
			thewindow.style.width  = '1px';
			thewindow.style.height = '1px';
			overlay.appendChild(thewindow);	

			var theTitle 	   = document.createElement("div");
			theTitle.className = 'title';
			theTitle.innerHTML = this.opts.title;							
			thewindow.appendChild(theTitle);

			var thewindowContent   	    = document.createElement("div"); 
			thewindowContent.className  = 'yagami-content';
			thewindowContent.style.height     = ( parseFloat( that.opts.height) - $(theTitle).height() )+ 'px';
			thewindow.appendChild(thewindowContent);


			var theclose 	       = document.createElement("div"); 
			theclose.className     = 'yagami-close';
			theclose.title  	   = 'Close';
			theclose.alt  	   	   = 'Close';
			thewindow.appendChild(theclose);

			$(theclose).click(function(){
				that.close();		
			});

			$(overlay).show(1,function(){	

				if(that.opts.animated){

					$(thewindow).animate({
					    width: that.opts.width,
					    height: that.opts.height
					  }, 300, function() {
					  	//Get data from remote
						that.getRemote(thewindowContent);					  
					 });
				}else{
					that.getRemote(thewindowContent);
					$(thewindow).css({width : that.opts.width });
					$(thewindow).css({height: that.opts.height  });					
				}			

				window.scrollTo(0,0);
				document.body.style.overflow = 'hidden';
				//onOpen callback
				that.opts.afterOpen.call(this,{});
			});

			if( this.opts.autohide )
			$(overlay).click(function(){
				 document.body.style.overflow = 'auto';
				$(this).remove();

			});

		}

		this.getRemote = function(container){

			var that = this;

			that.opts.onBeforeLoaded.call(this,{});

			if(this.opts.url) {

				$.ajax({
				  type: 'GET',
				  url: this.opts.url,
				  data: this.opts.data,
				  dataType: 'html',
				  asyn:false,
				  success: function( r ){
					  
					  $(container).html(r);
					  that.opts.afterLoaded.call(this,{});
					  
				  }
				});

			}

		}

		this.close = function (){
			document.body.style.overflow = 'auto';
			$('.yagami-overlay').remove();
		}


	}

