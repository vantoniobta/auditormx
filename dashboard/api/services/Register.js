module.exports = {

  action:function(action,data){
		return Logs.create({action:action,users:data}).exec(function(e,r){
		});
	},

	tenant:function(action,id,data){
		Accounts.findOne(id).exec(function(e,tenant){
			delete tenant.users;
			return Logs.create({users:data,action:action,tenant:tenant}).exec(function(e,r){
			});
		});
	}

};
