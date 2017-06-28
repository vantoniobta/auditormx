var private = {}

private.createDimensionTable = function(label, dimension, art_id){
  window[label] = $('#' + label).Table({         
       width : '100%',             
       source: '/campaings/sites_by_art_dimension',
       rows:8,
       //searcher:true,
       params:{ art_id: art_id, dimension: dimension }, 
       sortable:true,
       primary:'id',
       headers : [
          { db:'street',name:'Dirección',classname:'left',width:'20%' }
          ,{ 
            db:'city',name:'Ciudad / Estado',classname:'left',width:'20%', 
            valueFunction:function(i,o){ return o.city + ', ' + o.state }
          },              
          {db:'zip',name:'C.P.',classname:'left',width:'20%'},    
          {db:'material',name:'Material',classname:'left',width:'20%'}
          /*
          */
       ],
      onCompleteRequest : function(){    
          //$('.label-tooltip').tooltip();
      },

      onCheckBox : function(value,data){
        //console.log(value,data);
      }            
  });
  /*
  */
//Dirección Ciudad / Estado C.P.  Material
}

Core_Art = Core.extend({  
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
    
    this.version_lists();
    
    this.uploadVersion();
    
    this.change_type();
   
  },  
  /*@reset
  ---------------------------------*/
  reset : function(){    
   
  },
  setup : function(){
    /*--- refer to this object -- */
   
    
  },
  uploadVersion: function(){
    $('.upload-version-form').upload({
        input: $(this).attr('id'),
        source:'/campaings/save_version',      
        onComplete: function(res){
          console.log(res)
        }
    });  
  },
  version_lists: function(){
    var art_id = this.id
    $( "div.version" ).each(function( index ) {
      var version = this.id
      private.createDimensionTable(version, version.replace(/\-/g,'.'), art_id)
    });
           
  }, 
  change_type: function(){
    $( "select#type" ).change(function() {
      $( "#type_form" ).trigger( "submit" );
    });
  }


});