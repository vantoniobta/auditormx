
Number.prototype.format = function(n, x) {
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
		return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


function exporter(){

	var provider = $('#provider').val();
	var state    = $('#state').val();
	var list     = $('#list').val();
	$.get('/export/list', window.locationTable.opts.params ,function(o){
		if( o.code == 0){
			alert('Se ha iniciado un proceso para exportar la Lista');
			window.location.href  = '/export';
		}else{
			alert('Ha ocurrido un error al tratar de exportar la lista seleccionada');
		}
	});
}

Core_Location = Core.extend({

		init : function(opts){
			this.opts 		= opts;
			this.id   		= this.opts.id;
			this.uuid 		= this.opts.uuid;
			this.supplier_id 	= this.opts.supplier;
		},
		/* init
		------------------------------ */
		run : function(id){

			 this.setup();
			 this.getLastImages();
			 this.load();
			 this.addImpButon();
			 this.uploadReport();

		},
		/* init
		------------------------------ */
		index : function(id){

			var that = this;

			/*--- create-list-container ---*/
			$('#filters, #lists-container, #lists-container-footer, #create-list-container,#list-loader-container, .process_loader ').hide();



			/*--- Set actions for filters ---*/
			$('#list, #campaing,#provider,#type,#state,#active,#state').change(function(){

				var provider = $('#provider').val();
				var type     = $('#type').val();
				var state    = $('#state').val();
				var list     = $('#list').val();
				var state     = $('#state').val();


				switch(this.id){
					case 'list':
						that.loadTypes();
						that.loadStates();
						break;
					case 'provider':
						that.loadTypes();
						that.loadStates();
						break;
					case 'type':
						that.loadStates();
						break;
					case 'state':
						break;


				}


				window.locationTable.opts.params = { state:state, provider:provider,type:type,list:list };
				window.locationTable.setPage(1);
				$('#upload_supplier_id').val(provider);
				$('#upload_type_id').val(type);
				$('#upload_list_id ').val(list);
			});

			/*--- On Change List Event  ---*/
			// $('#list').change(function(){
			// 	var provider = $('#provider').val();
			// 	var state    = $('#state').val();
			// 	var list   	 = $('#list').val();

			// 	$('#upload_list_id ').val(list);
			// 	window.locationTable.opts.params = { state:state, provider:provider,list:list };
			// 	window.locationTable.setPage(1);

			// 	var src = $(this).find(':selected').attr('data-src');
			// 	var src = src == 'null' ? ' No disponible ' : src;
			// 	$('#attach-file').html('');
			// });

			/*--- This for hide upload forms, upload is just for suppliers ---*/
			if(  ! that.isAdmin()  ){
				$('#upload-location-container').hide();
				$('#filters').show();
				$('#providers-select').hide();


			}

			/*--- Show role admin ---*/
			if( that.isAdmin() ){

				/*--- Load Proviers to select ---*/
				this.loadProviders();

				/*--- Load Types Media to select ---*/
				this.loadTypes();

				/*--- Load Types Media to select ---*/
				this.loadStates();

				$('#lists-container, #lists-container-footer, #filters').show();

			}

			this.loadLists(function (argument) {
				that.setDataTable();
				that.createCSV();
				that.setUploadForm();
			});

			$('#btn-export').click(exporter).hide();


		},
		/*@setup
		-----------------------------*/
		setup : function(){
				// set status table
				this.setStatusTable();
				// form reset
				document.getElementById('form-upload-report').reset();

		},
		/*@setup
		-----------------------------*/
		load : function(){
				var that = this

				$('#container-page').hide();
				$.get('/locations/get',{id:this.id},function(data){
						for(var x in data){
										$('#'+x).html(data[x]);
						}

						$('#price').html( numeral(data.price).format('$0,0.00') );

						$('#ubication').html(data.city+','+data.state)
						that.setMap(data.lng,data.lat);

						$('#container-page').show();
				})
		},

		setMap : function(lng,lat){
				 $('#map_canvas').height( '342px' );
					var myOptions = {
							zoom:5,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							center: new google.maps.LatLng(22.719507,-102.324838),
							mapTypeControl: false
						};
						geocoder = new google.maps.Geocoder();
						map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
		},
		/*@loadPanel
		-----------------------------*/
		setDataTable : function(){
				var that = this;
				window.locationTable = $('#locationTable').Table({
				 id : 'users',
					 width : '100%',
					 source:'/locations/table',
					 rows:10,
					 // checkbox: that.isAdmin() ? true : false,
					 params:{ list:$('#list').val(), providers:$('#provider').val(), state:$('#state').val() },
					 searcher:true,
					 sortable:true,
					 primary:'id',
					 headers : [{db:'code',name:'Identificador',classname:'left',width:'15%',valueFunction:function(i,o){
										var license_plate 	= String(o.license_plate).length == 0 ? false : o.license_plate;
										var numid 			= String(o.numid).length == 0 ? false : o.numid;
										var code 			= String(o.code).length == 0 ? false : o.code;
										var id    			= code||license_plate||numid  ;

										return '<a href="/locations/view/'+o.id+'" class="label-tooltip label label-danger" data-toggle="tooltip" data-placement="right"  title="" ><span class="glyphicon glyphicon-link"></span> '+id+'</a>';
									}},
									{db:'last_status',name:'Estatus',classname:'left',width:'15%',valueFunction:function(i,o){

										switch( o.last_status ){
											case '0':
												var str = '<span class="label label-success">Sin problemas</span>';
											break
											case '11':
												var str = '<span class="label label-success">Testigo</span>';
											break
											case '12':
												var str = '<span class="label label-success">Reparación</span>';
											break
											case '13':
											var str = '<span class="label label-success">Penalización</span>';
											break;
											case '14':
												var str = '<span class="label label-success">Testigo mensual</span>';
											break
											case null:
												var str = '<span class="label label-default">Sin reportes</span>';
											break
											default :
												var str = '<span class="label label-danger">Anomalía</span>';
											break
										}
									return str;
									}},
									{db:'name',name:'Proveedor',classname:'left',width:'30%'},
									{db:'version',name:'Versión',classname:'left',width:'15%'},
									{db:'type',name:'Medio',classname:'center',width:'15%',valueFunction:function(i,o){
											return '<span class="label label-default " data-toggle="tooltip" data-placement="left"  title="Tipo de Medio" ><span class="glyphicon glyphicon-link"></span> '+o.type+'</span>';
									}}
							 ],
					onStartRequest : function(){
						//this.opts.params.page = 1;
						$('#btn-export').hide();
					},
					onCompleteRequest : function(){
						$('.label-tooltip').tooltip();
						$('#table-counter').html( this.datafull.pages.count.format(0) +' registros');

						$('#btn-export').show();
						 /*--- Load States to select ---*/
						// this.loadStates();

						 /*--- Load States to select ---*/
						// this.loadTypes();

					},

					onCheckBox : function(value,data){
						//console.log(value,data);
					}
			});
		},

		setUploadForm :function(){

			var that = this;
			$('#form-upload').upload({
					input:'csvfile',
					source:'/locations/upload',
					wait:true,
					onBeforeSend: function(){
						if( $('#provider').val() == '*'){
							// this.reset();
							alert('Debes seleccionar un proveedor para subir un listado!');
							this.ok = false;
						}else{
							if( $('#modelist').val() == 'update' && $('#list').val() == '0' ){
								this.ok = false;
								alert('Debes seleccionar un listado para actualizar');
							}else{
								this.ok = true;
							}
						}
					},
					onComplete: function(response){
						if(response.code == 0 ){
							alert('El archivo excel ha sido completado correctamente ');
						}else{
							alert(response.msg+'. Revisa los datos de tu archivo.');
						}

						document.getElementById('form-upload').reset();
					}
			});
		},

		 /*@loadPanel
		-----------------------------*/
		setStatusTable : function(){
				var that = this;
				window.statusTable = $('#statusTable').Table({
						 id : 'users',
						 width : '100%',
						 source:'/locations/status',
						 rows:20,
						 params:{id:that.uuid},
						 searcher:true,
						 sortable:true,
						 primary:'_id',
						 headers :[
										{db:'uuid',name:'Folio',classname:'left',width:'15%',valueFunction:function(i,o){
											var url = "/"+o.table+"/view/"+o.id_object;
											return '<span class="label label-success"><a href="'+url+'" class="white">'+o.uuid+'</a></span>';
										}},
										{db:'createdAt',name:'Fecha',classname:'left',width:'10%',valueFunction:function(i,o){
												var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
												var  tdate = new Date(o.createdAt);
												var  date = tdate.getDate()+'/'+ months[tdate.getMonth()]+'/'+tdate.getFullYear();
												return '<span class="label label-primary">'+date+'</span>';
										}},
										{db:'status_label',name:'Estatus Actual',classname:'left',width:'15%',valueFunction:function(i,o){
												var msg = o.message ? o.message : 'Sin comentarios ';
													switch( o.status ){
														case '-1':
															var str = '<span class="label label-default status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >Sin Reporte</span>';
														break
														case '0':  case '11': case '14':
															var str = '<span class="label label-success status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >Correcto</span>';
														break
														case '12':
															var str = '<span class="label label-warning status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >Correcto</span>';
														break
														case '13':
															var str = '<span class="label label-warning status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >Penalización</span>';
														break
														default:
														var str = '<span class="label label-danger status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >Anomalía</span>';
														break;
													}
												return str;
										}},
										{db:'status_label',name:'Tipo de Reporte',classname:'left',width:'15%'},
										{db:'reported_by',name:'Reportado por',classname:'left',width:'15%',valueFunction:function(i,o){

												var msg = o.message ? o.message : 'Sin comentarios ';
		return '<span class="status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >'+o.user_name+' '+o.reported_by+'</span>';
										}},
											{db:'snapshots',name:'Fotos',classname:'left',width:'15%',valueFunction:function(i,o){
											if( o.snapshots ){
												var str  = '';
												var code = o.code == '' ? o.license_plate : o.code;
												var snapshots = o.snapshots.split(',');
													for(x in snapshots ){

													 var snaptsh = snapshots[x].toLowerCase();
													if( snaptsh.indexOf('tmb_') || snaptsh.indexOf('tmb_tmb_') )
								var src = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_tmb_'+snaptsh;
								var url = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_'+snaptsh;
								if( snaptsh.length > 0 ){
								str += '<a data-lightbox="' + o.uuid + ' " data-title="'+ o.code  +' - '+ o.provider_name + ' " id="lastimage_link_' + o.uuid + '" href="' + url + '" style="float:left; display:block"> <img  alt="' + code  +' - '+ o.provider_name + ' " class="img-thumbnail" id="lastimage_' + o.uuid + '" src="' + src + '" width="20px" height="20px"> </a>';

								}
							}

												return str;
											}else{
												return '';
											}
										}},
										{db:'snapshots',name:'Acción',classname:'left',width:'5%',valueFunction:function(i,o){
											if ( that.isAdmin() ){
												return  ' <a href="/locations/status-delete/' + o.uuid + '" class="label-tooltip label label-danger delete-status" data-toggle="tooltip" data-placement="right" title="" data-original-title="">  <span class="glyphicon glyphicon-link"></span> Borrar </a>'
											}else{
												return '';
											}
										}}
								 ],
						onCompleteRequest : function(){
							$('.status_tooltip').tooltip();
							that.deleteStatus();
						}
				});


		},

		deleteStatus: function(){
			var that = this;

			$('a.delete-status').click(function(e){
				e.preventDefault();
				if ( confirm("¿Esta seguro de eliminar este estatus?") == true) {
					var url = $(this).attr('href')
					$.get(url, function(response){

						if( response.code != 200){
							alert(response.msg)
							window.statusTable.theLoad();
							that.getLastImages()
						}
					})
				}

				return false
			})
		},

		loadLists: function(cb){

			$.get('/lists/all',function(source){
				var data = source.data;
						$('#list').empty();
						$('#list').append('<option value="0">Selecciona una lista</option>');

						for( x in data ){
								var selected =  x == (data.length-1) ? 'selected ' : '';
								$('#list').append('<option value="'+data[x].id+'" '+selected+' > '+ data[x].name +'</option>');
						}

						if( typeof(cb) !='undefined'){
							cb();
						}
			});
		},

		loadProviders : function(){

			$.get('/providers/user',function(source){
				var data = source.data;

						for( x in data ){
								$('#provider').append('<option value="'+data[x].id+'">'+ data[x].name +'</option>');
						}

			});
		},

		loadTypes : function(){

			var provider = $('#provider').val();
			var list = $('#list').val();
			var url_types = '/locations/typesuser?provider='+ provider +'&list='+ list;

			$('#type')
				.find('option')
				.remove()
				.end()
				.append('<option value="*">Todos</option>')
				.val('*')
			;

			$.get(url_types,function(source){
				var data = source.data;

				for( x in data ){
					$('#type').append('<option value="'+data[x].id+'">'+ data[x].name +'</option>');
				}

			});
		},

		loadStates : function(){


			var provider = $('#provider').val();
			var list = $('#list').val();
			var type = $('#type').val();
			var url_state = '/locations/state?provider='+ provider +'&list='+ list + '&type='+ type;

			$('#state')
				.find('option')
				.remove()
				.end()
				.append('<option value="*">Todos</option>')
				.val('*')
			;



			$.get(url_state ,function(data){

				for( x in data.data ){
					if (data.data[x].name.trim()){
						name = data.data[x].name;
					}
					else {
						name = 'Sin descripcion';
					}
					$('#state').append('<option value="'+ data.data[x].id+'">'+ name +'</option>');
				}

			});
		},

		createCSV: function(){
			$('#down-csv').click(function(e){
				console.log('asas')
				e.preventDefault()
					$.post('locations/csv', { list_id: $('#list').attr('value') }, function(data){
						console.log(data)
					})
			})

		},
		addImpButon: function(){
			var imp_buton = " <button onclick='printPage()' class='btn btn-sm btn-default pull-right' id='printPage' > \
													<i class='fa fa-print'></i>  Imprimir \
												</button> "

			$('#ribbon').append($(imp_buton))
		},

		uploadReport :function(){
			var that = this;
			$('#form-upload-report').upload({
					input:'images_upload',
					source:'/locations/report',
					list:'file_list_images_upload',
					max: 6,
					onComplete: function(res){
							document.getElementById('form-upload-report').reset();
							 window.statusTable.theLoad();
							 that.getLastImages();
							 alert('El Estatus se ha agregado correctamente!.');
					},
					onCancel: function(res){
						alert('No han seleccionado archivos para subirlos')
					}
			});
		},

		getLastImages :function(){
			$.get('/locations/last-status',{id:this.uuid},function(r){
				if (r.data){
					//if(r.data.length > 0 ){
						var html_el = "";
						for(var x in r.data){

							if( !r.data[x].indexOf('tmb_') )
							if((x+1) % 3 == 1) html_el += '<div class="row site-images">';

							var url = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+r.dir+'_'+ String(r.data[x]).toLowerCase();
							html_el += '\
								<div class="col-md-4"> \
									<a data-lightbox="siteImages" data-title="1" id="lastimage_link_' + x + '" href="' + url + '"> \
										<img  alt="1" class="img-thumbnail" id="lastimage_' + x + '" src="'+url+'"> \
									</a> \
								</div>';

							if((x+1) % 3 == 0) html_el += '</div>';

						}

						$('#images-pane .col-md-12').html(html_el);

				 // }

				}

			})
		}

});
