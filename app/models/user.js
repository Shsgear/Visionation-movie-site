	var mongoose = require('mongoose');
	var userSchema = require('../schemas/user');
	
	// model模型化user类
	var user = mongoose.model('user', userSchema);  //定义数据库名user和模型化
	
	//暴露user类提供外部调用
	module.exports = user;
