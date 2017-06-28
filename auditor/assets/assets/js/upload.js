
(function($){

	$.fn.upload  = function(options) {
		var that = this;

		this.form = $(this);

		var defaults = {
			 input    : false,
			 primary  : false,
			 sortable : false,
			 source   : false,
			 max      : 3,
			 showpercent : false,
			 progressivebar : false,
			 list     : 'list_upload',
			 wait: false,
			 excludelist: [],
			 progressNum : options.progressNum || 'progressNum',
			 progressBar : options.progressBar || 'progressBar',
			 onStart: function() {},
			 onSelect:function() {},
			 onBeforeComplete:function(){},
			 onComplete: function(){},
			 onBeforeSend: function(){},
			 onFail : function(){},
			 onCancel : function(){},
		}

		this.ok = true;

		// final options merge
		this.opts = $.extend(defaults, options);

		//hide loaders
		$('.progresstrip').hide();

		// stop submit
	    this.form.submit(function(){
			/*var file_val = $('#' + that.opts.input ).val()
	    	if(!file_val) that.opts.onCancel.call(this);
			else*/ that.uploadFile();
	        return false;
	    });

	    /*--- Input Form -- */
		var input_name = this.opts.input;
		$('#' + input_name).change(function(e){
			that.selectFile(e);
		});

	    this.opts.onStart.call(this);
		return this;
	},

	$.fn.reset = function(){

		$(this.element.target).val('');
     	$('#'+this.opts.progressNum).hide();
    	$('#'+this.opts.progressBar).hide();
    	$('#'+this.opts.list).hide().html('');

	},


	$.fn.selectFile = function (e) {

		this.ok = true;
		this.element = e;
		if( this.opts.max > 0 ){
			if (parseInt(e.target.files.length) > this.opts.max ){
	        	this.reset();
	        	var msg = typeof(msg) != 'undefined' ? msg : "Sólo puedes subir un máximo de " + this.opts.max + ' items' ;
				alert(msg);
        	}
		}
        $('#'+this.opts.list).show().html('');
		var input = $(this);
		var files = e.target.files;
		var li    = '';
		var total = 0;
		//print files to upload
		for(var i=0; i<files.length; i++) {
				var f = files[i];
			if( this.opts.excludelist.indexOf(f.type) == -1 ){
				total = total + parseInt( f.size ) ;
				li += '<li>'+f.name+', <strong>('+ this.sizeFormat( f.size )+')</strong></li>';
			}
		}

		this.totalSize = this.sizeFormat(total);
		//list
		$('#'+this.opts.list).html(li);
		//size
    	var fileSize = this.getSize(e.target.files)
    	//onSelect
    	this.opts.onSelect.call(this, e.target.files );

	},

	$.fn.sizeFormat = function( size ){

		if ( size > 1024 * 1024){
	        return (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
	      }else{
	        return (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
	      }
	},
	$.fn.getSize = function( files ){
			var size = 0;
			for( x in files){
				if( typeof(files[x].size) != 'undefined' ){
				var bytes = files[x].size;
					size += parseFloat(bytes) ;
				}
			}
		return this.sizeFormat( size );

	},
	$.fn.uploadProgress = function(evt) {
	  if (evt.lengthComputable) {
	  	 var that 			 = this;
	     var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	     var percentComplete = percentComplete; //percentComplete == 100 ? 98 :


	     if(this.opts.showpercent){
	     	var percentComplete = isNaN(percentComplete) ? percentComplete + '%' : percentComplete ;
	     	$('#'+this.opts.progressNum).html( percentComplete.toString() );
	     }else{
	     	$('#'+this.opts.progressNum).html( 'Progreso: (' + percentComplete.toString() + '%)');
	     }
	     if(this.opts.progressivebar){
	     	$('#'+this.opts.progressBar).css('width', percentComplete.toString() + '%');
	 	 }
	 	 if( percentComplete == 100 ){
	     	if( that.opts.wait ){
	     		setTimeout(function(){
	     			$('#'+that.opts.progressNum).html('Procesando Archivo..');
	  			}, 1000);
	     	}
	     }
	  }else {
	    document.getElementById(this.opts.progressNum).innerHTML = 'unable to compute';
	  }
	},

	$.fn.uploadComplete = function(evt,o) {

	  // $('#'+this.opts.progressNum).html('Procesando Archivo..');
	  // var that = this;
	  // /* This event is raised when the server send back a response */
	  // setTimeout(function(){
	  //   $('#'+that.opts.progressNum).hide();
	  //   $('#'+that.opts.progressBar).hide();
	  //   $('#'+that.opts.list).html('');
	  //   that.opts.onComplete.call(this);
	  // }, 3000);
	},

	$.fn.done = function(response) {

	  var data = JSON.parse(response+'');
	  var that = this;

	    	// var that = this;
		  /* This event is raised when the server send back a response */
		  setTimeout(function(){
		    $('#'+that.opts.progressNum).hide();
		    $('#'+that.opts.progressBar).hide();
		    $('#'+that.opts.list).html('');
		    that.opts.onComplete.call(this,data);
		  }, 3000);

	},

	$.fn.uploadFailed = function(evt) {
		var that = this;
		$('#'+that.opts.progressNum).hide();
	    $('#'+that.opts.progressBar).hide();
	    $('#'+that.opts.list).html('');
	  alert("There was an error attempting to upload the file.");
	  this.opts.onFail.call(this);
	},

	$.fn.uploadCanceled = function(evt) {
	  that.opts.onCancel.call(this);
	},

	$.fn.uploadFile = function() {

		if( document.getElementById(this.opts.input).files.length == 0){
			alert("There was an error upload the file is empty");
	 		this.opts.onFail.call(this);
	 		return true;
		}

		var that = this;

		this.opts.onBeforeSend.call(this);


		if( this.ok ){

		    $('#'+this.opts.progressNum).html('').fadeIn();
		    $('#'+this.opts.progressBar).show();

		    var xhr = new XMLHttpRequest();
		    var fd  = new FormData(document.getElementById(this.form.attr('id')));

		    /* event listners */
		    xhr.upload.addEventListener("progress", function(evt){ that.uploadProgress(evt) }, false);
		    xhr.addEventListener("load", function(evt){ that.uploadComplete(evt) } , false);
		    xhr.addEventListener("error", function(evt){ that.uploadFailed(evt) }  , false);
		    xhr.addEventListener("abort", function(evt){ that.uploadCanceled(evt) }  , false);
		    /* Be sure to change the url below to the url of your upload server side script */
		    xhr.open("POST",this.opts.source);
		    xhr.send(fd);

		    this.xhr = xhr;

		    xhr.onreadystatechange = (function(){
		      if (xhr.readyState == 4) {
			        that.done(xhr.responseText);
			    }
		    });

	    }


	}

})(jQuery);
