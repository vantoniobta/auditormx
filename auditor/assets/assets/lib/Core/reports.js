Core_Report = Core.extend({

    init : function(){

    },

    run : function(){

    	$('.label-tooltip').tooltip();
    	this.setTable();
    	this.setTableMobile();

    },

    setTable : function(){


    	window.statusTable = $('#statusLocationsTable').Table({
             id : 'lasts',
             width : '100%',
             source:'/reports/table',
             rows:10,
             searcher:true,
             primary:'_id',
             // sortable:true,
             headers : [
                    {db:'provider_name',name:'Proveedor',classname:'left',width:'10%'},
                    {db:'code',name:'Código',classname:'left',width:'10%'},
                    {db:'light',name:'Luz',classname:'left',width:'10%'},
                    {db:'street',name:'Dirección',classname:'left',width:'10%'},
                    {db:'neighbor',name:'Colonia',classname:'left',width:'10%'},
                    {db:'ref_street_1',name:'Referencia 1',classname:'left',width:'10%'},
                    {db:'ref_street_2',name:'Referencia 2',classname:'left',width:'10%'},
                    {db:'zip',name:'CP',classname:'left',width:'5%'},
                    {db:'city',name:'Municipio',classname:'left',width:'10%'},
                    {db:'state',name:'Estado',classname:'left',width:'10%'},
                    {db:'dimensions',name:'Dimensiones',classname:'center',width:'5%'},
                    {db:'art_name',name:'Arte',classname:'left',width:'5%'},
                    {db:'price',name:'Precio',classname:'left',width:'5%',valueFunction:function(i,o){
                    	return numeral(o.price).format('$0,0.00');
                    }},
                    {db:'tax',name:'IVA',classname:'left',width:'5%',valueFunction:function(i,o){
                    	return numeral(o.tax).format('$0,0.00');
                    }},
                    {db:'snapshots',name:'Fotos',classname:'left',width:'10%',valueFunction:function(i,o){
                    	if( o.snapshots ){
                    		var str = '';
                    		var snapshots = o.snapshots.split(',');
                    			for(x in snapshots ){
                    				var url = 'http://iclicauditor.com/uploads/status/'+o.status+'/'+snapshots[x];
                    				// str += '<img src="'+url+'" >';
                    				str += '<a data-lightbox="status images" data-title="1" id="lastimage_link_' + x + '" href="' + url + '"> <img  alt="1" class="img-thumbnail" id="lastimage_' + x + '" src="' + url + '" width="20px" height="20px"> </a>';
                    			}

                    		return str;
                    	}else{
                    		return '';
                    	}
                    }},
                 ],
            onCompleteRequest : function(){
                $('.status_tooltip').tooltip();
            }
        });
    },

     setTableMobile : function(){


    	window.statusTable = $('#statusMobileTable').Table({
             id : 'lasts',
             width : '100%',
             source:'/reports/mobile',
             rows:10,
             searcher:true,
             primary:'_id',
             // sortable:true,
             headers : [
                    {db:'provider_name',name:'Proveedor',classname:'left',width:'10%'},
                    {db:'code',name:'Código',classname:'left',width:'10%'},
                    {db:'license_plate',name:'Placa',classname:'left',width:'10%'},
                    {db:'dimensions',name:'Dimensiones',classname:'center',width:'5%'},
                    {db:'art_name',name:'Arte',classname:'left',width:'5%'},
                    {db:'price',name:'Precio',classname:'left',width:'5%',valueFunction:function(i,o){
                    	return numeral(o.price).format('$0,0.00');
                    }},
                    {db:'tax',name:'IVA',classname:'left',width:'5%',valueFunction:function(i,o){
                    	return numeral(o.tax).format('$0,0.00');
                    }},
                    {db:'snapshots',name:'Fotos',classname:'left',width:'10%',valueFunction:function(i,o){
                    	if( o.snapshots ){
                    		var str = '';
                    		var snapshots = o.snapshots.split(',');
                    			for(x in snapshots ){
                    				var url = 'http://iclicauditor.com/uploads/status/'+o.status+'/'+snapshots[x];
                    				// str += '<img src="'+url+'" >';
                    				str += '<a data-lightbox="status images" data-title="1" id="lastimage_link_' + x + '" href="' + url + '"> <img  alt="1" class="img-thumbnail" id="lastimage_' + x + '" src="' + url + '" width="20px" height="20px"> </a>';
                    			}

                    		return str;
                    	}else{
                    		return '';
                    	}
                    }},
                 ],
            onCompleteRequest : function(){
                $('.status_tooltip').tooltip();
            }
        });
    }




});
