Core_Dashboard = Core.extend({

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

    //this.currentDates();
  },

  index : function(options){

    this.options = options;

  	// load object
  	this.run();

    // set Date pickers
    //this.setDateChooser()

  	//load chart
  	// this.loadChart();

  	//table
  	// this.table();


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
      $('#datetimepicker_start').datetimepicker({
            //viewMode: 'months',
            useCurrent:true,
            defaultDate: this.time_start,
            format: 'DD MMMM YYYY'

        })
        $('#datetimepicker_end').datetimepicker({
            //viewMode: 'months',
            useCurrent:true,
            defaultDate: this.time_end,
            format: 'DD MMMM YYYY'
        })

      $("#datetimepicker_start").on("dp.change", function (e) {
          var ndate         = new Date(e.date);
          that.sttime_start = that.formatDate(ndate);
          that.loadChart();

          window.sellsTable.opts.params = {start:that.sttime_start,end:that.sttime_end};
          window.sellsTable.theLoad();
        });

        $("#datetimepicker_end").on("dp.change", function (e) {
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

       Chart.types.Line.extend({
          name: "BarAlt",
          initialize: function(data){
              data.labels.forEach(function(item, index) {
                  data.labels[index] += Array(Math.max(30 - item.length, 0)).join(" ");
              })
              Chart.types.Line.prototype.initialize.apply(this, arguments);
          },
          draw: function(){
              var xScalePaddingRight = 120
              this.scale.xScalePaddingRight = xScalePaddingRight
              Chart.types.Line.prototype.draw.apply(this, arguments);
              this.chart.ctx.fillStyle="#FFF";
              this.chart.ctx.fillRect(this.chart.canvas.width - xScalePaddingRight, 0, xScalePaddingRight, this.chart.canvas.height);
          }
      });

				$('#canvas').remove();
				$('#labels-totals').hide();
        //'sells/chart/?start='+that.sttime_start+'&end='+that.sttime_end
				$.get('/cdn/chart.json',function(data){

						if(data.data.values.length > 0 ){

							// $('#labels-totals').show();
							// var sum = 0;
							// for(x in data.data.values ){
							// 	sum += data.data.values[x];
							// }
						//	var tax  = sum * ( that.options.tax / 100 );
						//	var neto = sum - tax ;
						//	$('#label-total').text( sum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
						//	$('#label-tax').text( tax.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
						//	$('#label-neto').text( neto.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

						var lineChartData = {
						 labels : data.data.labels,
						 datasets: [
					        {
					            label: "My First dataset",
					            fillColor: "rgba(220,220,220,0.2)",
					            strokeColor: "#fff",
					            pointColor: "#0097A7",
					            pointStrokeColor: "#fff",
					            pointHighlightFill: "#0097A7",
					            pointHighlightStroke: "rgba(220,220,220,1)",
					            data: data.data.values
						        }
						    ]
						}

						$('#chart-container').html('');
						var canvas = document.createElement('canvas');
							canvas.height = 208;
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
                scaleFontColor: "#fff",
                pointLabelFontColor:"#fff",
                scaleGridLineColor : "rgba(220,220,220,0.2)",
                scaleLineColor:'rgba(220,220,220,0.7)',
                scaleLineWidth: 5,
			   				scaleLabel:function(label){return  '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");},
							tooltipTemplate: " Pagos del Dia $<"+ "%= value %" + ">",
						});

					}else{
						$('#chart-container').html('No hay datos disponibles para esta fecha! ');
					}
				})
  },
  table : function(){
    var that  = this;
    var ndate = new Date();


    var headers = {
      'owner_name'      :{name:'Nombre',width:'50px',type:'text', align:'left', label:'primary'},
      'phone'           :{name:'Telefóno',width:'30px',type:'phone', align:'center' },
      'mobile'          :{name:'Móvil',width:'30px',type:'phone', align:'center' },
      'other_phone'     :{name:'Otro',width:'30px',type:'phone', align:'center' },
      'email'           :{name:'Email',width:'50px',type:'text', align:'right'},
      'debt'            :{name:'Adeudo Total',width:'50px',type:'money', align:'right'},
      'counter'         :{name:'Mensualidades atrasadas',width:'50px',type:'integer', align:'center'},
      'status'          :{name:'Estatus',width:'50px',  align:'center', value:function(i,o){
              var value = o.status;
              var classes = value == 1 ? 'label-success' : 'label-default';
              var label   = value == 1 ? 'Pagado' : 'Por pagar';

              if( value == 0 && o.current_date > o.date){
                var classes = 'label-danger';
                var label   = 'Atrasado';
              }
              return '<span class="label '+classes+'">'+label+'</span>';
        }}
      };
      
   $('#theTable').Table({
      source   :'/dashboard/debts',
      method   :'GET',
      type     :'table',
      tooltips :true,
      rows     :10,
      sortable :false,
      checkbox :false,
      headers  :headers,
      onLink: function(e){
          console.log(e);
      },
      onCheckBox: function(check){
          console.log('is checked',check);
      },
      onCheckBoxMain : function(checked){
          console.log(checked)
      },
      onCompleteRequest:function(){
          $('#theTable .fa-times').click(function(){
              if( confirm('are you sure to delete item: '+  $(this).attr('data-sku') )  ) {

              }
          });

      }
    })

   },

});
