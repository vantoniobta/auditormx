

function column( name, label, classname, width, value, un){

	if ( name === un) {
		throw new Error('column name has to be defined');
	}

	if (label === un) {
		label = name;
	}

	if (value === un) {
		value = function(i, obj){
			return obj[name];
		}
	}

	var column =  {db:name,name:label,valueFunction:value};

	if (classname !== un) {
		column.classname = classname;
	}

	if (width !== un) {
		column.width = width;
	}

	return column;

}


var Core_Cine = Core.extend({

	init : function(opts){
		this.opts = opts;
		this.id   = this.opts.id;
		this.uuid = this.opts.uuid;

		this.$form = $('#formCine');

		this.addBindings();
	},

	addBindings : function(){

		var that = this;

		this.$form.submit(function(e){
			e.preventDefault();
			that.sendForm();
		});

	},

	index : function(){

		var that = this;

		this.table = $('#locationTable').Table({
			id : 'cines',
			width : '100%',
			source:'/cine/table',
			rows:10,
			checkbox: that.isAdmin(),
			// searcher:true,
			sortable:true,
			primary:'id',
			headers : [
				column('uuid','Código'),
				column('name','Nombre'),
				column('state','Estado'),
				column('city','Ciudad'),
				column('room_count','Salas'),
				column('chairs','Sillas'),
				column('spots','Spots'),
				column('weeks','Semanas Contratadas'),
				column('audience','Audiencia Semanal'),
			],

		});
	},

	sendForm : function(e){

		var that = this;
		var data = this.$form.serialize();

		$.post('/cine/save', data, function(res){
			document.getElementById('formCine').reset();
	  		that.table.theLoad();
		});

	},

});
