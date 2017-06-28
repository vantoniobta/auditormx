Core_Report = Core.extend({
    init : function(){
      this.panels();
      this.loadSupplier();
      //this.loadReportAll();
      //this.loadTable();
    },

    loadSupplier : function(){
        var that = this;
        $.ajax({
            url : '/providers/all',
            type: 'POST',
            data:{noMaxRow : ''},
            success: function(response){
                $('#list-supplier').append('<option value="1" hidden>Elegir un proveedor</option>');
                $(response.data).each(function(i,supplier){
                  $('#list-supplier').append('<option value="'+supplier.id+'">'+supplier.name+'</option>');
                });
            },
            complete : function(){
                that.run();
            }
        });
    },

    run : function(){
        var that = this;
        $('#list-supplier').on('change', function(){
            var id = $(this).val();
            that.loadReportBySupplier(id);
        });
    },

    loadReportBySupplier : function(id){
        var that = this;
        $.ajax({
            url : '/v1/inventory/report',
            type: 'POST',
            dataType : 'JSON',
            data : {idSupplier : id},
            success : function(data){
                if(data.code === 0){
                  that.drawTable(data.data);
                }
            }
        });
        jQuery.ajax({
            url: '/v1/supplier/load/logo',
            type: 'POST',
            dataType: 'json',
            data : {idSupplier : id},
            success: function(data) {
                console.log(data.url);
                $('#logo-supplier').html('');
                if(data.code == 0){
                    var img = document.createElement('img');
                    img.src = data.url;
                    img.width = '100';
                    img.height = '70';
                    $('#logo-supplier').append(img);
                }
            }
        });
        that.loadInfoSupplier(id);

    },

    loadInfoSupplier : function(id){
        var that = this;
        $.ajax({
            type: "POST",
            url: "/v1/supplier/load",
            data:{_id:id},
            success:function(response){
                that.isLogged(response,function(){
                    $('#name-supplier').html(response.data.name);
                    $('#domicile-supplier').html(response.data.address);
                    $('#client').html(response.data.name);
                    $('#campaing').html(response.data.name);

                    $('#info-supplier').html(response.data.name + '<br>RFC: ' + response.data.rfc + ' TEL:' + response.data.phone );
                });
            }
        });
    },

    drawTable : function(data){
      var that = this;
      $('#report tbody').html('');
      var cont = 1;
      var totalPriceMinusIva = 0;
      var totalIva = 0;
      var totalPrice = 0;
      $.each(data, function(i,row){
        var trTable = '';
        var price = row.price.replace(',','');
        var priceMinusIva = 0;
        var iva = 0;
        var priceUnit = 0;
        if(row.arts.length > 1){
          var priceForDay = that.getPriceForDay(row.from,row.to,price);
          for(var x= 0;x< row.arts.length; x++){
            //console.log(i +' --' + cont);
            var dateFrom = new Date(row.arts[x].from);
            var month = new String( dateFrom.getMonth( ) +1 );
                month = month.length == 1 ? '0'+ month : month;
                dateFrom = dateFrom.getDate()+'/'+ month +'/'+dateFrom.getFullYear();

            var dateTo = new Date(row.arts[x].to);
                month = new String( dateTo.getMonth( ) +1 );
                month = month.length == 1 ? '0'+ month : month;
                dateTo = dateTo.getDate()+'/'+ month +'/'+dateTo.getFullYear();

            priceUnit = that.getPriceUnit(row.arts[x].from, row.arts[x].to, priceForDay);
            priceMinusIva = that.getPriceMinusIva(priceUnit);
            iva = that.getIva(priceUnit);
            //console.log(priceMinusIva + ' ++ ' + cont);

            trTable += "<tr>";
            trTable += '<td>'+ cont +'</td>';
            trTable += '<td>'+row.location.code+'</td>';
            trTable += '<td>'+(row.location.light == 'con luz' ? 'SI' : 'NO')+'</td>';
            trTable += '<td>'+row.location.street+'</td>';
            trTable += '<td>'+row.location.neighbor+'</td>';
            trTable += '<td>'+row.location.city+'</td>';
            trTable += '<td>'+row.location.zip+'</td>';
            trTable += '<td>'+row.location.state+'</td>';
            trTable += '<td>'+row.location.ref_street[0]+'</td>';
            trTable += '<td>'+row.location.ref_street[1]+'</td>';
            trTable += '<td>'+row.location.measures.base+'x'+row.location.measures.height+'</td>';
            trTable += '<td>'+row.arts[x].content+'</td>';
            trTable += '<td>'+dateFrom+' AL '+dateTo+'</td>';
            trTable += '<td>'+that.formatNumber(priceMinusIva.toFixed(2),'$')+'</td>';
            trTable += '<td>'+that.formatNumber(iva.toFixed(2),'$')+'</td>';
            trTable += '<td>'+that.formatNumber(priceUnit.toFixed(2),'$')+'</td>';
            trTable += '</tr>';
            cont++;
            totalPrice += parseFloat(priceUnit);
            totalIva += parseFloat(iva);
            totalPriceMinusIva += parseFloat(priceMinusIva);
            //that.getPriceUnit(row.from,row.to);
            $('#report tbody').append(trTable);
            trTable = '';
          }
        }else{
          // console.log(i +' --' + cont);
          var dateFrom = new Date(row.arts[0].from);
            var month = new String( dateFrom.getMonth( ) +1 );
                month = month.length == 1 ? '0'+ month : month;
                dateFrom = dateFrom.getDate()+'/'+ month +'/'+dateFrom.getFullYear();

            var dateTo = new Date(row.arts[0].to);
                month = new String( dateTo.getMonth( ) +1 );
                month = month.length == 1 ? '0'+ month : month;
                dateTo = dateTo.getDate()+'/'+ month +'/'+dateTo.getFullYear();

          priceUnit = parseFloat(price);
          priceMinusIva = that.getPriceMinusIva(priceUnit);
          iva = that.getIva(priceUnit);

          trTable = "<tr>";
          trTable += '<td>'+cont+'</td>';
          trTable += '<td>'+row.location.code+'</td>';
          trTable += '<td>'+(row.location.light == 'con luz' ? 'SI' : 'NO')+'</td>';
          trTable += '<td>'+row.location.street+'</td>';
          trTable += '<td>'+row.location.neighbor+'</td>';
          trTable += '<td>'+row.location.city+'</td>';
          trTable += '<td>'+row.location.zip+'</td>';
          trTable += '<td>'+row.location.state+'</td>';
          trTable += '<td>'+row.location.ref_street[0]+'</td>';
          trTable += '<td>'+row.location.ref_street[1]+'</td>';
          trTable += '<td>'+row.location.measures.base+'x'+row.location.measures.height+'</td>';
          trTable += '<td>'+row.arts[0].content+'</td>';
          trTable += '<td>'+dateFrom+' AL '+dateTo+'</td>';
          trTable += '<td>'+that.formatNumber(priceMinusIva.toFixed(2),'$') +'</td>';
          trTable += '<td>'+that.formatNumber(iva.toFixed(2),'$') +'</td>';
          trTable += '<td>'+that.formatNumber(priceUnit.toFixed(2),'$')+'</td>';
          trTable += '</tr>';
          totalPrice += parseFloat(priceUnit);
          totalIva += parseFloat(iva);
          totalPriceMinusIva += parseFloat(priceMinusIva);
          cont++;
          $('#report tbody').append(trTable);
          trTable = '';

        }
        // console.log(row.arts.length);
      });
      var trTotalTable = '<tr>';
      trTotalTable += '<td class="cell-hide" colspan="12"></td>';
      trTotalTable += '<td>Total</td>';
      trTotalTable += '<td>' + that.formatNumber(totalPriceMinusIva.toFixed(2),'$') + '</td>';
      trTotalTable += '<td>' + that.formatNumber(totalIva.toFixed(2),'$') + '</td>';
      trTotalTable += '<td>' + that.formatNumber(totalPrice.toFixed(2),'$') + '</td>';
      trTotalTable += '</tr>';
      $('#report tbody').append(trTotalTable);
      //console.log(totalPriceMinusIva+' ++ ' + totalIva + ' ++ '+ totalPrice);
  },
  getIva : function(price){
    var iva = parseFloat(price);
        iva = (iva * 16)/100;
        //console.log(price + ' --' + iva);
        //iva = Math.round(iva * 100) / 100;
    return iva;
  },
  getPriceMinusIva : function(price){
    var priceMinusIva = parseFloat(price);
        priceMinusIva = priceMinusIva - this.getIva(priceMinusIva);
        //priceMinusIva = Math.round(priceMinusIva * 100) / 100;

    return priceMinusIva;
  },
  getPriceForDay : function(dateFrom,dateTo,price){
    var from = new Date(dateFrom);
    var to = new Date(dateTo);
    var diferences = to.getDate() - from.getDate();
        diferences = diferences + 1;

    var priceForDay = parseFloat(price) / parseFloat(diferences);
        //priceForDay = Math.round(priceForDay * 100)/ 100;
    //var days = Math.floor(diferences / (1000 * 60 * 60 * 24));
    return priceForDay;
  },
  getPriceUnit : function(dateFrom, dateTo, priceForDay){
    var from = new Date(dateFrom);
    var to = new Date(dateTo);
    var diferences = to.getDate() - from.getDate();
        diferences = diferences + 1;

    var priceUnit = parseFloat(priceForDay) * parseFloat(diferences);
        //priceUnit = Math.round(priceUnit * 100)/ 100;
    //var days = Math.floor(diferences / (1000 * 60 * 60 * 24));
    return priceUnit;
  },

  formatNumber : function(num,prefix){
    prefix = prefix ||'';
    num += '';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '.00';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
      splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
    }
    return prefix + splitLeft + splitRight;
  },

  roundNumber : function (number){

  }
});
