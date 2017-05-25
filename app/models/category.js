	var mongoose = require('mongoose');
	var categorySchema = require('../schemas/category');
	
	// model模型化movie类
	var category = mongoose.model('category', categorySchema);
	
	//暴露movie类提供外部调用
	module.exports = category;