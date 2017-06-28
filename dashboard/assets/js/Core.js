// $.fn.disableSelection = function() {
//     return this
//              .attr('unselectable', 'on')
//              .css('user-select', 'none')
//              .on('selectstart', false);
// };

// function twoDigits(d) {
//     if(0 <= d && d < 10) return "0" + d.toString();
//     if(-10 < d && d < 0) return "-0" + (-1*d).toString();
//     return d.toString();
// }

// Date.prototype.toMySQLDatetime = function() {
//     return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
// };
// Date.prototype.toMySQLDate = function() {
//    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) ;
// };

// var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
// $("body").on("shown.bs.modal", ".modal", function() {
//     $(this).find('div.modal-dialog').css({
//         'margin-top': function () {
//             var modal_height = $('.modal-dialog').first().height();
//             var window_height = $(window).height();
//             return ((window_height/2) - (modal_height/2));
//         }
//     });
// });

(function($){
	$.unserialize = function(serializedString){
		var str = decodeURI(serializedString);
		var pairs = str.split('&');
		var obj = {}, p, idx, val;
		for (var i=0, n=pairs.length; i < n; i++) {
			p = pairs[i].split('=');
			idx = p[0];

			if (idx.indexOf("[]") == (idx.length - 2)) {
				// Eh um vetor
				var ind = idx.substring(0, idx.length-2)
				if (obj[ind] === undefined) {
					obj[ind] = [];
				}
				obj[ind].push(p[1]);
			}
			else {
				obj[idx] = p[1];
			}
		}
		return obj;
	};
})(jQuery);

$(function() {

  // Handler for .ready() called.
  var path = window.location.pathname;
  var controller =  path.split("/").length === 3 ? path.split("/")[1] : path.split("/").pop();
  var action     = path.split("/").length === 3 ? path.split("/").pop() : '';
  $('#nav_'+controller).addClass('active');
  $('#nav_'+controller+'_'+action).addClass('active');
});


