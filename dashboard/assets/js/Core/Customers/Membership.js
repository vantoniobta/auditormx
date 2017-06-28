Customers_Membership = Core_Customers.extend({  
	init : function(){

  	},
	run : function(tabcontent,status){	

		this.TabPanel          	= document.createElement('div');
		this.TabPanel.id           = 'customer-membership-tab';
		this.TabPanel.className    = 'tab-pane '+status;
		tabcontent.appendChild(this.TabPanel);

		this.header();
		this.setForm();

	},
	header : function(){
		var that = this;
			var card          		 = document.createElement('div');
			card.className    		 = 'card card-form ';
			card.style.display 		 = 'block';
			this.TabPanel.appendChild(card);

		   var form          	 = document.createElement('form');
		       form.id           = 'form-membership';
		       form.dataset.id   = this._data.id; 
		       form.action       = '';
		       form.method       = 'post';
		       form.setAttribute('autocomplete', 'off');
		       card.appendChild(form);

		    this._theForm = form;

		    this.addInput({container:form,prefix:'membership',name:'user_id',type:'hidden',value:this._data.id,default_value:0,value_type:'integer'});
		    this.addInput({container:form,prefix:'membership',name:'id',type:'hidden',value:this._data.membership_id,default_value:0,value_type:'integer'});

			//------------------------------------------------------
			this.cardBody           		 = document.createElement('div');
			this.cardBody .className 		 = 'row card-body ';
			form.appendChild(this.cardBody);

			//------------------------------------------------------
			var toptools           = document.createElement('fieldset');
			toptools.className 		 = 'form-group';
			this.cardBody.appendChild(toptools);

			//------------------------------------------------------
			var h2           = document.createElement('h2');
			h2.innerHTML 		 = this._data.membership_id === null ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Crear Membresía' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Membresía ' ;
			h2.className 		 = 'pull-left card-title';
			toptools.appendChild(h2);

		this.registerForm(form.id,function(e,data){
            that.sentForm(data);
        });

	},
	setForm : function(){
	
		// current scope
		var that     = this;

		// Row ------------------------------------------------------
		var row   = this.addRow(this.cardBody,'');

		// Key number
		var av = typeof(this._data.membership_id) == 'undefined' || this._data.membership_id == null ? false : true ; 
		var col   = this.addCol(row,'col-md-8');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'No. de contrato','text-10');
		this.addInput({container:fg,prefix:'membership',name:'uuid',type:'text',value:this._data.uuid,default_value:'Campo requerido',value_type:'string',required:!av,readonly:av});


		// date value
		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Fecha de compra','text-10');
		this.addInput({container:fg,prefix:'membership',name:'date',type:'text',value:this._data.date,default_value:'00-00-0000',value_type:'date',required:true});
		$('#membership-date').datepicker({format: 'dd-mm-yyyy', date: this._data.date});

		// Row ------------------------------------------------------

		var row   	 = this.addRow(this.cardBody,'');

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Precio de la membresía','text-10');
		this.addInput({container:fg,prefix:'membership',name:'price',type:'text',value:this._data.price,default_value:'0.00',value_type:'money',required:true,onBlur:function(){
			that.calculate();
			that.calculateFinancement();
		}});		
	
		var col   = this.addCol(row,'col-md-4');
		var fg    	= this.addFormGroup(col);
		var label  	= this.addLabelForm(fg,'Costo Administrativo','text-10');
		this.addInput({container:fg,prefix:'membership',name:'admin_cost',type:'text',value:this._data.admin_cost,default_value:'0.00',value_type:'money',required:true,onBlur:function(){
			that.calculate();
		}});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Total a pagar','text-10');
		this.addInput({container:fg,prefix:'membership',name:'total_payment',type:'text',value:this._data.total_payment,default_value:'0.00',value_type:'money',readonly:true});

		// Row ------------------------------------------------------

		var row   	 = this.addRow(this.cardBody,'');

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'% Enganche pactado','text-10');
		this.addInput({container:fg,prefix:'membership',name:'deposit_agreed',type:'text',value:this._data.deposit_agreed,default_value:'0',value_type:'float' ,onBlur:function(){
			that.percent();
		}});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'$ Enganche pactado','text-10');
		this.addInput({container:fg,prefix:'membership',name:'deposit',type:'text',value:this._data.deposit,default_value:'0.00',value_type:'money',readonly:true});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Pago de Enganche realizado','text-10');
		this.addInput({container:fg,prefix:'membership',name:'deposit_payment',type:'text',value:this._data.deposit,default_value:'0.00',value_type:'money'});


		// Row ------------------------------------------------------

		var row   	 = this.addRow(this.cardBody,'');
		
		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label  	= this.addLabelForm(fg,'N° de mensualidades','text-10');
		this.addInput({container:fg,prefix:'membership',name:'months',type:'text',value:this._data.months,default_value:'0',value_type:'integer',required:true,onBlur:function(){
			that.calculateFinancement();
		}});
     
		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Tasa de Interés anual' ,'text-10');
		this.addInput({container:fg,prefix:'membership',name:'interest_rate',type:'text',value:this._data.interest_rate,default_value:'0',value_type:'percent',required:true,onBlur:function(){
			that.calculateFinancement();
		}});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Mensualidad','text-10');
		this.addInput({container:fg,prefix:'membership',name:'monthly_payment',type:'text',value:this._data.monthly_payment,default_value:'0.00',value_type:'text',readonly:true});

     	// Row ------------------------------------------------------

		var row   	 = this.addRow(this.cardBody,'');

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Saldo','text-10');
		this.addInput({container:fg,prefix:'membership',name:'total',type:'hidden',value:this._data.total,default_value:'0.00',value_type:'money',readonly:true});
		this.addInput({container:fg,prefix:'membership',name:'balance',type:'text',value:this._data.balance,default_value:'0.00',value_type:'money',readonly:true});


  		this.addInput({container:fg,prefix:'calculator',name:'balance',type:'hidden',value:0,default_value:'0.00',value_type:'money'});
  		this.addInput({container:fg,prefix:'calculator',name:'rate',type:'hidden',value:0,default_value:'0.00',value_type:'text'});
  		this.addInput({container:fg,prefix:'calculator',name:'nper',type:'hidden',value:0,default_value:'0.00',value_type:'percent'});
  		this.addInput({container:fg,prefix:'calculator',name:'fe',type:'hidden',value:0,default_value:'0.00',value_type:'money'});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label  	= this.addLabelForm(fg,'Interés Total','text-10');
		this.addInput({container:fg,prefix:'membership',name:'interest',type:'text',value:this._data.interest,default_value:'0.00',value_type:'money',readonly:true});

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,' Total del Crédito Financiado ','text-10');
		this.addInput({container:fg,prefix:'membership',name:'financed_total',type:'text',value:this._data.financed_total,default_value:'0.00',value_type:'money',readonly:true});
	
		// Row ------------------------------------------------------
		var row   	 = this.addRow(this.cardBody,'');

		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Tipo de Cambio de la compra' ,'text-10');
		this.addInput({container:fg,prefix:'membership',name:'exchange_rate',type:'text',value:this._data.exchange_rate,default_value:'0.00',value_type:'money'});

		
		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Método de Pago','text-10');
		this.addSelect({options:[{label:'Tarjeta de Crédito',value:'tarjeta'},{label:'Depósito',value:'Depósito'},{label:'Transferencia Bancaria',value:'WT'}],container:fg,prefix:'membership',name:'payment_method',type:'text',value:this._data.payment_method,default_value:'0000-00-00',value_type:'select'});
		
		var col   = this.addCol(row,'col-md-4');
		var fg    = this.addFormGroup(col);
		var label = this.addLabelForm(fg,'Carta de Cargos automáticos','text-10');
		this.addInput({container:fg,prefix:'membership',name:'automate_payment_document',type:'file',value:this._data.automate_payment_document,default_value:'',value_type:'file'});
		

		// Row ------------------------------------------------------
		var row  = this.addRow(this.cardBody,'');		
		var col  = this.addCol(row,'col-md-12');
		this.addSeparator(col);
		var fg    = this.addFormGroup(col);

		if(this._data.membership_id === null){
		var button = document.createElement('button');
			button.innerHTML = 'Guardar datos';
			button.className = 'btn btn-success-outline btn-lg btn-block';
			fg.appendChild(button);
		}

	},
	sentForm : function(data){
    // local scope
    var that = this;
    // disable form before start process
    this.disableForms('form-membership','input, textarea, button, select',true);
    // send data to server
    this.post('/customers/membership',data,function(e,data){
      if(!e){
        switch(data.code){
            case 0:
           	
           	// display action message to user	
			bootbox.alert('Los datos fueron guardados correctamente en el sistema!');	
			// update element in collection chooser
			window.DataChooser.updateThis(data.data);
			// load new values for the current form
			window.DataChooser.loadThis(data.data);

			//load amortization table
			window.tableAmortization.load();

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
      that.disableForms('form-membership','input, textarea, button, select',false);
    }); 
  },

  percent : function(){
  	 var depositAgreed = document.getElementById('membership-deposit_agreed');
  	 var inputDeposit  = document.getElementById('membership-deposit');
  	 var inputPrice    = document.getElementById('membership-price');

  	 var depositAgreedValue = parseFloat(depositAgreed.value.replace(/,/g,''));
  	 var inputPriceValue 	= parseFloat(inputPrice.value.replace(/,/g,''));
  	 var percent 			= inputPriceValue * ( depositAgreedValue / 100 );
  	 var percent 			= isNaN(percent) ? 0.00 : percent;
  	 inputDeposit.value 	= percent.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

  	 this.calculate();

  },
  calculate : function(){
	var inputPrice   		= document.getElementById('membership-price');	
	var inputDeposit 		= document.getElementById('membership-deposit');
	var inputAdminCost 		= document.getElementById('membership-admin_cost');
	var inputTotal	 		= document.getElementById('membership-total');
	var inputBalance 		= document.getElementById('membership-balance');
	var totalPayment 		= document.getElementById('membership-total_payment');
	
	
	var inputPriceValue 	= parseFloat(inputPrice.value.replace(/,/g,''));  

	// define Admin Cost Value
	var inputAdminCostValue = parseFloat(inputAdminCost.value.replace(/,/g,''));
	var inputAdminCostValue = isNaN(parseFloat(inputAdminCostValue)) ? 0 : parseFloat(inputAdminCostValue) ;
	
	// define Input Depot Value
	var inputDepositValue	= parseFloat(inputDeposit.value.replace(/,/g,''));
	var inputDepositValue   = isNaN(inputDepositValue) ? 0 : inputDepositValue;

	//calculates
	var diferenceOfPercent	= parseFloat( inputPriceValue - inputDepositValue );
	var percent				=  100 - ((diferenceOfPercent / inputPriceValue) * 100) ;

	// write value total 	
	inputTotal.value 		 = (inputPriceValue).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

	// total payment
	totalPayment.value       = ( inputAdminCostValue + parseFloat(inputPriceValue) ).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') ;

	// diference of total
	var diferenceOfTotal    = parseInt(inputTotal.value.replace(/,/g,'')) - inputDepositValue;
  	inputBalance.value 		= diferenceOfTotal.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

  },

  calculateFinancement : function(){

  		// inputs elements 
  		var inputPrice   		 = document.getElementById('membership-price');
  		var inputDeposit 		 = document.getElementById('membership-deposit');
  		var inputBalance 		 = document.getElementById('membership-balance');
  		var inputMonthlyPayment  = document.getElementById('membership-monthly_payment');
  		var inputInterestRate    = document.getElementById('membership-interest_rate');
  		var inputInterest    	 = document.getElementById('membership-interest');
  		var inputMonths   		 = document.getElementById('membership-months');
  		var inputTotal   		 = document.getElementById('membership-total');
  		var inputFinancedTotal = document.getElementById('membership-financed_total');

  		// console.log({
  		// 	'inputPrice':inputPrice.value,
  		// 	'inputDeposit':inputDeposit.value,
  		// 	'inputBalance':inputBalance.value,
  		// 	'inputMonthlyPayment':inputMonthlyPayment.value,
  		// 	'inputInterestRate' : inputInterestRate.value,
  		// 	'inputInterest' : inputInterest.value,
  		// 	'inputMonths' : inputMonths.value,
  		// 	'inputTotal' : inputTotal.value,
  		// 	'inputFinancedBalance' : inputFinancedBalance.value
  		// })


  		// balance value 
  		var balanceValue 			= parseFloat( inputBalance.value.replace(/,/g,''));
  		var inputInterestRateValue = inputInterestRate.value == '' ? 0 : inputInterestRate.value;
  		var inputMonthsValue 	   = inputMonths.value == '' ? 1 : inputMonths.value;

  		//------------------------------------------------------------------------

  		if( inputInterestRateValue === 0 ){

  		// console.log('is cero rate')

  		var rate = 0;
  		// nper = representa el número de pagos aún por hacerse en el préstamo
  		var nper = inputMonthsValue;
  		// pv   = refiere esencialmente al valor actual, que es esencialmente el monto principal pendiente, o monto sin interés, del préstamo.
  		var pv   = balanceValue;
  		// fv   = el cual significa el valor futuro, que es la cantidad de dinero después de pagar el préstamo en su totalidad
  		var fv   = 0;
  		// type = simplemente especifica si los pagos vencen al principio o al final de un mes
  		var type = 0;

  		//------------------------------------------------------------------------

		// PMT Result
		var fe =  pv / inputMonthsValue;
		// total with financement
		var ft = pv;
		// interest total
		var ti = ft - pv;

  		}else{

		// console.log('more than cero rate')

  		// rate = representa la tasa de interés
  		var rate = (( inputInterestRateValue / 12 ) / 100);
  		// nper = representa el número de pagos aún por hacerse en el préstamo
  		var nper = inputMonthsValue;
  		// pv   = refiere esencialmente al valor actual, que es esencialmente el monto principal pendiente, o monto sin interés, del préstamo.
  		var pv   = balanceValue;
  		// fv   = el cual significa el valor futuro, que es la cantidad de dinero después de pagar el préstamo en su totalidad
  		var fv   = 0;
  		// type = simplemente especifica si los pagos vencen al principio o al final de un mes
  		var type = 0;

  		//------------------------------------------------------------------------

  		// first factor 
		var fi 			  = Math.pow((1+ rate) , nper) * rate;
		// second factor
		var fa 			  = Math.pow((1+ rate) , nper) - 1;
		// PMT Result
		var fe 			  = (pv * (fi / fa));
		// total with financement
		var ft = ( fe * nper );
		// interest total
		var ti = ft - pv;

		}

		//------------------------------------------------------------------------

		// finals values 
  		inputMonthlyPayment.value  = fe.toMoney() == 'Infinity' ? 0 : fe.toMoney();
  		inputFinancedTotal.value   = (balanceValue + parseFloat(ti)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') ;
  		inputInterest.value 	   = ti.toMoney();

  		$('#calculator-balance').val(balanceValue);
  		$('#calculator-rate').val(rate);
  		$('#calculator-nper').val(nper);
  		$('#calculator-fe').val(fe);


  		// Amortization Table Draw
		this.AmortTab.table(balanceValue,rate,nper,fe);
  		
  },

  setAmorTab :function(tab){
  	this.AmortTab  = tab;

  	this.calculateFinancement();

  }

});