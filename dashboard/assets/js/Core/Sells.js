Core_Sells = Core.extend({  

  init : function(){

  },
  run :function(){

  	//load parent
  	this.init();

    // this level
    var that = this;

    //initialize dates
    $('#datetimepicker8 input').val("");
    $('#datetimepicker9 input').val("");

    this.currentDates();
  },

  index : function(options){

    this.options = options;

  	// load object
  	this.run();

    // set Date pickers
    this.setDateChooser()

  	//load chart
  	this.loadChart();

  	//table Sells
  	this.tableSells();


  },
  
   currentDates : function(cb){
    var date 		  = new Date();
  	var ndate         = new Date(date.getFullYear(), date.getUTCMonth(), 1);    
  	this.time_start   = ndate;
  	this.sttime_start = this.formatDate(ndate);
  	
  	var ldate         = new Date(ndate.getFullYear(), ndate.getUTCMonth() + 1, 0);
  	this.time_end     = ldate;
  	this.sttime_end   = this.formatDate(ldate); 
  	//cb(this.start,this.end);  	

  },

  setDateChooser : function(){
      var that = this;
      $('#datetimepicker8').datetimepicker({
            //viewMode: 'months',
            useCurrent:true,
            defaultDate: this.time_start,
            format: 'DD MMMM YYYY'
              
        })
        $('#datetimepicker9').datetimepicker({
            //viewMode: 'months',
            useCurrent:true,
            defaultDate: this.time_end,
            format: 'DD MMMM YYYY'
        })

      $("#datetimepicker8").on("dp.change", function (e) {        
          var ndate         = new Date(e.date);
          that.sttime_start = that.formatDate(ndate);         
          that.loadChart();

          window.sellsTable.opts.params = {start:that.sttime_start,end:that.sttime_end};
          window.sellsTable.theLoad();
        });

        $("#datetimepicker9").on("dp.change", function (e) {        
          var ndate       = new Date(e.date);
          that.sttime_end = that.formatDate(ndate);

          console.log(that.sttime_end)
          that.loadChart();   

          window.sellsTable.opts.params = {start:that.sttime_start,end:that.sttime_end};
          window.sellsTable.theLoad();
        });

  },
  loadChart : function(){
  	   var that = this;


				$('#canvas').remove();
				$('#labels-totals').hide();
				$.get('sells/chart/?start='+that.sttime_start+'&end='+that.sttime_end,function(data){		

						if(data.data.values.length > 0 ){	

							$('#labels-totals').show();			
							var sum = 0;
							for(x in data.data.values ){
								sum += data.data.values[x];
							}
							var tax  = sum * ( that.options.tax / 100 );
							var neto = sum - tax ;
							$('#label-total').text( sum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
							$('#label-tax').text( tax.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
							$('#label-neto').text( neto.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

						var lineChartData = {
						 labels : data.data.labels,
						 datasets: [
					        {
					            label: "My First dataset",
					            fillColor: "rgba(220,220,220,0.2)",
					            strokeColor: "#4CAF50",
					            pointColor: "#00796b",
					            pointStrokeColor: "#4CAF50",
					            pointHighlightFill: "#00796b",
					            pointHighlightStroke: "rgba(220,220,220,1)",
					            data: data.data.values
						        }
						    ]
						}

						$('#chart-container').html('');
						var canvas = document.createElement('canvas');
							canvas.height = 200;
							canvas.width  = 500;
							canvas.id     = 'canvas';
							document.getElementById('chart-container').appendChild(canvas);								
						var ctx 		  = canvas.getContext("2d");

						window.chart = new Chart(ctx).Line(lineChartData, {
							responsive: true,				
			    			scaleGridLineWidth : 1,
			    			bezierCurve : false,
			   				pointDotRadius : 4	,
			   				pointDotStrokeWidth : 2,
			   				scaleLabel:function(label){return  '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");},
							tooltipTemplate: " Ventas del Dia $<"+ "%= value %" + ">",
						});	

					}else{
						
						
						$('#chart-container').html('No hay datos disponibles para esta fecha! ');
					}
				})	
  },

  tableSells : function(){
    var that  = this;
    var ndate = new Date();	
    window.sellsTable = $('#sellsTable').Table({         
         id : 'sells',
         width : '100%',
         searchtext : 'Buscar un Folio',
         source:'/sells/table',
         params:{start:that.sttime_start,end:that.sttime_end},
         rows:100,
         searcher:true,
         primary:'_id',
         headers : [
                    {db:'sku',name:'Folio de Venta',classname:'left',width:'10%',valueFunction:function(i,o){
                        var id   = o.uuid;
                        return '<span id="getproduct_'+id+'" class="label label-danger get-product" data-toggle="tooltip" data-placement="right" title="Click para cargar este producto">'+o.uuid+'</span>';
                    }},                                                                                                                          
                    {db:'date',name:'Fecha',classname:'left', width:'10%',valueFunction:function(i,o,t){  
                    	var months  = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                    	var date    = new Date(o.date);                      
                    	var year    = date.getFullYear();
                    	var month   = date.getMonth();
                    	var day     = date.getDate();

                    	var hour    = date.getHours();
                    	var min     = date.getMinutes();
                    	var sec     = date.getSeconds();

                    	var month   = months[month];//String(month).length == 2 ? month : '0'+month;
                    	var day     = String(day).length   == 2 ? day   : '0'+day;
                    	var hour    = String(hour).length  == 2 ? hour  : '0'+hour;
                    	var min     = String(min).length   == 2 ? min   : '0'+min;
                    	var sec     = String(sec).length   == 2 ? sec   : '0'+sec;

                    	var theDate = year+'-'+ month +'-'+ day +' '+ hour +':'+min +':'+sec;
                        return '<span class="label label-success ">'+theDate+'</span>';
                    }},    
                    {db:'amt',name:'Total',classname:'right', width:'15%',valueFunction:function(i,o){
                        return '$'+o.amt.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    }},  
                    
                 ],
            onCompleteRequest : function(){

                  $('.get-product').click(function(){
                     var id = this.id.split('_')[1];
                     return that.load(id);
                  })        
                  $('[data-toggle="tooltip"]').tooltip()
                  $('.remove-product').click(function(){
                      var id = this.id.split('_')[1];
                       window.asound.play();
                       bootbox.confirm({ message:'Deseas eliminar este producto de forma permanente?',callback:function(result) {
                         if( result ){
                          that.removeProduct(id); 
                         }
                       }});                      
                  })
            }
    });	

   },

});