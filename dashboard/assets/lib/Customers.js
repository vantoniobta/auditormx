Core_Customers = Core.extend({  

  init : function(){

  },
  run :function(){

  	//load parent
  	this.init();

    // this level
    var that = this;

    //initialize dates
    //$('#datetimepicker_start input').val("");
    //$('#datetimepicker_end input').val("");

  
  },

  index : function(options){

    var that     = this;
    this.options = options;

  	// load object
  	this.run();

    //getData;
    this.getData();


    //set add button
    $('#btn-new-customer').click(function(){
        that.setForm();
    });

  },

  getData : function(){

      window.DataChooser = $('.sidepanel .panel-body').DataChooser({
        rows:10,
        searchtext:'Buscar un elemento',
        source:'/cdn/data.json',      
        prepend:true,
        template: ' <div>  {{name}} <div class="label label-danger pull-right">Deuda: $ {{followers}}</div> </div>',
        onClick:function(data){
          that.setForm(data);
             
        }
    })

  },

  setForm : function(data){

          var data      = typeof(data) == 'undefined' ? false : data;          
          var container = document.getElementById('workspace');
              container.innerHTML = '';              

          var card = document.createElement('div');
          card.className = 'card';
          container.appendChild(card);

          var cardBody = document.createElement('div');
          cardBody.className = 'row card-body card-padding50';
          card.appendChild(cardBody);

          var fgroup = document.createElement('fieldset');
          fgroup.className = 'form-group';
          cardBody.appendChild(fgroup);

          var label = document.createElement('label');
          label.innerHTML = 'Name';
          fgroup.appendChild(label);


          var input         = document.createElement('input');
          input.className = 'form-control';
          input.type      = 'text'; 
          input.value     = data === false ? '' : data.name;
          fgroup.appendChild(input);


         var fgroup = document.createElement('fieldset');
          fgroup.className = 'form-group';
          cardBody.appendChild(fgroup);

          var label = document.createElement('label');
          label.innerHTML = 'User';
          fgroup.appendChild(label);

          var input         = document.createElement('input');
          input.className = 'form-control';
          input.type      = 'text'; 
          input.value     = data === false  ? '' : data.user;
          fgroup.appendChild(input);


          var button         = document.createElement('button');
          button.className   = 'btn btn-primary btn-block';
          button.innerHTML   = 'Guardar datos';
          cardBody.appendChild(button);

          card.style.display = 'block';
  }
  
});