	var Movie = require('../models/movie'); //引用movie模型
	var Comment = require('../models/comment'); //引用comment模型
	var Category = require('../models/category')
	var _ = require('underscore'); //可以将新的字段替换老的字段
	var querystring = require('querystring');
	
	var multer = require('../../public/javascripts/multerUtil');  //引用multer上传模块以及其配置
    var upload=multer.single('uploadPoster');         //设置上传方式为单文件上传 	   
	
	
	
	
	/* GET detail page. */
	exports.detail = function(req, res) {
		var id = req.params.id; //获取请求url中的id
		Movie.findById(id, function(err, movie) {  //调用Movie类的静态方法查找
			Movie.update({_id: id}, {$inc:{pv: 1}}, function(err){  //用户进入详情页数据库pv加1
				if(err){
					console.log(err);
				}
			})
			Comment
			.find({movie: id})  //在comment类中找到对应的movie id为 id的comment
			.populate('from', 'name')  //populate方法查找comment的from，form ref引用user，并用user的name填充，在jade评论人中可以使用from.name
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){  //查找完movie后顺便查找当前movie的评论
			console.log('this movie\'s comments: ' + comments);
			res.render('detail', {
				title:  movie.title,
				movie: movie,
				comments: comments
			});
		})
	})
}
	
	/* GET admin page. */
	exports.new = function(req, res) {
		Category.find({}, function(err, categories){
			res.render('admin', {
			title: 'imooc后台录入页',
			categories: categories,
			movie: {}
		});
	})
}
	
	/*admin update movie*/
	exports.update = function(req, res) {
		var id = req.params.id;
		if(id) {
			Movie.findById(id, function(err, movie) {
				if(err){
					console.log(err);
				}
				Category.find({}, function(err, categories) {
				res.render('admin', {
					title: '后台更新页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}	
	
	/*savePoster*/
	/*exports.savePoster = function(req, res, next) {
		upload(req, res, function(err){
			if (err) {
         	return  console.log(err);
    		} 
        		//文件信息在req.file或者req.files中显示
    		console.log(req.file);
  			});
  			next();
		}*/
	
	
	
	/*Admin POST movie*/
	exports.save = function(req, res) {
		var id = req.body.movie._id;
		var movieObj = req.body.movie;
		var _movie; //新的电影数据
	
		if(id) { //如果post上来的id已经在数据库中
			Movie.findById(id, function(err, movie) {
				if(err) {
					console.log(err);
				}
				_movie = _.extend(movie, movieObj); //使用underscore的extend方法，将新的moveObj替换movie
				_movie.save(function(err, movie) { //保存到数据库中
					if(err) {
						console.log(err);
					}
					res.redirect('/movie/' + movie._id); //保存完毕重定向到当前电影详情页
				});
			})
		} else { //数据库中不存在,新加数据
			_movie = new Movie(movieObj);
			
			var categoryId = _movie.category;
			var categoryName = movieObj.categoryName;
			_movie.save(function(err, movie) {
				if(err) {
					console.log(err);
				}
				if(categoryId){      //用radio新增category
					Category.findById(categoryId, function(err, category) {
					category.movies.push(_movie._id);
					category.save(function(err, category){
						res.redirect('/movie/' + movie._id);
					})
				})
			}else if(categoryName) {//提交上看来的电影数据中有categoryName,即手工填写categoryName，而不是勾选radio
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				});
				category.save(function(err, category){
						movie.category = category._id;
						movie.save(function(err, movie){   //重新保存一次movie，才能把电影的category._id存到movie的category中
							res.redirect('/movie/' + movie._id);
						})
						
					})
			}    
		})
	}
}
	
	/* GET list page. */
	exports.list = function(req, res, next) {
		Movie.fetch(function(err, movies) {
			if(err) {
				console.log(err);
			}
			res.render('list', {
				title: '列表页',
				movies: movies
			});
		});
	}
	
	/*list delete*/
	exports.del = function(req, res) {
		var id = req.query.id;
	
		if(id) {
			Movie.remove({
				_id: id
			}, function(err, movie) {
				if(err) {
					console.log(err);
					res.json({
						success: -1
					});
				} else {
					res.json({
						success: 1
					});
				}
			})
		}
	}