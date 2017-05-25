	var mongoose = require('mongoose');
	var commentSchema = require('../schemas/comment');
	
	// model模型化movie类
	var comment = mongoose.model('comment', commentSchema);
	
	//暴露movie类提供外部调用
	module.exports = comment;