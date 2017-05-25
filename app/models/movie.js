	var mongoose = require('mongoose');
	var movieSchema = require('../schemas/movie');
	
	// model模型化movie类
	var movie = mongoose.model('movie', movieSchema);
	
	//暴露movie类提供外部调用
	module.exports = movie;
