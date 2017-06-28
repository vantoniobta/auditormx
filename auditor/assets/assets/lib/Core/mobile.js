Core_Mobile = Core.extend({

    init : function(opts){
      this.opts = opts;
      this.id   = this.opts.id;
      this.uuid = this.opts.uuid;
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


        /*--- newlist button ---*/
        $('#newlist').click(function(){
            $('#create-list-container').show();
        });

         /*--- addlist button ---*/
        $('#addlist').click(function(){
            var value = $('#list').val();
            if(value > 0){
              if( window.locationTable.collection.length > 0 ){
                $('.process_loader ').show();
                $.post('/lists/update',{id:value, collection: window.locationTable.collection},function(response){
                    that.loadLists(value);
                     $('.process_loader ').fadeOut();
                });
              }else{
                alert('Seleccionar al menos un item.');
              }
            }else{
              alert('Favor de Seleccionar un lista válida');
            }
        });

        $('#btn-cancel-createlist').click(function(){
            $('#create-list-container').hide();
            $('#list-loader-container').fadeOut();
            $('#listname').val('');
            $('#btn-save-list').attr('disabled',false);
        });

        $('#btn-save-list').click(function(){
           var value = $('#listname').val();
           if( value.length > 3 ){
              $('#btn-save-list').attr('disabled',true);
               $('#list-loader-container').show();

                $.post('/lists/save',{name:value, collection: window.locationTable.collection},function(response){
                     $('#create-list-container,#list-loader-container').hide();
                     $('#listname').val('');
                     $('#btn-save-list').attr('disabled',false);
                      $('#list').append('<option value="'+response.data.id+'">'+ response.data.name +' ['+response.count+']'+'</option>');
                      $("#list").val(response.data.id);
                });

           }else{
              alert('Por favor agregue un nombre para esta lista');
           }

        });

      /*--- Set actions for filters ---*/
      $('#campaing,#provider,#state,#active').change(function(){
          var state    = $('#state').val();
          var provider = $('#provider').val();
          var active   = $('#active').val();
          window.locationTable.opts.params = { state:state, provider:provider,active:active };
          window.locationTable.theLoad();
      });

      /*--- On Change List Event  ---*/
      $('#list').change(function(){

      });

      // console.log( this.opts.role, [1,2].indexOf(this.opts.role ) );

      /*--- This for hide upload forms, upload is just for suppliers ---*/
      // if( [1,2].indexOf( parseInt( this.opts.role ) ) > -1  ){
      //   $('#upload-location-container').hide();
      // }

       $('#upload-location-container').hide();

     // console.log( this.opts.role, [1,2].indexOf(this.opts.role ) )

      /*--- Show role admin ---*/
      if( [1,2].indexOf( parseInt( this.opts.role ) ) != -1 ){

         /*--- Load States to select ---*/
        this.loadStates();

        /*--- Load States to select ---*/
        this.loadLists();

        /*--- Load Proviers to select ---*/
        this.loadProviders();

        $('#lists-container, #lists-container-footer, #filters').show();

      }

    },
    /*@setup
    -----------------------------*/
    setup : function(){
        // set status table
        this.setStatusTable();

        // form reset
        //document.getElementById('form-upload-report').reset();

    },
    /*@setup
    -----------------------------*/
    load : function(){
        var that = this

        $('#container-page').hide();

        $.get('/mobile/get',{id:this.id},function(data){
            for(var x in data){
              var value = data[x] == '' ? 'No aplica' : data[x];
                    $('#data_'+x).html(value);
            }

            $('#license_plate').html( data.license_plate );
            $('#ubication').html(data.state)
            $('#data_price').html( numeral(data.price).format('$0,0.00') );
            $('#data_ubication').html(data.state)
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
             source:'/mobile/table',
             rows:30,
             checkbox: that.opts.role == '2' ? true : false,
             searcher:true,
             sortable:true,
             primary:'id',
             headers : [{db:'uuid',name:'Clave Interna',classname:'left',width:'15%',valueFunction:function(i,o){
                            return '<span class="label label-danger label-tooltip" data-toggle="tooltip" data-placement="right"  title="ID único del Sistema" ><span class="glyphicon glyphicon-link"></span> '+o.uuid+'</span>';
                        }},
                        {db:'code',name:'Placa - Código',classname:'left',width:'20%',valueFunction:function(i,o){
                          var code = o.code == '' ? o.license_plate : o.license_plate +' - '+ o.code ;
                          var tip  = o.route + '\n'+ o.line;
                          return '<a href="/mobile/view/'+o.id+'" class="label-tooltip" data-toggle="tooltip" data-placement="right"  title="'+tip+'" ><span class="glyphicon glyphicon-link"></span> '+code+'</a>';
                        }},
                    {db:'name',name:'Proveedor',classname:'left',width:'30%'} ,
                    {db:'type',name:'Medio',classname:'center',width:'15%',valueFunction:function(i,o){
                            return '<span class="label label-default label-tooltip" data-toggle="tooltip" data-placement="right"  title="Tipo de Medio" ><span class="glyphicon glyphicon-link"></span> '+o.type+'</span>';
                        }}



                 ],
            onCompleteRequest : function(){
                $('.label-tooltip').tooltip();
            },

            onCheckBox : function(value,data){
              //console.log(value,data);
            }
        });
    },

    setUploadForm :function(){
      $('#form-upload').upload({
          input:'csvfile',
          source:'/mobile/upload',
          onComplete: function(){
              document.getElementById('form-upload').reset();
              window.locationTable.theLoad();
              alert('El archivo excel ha sido completado correctamente ');
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
             source:'/mobile/status',
             rows:10,
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
                    {db:'status_label',name:'Tipo de Reporte',classname:'left',width:'15%'},
                    {db:'reported_by',name:'Reportado por',classname:'left',width:'15%',valueFunction:function(i,o){

                        var msg = o.message ? o.message : 'Sin comentarios ';
    					return '<span class="status_tooltip" data-toggle="tooltip" data-placement="top" title="'+msg+'" >'+o.user_name+'<br/>'+o.reported_by+'</span>';
                    }},
                      {db:'snapshots',name:'Fotos',classname:'left',width:'15%',valueFunction:function(i,o){
                    	if( o.snapshots ){
                    		var str  = '';
                    		var code = o.code == '' ? o.license_plate : o.code;
                    		var snapshots = o.snapshots.split(',');
                    		for(x in snapshots ){
                    			if( snapshots[x].indexOf('tmb_') || snapshots[x].indexOf('tmb_tmb_') )
								var src = 'http://iclicauditor.com/uploads/status/'+o.id+'/tmb_'+snapshots[x];
								var url = 'http://iclicauditor.com/uploads/status/'+o.id+'/'+snapshots[x];
								if( snapshots[x].length > 0 ){
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
    loadLists: function(id){

      $.get('/lists/mobile/all',function(source){
        var data = source.data;
            $('#list').empty();
            $('#list').append('<option value="0">Selecciona una lista</option>');
            for( x in data ){
                var selected = id == data[x].id ? 'selected' : '';
                $('#list').append('<option value="'+data[x].id+'" '+selected+'> '+ data[x].name  +' ['+data[x].count+']'+'</option>');
            }

            /* MultiSelect List */
            $('#list2').empty();
            for( x in data ){
                var selected = id == data[x].id ? 'selected' : '';
                $('#list2').append('<option value="'+data[x].id+'" '+selected+'> '+ data[x].name  +' ['+data[x].count+']'+'</option>');
            }

            $('#list2').SumoSelect({
                placeholder: 'Selecciona una o varias listas'
              , floatWidth: 500
              , forceCustomRendering: true
            });
      });
    },

    loadProviders : function(){

      $.get('/providers/all',function(source){
        var data = source.data;

            for( x in data ){
                $('#provider').append('<option value="'+data[x].id+'">'+ data[x].name +'</option>');
            }

      });
    },

    loadStates : function(){

      $.get('/mobile/state-table',function(data){
            for( x in data ){
                $('#state').append('<option value="'+data[x].state+'">'+ data[x].state +'</option>');
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
          source:'/mobile/report',
          list:'file_list_images_upload',
          max:10,
          onComplete: function(){
              document.getElementById('form-upload-report').reset();
               window.statusTable.theLoad();
               that.getLastImages();
               alert('El Estatus se ha agregado correctamente!.');
          }
      });
    },

     getLastImages :function(){
      $.get('/locations/last-status',{id:this.uuid},function(r){
        if (r.data){
            var html_el = "";
           for(var x in r.data){

              if( !r.data[x].indexOf('tmb_') )
              if((x+1) % 3 == 1) html_el += '<div class="row site-images">';

          	  var url = 'http://iclicauditor.com/uploads/status/'+r.dir+'/'+ r.data[x];
              html_el += '\
                <div class="col-md-4"> \
                  <a data-lightbox="siteImages" data-title="1" id="lastimage_link_' + x + '" href="' + url + '"> \
                    <img  alt="1" class="img-thumbnail" id="lastimage_' + x + '" src="'+url+'"> \
                  </a> \
                </div>';

              if((x+1) % 3 == 0) html_el += '</div>';

            }
            $('#images-pane .col-md-12').html(html_el);
        }
      })
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

});
