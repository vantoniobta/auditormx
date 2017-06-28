Core_User = Core.extend({
  page:1,
  maxRowPage : 0,
  init : function(){

  },
  /*@run
  ---------------------------------*/
  run : function(){

    //refer to this object
    var that = this;

    //reset to start view
    this.reset();

    //start actions
    this.setup();

    //load panel
    this.setDataGrid();
  },
  /*@reset
  ---------------------------------*/
  reset : function(){

	  $('input:checkbox').attr('checked', false);

    $('#modeForm').val('add');
    $('#userid').val(0);
    $('#btDeleteUser').hide();
    $('#password').attr('disabled',true);
    $('#updatePass').attr('checked', false);
    $('#btNewUser').hide();
    $('#suppliersGroup').hide();
    $('#supplier_id').attr('disabled',true);
    document.getElementById('formUser').reset();
  },

  setup : function(){
    /*--- refer to this object -- */
    var that = this;

    /*--- suppliers  user info-- */
    that.loadSuppliers();


	  /*-- provider - permisions --*/
	  that.loadProviders();


	  /*-- types  --*/
	  that.loadTypes();

    //---------- load roles -----------//
    this.loadRoles();

    /*--- User New Action -- */
    $('#btNewUser').click(function(){
      // if(confirm('Realmente deseas salir de este formulario sin guardar?')){
        that.reset();
      // }
    });

    /*--- User Delete Action -- */
    $('#btDeleteUser').click(function(){
      if(confirm('Realmente deseas eliminar este usuario?')){
         that.deleteUser();
      }
    });

    /*--- User Form Action -- */
    $('#formUser').submit(function(){
        that.sendForm();
        return false;
    });

    /*--- Supplier Form Action -- */
    $('#role').change(function(){
        if( this.value != '1' || this.value != '2'){
            $('#suppliersGroup').show();
            $('#supplier_id').attr('disabled',false).attr('required',false);
            $('#updatePass').attr('checked', false);
        }
    });

    /*--- Enable Password Input Form -- */
    $('#updatePass').click(function(){
        if( this.checked ){
          $('#password').attr('disabled',false);
        }else{
          $('#password').attr('disabled',true);
        }
    });

    // ------- set tab ---------------- //
    $('#mainpane-tab a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })

  },
  deleteUser : function(){
    var that = this;
    $.post('/users/delete',{id:$('#userid').val()},function(r){
      that.reset();
      window.usersTable.theLoad();
    });
  },
  sendForm : function(){
    var that = this;
    var data = $('#formUser').serialize();
    $.post('/users/save',data,function(resp){

        if( resp.code == 101){
            alert(resp.msg);
        }else{

          window.usersTable.theLoad();
          if( $('#modeForm').val() == 'add' ){
            that.reset();
            alert('El usuario ha sido creado!');
          }else{
            alert('El usuario ha sido actualizado!');
            $('#mainpane-tab a:first').tab('show');
          }

        }
    });

  },
  setDataGrid : function(){
    var that = this;
    window.usersTable = $('#usersTable').Table({
         id : 'users',
         width : '100%',
         // title : 'Usuarios',
         source:'/users/table',
         rows:100,
         searchmessage: 'Buscar por nombre o email',
         searcher:true,
         sortable:true,
         primary:'_id',
         headers : [{db:'full_name',name:'Nombre',classname:'left',width:'25%',linkin:function(doc){

                         $.get('/users/get/',{id:doc.id},function(r){
                            if(r.error){
                              alert(r.message);
                            }else{

                              //reset first
                              that.reset();

                              //data from db
                              for(x in r){
                                $('#'+x).val(r[x]);
                              }
                              if( r.role != '1'){

                                $('#suppliersGroup').show();
                                $('#supplier_id').attr('disabled',false).attr('required',false);
                                $('#updatePass').attr('checked', false);
                                $('#supplier_id').val(r.supplier_id);
                              }

                              $('#password').attr('disabled',true);
                              $('#btDeleteUser').show();
                              $('#btNewUser').show();
                              $('#modeForm').val('update');
                              $('#userid').val(r.id)
                              // window.scrollTo(0,0);

                              $('#password').attr('disabled',true);

                              //change panel;
                              $('#mainpane-tab a:last').tab('show');




								$.get('/users/getusertypes/',{'user_id':doc.id},function(r){
									if(r.error){
										alert(r.message);
									}else{
										for (doc in r){
											console.log(r[doc]);
											$('input:checkbox[value="' + r[doc].type + '"]').attr("checked", true);
										}




									}
								});


								$.get('/users/getuserproviders/',{'user_id':doc.id},function(r){
									if(r.error){
										alert(r.message);
									}else{
										//console.log(r);
										for (doc in r){
											console.log(r[doc]);
											$('#provider_'+ r[doc].provider_id).attr('checked',true);
										}

									}
								});



                            }
                       });
                       return document.location.href = 'javascript:void(null)';

                    }},
                    {db:'company_name',name:'Empresa',classname:'left', width:'25%' },
                    {db:'role_name',name:'Rol',classname:'center', width:'10%',valueFunction : function(i,o){
                         switch( o.role_name ){

                            case 'admin':
                              var str = '<span class="label label-warning">Administrator</span>';
                            break
                            case 'root':
                              var str = '<span class="label label-danger">Root</span>';
                            break
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
              //$('#loader').hide();
              //$('#colView .row').show();
            }
    });

  },

  loadSuppliers : function(){
    $('#supplier_id').html('');
    $.get('/providers/all',function(data){
        var select = document.getElementById('supplier_id');
        for( x in data.data ){
            var doc = data.data[x];
            var opt = document.createElement("option");
             opt.textContent = doc.name;
             opt.value = doc.id;
             select.appendChild(opt);
        }
    });
  },

	loadProviders : function(){

		$.get('/providers/all',function(source){
			var data = source.data;

			for( x in data ){
				//$('#user_provider').append('<input type="checkbox" value="'+data[x].id+'">'+ data[x].name +'</option>');
				$('#user_provider').append('<li><input type="checkbox" name="user_provider[]" id="provider_'+data[x].id +'"  value="'+data[x].id +'"/> '+ data[x].name +'  </li>');
			}

		});
	},


	loadTypes : function(){

		$.get('/locations/types',function(source){
			var data = source.data;

			for( x in data ){
				//$('#user_provider').append('<input type="checkbox" value="'+data[x].id+'">'+ data[x].name +'</option>');
				$('#user_type').append('<li><input type="checkbox" name="user_type[]"  value="'+data[x].id +'" id="type_'+data[x].id +'"/> '+ data[x].name +'  </li>');
			}

		});
	},
  //----------------  permisions view -------------- //
  permisions : function(){

    //---------- load roles -----------//
      this.loadRoles();

    //---------- load modules -----------//
      this.loadModules();

      //---------- hidding modules -----------//
      $('#panel-body, #panel-footer').hide();


      $('#all_modules').click(function(){

         if(this.checked){
          console.log(this.checked);
            $('.chk_modules').each(function(i,o){
                o.checked = true;
            });
          }else{
             $('.chk_modules').each(function(i,o){
                o.checked = false;
            });
          }
      });

      $('#all_visibles').click(function(){
          if(this.checked){
            console.log(this.checked);
              $('.chk_visibles').each(function(i,o){
                  o.checked = true;
              });
            }else{
               $('.chk_visibles').each(function(i,o){
                  o.checked = false;
              });
          }
      });

      $('#form_permisions').submit(function(){
          if($('#role').val() != '#'){
             var data = $('#form_permisions').serializeArray();
              $.post('/users/savepermisions',data,function(response){
                    alert('Permisos de pérfil guardado correctamente');
              });
          }else{
            alert('Selecciona un Perfil, Primero');
          }
          return false;
      })

    //---------- on change roles -----------//
      $('#role').change(function(){
        if( this.value != '#'){
            $('#panel-body, #panel-footer').show();
            $.get('/users/getroles',{id:this.value},function(data){

               $('.chk_visibles').prop("checked", false);
               $('.chk_modules').prop("checked", false);

                $(data).each(function(i,itm){
                     var value = itm.visible == 0 ? false : true;
                     $('#module_id_'+itm.module_id).prop('checked',true);
                     $('#visible_'+itm.module_id).prop('checked',value);
                });
            });
        }else{
          $('#panel-body, #panel-footer').hide();
        }
      });
  },

  loadRoles : function(){

      var that = this;
      $.get('/users/roles/',function(roles){
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

  loadModules : function(){
      var that = this;
      $.get('/users/modules/',function(modules){

        var container = document.getElementById('rows_content');
        for(x in modules){

            var tr = document.createElement('tr');
                container.appendChild(tr);

            // Name ---------------------------------------------------
            var td_name = document.createElement('td');
                td_name.innerHTML = modules[x].name;
                tr.appendChild(td_name)



            // Module ---------------------------------------------------
            var td_module = document.createElement('td');
                tr.appendChild(td_module)

            var check_module = document.createElement('input');
                check_module.type      = 'checkbox';
                check_module.className = 'chk_modules';
                check_module.value     = modules[x].id;
                check_module.name      = 'modules[]';
                check_module.id        = 'module_id_'+modules[x].id;
                td_module.appendChild(check_module)

            // Visible ---------------------------------------------------

            var td_visible = document.createElement('td');
                tr.appendChild(td_visible)

            var check_visible = document.createElement('input');
                check_visible.type      = 'checkbox';
                check_visible.className = 'chk_visibles';
                check_visible.name      = 'visible[]';
                check_visible.value     = modules[x].id;
                check_visible.id        = 'visible_'+modules[x].id;
                td_visible.appendChild(check_visible)

            // Landing ---------------------------------------------------

            var td_landing = document.createElement('td');
                tr.appendChild(td_landing)

            var check_landing = document.createElement('input');
                check_landing.type      = 'radio';
                check_landing.className = 'rd_landing';
                check_landing.name      = 'landing[]';
                check_landing.value     = modules[x].id;
                check_landing.id        = 'landing_'+modules[x].id;
                td_landing.appendChild(check_landing)


        }

      });
  },

  createTable : function(roles){

      for(x in roles){
          console.log(roles[x]);
        // $('#rows_content').append(tr);
      }
  }

});
