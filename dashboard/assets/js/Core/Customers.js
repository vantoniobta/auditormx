Core_Customers = Core.extend({  

 
  run :function(){
  	//load parent
  	this.sounds();

    // this level
    var that = this;
  },

  index : function(options){

    //local scope
    var that = this;

    // options 
    this.options = options;

  	// load object
  	this.run();

    //getData;
    this.getCustomers();

    //overflow hide
    this.overflow();

    // define tabs
    this._tabs = [];

    //mode view
    this.view_mode = false;

    //set add button
    $('#btn-new-customer').click(function(){

        that.view_mode = true; 
        that.createWorkspace({});
        window.DataChooser.setDeactive(  window.DataChooser._current || '' );

    });
  },
   getCustomers : function(){
    //local scoope
    var that = this;
    window.DataChooser = $('.sidepanel .panel-body').DataChooser({
        rows:10,
        searchtext:'Buscar un elemento',
        source:'http://ws.iclicauditor.com/customers/all',      
        prepend:true,
        template: ' <div class="row-customer-{{thestatus}}"> <div class="pull-left">{{owner_name}} <br/> <div class="customer-cve">Clave:{{cve}}</div> <div class="customer-phone">Móvil: {{mobile}}</div>  </div>  <div class="clear fix"></div> </div>',
        onClick:function(data){       
          that.view_mode = false;               
          that.createWorkspace(data);                
        }, 
        onCompleteRender: function(){

          //  $(window).keydown(function (e) {     

          //         switch (e.which) {                
          //           case 38: // up 
          //               var current = $('.sidepanel .panel-body ').find('.active');
          //               current.removeClass('active');
                  
          //               var direction = 'up';            
          //               var selected  = current.prev();
          //               selected.focus().addClass('active');      
                        
          //             if( typeof(selected[0]) == 'undefined'){                              
          //                   var selected = $('.sidepanel .panel-body .zrow:last-child');
          //                       selected.focus().addClass('active');
          //             }
          //             return true;
          //           break;               
          //           case 40: // down  
          //               var current = $('.sidepanel .panel-body ').find('.active');
          //               current.removeClass('active');
          //               var direction = 'down';
          //               var selected  = current.next();                    
          //                   selected.focus().addClass('active');

          //                 if( typeof(selected[0]) == 'undefined'){                              
          //                     var selected = $('.sidepanel .panel-body .zrow:first-child');
          //                         selected.focus().addClass('active');
          //                 }
          //                 return true;
          //           break;
          //           case 13:               
          //               if( typeof($(':focus')[0]) == 'undefined' ){
          //                 var current = $('.sidepanel .panel-body ').find('.active');
          //                 current.click();
          //               }                       
          //              return true;
          //           break;
          //           default:                                       
          //              return true;
          //           break;
          //         }                                   
          //       e.preventDefault();
                
          //     //console.log(direction,selected[0] );
          // });
        }
    });

   

  },

  clearWorkSpace : function(){     
     var container = document.getElementById('workspace');
         container.innerHTML = '';    
         return container;
  },

  createWorkspace : function(data){

      /* Local Scoope
      --------------------------------------------------------------- */
      var that = this;
      
      /* workspace
      --------------------------------------------------------------- */
      var workspace  = that.clearWorkSpace();    

      /* Tabs Container 
      --------------------------------------------------------------- */
      this.createTabs(data);

      /* Tab Content
      --------------------------------------------------------------- */
      var tabcontent  = document.createElement('div');            
          tabcontent.className = 'tab-content';
          workspace.appendChild(tabcontent);

      // If view is from new element
      if( that.view_mode ){

        /* Form Tab
        --------------------------------------------------------------- */
        this.addTab('form','Datos Generales','active');
        this.FormTab = new Customers_Form();
        this.FormTab.setData(data);
        this.FormTab.run(tabcontent,'active');

      }else{
        

        if( data.membership_id === null ){

          /* Resumen Tab
          --------------------------------------------------------------- */
          this.addTab('resumen','Resumen');
          this.ResumenTab = new Customers_Resumen();
          this.ResumenTab.setData(data);
          this.ResumenTab.run(tabcontent);

          /* Form Tab
          --------------------------------------------------------------- */
          this.addTab('form','Datos Generales');
          this.FormTab = new Customers_Form();  
          this.FormTab.setData(data);
          this.FormTab.run(tabcontent);

          /* Membership / Agreement
          --------------------------------------------------------------- */
          this.addTab('membership','Membresía','active');
          this.MembershipTab = new Customers_Membership();   
          this.MembershipTab.setData(data);
          this.MembershipTab.run(tabcontent,'active');

          /* Amortization
          --------------------------------------------------------------- */
          this.addTab('amortization','Tabla de Amortización');
          this.AmortTab = new Customers_Amortization();
          this.AmortTab.setData(data);
          this.AmortTab.run(tabcontent);
          this.MembershipTab.setAmorTab(this.AmortTab); 


        }else{
          /* Resumen Tab
          --------------------------------------------------------------- */
          this.addTab('resumen','Resumen','active');
          this.ResumenTab = new Customers_Resumen();
          this.ResumenTab.setData(data);
          this.ResumenTab.user = this.options.user;
          this.ResumenTab.run(tabcontent,'active');

          /* Form Tab
          --------------------------------------------------------------- */
          this.addTab('form','Datos Generales');
          this.FormTab = new Customers_Form();  
          this.FormTab.setData(data);
          this.FormTab.run(tabcontent);

          /* Membership / Agreement
          --------------------------------------------------------------- */
          this.addTab('membership','Membresía','');
          this.MembershipTab = new Customers_Membership();   
          this.MembershipTab.setData(data);
          this.MembershipTab.run(tabcontent);

          /* Amortization
          --------------------------------------------------------------- */
          this.addTab('amortization','Tabla de Amortización');
          this.AmortTab = new Customers_Amortization();
          this.AmortTab.setData(data);
          this.AmortTab.run(tabcontent);
          this.MembershipTab.setAmorTab(this.AmortTab);

          /* Amortization
          --------------------------------------------------------------- */
          this.addTab('payments','Pagos');
          this.PayTab = new Customers_Payments();
          this.PayTab.setData(data);
          this.PayTab.run(tabcontent);          

        }
      }
  },

  createTabs : function(data){  

    //main container
    var container = document.getElementById('workspace');

    //tab lis container
    var ul = document.createElement('ul');
        ul.className = 'nav nav-tabs';
        ul.role      = "tablist";
        ul.id        = 'myTab';
        container.appendChild(ul);

        ul.setAttribute('role','tablist');
        this._tabnav = ul;
        return ul;

  },
  addTab : function(container,label,status){
      var li           = document.createElement('li');
          li.className = 'nav-item';
          this._tabnav.appendChild(li);
      var a           = document.createElement('a');
          a.innerHTML = label;
          a.className = 'nav-link '  + status;
          a.href      = '#customer-'+container+'-tab';

          if(status != 'disabled'){
            a.dataset.toggle = 'tab';
          }
          a.setAttribute('role','tab');
          li.appendChild(a);
  },
  createCardElement : function(container,label,value){
    var card           = document.createElement('div');
        card.className = ' row card card-data-segment';
        container.appendChild(card);

    var body           = document.createElement('div');         
        body.className = ' card-data-body ';
        body.innerHTML = '<div class="segment-card-data-label">'+label+'</div><div class="segment-card-data-vaue">'+value+'</div>';
        card.appendChild(body);
       return card;
  },
  setData : function(data){
    this._data = data;
  },

  getData : function(){
    return this._data;
  }
 
});