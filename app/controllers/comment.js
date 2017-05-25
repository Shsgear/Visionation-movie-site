	var Comment = require('../models/comment');
	
	exports.save = function(req, res) {
		var _comment = req.body.comment;
		//var user = req.session.user;
		console.log('submitted comment: ' + _comment);
		var movieId = _comment.movie;   //ref的是movie的id
		//cid是自己评论id  tid是别人的id
		if(_comment.cid) {    //当用户点击头像链接后，js脚本自动在form下动态插入两条数据，一条是comment.cid和comment.tid
			//用户点击他人头像评论
			Comment.findById(_comment.cid, function(err, comment){
				var reply = {
					from: _comment.from,
					to: _comment.tid,
					content: _comment.content
				}
				console.log('reply'+JSON.stringify(reply));
				console.log('found to comment: '+ comment);
				comment.reply.push(reply);
				
				comment.save(function(err, comment){
					if(err){
						console.log(err);
					}
					console.log('to other\'s comment saved: ' + comment);
					res.redirect('/movie/' + movieId);
				})
			})
		}else{ //用户自己主评论
			var comment = new Comment(_comment);
		
			comment.save(function(err, comment){
				if(err){
					console.log(err);
				}
				console.log('self comment saved: ' + comment);
				res.redirect('/movie/' + movieId);
		})
	}
		
}	
	
