 Customers_Payments = Core_Customers.extend({  

 	payment_types : [
 		{label:'Pago mensualidad completo',value:'PM',selected:true},
 		{label:'Pago parcial',value:'PMP'},
 		{label:'Cancelación de pago',value:'CP'},
 	],
 	payment_methods : [
 		{label:'Tarjeta de Crédito',value:'TC',selected:true},
 		{label:'Cheque',value:'CQ'},
 		{label:'Wire Transfer',value:'WT'},
 	],
 	init : function(){

  	},
	run : function(tabcontent){
		this.TabPanel          		= document.createElement('div');
	    this.TabPanel.id       		= 'customer-payments-tab';
	    this.TabPanel.className    	= 'tab-pane ';
	    tabcontent.appendChild(this.TabPanel);
		
	    this.header();
		this.setForm();
	},

	header : function(){	

		var that 				 = this;
        var card          		 = document.createElement('div');
		card.className    		 = 'card card-form card-form-payment';
		card.style.display 		 = 'block';
		this.TabPanel.appendChild(card);

		// Form container
		var form          = document.createElement('form');
		form.id           = 'form-payment';
		form.action       = '';
		form.method       = 'post';
		form.setAttribute('autocomplete', 'off');
		card.appendChild(form);

		//the form
		this._form = form;

		//------------------------------------------------------
		this.cardBody           = document.createElement('div');
		this.cardBody.className = 'row card-body ';
		form.appendChild(this.cardBody);

		//------------------------------------------------------
		var toptools           = document.createElement('fieldset');
		toptools.className 		 = 'form-group';
		this.cardBody.appendChild(toptools);

		//------------------------------------------------------
		var h2           = document.createElement('h2');
		h2.innerHTML 		 = '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Hacer un pago ';
		h2.className 		 = 'pull-left card-title';
		toptools.appendChild(h2);

		this.registerForm(form.id,function(e,data){
            that.sentForm(data);
        });

	},
	setForm : function(){

		var that = this;

		/* Row Group country-state
		------------------------------------------------------ */      
		var row   = this.addRow(this.cardBody,'');

		/* Payment Amount
		------------------------------------------------------ */      
		var col   = this.addCol(row,'col-md-6');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Cantidad a pagar','text-10');

		this.addInput({container:fg,prefix:'payment',name:'customer_id',type:'hidden',value:this._data.id,default_value:'0',value_type:'integer'});
		this.addInput({container:fg,prefix:'payment',name:'membership_id',type:'hidden',value:this._data.membership_id,default_value:'0',value_type:'integer'});
		this.addInput({container:fg,prefix:'payment',name:'amount',type:'text',value:'',default_value:'0.0',value_type:'money',required:true});


		/* Payment Type
		------------------------------------------------------ */      
		var col   = this.addCol(row,'col-md-6');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'	Método de pago ','text-10');    

		var input          = document.createElement('select');
		input.id           = 'payment-method';
		input.className    = 'form-control';
		input.name         = 'payment[method]';
		fg.appendChild(input);   
		//create options from select
		for( x in that.payment_types){         
		  that.createOption(input,that.payment_methods[x].label,that.payment_methods[x].value);
		}
		$(input).selectize();

		// Row ------------------------------------------------------
		var row  = this.addRow(this.cardBody,'');		
		var col  = this.addCol(row,'col-md-12 padding-10');
		this.addSeparator(col,'separate button');
		var fg    = this.addFormGroup(col);

		var input          = document.createElement('textarea');
		input.rows 		   = 5;
		input.id           = 'payment-comment';
		input.className    = 'form-control';
		input.name         = 'payment[comment]';
		fg.appendChild(input);
		
		// Row ------------------------------------------------------
		var row  = this.addRow(this.cardBody,'');
		var col  = this.addCol(row,'col-md-12 padding-10');
		this.addSeparator(col,'separate button');
		var fg    = this.addFormGroup(col);

		var button = document.createElement('button');
			button.innerHTML = '<i class="fa fa-credit-card" aria-hidden="true"></i> Registrar Pago';
			button.className = 'btn btn-success-outline btn-lg btn-block';
			fg.appendChild(button);

	},
	sentForm : function(data){
    // local scope
    var that = this;
    // disable form before start process
    this.disableForms('form-customer','input, textarea, button, select',true);
    // send data to server
    this.post('/payments/add',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
              that.reseForm();

              window.tablePayments.load();
              // display action message to user
              bootbox.alert('Los datos fueron guardados correctamente en el sistema!');
            break;
            case 1:
                // check if raw data is enable
                if( typeof(data.data.raw) != 'undefined'){
                  // case database error for application response
                  switch( data.data.raw.code ){
                    case 11000:
                      bootbox.alert('El email que intenta registrar ya se encuentra en la base de datos!');
                    break;
                    default:
                      bootbox.alert('Unknow error database error');
                    break;
                  }
                }else{
                 // this error alert is when the error is not from database
                 bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
                }             
            break;
            default:
              // this error alert is when server timeout or cant get answer from it
              bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
            break;
        }                
      }else{
          // this error alert is when server timeout or cant get answer from it
          bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
      }

      // all another no documented stuff xD
      window.asound.play();
      that.disableForms('form-customer','input, textarea, button, select',false);
    }); 
  },

  reseForm : function(){
  	document.getElementById(this._form.id).reset();
  }
});