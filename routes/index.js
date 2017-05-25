	var express = require('express');
	var router = express.Router();
	var Index = require('../app/controllers/index') //引用首页的路由处理
	var Movie = require('../app/controllers/movie'); //引用movie的路由处理
	var User = require('../app/controllers/user') //引用user的路由处理
	var Comment = require('../app/controllers/comment')//引用comment的路由处理
	var Category = require('../app/controllers/category')//引用comment的路由处理
	var session = require('express-session');
	
	
	
	// pre handle user预处理user
	router.use(function(req, res, next) {
		var _user = req.session.user; //判断是否有session.user,有就在主页显示欢迎和注销
		res.locals.user = _user; // 把session.user的状态赋值给本地locals的user,jade模板都能拿到user显示对应是否登录的状态
		next();
	});
	
	
	router.get('/',                Index.index);
	
	//user routers
	router.get('/signup',          User.showSignup);
	router.get('/signin',          User.showSignin);
	router.post('/user/signup',    User.signup);
	router.post('/user/signin',    User.signin);
	router.get('/logout',          User.logout);
	router.get('/admin/user/list', User.signinRequired, User.permission, User.list);
	
	//movie routers
	router.get('/movie/:id',               Movie.detail);
	router.get('/admin/movie/create',      User.signinRequired, User.permission, Movie.new);
	router.get('/admin/update/:id',        User.signinRequired, User.permission, Movie.update);
	router.post('/admin/movie/save',       User.signinRequired, User.permission, Movie.save);
	router.get('/admin/movie/list',        User.signinRequired, User.permission, Movie.list);
	router.delete('/admin/movie/list',     User.signinRequired, User.permission, Movie.del);
	
	//comment routers
	router.post('/user/comment',           User.signinRequired, Comment.save);
	
	//category
	router.get('/admin/category/new',        User.signinRequired, User.permission, Category.new);
	router.post('/admin/category',           User.signinRequired, User.permission, Category.save);
	router.get('/admin/category/list',       User.signinRequired, User.permission, Category.list);
	
	//get results from category and get results from search
	router.get('/results', Index.categorySearch);
	router.get('/searchResults', Index.search);
	
	
	
	module.exports = router;
	
   
    