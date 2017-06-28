Core_Export = Core.extend({
	page:1,
	maxRowPage : 0,
	init : function(){

	},
	/*@run
	---------------------------------*/
	run : function(){

		window.sycprocess = false;

		//refer to this object
		var that = this;

		//reset to start view
		//this.reset();

		//start actions
		this.setup();


	 /*--- Set Status table ---*/
		// this.setStatusTable();

	 /*--- Set Process table ---*/
		this.setProcessTable()

	 /*--- Load Proviers to select ---*/
		// this.loadProviders();


		/*--- set report ---*/
		// this.setReport();

		/*--- hide lists ---*/
		$('#list_container').hide();
	},
	/*@reset
	---------------------------------*/
	reset : function(){


	},
	setup : function(){
		/*--- refer to this object -- */
		var that = this;

	},



		 /*@loadPanel
		-----------------------------*/
		setProcessTable : function(){
				var that = this;
				window.processTable = $('#processTable').Table({
						 id : 'file',
						 width : '100%',
						 source:'/export/files',
						 rows:10,
						 searcher:true,
						 headers : [
								 {db:'id',name:'ID',classname:'left',width:'10%',valueFunction:function(i,o){
												return '<span class="label label-primary">'+o.id+'</span>';
										}},
										{db:'createdAt',name:'Creado',classname:'left',width:'10%',valueFunction:function(i,o){
												var theDate = new Date(o.createdAt);
											var d 	    = String(theDate.getDate()).length > 1 ? String(theDate.getDate()) : '0'+ String(theDate.getDate());
											var m 	    = String(theDate.getMonth()).length > 1 ? String(theDate.getMonth()) : '0'+ String(theDate.getMonth());
											var y 	    = theDate.getFullYear();

											var h 	    = String(theDate.getHours()).length > 1 ? String(theDate.getHours()) : '0'+ String(theDate.getHours());
											var i 	    = String(theDate.getMinutes()).length > 1 ? String(theDate.getMinutes()) : '0'+ String(theDate.getMinutes());
												return '<span class="label label-primary">'+ d+'-'+m+'-'+y+' '+h+':'+i+'</span>';
										}},
										{db:'src',name:'Archivo',classname:'left',width:'20%',valueFunction:function(i,o){
												if( o.status == o.qty ){
													return '<a href="http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.src+'" class="label-tooltip label label-success " data-toggle="tooltip" data-placement="right"  title="" ><span class="glyphicon glyphicon-link"></span> '+o.src+' </a>';
												}else{
													return o.src;
												}
										}},
										{db:'company_name',name:'Proveedor',classname:'left',width:'15%'},
										{db:'comment',name:'Proceso',classname:'left',width:'25%'},
										{db:'status',name:'Estatus',classname:'left',width:'20%',valueFunction:function(i,o){
											if( o.status < o.qty ){
												return o.status + ' de '+o.qty+' <div  id="" class="progresstrip"><div class="progress-inner"></div></div>';
											}else{
												return  o.status+' de '+o.qty+' Completado <div  id="" class="progresstrip"></div> ';
											}
										}},
										 {db:'status',name:'',classname:'left',width:'10%',valueFunction:function(i,o){
											if( o.status == o.qty ){
												return '<a href="#" class="label-tooltip label label-danger label-delete" data-toggle="tooltip" data-placement="right"  title="" ><span class="glyphicon glyphicon-link"></span> Eliminar </a>';
											}else{
												return '';
											}
										}},
								 ],
						onCompleteRequest : function(){
							$('.label-delete').click(function(){
								if(confirm('Estas seguro de eliminar este proceso? Los datos relacionados se perderan. ') ){
									console.log('deleting');
								}
							})
							that.loadSycProcess();
						}
				});
		},


		loadSycProcess : function(){
			var that = this;
			if( window.sycprocess ){
				 clearInterval(window.sycprocess);
			}

			window.sycprocess = setInterval(function(){
				window.processTable.theLoad();
			}, 20000 );
		}

});
