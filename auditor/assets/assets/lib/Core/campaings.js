
Core_Campaing = Core.extend({  
  page:1,
  maxRowPage : 0, 
  init : function(){

  },
  /*@run
  ---------------------------------*/
  run : function(id){

    //id
    this.id = id
    
    //refer to this object
    var that = this;   
    
    //reset to start view
    this.reset();

    //start actions
    this.setup();   
    
    //upload Art
    this.saveArt();

    //Show Add Art Form
    this.setDataTable();

    this.arts_by_campaing();

    //load data
    this.load()
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){    
    $('#modeForm').val('add');
    $('#campaingid,#campaing-id-attach').val(0);
    $('#btDeleteCampaing').hide();    
    $('#btNewCampaing').hide();
    $('#formUploadContainer').hide(); 
    $('#progressNumber').hide();
    $('#progressbar').hide();
    document.getElementById('formCampaing').reset();
  },
  setup : function(){
    /*--- refer to this object -- */
    var that = this;

    /*--- Campaings New Action -- */
    $('#btNewCampaing').click(function(){
      var url = '/campaings/view/'
        window.location = url
      // if(confirm('Realmente deseas salir de este formulario sin guardar?')){
        that.reset();
      // }
    });    

    /*--- Campaings Delete Action -- */
    $('#btDeleteCampaing').click(function(){
      if(confirm('Realmente deseas eliminar este usuario?')){
         that.deleteCampaings();
      }
    });    

    /*--- Campaings Form Action -- */
    $('#formCampaing').submit(function(){

        that.sendForm();
        return false;
    });

     /*--- Campaings Form Action -- */
    $('#uploadLocation').submit(function(){
        that.uploadFile();
        return false;
    });

    //date chooser 
    var choose_start = $('#start').datepicker({format:'yyyy-mm-dd'}).on('changeDate', function(ev) {
        choose_start.hide();
    }).data('datepicker');
    
    var choose_finish = $('#finish').datepicker({format:'yyyy-mm-dd'}).on('changeDate', function(ev) {
        choose_finish.hide();
    }).data('datepicker');

    var choose_art_start_1 = $('#art_start').datepicker({format:'yyyy-mm-dd'}).on('changeDate', function(ev) {
        choose_art_start_1.hide();
    }).data('datepicker');

     var choose_art_finish_1 = $('#art_finish').datepicker({format:'yyyy-mm-dd'}).on('changeDate', function(ev) {
        choose_art_finish_1.hide();
    }).data('datepicker');
    
  },

  load : function(){
    if (this.id > 0){
      var that = this;
         $.get('/campaings/get/',{id:this.id},function(r){                                                      
            if(r.error){
              alert(r.message);
            }else{          

              //reset first     
              that.reset();

              //data from db             
              for(x in r){
                $('#'+x).val(r[x]);

                if( x == 'start' || x == 'finish'){
                    var date = new Date(r[x]);
                    $('#'+x).val(date.toMySQLDate()); 
                }
              }
              //other data                              
              $('#formUploadContainer').show();
              $('#password').attr('disabled',true);
              $('#btDeleteCampaing').show();
              $('#btNewCampaing').show();
              $('#modeForm').val('update');
              $('#campaingid,#campaing-id-attach').val(r.id)
             
            }
      });        
      
    }

  },

  deleteCampaings : function(){      
    var that = this;    
    $.post('/campaings/delete',{id:$('#campaingid').val()},function(r){
      that.reset();
      window.usersTable.theLoad();
    });
  },
  sendForm : function(){   
    var that = this; 
    var data = $('#formCampaing').serialize();
    $.post('/campaings/save', data, function(resp){        
      if( $('#modeForm').val() == 'add' ){
        if( resp.data.id ){
          var url = '/campaings/view/' + resp.data.id
          window.location = url
        }
      }
    });

  },
  setDataGrid : function(){
    var that = this;
    window.usersTable = $('#usersTable').Table({         
         id : 'users',
         width : '100%',
         source:'/campaings/table',
         rows:10,
         searcher:true,
         // sortable:true,
         primary:'_id',
         headers : [{db:'name',name:'Nombre',classname:'left',width:'40%',linkin:function(doc){
                  
                   return document.location.href = '/campaings/view/'+doc.id;

                }},                         
                {db:'start',name:'Inicio',classname:'left',width:'15%',valueFunction:function(i,o){
                  var date = new Date(o.start);                                   
                  return '<span class="label label-success">'+ date.toMySQLDate() +'</span>'; 
                }},   
                {db:'finish',name:'Finaliza',classname:'left',width:'15%',valueFunction:function(i,o){
                  var date = new Date(o.finish);                                                         
                  return '<span class="label label-success">'+ date.toMySQLDate() +'</span>'; 
                }}   
             ],
        onCompleteRequest : function(){    
        
        }
    });
  },

  saveArt:function(callback) {
    $('#form-save-art').submit(function(e){
      e.preventDefault();
      $.post('/campaings/save_art', $(this).serialize(), function(res){
          document.getElementById('form-save-art').reset();
          $('#art-table-content').show()
          $('#loading').css('visibility', 'hidden')
          $('#send-btn').addClass('btn-success')
          $('#send-btn').attr('type', 'submit')
          window.locationTable.theLoad();
          //callback()
      })
    })
  }, 
  /*@loadPanel
  -----------------------------*/
  setDataTable : function(){
      //console.log( $('#art-table').attr('id') ) ;
      var that = this;
      window.locationTable = $('#art-table').Table({         
           id : 'users',
           width : '100%',             
           source:'/campaings/arts_table',
           rows:10,
           params: { campaing_id: this.id },
           searcher:true,
           sortable:true,
           primary:'id',
           headers : [
           {db:'uuid',name:'Código',classname:'left',width:'15%',valueFunction:function(i,o){
                // var address = o.street+','+o.neighbor+','+o.city+','+o.state+'. CP.'+o.zip;
                return '<a href="/campaings/view/'+that.id+'" class="label-tooltip label label-danger" data-toggle="tooltip" data-placement="right"  title="" ><span class="glyphicon glyphicon-link"></span> '+o.uuid+'</a>';
            }}, 
           {db: 'name', name: 'Nombre', classname: 'left', width: '40%'},
            {  db: 'created_full_name', name: 'Creado por', classname: 'left', width: '20%' }, 
            { db:'status',name:'Status',classname:'left',width:'20%' ,valueFunction:function(i,o){                          
              switch( o.status ){
                case '2':
                  var str = '<span class="label label-warning"> En proceso </span>';
                break
                case '3':
                  var str = '<span class="label label-success"> Impreso </span>';
                break
                default :
                  var str ='<a href="#" class="send-art-button label label-danger" id="send-art-' + o.id + '-'+ o.name + '" > \
                              <i class="glyphicon glyphicon-upload"> </i>  Notificar \
                            </a> '
                break
              }

            return str; 
            }}
          ],
          onCompleteRequest : function(){    
          
          },

          onCheckBox : function(value,data){
            //console.log(value,data);
          }            
      });
  }, 

  sendNotifications: function(){
    $(document).on('click', '.send-art-button' , function(e){ 
      e.preventDefault()
      if( !confirm("¿Esta seguro que quiere iniciar el proceso?") ) 
        return 
      
      var id = this.id
      var art =  id.split('-')

      $('#' + id ).removeClass('label-danger')
        .replaceWith( $('<span class="label label-warning"> En proceso </span>') )

      $.post('/campaings/send_notifications', { art_id: art[2], art_name: art[3] }, function(a){
        console.log(a)
      }) 
     
    })
  }, 


  arts_by_campaing: function(){
    $.post('/campaings/arts_by_campaing', { campaing_id: this.id }, function(res){
      console.log(res)
      
      if(res.data == 0 ){
        $('#art-table-content').hide()
      }

    })
  }



});