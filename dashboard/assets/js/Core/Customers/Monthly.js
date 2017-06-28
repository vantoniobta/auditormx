 Customers_Monthly = Core_Customers.extend({  
 	init : function(){

  	},
	init : function(tabcontent){
		var container          = document.createElement('div');
    container.id           = 'customer-monthly-tab';
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

		//------------------------------------------------------
		var toptools           = document.createElement('fieldset');
		toptools.className 		 = 'form-group';
		cardBody.appendChild(toptools);

		//------------------------------------------------------
		var h2           = document.createElement('h2');
		h2.innerHTML 		 = data === false ? '<i class="fa fa-plus-square green-text" aria-hidden="true"></i> Agregar cliente' : '<i class="fa fa-pencil-square green-text" aria-hidden="true"></i> Actualizar datos del cliente ' ;
		h2.className 		 = 'pull-left card-title';
		toptools.appendChild(h2);
	}

});