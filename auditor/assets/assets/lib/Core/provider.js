function goLocations(id){
	window.location.href = '/locations/#!/?provider='+id;
}


loadStats = function (list, provider_id){
	$.get('/dashboard/stats',{list:list,'provider':provider_id},function(resp){
		var data = resp.data[0];

		for( var columna in data){
			$('#'+columna).html(data[columna]);
		}
	});
}

Core_Provider = Core.extend({
	page:1,
	maxRowPage : 0,
	init : function(opts){
			this.opts = opts;
			this.id = this.opts.id;
			this.disable_edit = false;
	},
		/* init
	/*@run
	---------------------------------*/
	run : function(){

		//refer to this object
		var that = this;

		//reset to start view
		this.reset();

		//start actions
		this.setup();

		if( this.id != 0 ){
			//load panel
			this.load();
		}

		// loadRoles
		this.loadRoles()

		// setDataTable
		this.setDataTable();

		// setStatusTable
		this.setStatusTable();

		// setStatusTable
		this.setListSelect();

		// ------- set tab ---------------- //
		$('#mainpane-tab a').click(function (e) {
			e.preventDefault()
			$(this).tab('show')
		});

	},

	/*@run
	---------------------------------*/
	settings : function(){

		//refer to this object
		var that = this;

		//reset to start view
		this.reset();

		//start actions
		this.setup();

		//tabla no editable
		this.noedit();

	},

	/*@reset
	---------------------------------*/
	reset : function(){
		$('#modeForm').val('add');
		$('#userid').val(0);
		$('#btDeleteProvider').hide();
		$('#btNewProvider').hide();
		$('#formUploadContainer').hide();
		$('#progressNumber').hide();
		$('#progressbar').hide();

		$('#formUser #suppliersGroup').hide();
		$('#formUser #btDeleteUser').hide();
		$('#formUser #btNewUser').hide();

		document.getElementById('formProvider').reset();


	},
	setup : function(){
		/*--- refer to this object -- */
		var that = this;

		/*--- hide loader image -- */
		$('.process_loader, .alert').hide();

		/*--- Provider New Action -- */
		$('#btNewProvider').click(function(){
			// if(confirm('Realmente deseas salir de este formulario sin guardar?')){
				that.reset();
			// }
		});

		/*--- Provider Delete Action -- */
		$('#btDeleteProvider').click(function(){
			if(confirm('Realmente deseas eliminar este Proveedor?')){
				 that.deleteProvider();
			}
		});

		/*--- Provider Form Action -- */
		$('#formProvider').submit(function(){
				that.sendForm();
				return false;
		});

		/*--- User Form Action -- */
		$('#formUser').submit(function(){
				that.sendFormUser();
				return false;
		});

		 /*--- Provider Form Action -- */
		$('#uploadLocation').submit(function(){
				that.uploadFile();

				return false;
		});

		/*--- Provider Form Action -- */
		$('#role').change(function(){
				if( this.value == 'supplier'){
						$('#suppliersGroup').show();
						$('#supplier_id').attr('disabled',false).attr('required',false);
						$('#updatePass').attr('checked', false);
				}
		});

		 /*--- User New Action -- */
		$('#formUser #btNewUser').click(function(){
			// if(confirm('Realmente deseas salir de este formulario sin guardar?')){
				that.resetUser();
			// }
		});

		/*--- User Delete Action -- */
		$('#formUser #btDeleteUser').click(function(){
			if(confirm('Realmente deseas eliminar este usuario?')){
				 that.deleteUser();
			}
		});
	},
	load : function(){

		var that = this;
		$.get('/providers/get/',{id:this.id},function(r){
					if(r.error){
						alert(r.msg);
					}else{
						//reset first
						that.reset();

						//data from db
						for(x in r){
							$('#'+x).val(r[x]);
						}


						$('#supplier_id').val(r.id)

						window.usersTableByProvider = $('#usersTableByProvider').Table({
							 id : 'users',
							 width : '100%',
							 source:'/providers/users',
							 params: { provider_id: r.id },
							 rows:20,
							 searcher:true,
							 primary:'_id',
							 headers : [
								{   db:'full_name',  name:'Nombre',  classname:'left',  width:'25%'
									, linkin:function(doc){
											$.get('/users/get/',{ id: doc.id},function(r){
													if(r.error){
														alert(r.message);
													}else{
														//data from db
														for(x in r){
															$('#formUser #'+x).val(r[x]);
														}
														if( r.role != '1'){

															$('#formUser #suppliersGroup').show();
															$('#formUser #supplier_id').attr('disabled',false).attr('required',false);
															$('#formUser #updatePass').attr('checked', false);
															$('#formUser #supplier_id').val(r.supplier_id);
														}

														$('#formUser').append( $('<input type="hidden" id="userid" name="user[id]" value="0">') )

														$('#formUser #password').attr('disabled',true);
														$('#formUser #btDeleteUser').show();
														$('#formUser #btNewUser').show();
														$('#formUser #modeForm').val('update');

														$('#formUser #userid').val(r.id)
														// window.scrollTo(0,0);

														$('#formUser #password').attr('disabled',true);

														//change panel;
														$('#mainpane-tab a:last').tab('show');

													}
											 });

											return document.location.href = 'javascript:void(null)';
										}
								},

								{db:'email',name:'Correo',classname:'left', width:'10%'},

								{db:'role_name',name:'Rol',classname:'center', width:'10%',valueFunction : function(i,o){
										switch( o.role_name ){
											case 'auditor':
												var str = '<span class="label label-warning">Proveedor Auditor</span>';
											break
											default:
												var str = '<span class="label label-primary">Proveedor Publicitario</span>';
											break
										}
										return str;
								}},

								{db:'status',name:'Estatus',classname:'center',width:'10%',valueFunction:function(i,o){
											switch( o.status ){
												case 0:
													var str = '<span class="label">Sin Activar</span>';
												break
												case 1:
													var str = '<span class="label label-success">Activo</span>';;
												break
												case 2:
													var str = '<span class="label label-danger">Suspendido</span>';
												break
											}

										return str;
								}}
							 ],
								onCompleteRequest : function(){
									$('.label-tooltip').tooltip();
								}
					});


						$('#formUploadContainer').show();
						$('#password').attr('disabled',true);
						$('#btDeleteProvider').show();
						$('#btNewProvider').show();
						$('#modeForm').val('update');
						$('#userid').val(r.id)

					}

		 });

	},

	deleteProvider : function(){
		var that = this;
		$.post('/providers/delete',{id:$('#userid').val()},function(r){
			//that.reset();
			window.location.href = '/providers';
		});
	},

	loadRoles : function(){

		var that = this;
		$.get('/users/roles_for_provider/',function(roles){
				var select = document.getElementById('role');
				for( x in roles ){
						var doc = roles[x];
						var opt = document.createElement("option");
						 opt.textContent = doc.name;
						 opt.value = doc.id;
						 select.appendChild(opt);
				}
		});
	},

	sendForm : function(){
		var that = this;
		$('.process_loader').show();
		var data = $('#formProvider').serialize();
		$.post('/providers/save',data,function(resp){
				$('.process_loader').hide();
				$('.alert').addClass('alert-success').html('La información fue guardada correctamente.').showAlert();
				if( $('#modeForm').val() == 'add' ){
					 that.id = resp.data.id;
					 //console.log(resp)
					 that.load();
				}
		});

	},

	sendFormUser : function(){
		var that = this;
		var data = $('#formUser').serialize();
		$.post('/users/save',data,function(resp){

				if( resp.code == 101){
						alert(resp.msg);
				}else{

					window.usersTableByProvider.theLoad();
					if( $('#formUser #modeForm').val() == 'add' ){
						alert('El usuario ha sido creado!');
					}else{
						alert('El usuario ha sido actualizado!');
					}
						that.resetUser();
						$('#mainpane-tab a:first').tab('show');

				}
		});

	},
	resetUser : function(){
		$('#formUser #modeForm').val('add');
		$('#formUser #userid').remove();
		$('#formUser #btDeleteUser').hide();
		$('#formUser #password').attr('disabled',true);
		$('#formUser #updatePass').attr('checked', false);
		$('#formUser #btNewUser').hide();
		$('#formUser #suppliersGroup').hide();
		$('#formUser #supplier_id').attr('disabled',true);
		document.getElementById('formUser').reset();
	},

	deleteUser : function(){
		var that = this;
		$.post('/users/delete',{ id: $('#formUser #userid').val() },function(r){
			that.resetUser();
			$('#mainpane-tab a:first').tab('show');
			window.usersTableByProvider.theLoad();
		});
	},

	 /*@loadPanel
		-----------------------------*/
		setDataTable : function(){

				var that = this;
				window.locationTable = $('#locationTable').Table({
						 id : 'users',
						 width : '100%',
						 source:'/providers/locations-table',
						 rows:10,
						 checkbox: that.isAdmin() ? true : false,
						 params:{id:that.id},
						 searcher:true,
						 sortable:true,

						 primary:'id',
						 headers : [{db:'uuid',name:'Clave única',classname:'left',width:'25%',valueFunction:function(i,o){
											var address = o.street+','+o.neighbor+','+o.city+','+o.state+'. CP.'+o.zip;

											return '<span class="label label-danger label-tooltip" data-toggle="tooltip" data-placement="right"  title="ID único del Sistema" ><span class="glyphicon glyphicon-link"></span> '+o.uuid+'</span>';
									}},
									{db:'type',name:'Medio',classname:'left',width:'15%',valueFunction:function(i,o){
											return '<span class="label label-default">'+o.type+'</span>';
									}},
									{db:'version',name:'Version',classname:'left',width:'15%'},
									{db:'code',name:'Código',classname:'left',width:'15%',valueFunction:function(i,o){
											var address = o.street+','+o.neighbor+','+o.city+','+o.state+'. CP.'+o.zip;
											var address = address ==  null ? '' : address;
											return '<a href="/'+o.segment+'s/view/'+o.id+'" class="label-tooltip label label-danger" data-toggle="tooltip" data-placement="right"  ><span class="glyphicon glyphicon-link"></span> '+o.code+'</a>';
									}},
									{db:'license_plate',name:'Placa/Permiso',classname:'left',width:'15%',valueFunction:function(i,o){

										var license_plate = o.license_plate == '' ? false : o.license_plate;
										var numid   = o.numid == '' ? false : o.numid;
										var license  =  license_plate||numid;

										if( license ){
											return '<a href="/'+o.segment+'s/view/'+o.id+'" class="label-tooltip label label-danger" data-toggle="tooltip" data-placement="right"  ><span class="glyphicon glyphicon-link"></span> '+license+'</a>';
										}else{
											return '';
										}
									}},

									{db:'type',name:'Acción',classname:'left',width:'30%',valueFunction:function(i,o){
											return '<span class="label label-danger delete_location" data-id="'+o.id+'" data-uuid="'+o.uuid+'" style="cursor:pointer" ><span class="glyphicon glyphicon-trash"></span> Eliminar </span>';
									}},
								 ],
						onCompleteRequest : function(){

								$('#location_counter').html(this.serverData.count);
								$('.label-tooltip').tooltip();
								$('.delete_location').click(function(){
									var id = $(this).attr('data-id');
									var uuid = $(this).attr('data-uuid');
									if(confirm('Deseas realmente eliminar este espacio publicitario?, si existen Estatus relacionados se perderan!')){
										$.post('/providers/delete-space',{uuid:uuid,id:id},function(response){
											 window.locationTable.theLoad();
											alert('El registro ha sido eliminado correctamente!');
										});
									}
								});
						}

				});
		},

	setDataGrid : function(){
		var that = this;
		window.providersTable = $('#providersTable').Table({
				 id : 'users',
				 width : '100%',
				 source:'/providers/table',
				 rows:100,
				 searcher:true,
				 primary:'_id',
				 headers : [ {db:'uuid',name:'ID',classname:'left',width:'15%',valueFunction:function(i,o){
											var address = o.street+','+o.neighbor+','+o.city+','+o.state+'. CP.'+o.zip;
											return '<span class="label label-danger label-tooltip" data-toggle="tooltip" data-placement="right"  title="ID único del Sistema" ><span class="glyphicon glyphicon-link"></span> '+o.uuid+'</span>';
									}},
							 {db:'name',name:'Nombre',classname:'left',width:'40%',linkin:function(doc){
								 return document.location.href = '/providers/view/'+doc.id;
							}},
							{db:'counter_locations',name:'Espacios Fijos Contratados',classname:'center',width:'10%', valueFunction:function(i,o){
									return '<a href="/providers/view/'+o.id+'">'+ o.counter_locations +'</a>';
							}},
							{db:'counter_mobile',name:'Espacios Móviles Contratados',classname:'center',width:'10%', valueFunction:function(i,o){
									return '<a href="/providers/view/'+o.id+'">'+ o.counter_mobile +'</a>';
							}},
							{db:'status_counter',name:'Testigos',classname:'center',width:'10%', valueFunction:function(i,o){
									return '<a href="/providers/view/'+o.id+'">'+ o.status_counter +'</a>';
							}},
							{db:'status_counter',name:'Most Anomalías',classname:'center',width:'10%', valueFunction:function(i,o){
									return '<a href="/providers/view/'+o.id+'">'+o.anom_counter+'</a>';
							}}
					 ],
			onCompleteRequest : function(){
					$('.label-tooltip').tooltip();
			}
		});

	},

	uploadFile:function() {

		$('#progressNumber').html('').fadeIn();
		$('#progressbar').css('width','0px').fadeIn();


		var xhr = new XMLHttpRequest();
		var fd = new FormData(document.getElementById('uploadLocation'));

		/* event listners */
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", uploadComplete, false);
		xhr.addEventListener("error", uploadFailed, false);
		xhr.addEventListener("abort", uploadCanceled, false);

		/* Be sure to change the url below to the url of your upload server side script */
		xhr.open("POST", "/locations/upload");
		xhr.send(fd);

	},


 noedit : function(){

		var that = this;
		$.get('/providers/get/',{id:this.id},function(r){
					if(r.error){
						alert(r.msg);
					}else{
						//reset first
						that.reset();

						//data from db
						for(x in r){
							$('#'+x).val(r[x]);
						}

						$('#supplier_id').val(r.id)

						window.usersTableByProvider = $('#usersTableByProvider').Table({
							 id : 'users',
							 width : '100%',
							 source:'/providers/users',
							 params: { provider_id: r.id },
							 rows:20,
							 //searcher:true,
							 primary:'_id',
							 headers : [
								{   db:'full_name',  name:'Nombre',  classname:'left',  width:'45%'},

								{db:'email',name:'Correo',classname:'left', width:'30%'},
								{db:'status',name:'Estatus',classname:'center',width:'15%',valueFunction:function(i,o){
											switch( o.status ){
												case 0:
													var str = '<span class="label">Sin Activar</span>';
												break
												case 1:
													var str = '<span class="label label-success">Activo</span>';;
												break
												case 2:
													var str = '<span class="label label-danger">Suspendido</span>';
												break
											}

										return str;
								}}
							 ],
								onCompleteRequest : function(){
									$('.label-tooltip').tooltip();
								}
					});


						$('#formUploadContainer').show();
						$('#password').attr('disabled',true);
						$('#btDeleteProvider').show();
						$('#btNewProvider').show();
						$('#modeForm').val('update');
						$('#userid').val(r.id)

					}

		 });
	},

	setStatusTable:function(){
	 var that = this;
     window.statusTable = $('#lastTable').Table({
             id : 'lasts',
             width : '100%',
             source:'/dashboard/last-status',
             rows:10,
             searcher:true,
             sortable:true,

             params:{provider:this.id},
             headers :[
                    {db:'uuid',name:'Folio',classname:'left',width:'15%',valueFunction:function(i,o){
                      var url = "/"+o.table+"/view/"+o.id_object;
                      return '<span class="label label-success"><a href="'+url+'" class="white">'+o.uuid+'</a></span>';
                    }},
                    {db:'code',name:'Código',classname:'left',width:'10%',valueFunction:function(i,o){
                      var url = "/"+o.table+"/view/"+o.id_object;
                      var code = o.code == '' &&  o.license_plate != null ? o.license_plate : o.code;
                      return '<span class="label label-primary"><a href="'+url+'" class="white">'+code+'</a></span>';
                    }},
                    {db:'createdAt',name:'Fecha',classname:'left',width:'10%',valueFunction:function(i,o){
                        var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
                        var  tdate = new Date(o.createdAt);
                        var  date = tdate.getDate()+'/'+ months[tdate.getMonth()]+'/'+tdate.getFullYear();
                        return '<span class="label label-primary">'+date+'</span>';
                    }},
                    {db:'status_label',name:'Estatus Actual',classname:'left',width:'10%',valueFunction:function(i,o){
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
                    {db:'status_label',name:'Tipo de Reporte',classname:'left',width:'10%'},
                    // {db:'provider_name',name:'Proveedor',classname:'left',width:'20%'},
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
                          	var snapsh = snapshots[x].toLowerCase();
                          	if( snapsh.indexOf('tmb_') || snapsh.indexOf('tmb_tmb_') )
                var src = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_tmb_'+snapsh;
                var url = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_'+snapsh;
                if(  snapsh.length > 0 ){
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
                // console.log(this.serverData.count);
                $('#status_counter').html(this.serverData.count);

              // that.deleteStatus();
            }
        });
	},

	setListSelect:function(){

		var that = this;
		var last_list_id = 0;
		$.get('/lists/all/',{provider:this.opts.id},function(source){
			var data = source.data;
			$('#listid').empty();
			$('#listid').append('<option value="0">Selecciona un listado</option>');
			console.log( data.length )
			for( x in data ){
					var selected =  x == (data.length-1) ? 'selected' : '';
					$('#listid').append('<option value="'+data[x].id+'" '+selected+' data-src="'+data[x].src+'"> '+ data[x].name +'</option>');
					last_list_id = data[x].id;
			}

			loadStats( last_list_id  , that.id);

		});

		/*--- On Change List Event  ---*/
		$('#listid').change(function(){
			var list   	 = $('#listid').val();
			window.locationTable.opts.params = { id:that.id,list:list };
			window.locationTable.setPage(1);

			window.statusTable.opts.params = { provider:that.id,list:list };
			window.statusTable.setPage(1);

			loadStats( list  , that.id);
		});

		// $('#listid').change();
	}


});
