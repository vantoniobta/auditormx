Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

 Customers_Amortization = Core_Customers.extend({  
 	init : function(){

  	},
	run : function(tabcontent){

		var container          = document.createElement('div');
	    container.id           = 'customer-amortization-tab';
	    container.className    = 'tab-pane';
	    tabcontent.appendChild(container);

		var card          		 = document.createElement('div');      
		card.className    		 = 'card card-form ';
		card.style.display 		 = 'block';
		container.appendChild(card);

		//------------------------------------------------------
		var cardBody           = document.createElement('div'); 
		cardBody.className 		 = 'row card-body ';
		card.appendChild(cardBody);

		/* new row
      	-------------------------------------------------- */
		var row = this.addRow(cardBody);

		var col       = document.createElement('div');
		col.className = ' col-md-12 ';
		row.appendChild(col);

		var h2       = document.createElement('h2');
		h2.innerHTML = '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Tabla de Amortización ' ;
		h2.className = 'pull-left card-title';
		col.appendChild(h2);

		 //print button
      	this.setPrintButton(col);

    var atc = document.createElement('div');
			  atc.id = 'atc-container1';
				cardBody.appendChild(atc);

		var atc = document.createElement('div');
			atc.id = 'atc-container';
			cardBody.appendChild(atc);


		if( this._data.membership_id !== null ){
			$('#myTab a[href="#customer-amortization-tab"]').removeClass('disabled').attr('data-toggle','tab'); 
			// this.fixtable(this._data.balance,this._data.interest_rate );
			// this.table();
		}
	},

	fixtable  : function(balance,rate,nper,fe){

	// $('#myTab a[href="#customer-amortization-tab"]').removeClass('disabled').attr('data-toggle','tab');

  	// months names 
  	var monthNames = [
	  	"Enero", 
	  	"Febrero", 
	  	"Marzo", 
	  	"Abril", 
	  	"Mayo", 
	  	"Junio",
	  	"Julio", 
	  	"Agosto", 
	  	"Septiembre", 
	  	"Octubre", 
	  	"Noviembre", 
	  	"Diciembre"];

  	var container = document.getElementById('atc-container1');		
		this.addSeparator(container);
		
		var table = document.createElement('table');
			table.className = 'table table-hover';
			container.appendChild(table);

		var thead = document.createElement('thead');
			table.appendChild(thead);

		 var tr = '';
		 	 tr += '<tr>';
		 	 tr += '<th>Periodo</th>';
		 	 tr += '<th>Fecha</th>';
		 	 tr += '<th>Saldo</th>';
		 	 tr += '<th>Mensualidad</th>';
		 	 tr += '<th>Interés</th>';
		 	 tr += '<th>Capital</th>';
		 	 tr += '<th>Saldo Final</th>';
		 	 tr += '<th>Interés Acumulado</th>';
		 	 tr += '</tr>';
		 
		 thead.innerHTML = tr;

		var tbody = document.createElement('tbody');
			table.appendChild(tbody);

		var now   = balance;
  		var str   = '';  	
		var m     = 0;
		var i     = nper;
		var imc   = 0;

		var initdate     = $('#membership-date').val().split('-');
		var init_day     = initdate[0];
		var init_month   = initdate[1];
		var init_year    = initdate[2];
		var payment_cost = 10.00;

		var cdate = new Date(init_year, init_month, init_day);

  		while( i > 0 ){

  			var date  =  cdate.getDate();
  			var month = monthNames[ cdate.getMonth() ];
  			var year  = cdate.getFullYear();
  			var amort = fe + payment_cost;	
  			var im    = now * rate;
  			var cap   = fe - im;
  			var imc   = im + imc;
  			var dif   = now - cap;

		 	 str += '<tr>';
		 	 str += '<td>'+(m+1)+'</th>';
		 	 str += '<td>'+date+'-'+month+'-'+year+'</th>';
		 	 str += '<td>'+now.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '<td>'+amort.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '<td>'+im.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '<td>'+cap.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '<td>'+dif.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '<td>'+imc.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</th>';
		 	 str += '</tr>';

		 	 var now   = dif;

		 	 var cdate = cdate.addMonths(1);
  			
  			m++;
  			i--;
  		}

  		tbody.innerHTML = str;

  },
  setPrintButton : function(container){

    var that            = this;
    
    /* Delete Button Button
    --------------------------------------------------------------- */
    var button          = document.createElement('button');
    button.type         = 'button'; 
    button.className    = 'btn btn-success-outline pull-right btn-tools-customer';
    button.innerHTML    = '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Exportar';//'<i class="fa fa-print" aria-hidden="true"></i> Imprimir';
    button.dataset.id   = this._data.id;
    container.appendChild(button);
    // delete action 
    button.onclick = function(){
      // var id = this.dataset.id;
      // bootbox.confirm('¿Deseas eliminar este registro?, los cambios serán permanentes!',function(result){
      //   if (result ) {
      //     that.post('/customers/delete',{id:id},function(e,data){
      //       switch(data.code){
      //         case 0:
      //           that.clearWorkSpace();
      //           bootbox.alert('El registro fue eliminado correctamente!');
      //           window.DataChooser.deleteThis(id);
      //         break;
      //         case 1:
      //           bootbox.alert('Ha ocurrido un error y los datos no fueron actualizados!');
      //         break;
      //       }
      //       window.asound.play();
      //     });
      //   }  
      // });
    }
  },

  table : function(){

  	// caontainer table 
  	var container = document.getElementById('atc-container');
  			container.innerHTML = '';

  	var headers = { 
  		'number' 		:{name:'Periodo',width:'50px',type:'text', align:'center'},
  		'date' 			:{name:'Fecha',width:'50px',type:'date', align:'left', label:'primary'},
  		'balance' 	:{name:'Saldo',width:'30px',type:'money', align:'center' },
  		'amount' 		:{name:'Mensualidad',width:'50px',type:'money', align:'right', value:function(i,o){
  				return o.amount + o.payment_cost;
  		}},
  		'difference' 				:{name:'Pendiente',width:'50px',type:'money', align:'right'},
  		'payment_done'			:{name:'Pagado',width:'100px',type:'text', align:'right', value:function(i,o){
  			return o.payment_done == null ? '0.00' : o.payment_done;
  		}},
  		'monthly_interest'		:{name:'Interés',width:'50px',type:'text', align:'right'},
  		'capital'							:{name:'Capital',width:'50px',type:'text', align:'right'},
  		'balance_diference'		:{name:'Saldo',width:'50px',type:'money', align:'right'},
  		'interest'						:{name:'Int. acumulado',width:'50px',type:'money', align:'right'},
      'status' 							:{name:'Estatus',width:'50px',  align:'center', value:function(i,o){
              var value = o.status;
              var classes = value == 1 ? 'label-success' : 'label-default';
              var label   = value == 1 ? 'Pagado' : 'Por pagar';

             	if( value == 0 && o.current_date > o.date){
								var classes = 'label-danger';
              	var label   = 'Atrasado';	
             	}

              return '<span class="label '+classes+'">'+labsel+'</span>';
        }}        
      };

  	window.tableAmortization = $(container).Table({
      source   :'/amortization/table',
      method   :'GET',
      type     :'table',
      params   :{membership_id:this._data.membership_id},
      tooltips :true,
      rows     :500,
      sortable :false,
      checkbox :false,
      searcher :false,
      headers  : headers, 
      onLink: function(e){
          console.log(e);
      },
      onCheckBox: function(check){
          // console.log('is checked',check);
      },
      onCheckBoxMain : function(checked){
          // console.log(checked)
      },
      onCompleteRequest:function(){        
       
      }
  	});
  }

});