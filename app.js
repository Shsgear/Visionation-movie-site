	var express = require('express');
	var path = require('path');
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	var session = require('express-session');
	var MongoStore = require('connect-mongo')(session);
	var index = require('./routes/index');
	var users = require('./routes/users');
	var dbUrl = 'mongodb://localhost:27017/movie'; 
	//var logDirectory = path.join(__dirname, 'log');   //定义开发环境的margan输出日志路径 //不定义的话可以直接在控制台生成
	//var fs = require('fs');
	
	var app = express();
	
	
	
	
	app.locals.moment = require('moment');  //引用moment时间日期模块
	app.use(session({    //配置session，保持会话
	  secret: 'imooc',
	  store: new MongoStore({
	  	url: dbUrl,
	  	collection: 'sessions'
	  })
	}));
	
	if('development' === app.get('env')) {   //如果当前环境是开发环境,使用morgan(logger)输出日志
		  //app.set('showStaticError', true);
		  app.use(logger(":method :url :status :response-time ms" ));  //使用文档:https://www.npmjs.com/package/morgan
			app.locals.pretty = true;    //增加代码可读性,用户右键查看源代码是整齐的代码
			mongoose.set('debug', true);   //打开mongoose的debug 控制套中可以打印出调用mongoose的方法以及数据
	}
	
	
	// view engine setup设置视图根目录和模板引擎
	app.set('views', path.join(__dirname, '/app/views/pages'));  //设置views即html页面的位置，默认为'views'
	app.set('view engine', 'jade');
	
	
	mongoose.connect(dbUrl);//连接数据库,指定数据库名
	console.log('\n\n********************\n\nmongodb connected!\n\n********************');
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	//app.use(logger('dev'));
	
	app.use(bodyParser.json());  //能将提交表单的数据格式化
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public'))); //设置获取静态资源的目录，默认为'public'
	
	app.use('/', index);
	app.use('/users', users);
	
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	
	// error handler
	app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
	
		// render the error page
		res.status(err.status || 500);
		res.render('error');
	});
	
	module.exports = app;