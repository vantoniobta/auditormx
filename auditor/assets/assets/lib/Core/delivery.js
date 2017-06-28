Core_Delivery = Core.extend({  
  page:1,
  maxRowPage : 0, 
  init : function(){

  },
  /*@run
  ---------------------------------*/
  run : function(id){

    //id
    this.id = id;
    
    //refer to this object
    var that = this;   
    
    //reset to start view
    //this.reset();

    //start actions
    this.setup();   
    
    //load data
    //this.load(this.updateTable);
    this.load();

    //load datatable
    //this.setDataTable();
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){ 
    document.getElementById('deliveryTable').reset();   
  },
  setup : function(){
    /*--- refer to this object -- */
    var that = this;

     var create_html_states = function(){
      var states = [
        'Aguascalientes, Ags',
        'Baja California, BC ',
        'Baja California Sur, BCS',
        'Campeche, Cam',
        'Chiapas, Chis ',
        'Chihuahua, Chih ',
        'Coahuila, Coah ',
        'Colima, Col',
        'Distrito Federal, DF ',
        'Durango, Dgo',
        'Guanajuato, Gto',
        'Guerrero, Gro',
        'Hidalgo, Hgo',
        'Jalisco, Jal',
        'Estado de México, Mex',
        'Michoacán, Mich ',
        'Morelos, Mor',
        'Nayarit, Nay',
        'Nuevo León, NL ',
        'Oaxaca, Oax',
        'Puebla, Pue',
        'Querétaro, Qro',
        'Quintana Roo, QR ',
        'San Luis Potosí, SLP',
        'Sinaloa, Sin',
        'Sonora, Son',
        'Tabasco, Tab',
        'Tamaulipas, Tamp',
        'Tlaxcala, Tlax ',
        'Veracruz, Ver',
        'Yucatán, Yuc',
        'Zacatecas, Zac'
      ];
      
      var create_option = function(state, num){
        return   "<option id='" + state[0] + "' value='" + state[0] + "'>" + state[0] + "</option>"
      }

      for(i in states){
        var j = parseInt(i) + 1;

        var states_option = create_option( states[i].split(', '), j )
        $('#state').append(states_option)
      }

    }

    create_html_states()

    
    
  },

  setDataTable : function(){
    
    var that = this;
    $('#deliveryTable').empty()
    window.deliveryTable = $('#deliveryTable').Table({         
       id : 'address',
       width : '100%',             
       source:'/delivery/table',
       rows:10,
       searcher:true,
       sortable:true,
       primary:'id',
       headers : [                
          { db:'address',name:'Dirección',classname:'left',width:'60%' },
          { db:'state',name:'Estado',classname:'left',width:'20%' },
          { db:'type',name:'Tipo',classname:'left',width:'20%' }
      ],
      onCompleteRequest : function(){    

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

  }


});