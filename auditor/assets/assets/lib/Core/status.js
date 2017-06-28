Core_Status = Core.extend({
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
    this.setStatusTable();

   /*--- Set Process table ---*/
    this.setProcessTable()

   /*--- Load Proviers to select ---*/
    this.loadProviders();


    /*--- set report ---*/
    this.setReport();

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
    setStatusTable : function(){
        var that = this;
        window.statusTable = $('#statusTable').Table({
             id : 'users',
             width : '100%',
             source:'/status/table',
             rows:10,
             searcher:true,
             primary:'_id',
             headers : [
            		 {db:'uuid',name:'Folio',classname:'left',width:'10%',valueFunction:function(i,o){
                        return '<span class="label label-primary">'+o.uuid+'</span>';
                    }},
                    {db:'createdAt',name:'Fecha de Reporte',classname:'left',width:'10%',valueFunction:function(i,o){
                    	var theDate = new Date(o.createdAt);
                    	var d 	    = String(theDate.getDate()).length > 1 ? String(theDate.getDate()) : '0'+ String(theDate.getDate());
                    	var m 	    = String(theDate.getMonth()).length > 1 ? String(theDate.getMonth()) : '0'+ String(theDate.getMonth());
                    	var y 	    = theDate.getFullYear();
                        return '<span class="label label-primary">'+ d+'-'+m+'-'+y+'</span>';
                    }},
                     {db:'code',name:'Espacio Contratado',classname:'left',width:'10%',valueFunction:function(i,o){

                        	var license_plate 	= String(o.license_plate).length == 0 ? false : o.license_plate;
											var numid 			= String(o.numid).length == 0 ? false : o.numid;
											var code 			= String(o.code).length == 0 ? false : o.code;
											var id    			= code||license_plate||numid  ;
											return '<a href="/locations/view/'+o.id+'" class="label-tooltip label label-danger" data-toggle="tooltip" data-placement="right"  title="" ><span class="glyphicon glyphicon-link"></span> '+id+'</a>';
                    }},
                    {db:'status',name:'Estatus Actual',classname:'left',width:'10%',valueFunction:function(i,o){

                          switch( o.status ){
                            case '-1':
                              var str = '<span class="label label-default">Sin Reporte</span>';
                            break
                            case '0':
                              var str = '<span class="label label-success">Correcto</span>';
                            break
                            case '11':  case '14':
                              var str = '<span class="label label-success">Correcto</span>';
                            break
                            case '12':
                              var str = '<span class="label label-warning">Correcto</span>';
                            break
                            case '13':
                              var str = '<span class="label label-danger">Penalización</span>';
                            break
                            default:
                            var str = '<span class="label label-warning">Anomalía</span>';
                            break;
                          }
                        return str;
                    }}
                    ,{db:'status_label',name:'Tipo de Reporte',classname:'left',width:'15%'},
                    {db:'provider_name',name:'Empresa',classname:'left',width:'15%'},

                    {db:'user_name',name:'Reportado por',classname:'left',width:'15%',valueFunction:function(i,o){
                        return '<span class="status_tooltip" data-toggle="tooltip" data-placement="top" title="'+o.message+'" >'+o.user_name+'</span>';
                    }},
                    {db:'snapshots',name:'Fotos',classname:'left',width:'30%',valueFunction:function(i,o){
											if( o.snapshots ){
												var str = '';
												var snapshots = o.snapshots.split(',');
												var code = o.code == '' ? o.license_plate : o.code;
													for(x in snapshots ){
                             var snaptsh = snapshots[x].toLowerCase();                                
														if( snapshots[x].length > 0 ){
                               var src = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_tmb_'+snaptsh;
                               var url = 'http://1a2acb33e6a5f1efae28-89816399c8ac59f42d5fd8ae4b430b98.r48.cf1.rackcdn.com/'+o.id+'_'+snaptsh;
														str += '<a data-lightbox="' + o.uuid + ' " data-title="'+ o.code  +' - '+ o.provider_name + ' " id="lastimage_link_' + o.uuid + '" href="' + url + '" style="float:left; display:block"> <img  alt="' + code  +' - '+ o.provider_name + ' " class="img-thumbnail" id="lastimage_' + o.uuid + '" src="' + src + '" width="20px" height="20px"> </a>';

														}
													}

												return str;
											}else{
												return '';
											}
										}},
                 ],
            onCompleteRequest : function(){
                $('.status_tooltip').tooltip();
            }
        });
    },

     /*@loadPanel
    -----------------------------*/
    setProcessTable : function(){
        var that = this;
        window.processTable = $('#processTable').Table({
             id : 'file',
             width : '100%',
             source:'/status/files',
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
                    {db:'src',name:'Archivo',classname:'left',width:'20%'},
                    {db:'comment',name:'Proceso',classname:'left',width:'30%'},
                    {db:'status',name:'Estatus',classname:'left',width:'20%',valueFunction:function(i,o){

                    	if( o.status < o.qty ){
                    		return o.status + ' de '+o.qty+' <div  id="" class="progresstrip"><div class="progress-inner"></div></div>';
                    	}else{
                    		return  o.status+' de '+o.qty+' Completado <div  id="" class="progresstrip"></div> ';
                    	}


                    }},
                     {db:'status',name:'',classname:'left',width:'20%',valueFunction:function(i,o){
                     	if( o.status == 5 ){
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

  load : function(){
    $('#delivery-create').submit(function(e){
      e.preventDefault();
      var that = this
      var form = $(this);

      $.post('delivery/save_address', form.serialize(), function(data){
          that.reset();
          window.deliveryTable.theLoad();
      })
    })

  },

   setReport :function(){
      var that = this;
      $('#form-upload-report').upload({
          input:'images_upload',
          source:'/status/report',
          wait:true,
          max:1,
          onComplete: function(response){
          	  console.log();
              document.getElementById('form-upload-report').reset();
               window.statusTable.theLoad();
                $('#file_csv_list').html('');
                $('#list_container').hide();
                if(response.code == 0){
               		alert('El archivo se ha cargado correctamente, Se comenzará el procesamiento del mismo.');
               		window.processTable.theLoad();
				}else{
					alert(response.msg);
				}
          }
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

    loadSycProcess : function(){
    	var that = this;
    	if( window.sycprocess ){
    	   clearInterval(window.sycprocess);
    	}

    	window.sycprocess = setInterval(function(){
    	 	window.processTable.theLoad();
    	}, 60000 );
    }

});