Number.prototype.toMoney = function(){
  return parseFloat(this).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

String.prototype.toCapitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
 Core = Class.extend({

    countrys : [
    {'ccode' : 'AF', 'cname' : 'Afghanistan'},
    {'ccode' : 'AX', 'cname' : 'Aland Islands'},
    {'ccode' : 'AL', 'cname' : 'Albania'},
    {'ccode' : 'DZ', 'cname' : 'Algeria'},
    {'ccode' : 'AS', 'cname' : 'American Samoa'},
    {'ccode' : 'AD', 'cname' : 'Andorra'},
    {'ccode' : 'AO', 'cname' : 'Angola'},
    {'ccode' : 'AI', 'cname' : 'Anguilla'},
    {'ccode' : 'AQ', 'cname' : 'Antarctica'},
    {'ccode' : 'AG', 'cname' : 'Antigua And Barbuda'},
    {'ccode' : 'AR', 'cname' : 'Argentina'},
    {'ccode' : 'AM', 'cname' : 'Armenia'},
    {'ccode' : 'AW', 'cname' : 'Aruba'},
    {'ccode' : 'AU', 'cname' : 'Australia'},
    {'ccode' : 'AT', 'cname' : 'Austria'},
    {'ccode' : 'AZ', 'cname' : 'Azerbaijan'},
    {'ccode' : 'BS', 'cname' : 'Bahamas'},
    {'ccode' : 'BH', 'cname' : 'Bahrain'},
    {'ccode' : 'BD', 'cname' : 'Bangladesh'},
    {'ccode' : 'BB', 'cname' : 'Barbados'},
    {'ccode' : 'BY', 'cname' : 'Belarus'},
    {'ccode' : 'BE', 'cname' : 'Belgium'},
    {'ccode' : 'BZ', 'cname' : 'Belize'},
    {'ccode' : 'BJ', 'cname' : 'Benin'},
    {'ccode' : 'BM', 'cname' : 'Bermuda'},
    {'ccode' : 'BT', 'cname' : 'Bhutan'},
    {'ccode' : 'BO', 'cname' : 'Bolivia'},
    {'ccode' : 'BA', 'cname' : 'Bosnia And Herzegovina'},
    {'ccode' : 'BW', 'cname' : 'Botswana'},
    {'ccode' : 'BV', 'cname' : 'Bouvet Island'},
    {'ccode' : 'BR', 'cname' : 'Brazil'},
    {'ccode' : 'IO', 'cname' : 'British Indian Ocean Territory'},
    {'ccode' : 'BN', 'cname' : 'Brunei Darussalam'},
    {'ccode' : 'BG', 'cname' : 'Bulgaria'},
    {'ccode' : 'BF', 'cname' : 'Burkina Faso'},
    {'ccode' : 'BI', 'cname' : 'Burundi'},
    {'ccode' : 'KH', 'cname' : 'Cambodia'},
    {'ccode' : 'CM', 'cname' : 'Cameroon'},
    {'ccode' : 'CA', 'cname' : 'Canada'},
    {'ccode' : 'CV', 'cname' : 'Cape Verde'},
    {'ccode' : 'KY', 'cname' : 'Cayman Islands'},
    {'ccode' : 'CF', 'cname' : 'Central African Republic'},
    {'ccode' : 'TD', 'cname' : 'Chad'},
    {'ccode' : 'CL', 'cname' : 'Chile'},
    {'ccode' : 'CN', 'cname' : 'China'},
    {'ccode' : 'CX', 'cname' : 'Christmas Island'},
    {'ccode' : 'CC', 'cname' : 'Cocos (Keeling) Islands'},
    {'ccode' : 'CO', 'cname' : 'Colombia'},
    {'ccode' : 'KM', 'cname' : 'Comoros'},
    {'ccode' : 'CG', 'cname' : 'Congo'},
    {'ccode' : 'CD', 'cname' : 'Congo, Democratic Republic'},
    {'ccode' : 'CK', 'cname' : 'Cook Islands'},
    {'ccode' : 'CR', 'cname' : 'Costa Rica'},
    {'ccode' : 'CI', 'cname' : 'Cote D\'Ivoire'},
    {'ccode' : 'HR', 'cname' : 'Croatia'},
    {'ccode' : 'CU', 'cname' : 'Cuba'},
    {'ccode' : 'CY', 'cname' : 'Cyprus'},
    {'ccode' : 'CZ', 'cname' : 'Czech Republic'},
    {'ccode' : 'DK', 'cname' : 'Denmark'},
    {'ccode' : 'DJ', 'cname' : 'Djibouti'},
    {'ccode' : 'DM', 'cname' : 'Dominica'},
    {'ccode' : 'DO', 'cname' : 'Dominican Republic'},
    {'ccode' : 'EC', 'cname' : 'Ecuador'},
    {'ccode' : 'EG', 'cname' : 'Egypt'},
    {'ccode' : 'SV', 'cname' : 'El Salvador'},
    {'ccode' : 'GQ', 'cname' : 'Equatorial Guinea'},
    {'ccode' : 'ER', 'cname' : 'Eritrea'},
    {'ccode' : 'EE', 'cname' : 'Estonia'},
    {'ccode' : 'ET', 'cname' : 'Ethiopia'},
    {'ccode' : 'FK', 'cname' : 'Falkland Islands (Malvinas)'},
    {'ccode' : 'FO', 'cname' : 'Faroe Islands'},
    {'ccode' : 'FJ', 'cname' : 'Fiji'},
    {'ccode' : 'FI', 'cname' : 'Finland'},
    {'ccode' : 'FR', 'cname' : 'France'},
    {'ccode' : 'GF', 'cname' : 'French Guiana'},
    {'ccode' : 'PF', 'cname' : 'French Polynesia'},
    {'ccode' : 'TF', 'cname' : 'French Southern Territories'},
    {'ccode' : 'GA', 'cname' : 'Gabon'},
    {'ccode' : 'GM', 'cname' : 'Gambia'},
    {'ccode' : 'GE', 'cname' : 'Georgia'},
    {'ccode' : 'DE', 'cname' : 'Germany'},
    {'ccode' : 'GH', 'cname' : 'Ghana'},
    {'ccode' : 'GI', 'cname' : 'Gibraltar'},
    {'ccode' : 'GR', 'cname' : 'Greece'},
    {'ccode' : 'GL', 'cname' : 'Greenland'},
    {'ccode' : 'GD', 'cname' : 'Grenada'},
    {'ccode' : 'GP', 'cname' : 'Guadeloupe'},
    {'ccode' : 'GU', 'cname' : 'Guam'},
    {'ccode' : 'GT', 'cname' : 'Guatemala'},
    {'ccode' : 'GG', 'cname' : 'Guernsey'},
    {'ccode' : 'GN', 'cname' : 'Guinea'},
    {'ccode' : 'GW', 'cname' : 'Guinea-Bissau'},
    {'ccode' : 'GY', 'cname' : 'Guyana'},
    {'ccode' : 'HT', 'cname' : 'Haiti'},
    {'ccode' : 'HM', 'cname' : 'Heard Island & Mcdonald Islands'},
    {'ccode' : 'VA', 'cname' : 'Holy See (Vatican City State)'},
    {'ccode' : 'HN', 'cname' : 'Honduras'},
    {'ccode' : 'HK', 'cname' : 'Hong Kong'},
    {'ccode' : 'HU', 'cname' : 'Hungary'},
    {'ccode' : 'IS', 'cname' : 'Iceland'},
    {'ccode' : 'IN', 'cname' : 'India'},
    {'ccode' : 'ID', 'cname' : 'Indonesia'},
    {'ccode' : 'IR', 'cname' : 'Iran, Islamic Republic Of'},
    {'ccode' : 'IQ', 'cname' : 'Iraq'},
    {'ccode' : 'IE', 'cname' : 'Ireland'},
    {'ccode' : 'IM', 'cname' : 'Isle Of Man'},
    {'ccode' : 'IL', 'cname' : 'Israel'},
    {'ccode' : 'IT', 'cname' : 'Italy'},
    {'ccode' : 'JM', 'cname' : 'Jamaica'},
    {'ccode' : 'JP', 'cname' : 'Japan'},
    {'ccode' : 'JE', 'cname' : 'Jersey'},
    {'ccode' : 'JO', 'cname' : 'Jordan'},
    {'ccode' : 'KZ', 'cname' : 'Kazakhstan'},
    {'ccode' : 'KE', 'cname' : 'Kenya'},
    {'ccode' : 'KI', 'cname' : 'Kiribati'},
    {'ccode' : 'KR', 'cname' : 'Korea'},
    {'ccode' : 'KW', 'cname' : 'Kuwait'},
    {'ccode' : 'KG', 'cname' : 'Kyrgyzstan'},
    {'ccode' : 'LA', 'cname' : 'Lao People\'s Democratic Republic'},
    {'ccode' : 'LV', 'cname' : 'Latvia'},
    {'ccode' : 'LB', 'cname' : 'Lebanon'},
    {'ccode' : 'LS', 'cname' : 'Lesotho'},
    {'ccode' : 'LR', 'cname' : 'Liberia'},
    {'ccode' : 'LY', 'cname' : 'Libyan Arab Jamahiriya'},
    {'ccode' : 'LI', 'cname' : 'Liechtenstein'},
    {'ccode' : 'LT', 'cname' : 'Lithuania'},
    {'ccode' : 'LU', 'cname' : 'Luxembourg'},
    {'ccode' : 'MO', 'cname' : 'Macao'},
    {'ccode' : 'MK', 'cname' : 'Macedonia'},
    {'ccode' : 'MG', 'cname' : 'Madagascar'},
    {'ccode' : 'MW', 'cname' : 'Malawi'},
    {'ccode' : 'MY', 'cname' : 'Malaysia'},
    {'ccode' : 'MV', 'cname' : 'Maldives'},
    {'ccode' : 'ML', 'cname' : 'Mali'},
    {'ccode' : 'MT', 'cname' : 'Malta'},
    {'ccode' : 'MH', 'cname' : 'Marshall Islands'},
    {'ccode' : 'MQ', 'cname' : 'Martinique'},
    {'ccode' : 'MR', 'cname' : 'Mauritania'},
    {'ccode' : 'MU', 'cname' : 'Mauritius'},
    {'ccode' : 'YT', 'cname' : 'Mayotte'},
    {'ccode' : 'MX', 'cname' : 'Mexico'},
    {'ccode' : 'FM', 'cname' : 'Micronesia, Federated States Of'},
    {'ccode' : 'MD', 'cname' : 'Moldova'},
    {'ccode' : 'MC', 'cname' : 'Monaco'},
    {'ccode' : 'MN', 'cname' : 'Mongolia'},
    {'ccode' : 'ME', 'cname' : 'Montenegro'},
    {'ccode' : 'MS', 'cname' : 'Montserrat'},
    {'ccode' : 'MA', 'cname' : 'Morocco'},
    {'ccode' : 'MZ', 'cname' : 'Mozambique'},
    {'ccode' : 'MM', 'cname' : 'Myanmar'},
    {'ccode' : 'NA', 'cname' : 'Namibia'},
    {'ccode' : 'NR', 'cname' : 'Nauru'},
    {'ccode' : 'NP', 'cname' : 'Nepal'},
    {'ccode' : 'NL', 'cname' : 'Netherlands'},
    {'ccode' : 'AN', 'cname' : 'Netherlands Antilles'},
    {'ccode' : 'NC', 'cname' : 'New Caledonia'},
    {'ccode' : 'NZ', 'cname' : 'New Zealand'},
    {'ccode' : 'NI', 'cname' : 'Nicaragua'},
    {'ccode' : 'NE', 'cname' : 'Niger'},
    {'ccode' : 'NG', 'cname' : 'Nigeria'},
    {'ccode' : 'NU', 'cname' : 'Niue'},
    {'ccode' : 'NF', 'cname' : 'Norfolk Island'},
    {'ccode' : 'MP', 'cname' : 'Northern Mariana Islands'},
    {'ccode' : 'NO', 'cname' : 'Norway'},
    {'ccode' : 'OM', 'cname' : 'Oman'},
    {'ccode' : 'PK', 'cname' : 'Pakistan'},
    {'ccode' : 'PW', 'cname' : 'Palau'},
    {'ccode' : 'PS', 'cname' : 'Palestinian Territory, Occupied'},
    {'ccode' : 'PA', 'cname' : 'Panama'},
    {'ccode' : 'PG', 'cname' : 'Papua New Guinea'},
    {'ccode' : 'PY', 'cname' : 'Paraguay'},
    {'ccode' : 'PE', 'cname' : 'Peru'},
    {'ccode' : 'PH', 'cname' : 'Philippines'},
    {'ccode' : 'PN', 'cname' : 'Pitcairn'},
    {'ccode' : 'PL', 'cname' : 'Poland'},
    {'ccode' : 'PT', 'cname' : 'Portugal'},
    {'ccode' : 'PR', 'cname' : 'Puerto Rico'},
    {'ccode' : 'QA', 'cname' : 'Qatar'},
    {'ccode' : 'RE', 'cname' : 'Reunion'},
    {'ccode' : 'RO', 'cname' : 'Romania'},
    {'ccode' : 'RU', 'cname' : 'Russian Federation'},
    {'ccode' : 'RW', 'cname' : 'Rwanda'},
    {'ccode' : 'BL', 'cname' : 'Saint Barthelemy'},
    {'ccode' : 'SH', 'cname' : 'Saint Helena'},
    {'ccode' : 'KN', 'cname' : 'Saint Kitts And Nevis'},
    {'ccode' : 'LC', 'cname' : 'Saint Lucia'},
    {'ccode' : 'MF', 'cname' : 'Saint Martin'},
    {'ccode' : 'PM', 'cname' : 'Saint Pierre And Miquelon'},
    {'ccode' : 'VC', 'cname' : 'Saint Vincent And Grenadines'},
    {'ccode' : 'WS', 'cname' : 'Samoa'},
    {'ccode' : 'SM', 'cname' : 'San Marino'},
    {'ccode' : 'ST', 'cname' : 'Sao Tome And Principe'},
    {'ccode' : 'SA', 'cname' : 'Saudi Arabia'},
    {'ccode' : 'SN', 'cname' : 'Senegal'},
    {'ccode' : 'RS', 'cname' : 'Serbia'},
    {'ccode' : 'SC', 'cname' : 'Seychelles'},
    {'ccode' : 'SL', 'cname' : 'Sierra Leone'},
    {'ccode' : 'SG', 'cname' : 'Singapore'},
    {'ccode' : 'SK', 'cname' : 'Slovakia'},
    {'ccode' : 'SI', 'cname' : 'Slovenia'},
    {'ccode' : 'SB', 'cname' : 'Solomon Islands'},
    {'ccode' : 'SO', 'cname' : 'Somalia'},
    {'ccode' : 'ZA', 'cname' : 'South Africa'},
    {'ccode' : 'GS', 'cname' : 'South Georgia And Sandwich Isl.'},
    {'ccode' : 'ES', 'cname' : 'Spain'},
    {'ccode' : 'LK', 'cname' : 'Sri Lanka'},
    {'ccode' : 'SD', 'cname' : 'Sudan'},
    {'ccode' : 'SR', 'cname' : 'Suriname'},
    {'ccode' : 'SJ', 'cname' : 'Svalbard And Jan Mayen'},
    {'ccode' : 'SZ', 'cname' : 'Swaziland'},
    {'ccode' : 'SE', 'cname' : 'Sweden'},
    {'ccode' : 'CH', 'cname' : 'Switzerland'},
    {'ccode' : 'SY', 'cname' : 'Syrian Arab Republic'},
    {'ccode' : 'TW', 'cname' : 'Taiwan'},
    {'ccode' : 'TJ', 'cname' : 'Tajikistan'},
    {'ccode' : 'TZ', 'cname' : 'Tanzania'},
    {'ccode' : 'TH', 'cname' : 'Thailand'},
    {'ccode' : 'TL', 'cname' : 'Timor-Leste'},
    {'ccode' : 'TG', 'cname' : 'Togo'},
    {'ccode' : 'TK', 'cname' : 'Tokelau'},
    {'ccode' : 'TO', 'cname' : 'Tonga'},
    {'ccode' : 'TT', 'cname' : 'Trinidad And Tobago'},
    {'ccode' : 'TN', 'cname' : 'Tunisia'},
    {'ccode' : 'TR', 'cname' : 'Turkey'},
    {'ccode' : 'TM', 'cname' : 'Turkmenistan'},
    {'ccode' : 'TC', 'cname' : 'Turks And Caicos Islands'},
    {'ccode' : 'TV', 'cname' : 'Tuvalu'},
    {'ccode' : 'UG', 'cname' : 'Uganda'},
    {'ccode' : 'UA', 'cname' : 'Ukraine'},
    {'ccode' : 'AE', 'cname' : 'United Arab Emirates'},
    {'ccode' : 'GB', 'cname' : 'United Kingdom'},
    {'ccode' : 'US', 'cname' : 'United States'},
    {'ccode' : 'UM', 'cname' : 'United States Outlying Islands'},
    {'ccode' : 'UY', 'cname' : 'Uruguay'},
    {'ccode' : 'UZ', 'cname' : 'Uzbekistan'},
    {'ccode' : 'VU', 'cname' : 'Vanuatu'},
    {'ccode' : 'VE', 'cname' : 'Venezuela'},
    {'ccode' : 'VN', 'cname' : 'Viet Nam'},
    {'ccode' : 'VG', 'cname' : 'Virgin Islands, British'},
    {'ccode' : 'VI', 'cname' : 'Virgin Islands, U.S.'},
    {'ccode' : 'WF', 'cname' : 'Wallis And Futuna'},
    {'ccode' : 'EH', 'cname' : 'Western Sahara'},
    {'ccode' : 'YE', 'cname' : 'Yemen'},
    {'ccode' : 'ZM', 'cname' : 'Zambia'},
    {'ccode' : 'ZW', 'cname' : 'Zimbabwe'}
    ],

    remote : {
          token: null,
          secret: null
    },

    init  : function(){


    },
    sounds : function(){

      window.asound         = document.createElement('audio');
      window.asound.preload = "auto";
      document.body.appendChild(window.asound);
      var asource           = document.createElement('source');
          asource.src       = "/audio/alert-popup.mp3"
      window.asound.appendChild(asource);

    },
    config : function(options){
      // console.log(options);
    },
    formatDate   :function(ndate){
      var year    = ndate.getFullYear();
      var month   = ndate.getUTCMonth()+1;
      var day     = ndate.getUTCDate();
      var month   =String(month).length == 2 ? month : '0'+month;
      var day     = String(day).length   == 2 ? day   : '0'+day;
      return year+'-'+ month +'-'+ day;
    },
    formatDateTime   :function(ndate){
      var year    = ndate.getFullYear();
      var month   = ndate.getUTCMonth()+1;
      var day     = ndate.getUTCDate();
      var month   = String(month).length == 2 ? month : '0'+month;
      var day     = String(day).length   == 2 ? day   : '0'+day;

      var hour    = ndate.getUTCHours();
      var min     = ndate.getUTCMinutes();
      var sec     = ndate.getUTCSeconds();

      var month   = String(month).length == 2 ? month : '0'+month;
      var day     = String(day).length   == 2 ? day   : '0'+day;
      var hour    = String(hour).length  == 2 ? hour  : '0'+hour;
      var min     = String(min).length   == 2 ? min   : '0'+min;
      var sec     = String(sec).length   == 2 ? sec   : '0'+sec;

      return  year+'-'+ month +'-'+ day +' '+ hour +':'+min +':'+sec;
    },

    getControllerName : function(){
    	var path  				= window.location.pathname;
    	var controller 		=  path.split("/").length === 3 ? path.split("/")[1] : path.split("/").pop();
    	var	controller		= controller == '' ? 'index': controller;
			return 	controller
    },

    getActionName : function(){
    	var path  = window.location.pathname;
			return 	path.split("/").length === 3 ? path.split("/").pop() : 'index';
    },

    getCurrentController : function(options){

		var path         			= window.location.pathname;
		this._controller 			=  this.getControllerName();
		this._action     			=  this.getActionName();
		this._options 				= options;

      if( typeof(this[this._controller]) != 'function'){
      		return 'no function for this controller';
      }else{
        this[this._controller].call(this,options,this._action);
      }
    },
    getAction : function(options){
    	this[this.getActionName()].call(this,options);
    },
    registerForm : function(id,cb,reset){

        var reset    = typeof(reset) == 'undefined' ? null : reset;
        var that     = this;
        this.inputid = $('#'+id).find('#input-id').val();


        $('#'+id).submit(function(){
           var data  = $(this).serialize();
           var adata = $(this).serializeArray();

            cb(this,data,adata);
            return false;
        });
    },
    disableForms : function(container,forms,status){
      $('#'+container).find(forms).attr("disabled", status);
    },
    disableAutocomplete : function(container,status){
      $(container).attr('autocomplete', 'off');
    },
    resetForm : function(id){
      //console.log('this.resetForm:',id);
      document.getElementById(id).reset();
      $('#'+id).find('#input-id').val(this.inputid);
      this.disableForms(id,'input, textarea, button, select',false);
    },
    isLogged: function(result,callback){
        if(result == 'login'){
          window.location.href = '/login';
          return true;
        }
        callback.call(result);
    },

    get : function(source,data,cb){
        var that     = this;
        var request  = $.ajax({
          method: "GET",
          url: source,
          crossDomain: true,
          headers:{
            token:this.remote.token,
            secret:this.remote.secret
          },
          data:data
        });
        request.done(function( item ) {
            cb(null,item);
        });
        request.fail(function( jqXHR, textStatus ) {
          that.msg( "No Response from Server: " + textStatus );
          cb(true,null);
        });
    },
    post : function(source,data,cb){

      var that     = this;
      var token    = this.remote.token  == null ? ''  : this.remote.token;
      var secret   = this.remote.secret == null ? '' : this.remote.secret;

      var request  = $.ajax({
        method: "POST",
        url: source,
        crossDomain: true,
        timeout: 30000,
        headers:{
          token:token,
          secret:secret
        },
        data:data
      });
      request.done(function( item ) {
          cb(null,item);
      });
      request.fail(function( data, status ) {
        // console.log(data,status);
        // that.msg( "No Response from Server: " +  );
        cb(true,data);
      });

    },
    panels : function(){
      var viewportWidth  = $(window).width();
      var viewportHeight = $(window).height();
      var navHeight      = $('#mainNavigator').height();

      var panelHeigth    = viewportHeight - ( navHeight + 165 + $('.boxFooter').height() );
      window.rowsmax     = Math.ceil( panelHeigth / 120 );
      $('.boxcontainer .innercontent').height( panelHeigth );
    },
    overflow : function(){
     document.body.style.overflow = "hidden";
    },
    isAdmin : function(){
      return [1,2,3,11].indexOf( parseInt( this.opts.role ) ) > -1;
    },

    msg : function(msg){
        window.asound.play();
        bootbox.alert(msg);
    },
    setGoogleZipApi : function(_i,area,cb){
      var that      = this;
      var _i        = $('#'+_i);
      var _id       = _i.attr('id');
      var idc       = ('google-'+_id+'-results').replace(/_/g,'-');

      _i.attr('data-area',area);

      var  container = $( _i ).parent().get( 0 );
           container.style.position = 'relative';


           //window.getComputedStyle(container,null).getPropertyValue("width")


      var _rc = document.createElement('div');
          _rc.className = 'search-google-results';
          _rc.id = idc;
          container.appendChild(_rc);

          $(_rc).width(_i.width());

      _i.keyup (function(e){
         that.loadGoogleMaps(this,e,_rc,cb);
      });
       _i.focus(function(e) {

        that.loadGoogleMaps(this,e,_rc,cb);
      });
      _i.blur(function(e){
          setTimeout(function(){
              $(_rc).html(' ').css('display','none');

          },800);
      });
    },
    loadGoogleMaps : function(i,e,_rc,cb){


      $('.search-google-results').width( $(i).css('width') );

      var that  = this;
      var value = i.value;
      var area  = $('#'+i.dataset.area).val();
      setTimeout(function(){
        that.searchGoogleApi(value,area,_rc,cb);
      },1000);
    },
    searchGoogleApi : function(k,area,_rc,cb){
      var geocoder  = new google.maps.Geocoder();
      // console.log({'address': k+'+'+area});
      geocoder.geocode({'address': k+'+'+area}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
              _rc.innerHTML     = '';
              _rc.style.display = 'block'
              var list = document.createElement('ul');
              _rc.appendChild(list);

              var result = {};
              for( x in results){
                var data = results[x].address_components;
                var geo  = results[x].geometry.location;

                result.zip                            = typeof(data[0]) == 'undefined' ? '' : data[0].long_name;
                result.sublocality_level_1            = typeof(data[1]) == 'undefined' ? '' : data[1].long_name;
                result.city                           = typeof(data[2]) == 'undefined' ? '' : data[2].short_name;
                result.administrative_area_level_3    = typeof(data[3]) == 'undefined' ? '' : data[3].long_name;
                result.state                          = typeof(data[4]) == 'undefined' ? '' : data[4].long_name;
                result.country                        = typeof(data[5]) == 'undefined' ? '' : data[5].long_name;
                result.location                       = geo;

                var li = document.createElement('li');
                    li.innerHTML = results[x].formatted_address
                    list.appendChild(li);
                    li.onclick = function(){
                      cb(result);
                      $(_rc).html(' ').css('display','none');
                    }
              }
          }
      });
    },
    addRow : function(container,classes){
      var classes        = typeof(classes) == 'undefined' ? '':classes;
      var row            = document.createElement('div');
          row.className  = 'row '+classes;
          container.appendChild(row);
          return row;
    },

    addCol : function(container,type,classes){
      var classes        = typeof(classes) == 'undefined' ? '':classes;
      var col            = document.createElement('div');
          col.className  = type +' '+ classes;
          container.appendChild(col);
          return col;
    },

    addCols : function(n,container,classes){

       var i    = 0;
       var m    =  Math.ceil(12/n);
       var cols = [];
       while( i < n ){
        cols.push(this.addCol(container,'col-md-'+m + ' '+ classes)) ;
        i++;
       }

       return cols;
    },

    addInput: function(options){
      // console.log( options.name,  options.default_value,  options.value);
      var container      = typeof(options.container)      == 'undefined' ? null  : options.container;
      var prefix         = typeof(options.prefix)         == 'undefined' ? null  : options.prefix;
      var name           = typeof(options.name)           == 'undefined' ? null  : options.name;
      var type           = typeof(options.type)           == 'undefined' ? null  : options.type;
      var classes        = typeof(options.classes)        == 'undefined' ? ''    : options.classes;
      var default_value  = typeof(options.default_value)  == 'undefined' ? ''    : options.default_value;
      var value          = typeof(options.value)          == 'undefined' || options.value == null ? ''  : options.value;
      var value_type     = typeof(options.value_type)     == 'undefined' ? null    : options.value_type;
      var readonly       = typeof(options.readonly)       == 'undefined' ? false   : options.readonly;
      var onBlur         = typeof(options.onBlur)         == 'undefined' ? null   : options.onBlur;
      var required         = typeof(options.required)     == 'undefined' ? false   : options.required;

      // console.log({'name':name,'default_value':default_value,'value':value,'value.length': String(value).length});

      switch(value_type){
        case 'money':
          var value = String(value).length > 0 ? parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : value;
          var default_value = default_value.length > 0 ? parseFloat(default_value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : default_value;
        break;
        case 'integer':
          // var value = value.length > 0 ? parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : value;
          // var default_value = default_value.length > 0 ? parseFloat(default_value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : default_value;
        break;
        case 'date':

          if( value.length > 0 ){
            var theDate = new Date(value);
            var value = theDate.getDate() +'-'+ ( theDate.getUTCMonth() + 1) + '-' + theDate.getFullYear() ;
          }
        break;

      }


      var input          = document.createElement('input');
          input.id           = prefix+'-'+name;
          input.className    = 'form-control';
          input.type         = type;
          input.name         = prefix+'['+name+']';
          input.value        = value;
          input.placeholder  = default_value;
          input.readOnly     = readonly;
          input.required     = required;

          container.appendChild(input);

          input.onblur = function(){
            switch(value_type){
                case 'money':
                this.value = this.value.replace(/,/g,'');
                this.value = isNaN(this.value) ? 0 : this.value;
                this.value = parseFloat(this.value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                this.value = this.value == 0 || this.value == 'NaN' ? '' : this.value;
              break;
              case 'integer':
                this.value = this.value.replace(/,/g,'');
                this.value = isNaN( parseInt(this.value) ) ? 0 : parseInt(this.value)
                // var default_value = default_value.length > 0 ? parseFloat(default_value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : default_value;

              break;
            }

            if(onBlur){
              onBlur(this);
            }
          }

          return input;
    },

     addSelect: function(options){


      var container      = typeof(options.container)      == 'undefined' ? null  : options.container;
      var prefix         = typeof(options.prefix)         == 'undefined' ? null  : options.prefix;
      var name           = typeof(options.name)           == 'undefined' ? null  : options.name;
      var type           = typeof(options.type)           == 'undefined' ? null  : options.type;
      var classes        = typeof(options.classes)        == 'undefined' ? ''    : options.classes;
      var default_value  = typeof(options.default_value)  == 'undefined' ? ''    : options.default_value;
      var value          = typeof(options.value)          == 'undefined' ? default_value  : options.value;
      var value_type     = typeof(options.value_type)     == 'undefined' ? null    : options.value_type;
      var readonly       = typeof(options.readonly)       == 'undefined' ? false   : options.readonly;
      var select_options = typeof(options.options)        == 'undefined' ? false    : options.options;

      var select          = document.createElement('select');
          select.id           = prefix+'-'+name;
          select.className    = 'form-control c-select';
          select.name         = prefix+'['+name+']';
          container.appendChild(select);

          for(x in select_options ){
              var opt  = document.createElement('option');
                  opt.innerHTML = select_options[x].label;
                  opt.value    = select_options[x].value;
                  select.appendChild(opt);
          }

          select.value = value ;
    },

     addFormGroup : function(container,classes){
      var classes           = typeof(classes) == 'undefined' ? '':classes;
      var fgroup             = document.createElement('fieldset');
          fgroup.className   = 'form-group '+classes;
          container.appendChild(fgroup);
          return fgroup;
    },

     addLabelForm : function(container,text,classes){
        var classes            = typeof(classes) == 'undefined' ? '':classes;
        var label              = document.createElement('label');
            label.className    = ' '+classes;
            label.innerHTML    = text;
            container.appendChild(label);
            return label;
    },

    addSeparator : function(container){
      var hr = document.createElement('hr');
          container.appendChild(hr);
    },

    createOption : function(select,label,value,selected){

      var selected        = typeof(selected) == 'undefined' ? false : selected;
      var option          = document.createElement('option');
      option.innerHTML    = label;
      option.value        = value;
      option.selected     = selected;
      select.appendChild(option);

      return option;
    },

    clearFix : function(container){
      var fix            = document.createElement('div');
      fix.className      = 'clear fix';
      container.appendChild(fix);
    },

    allow : function(role,roles){
        return roles.indexOf(role) == -1 ? false : true ;
    }

 });
