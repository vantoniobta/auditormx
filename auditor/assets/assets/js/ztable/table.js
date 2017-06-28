/*!
 * Ztable v0.9
 * (c) 2008 @ferso, Fernando Soto erickfernando@gmail.com
 * Evisualmx.com
 */



(function($){

	$.fn.Table = function(options) {

		this.Container = $(this);

		var defaults = {

			 id     : 'JTable',
			 title  : null,
			 width : '100%',
			 source : null,
			 auto : true,
			 params : {},
			 headers: {},
			 rows : 10,
			 page : 1,
			 vpp: 5,
			 checkbox : false,
			 drawgrid : false,
			 btCheckbox:false,
			 searcher:false,
			 navigation:false,
			 animation:false,
			 primary:false,
			 sortable:false,
			 searchmessage: 'Enter keyword to find, press enter',
			 onStartRequest : function() {},
			 onCompleteRequest: function(){},
			 onBeforeCreateRow:function(){},
			 onBeforeCreateCell : function(){},
			 onCheckBoxMain: function(){},
			 onCheckBox: function(){}
		}

		this.xhr           = false;

		this.opts 		   = $.extend(defaults, options);

		//Page request
		this.page          = this.opts.page;
		this.crows         = this.opts.rows;
		this.keyword       = null;
		this.sortfield     = null;
		this.sortby        = null;

		// Create search area
		this.createSearchInput();

		//Create Table
		this.createTable();

		if( this.opts.auto ) {
			this.theLoad();
		}
		return this;
	},

	$.fn.test = function (){
		console.log('ok');
	},

	$.fn.uniq = function(collection){
		collection.reduce(function(a,b){
		    if (a.indexOf(b) < 0 ) a.push(b);
		    return a;
	 	 },[]);
		return collection;
	},

	$.fn.theLoad = function (){
		var that = this;
		this.opts.params.page   = this.page;
		this.opts.params.rows   = this.crows;

		if( this.opts.params.page == 1 ){
			this.collection 		= new Array();
		}

		if( this.keyword != null ){
			this.opts.params.keyword = this.keyword;
		}else{
			delete this.opts.params.keyword;
		}

		//--------------------------------------
		if( this.sortfield != null ){
			this.opts.params.sortfield   = this.sortfield;
			this.opts.params.sortby = this.sortby;
		}else{
			delete this.opts.params.sortfield;
			delete this.opts.params.sortby;
		}

	 	//--------------------------------------
		this.opts.onStartRequest.call(this);

		var idcontainer = that.Container.attr('id');
		// console.log('#'+idcontainer +' #loader_icon_search');

		$('#'+idcontainer+' #loader_icon_search').removeClass('glyphicon glyphicon-search').addClass('csspinner traditional');

		if(this.xhr){
			this.xhr .abort();
		}
		this.xhr = $.get(this.opts.source,this.opts.params, function(data){
			$('#'+that.Container.attr('id') +' #loader_icon_search').removeClass('csspinner traditional').addClass('glyphicon glyphicon-search');
			that.datafull = data;
			that.executer(data);
			this.xhr = false;
		}, "json");

	},

	$.fn.executer = function( source ){

		if( typeof( window.scookie ) == 'undefined' ){
			window.scookie = 1;
		}else{
			window.scookie = window.scookie + 1;
		}

		this.createTBody(1);

		this.NavDiv.html('');
		var data     = typeof(source.data) != 'undefined' ? source.data : source;
		var pages    = typeof(source.pages) != 'undefined' ? source.pages  : 1;
		this.keyword = this.keyword ? this.keyword  : null;

		this.serverData = source;

		//Create Table
		this.createRowTable( data );

		//Create The pages navigation
		this.drawPages( source );

		this.firstRequest = null;
		// $(this.MainTableBodyDiv).slideDown();
		this.opts.onCompleteRequest.call(this);

	},

	/**
	 * createTable()
	 * Create the table object
	 * @return void
	 */
	$.fn.createTable = function(){

		//Main table
		this.MainTable 	       	   		= document.createElement('table');
		this.MainTable.className   		= 'grid table table-condensed table-striped';
		this.MainTable.width	   		= this.opts.width;
		this.MainTable.border	   		= 0;
		this.MainTable.cellspacing 		= 0;
		this.MainTable.cellpadding 		= 0;
		this.MainTable.id 	       		= 'STable_'+ this.opts.id;
		this.Container.append(this.MainTable);

		// Create heaers
		this.createHeaders(  );

		// Crate Main table body
		this.MainTableBodyDiv = document.createElement('div');
		this.MainTable.appendChild(this.MainTableBodyDiv);

		this.createTBody();

		this.Container.addClass('ztable');

		if( this.opts.navigation === false ) {
			// Navigation Pages
			this.NavDiv 	       	   = document.createElement('div');
			this.NavDiv.className      = ' text-center';
			this.Container.append(this.NavDiv);
			this.NavDiv = $(this.NavDiv);

		}else{
			// Navigation pages
			this.NavDiv = $( this.opts.navigation );
			this.NavDiv.addClass(' text-center');
		}

		$(this.MainTableBodyDiv).hide();
	 },

	  /**
	  * createTBody()
	  * create the tBody element
	  * @return void
	  */
	 $.fn.createTBody = function( r ){
		if( typeof(r) != 'undefined' ){
			this.MainTable.removeChild( this.MainTableBody );
		}
		this.MainTableBody 	       	   = document.createElement('tbody');
		this.MainTable.appendChild(this.MainTableBody);
	}

	  /**
	  * createSearchInput()
	  * create the Search input in the table
	  * @return void
	  */
	  $.fn.createSearchInput = function(s ){

			if( this.opts.searcher ){

				this.Sic 	       	   		= document.createElement('div');
				this.Sic.className     		= 'search-container input-group';
				this.Container.append(this.Sic);

				// ------------------------------------------------------------
				var that = this;

				this.SearchInput 	         = document.createElement('input');
				this.SearchInput.type        = 'search';
				this.SearchInput.placeholder = this.opts.searchmessage;
				this.SearchInput.className   = ' form-control' ;
				this.Sic.appendChild( this.SearchInput );
				this.SearchInput = $( this.SearchInput );

				var gspan 	       	   		= document.createElement('div');
				gspan.className     		= 'input-group-addon';
				this.Sic.appendChild(gspan);

				var gspanicon 	       	   	= document.createElement('div');
				gspanicon.id                = 'loader_icon_search';
				gspanicon.className     	= 'glyphicon glyphicon-search';
				gspan.appendChild(gspanicon);


				 this.SearchInput.blur(function(e){
				 	e.preventDefault();
					if( that.SearchInput.val() == ''  ) {
						that.keyword = null;
					}else{
						that.Search();
					}

				 });

				 this.SearchInput.keyup(function(e){
						e.preventDefault();
				    if(  ( that.SearchInput.val() != '' ) ){
						that.keyword = that.SearchInput.val();
						that.Search();
				    }else{
				    	that.keyword = null;
				    	that.Search();
				    }
				 });
				// ------------------------------------------------------------
		 	}
	  },


	  $.fn.Search = function(){

		var that = this;
		this.page = 1;
		if (window.keyTimeout_) {
				clearTimeout(window.keyTimeout_);
		}
		var callMethod = function(){
			that.theLoad();
		}
		window.keyTimeout_ = setTimeout(callMethod, 1000);

	  },

	 /**
	  * createHeaders()
	  * create the headers in the table
	  *
	  * @return void
	  *
	  */
	$.fn.createHeaders = function(){

			var that     = this;
		 	var Row      = this.createRowTitle('throw');
			var iterator = 1;

			if( this.opts.checkbox ) {

				this.Header = document.createElement('th');
				this.Header.id	 		= 'CellHeader_itms';
				this.Header.innerHTML	= '';
				this.Header.className	= 'center';
				this.Header.style.width = '10px';
				Row.appendChild(this.Header);

				this.mainCheck = document.createElement('input');
				this.mainCheck.type	 		= 'checkbox';
				this.mainCheck.id	 		= that.Container.attr('id')+'_checkbox_main';
				this.mainCheck.onclick	 	= function(){

					var mainchecked = this;

					$('#' + that.Container.attr('id') + ' .chkbox').each(function(i,chck){
						if( mainchecked.checked ){
						 	chck.checked = true;
						 	that.addToCollection(chck.value);
						}else{
							chck.checked = false;
							that.removeToCollection(chck.value);
						}

						if(typeof($.uniform) != 'undefined' ){
							$.uniform.update($(mainchecked) );
							$.uniform.update(chck);
						}
					});

				};
				this.Header.appendChild(this.mainCheck);


			}


			this.headerCellCollector = new Array();

			var total    = this.opts.headers.length ;
			var that     = this;

			$.each(this.opts.headers,function(idx,itm){

				var Width    = typeof(itm.width) 	 != 'undefined' ? itm.width : '' ;
				var nClass   = typeof(itm.classname) != 'undefined' ? itm.classname : '' ;
				var lastCol  = iterator >= total ? 'lastcol' : '';

				this.Header 			= document.createElement('th');
				this.Header.id	 		= 'CellHeader_'+ idx;
				this.Header.width		= Width;
				this.Header.innerHTML	= itm.name
				this.Header.className	= nClass +' ' + lastCol	;

				this.hiddenHeader 		= document.createElement('input');
				this.hiddenHeader.type	= 'hidden';
				this.hiddenHeader.id	= 'hCellHeader_'+ idx;
				this.hiddenHeader.value =  itm.db;
				this.Header.appendChild(this.hiddenHeader);

				Row.appendChild(this.Header);

				that.headerCellCollector.push( this.Header );

				if( that.opts.sortable ){
					if( typeof( itm.disableSort ) == 'undefined'){
						$(this.Header).addClass('sortable');
						this.Header.onclick = function(){
							that.doTheSort(this);
						};
					}
				}
				iterator++;
			});

		 },

		/**
		 * createRowTitle()
		 * Create a row table DOM
		 * @return HTMLTableRowElement TableRow
		 */
		$.fn.createRowTitle = function( id ){

			var TableRow = document.createElement('tr');
			TableRow.id  = 'STRow_'+ id;
			this.MainTable.appendChild(TableRow);
			return TableRow;
		},

		/**
		 * createRow()
		 * Create a row table DOM
		 * @return HTMLTableRowElement TableRow
		 */
		$.fn.createRow = function( id ){

			var TableRow = document.createElement('tr');
			TableRow.id  = 'STRow_'+ id;
			this.MainTableBody.appendChild(TableRow);
			return TableRow;

		},

		////////////////////////////////////////////////////////////

		$.fn.createRowTable = function( request ){

			var that     = this;
		    var Data     = request;
			var Total 	 = Data.length;
			this.element = '';
			var i = 0;

			$.each(Data, function(i,rw){

				var rowclass    =  ( i % 2 ) > 0 ? '' : 'row2' ;
				var nogridClass =  that.opts.drawgrid  == false ? 'nogrid' : '' ;

				this.Dataset = rw;
				//This call onBeforeCreateRow Callback
				that.opts.onBeforeCreateRow.call(this);

				//This Call create the row object
				var Row = that.createRow( i );
				var iterator = 1;
				var total    = that.opts.headers.length;
				var lastClass = ( i + 1 ) >= Total ? 'last' : '';

				//This create the Checkboxes in the component
				if( that.opts.checkbox ) {
					/*Create the Checkbox column*/
					that.createCheckBoxes(Row, rw, lastClass, rowclass,nogridClass);
				}

				/**
				 * This create the fields in the table
				 * according with the fields defined in the options
				 */
				$.each(that.opts.headers,function(it,col){

					var lastCol  = iterator >= total ? 'lastcol' : '';
					//This call onBeforeCreateRow Callback
					that.opts.onBeforeCreateCell.call(this);
					this.Cell = document.createElement('td');
					this.Cell.id	    = 'Cell_itms' + it;
					this.Cell.className	= col.classname +' '+ lastClass + ' ' + lastCol+' '+rowclass + ' ' + nogridClass;
					Row.appendChild(this.Cell);
					//this create the field action in the table
					if( typeof(col.db) != 'undefined' ){
						if( typeof( col.handler ) != 'undefined' ) {
							this.Cell.innerHTML = '';
							this.CellLink = document.createElement('a');
							this.CellLink.innerHTML	= rw[col.db];
							this.CellLink.href      = 'javascript:;';
							this.Cell.appendChild(this.CellLink);
							this.CellLink.onclick  = function(){
								col.handler.call(that,rw);
							}
						}

						if( typeof( col.linkin ) != 'undefined' ) {

							this.Cell.innerHTML = '';
							this.CellLink = document.createElement('a');
							this.CellLink.innerHTML	= rw[col.db];
							this.CellLink.href      = 'javascript:;';
							this.Cell.appendChild(this.CellLink);
							this.CellLink.onclick  = function(){
								col.linkin.call(that,rw,this);
							}
						}

						if( typeof( col.linked ) != 'undefined' ) {
							this.Cell.innerHTML = '';
							this.CellLink = document.createElement('a');
							this.CellLink.innerHTML	= rw[col.db];
							this.CellLink.href  = col.linked.url + rw[col.linked.rel];
							this.Cell.appendChild(this.CellLink);
						}
					}

					if( typeof( col.handler ) == 'undefined' && typeof( col.linked ) == 'undefined'   && typeof( col.linkin ) == 'undefined'  ) {
						this.Cell.innerHTML	= typeof( col.valueFunction ) != 'undefined' ?  col.valueFunction.call( that, rw[col.db], rw ) : rw[col.db];
					}
					iterator++;
				});
			});
		 },


		 $.fn.createCheckBoxes = function( Row, rw, lastClass, rowclass,nogridClass ) {

		 	var that    = this;
			var valueid = this.opts.primary ? rw[this.opts.primary] : rw.id;


			//Td Elements
			this.Cell = document.createElement('td');
			this.Cell.id	      = 'rtd_'+rw.id;
			this.Cell.className	  = 'left' +' '+ lastClass + ' ' + rowclass;
			this.Cell.className	  = 'center' +' '+ lastClass + ' ' + rowclass + ' ' + nogridClass;
			this.Cell.style.width = '30px';
			Row.appendChild(this.Cell);

			//Input elements
			this.Chkbox = document.createElement('input');
			this.Chkbox.type        = 'checkbox';
			this.Chkbox.className	= 'chkbox';
			this.Chkbox.id 		    = that.Container.attr('id')+'_checkbox_'+valueid;
			this.Chkbox.value 		= valueid;
			this.Chkbox.onclick     = function(){
				if(this.checked){
					that.addToCollection(this.value,rw);
				}else{
					that.removeToCollection(this.value);
				}
			}
			this.Cell.appendChild(this.Chkbox);
		 },

		 $.fn.addToCollection = function(value,rw){
			this.collection.push(value);
			this.collection = this.uniq( this.collection );
			this.opts.onCheckBox.call(this,value,this.collection,rw);
		 },

		  $.fn.removeToCollection = function(value){
			var index = this.collection.indexOf(value);
			if (index > -1) {
			    this.collection.splice(index, 1);
			}
			this.opts.onCheckBox.call(this,value,this.collection);
		 },


		 /**
		  * @getRowId
		  */
		 $.fn.getRowId = function( idx ){
				var idx =  idx == null ? 1 : idx;
				var id  =  (this.Row.id).split('_');
				return id[idx];
		 },

		 /**
		  * @getRowElement
		  */
		 $.fn.getRowElement = function ( ){
			return this.Row;
		 },

	 	/**
		 * getAllCheckRows()
		 */
		 $.fn.getAllCheckRows = function(){

			var Boxes = new Array();
			$('#' + this.Container.attr('id') + ' .chkbox').each(function(i,chck){

				if( chck.checked ){
					Boxes.push( chck.value );
				}
			});
			return Boxes;
		 },


		 /**
		  * @name drawPages
		  *
		  * set the page request
		  */
	 $.fn.drawPages = function( pages ){

	 	var pages = pages.pages;

		var curr = pages.current_page > 1 ? ( parseInt( pages.current_page ) ) : pages.current_page;
		var that = this;
		var nav = '';
		var pageview   = 10;
		var interval   = Math.floor ( (pageview/2) );
		var total 	   = pages.last_page;
		var current    = parseInt(curr);

		var aux 	   = ( Math.round(current) - pageview ) + interval;

		var initpage   = current < pageview ?  0 : ( aux ) ;
		var maxpages   = current == total  ? total : initpage + pageview ;
		var maxpages   = maxpages > total ? total : maxpages;

		var aux2 	   =  maxpages - initpage ;
		var ninitpage   = initpage - ( pageview - aux2 ) ;
		var initpage   =  aux2 < pageview && ( total > pageview ) ? ninitpage : initpage ;

		 if( pages.last_page > 1 ) {

			  var prevpage = parseInt(curr) - 1;

			  if( parseInt(curr) != 1 && prevpage >= 0 ){
				  nav += '<li><a href="javascript:;" id="znavi_'+1+'" class="'+ classe +'">&laquo; &laquo; </a></li>';
			  }else{
				  nav += '<li><a href="javascript:;" id="znavi_'+1+'" class="banned">&laquo; &laquo; </a></li>';
			  }
			  if( parseInt(curr) != 1 && prevpage >= 0 ){
			  	 nav += '<li><a href="javascript:;" id="znavi_'+prevpage+'" class="'+ classe +'"><span class="glyphicon glyphicon-chevron-left"></span></a></li>';
			  }else{
				 nav += '<li><a href="javascript:;"  id="znavi_'+1+'" class="banned"><span class="glyphicon glyphicon-chevron-left"></span> </a></li>';
			  }

			 /////////////////////////////////////////////////

			 for( var o = initpage; o < maxpages; o++ ){
				 var classe =  curr == ( o + 1 )  ? 'active' : '';
				 var nextpage = parseInt(curr) + 1;
				 var ix = o + 1;
				 nav += '<li class="'+ classe +'"><a href="javascript:;" id="znavi_'+ix+'" >'+ ix +'</a></li>';
			 };
			  /////////////////////////////////////////////////
			  if( nextpage <= pages.last_page ){
			  	nav += '<li><a href="javascript:;" id="znavi_'+nextpage+'" > <span class="glyphicon glyphicon-chevron-right"></span></a></li>';
			  }else{
				  nav += '<li><a href="javascript:;" class="banned">&raquo;</a>';
			  }

			  if( nextpage <=  pages.last_page){
				  nav += '<li><a href="javascript:;" id="znavi_'+pages.last_page+'" class="'+ classe +'">&raquo; &raquo;</a></li>';
			  }else{
			  	  nav += '<li><a href="javascript:;" class="banned">&raquo; &raquo;</a></li>';
			  }

		 }

		 nav = '<ul class="pagination">'+ nav + '</ul>';

		 this.NavDiv.append( nav );

		 $('.pagination a').each(function( e , itm){
				if( typeof(itm.id) != 'undefined' && itm.id.length > 0 )
			 	$(this).click(function(){
			 	// console.log(this.id);
			 		that.setPage( (this.id).split('_')[1] );
			 	});
		 });
	 },

	 /**
	  * @name setPage
	  * set the page request
	  */
	 $.fn.setPage = function( p ){
		 this.page = p;
		 this.theLoad();
	 },
	 $.fn.drawSearch = function (){
	 },

	 /**
	  * @name doTheSort
	  * set the page request
	  */
	 $.fn.doTheSort = function(f){
		this.sortfield  =  $( '#hCellHeader_'+ (f.id).split('_')[1] ).val(); //sortColData.db;
		if( $(f).hasClass('sortableUp') ){
			this.sortby = 'asc';
		}else{
			this.sortby = 'desc';
		}
		this.theLoad();
		$.each(this.headerCellCollector,function(i,e){
			 if( f.id != e.id )
			 $(e).removeClass('sortableField').removeClass('sortableUp');
		});
		$(f).addClass('sortableField').toggleClass('sortableUp');
	 }

})(jQuery);
