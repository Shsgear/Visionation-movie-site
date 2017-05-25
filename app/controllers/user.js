	var User = require('../models/user');
	
	
	exports.showSignup = function(req, res) {
		res.render('signup', {
				title: '用户注册页',
			});
	}
	exports.showSignin = function(req, res) {
		res.render('signin', {
				title: '用户登录页',
			});
	}
	
	/*signup*/
	
	exports.signup = function(req, res) {
		var _user = req.body.user;
		User.findOne({
			name: _user.name
		}, function(err, user) {
			if(err) {
				console.log(err);
			}
			if(user) {   //已存在用户
				console.log('***\nuser already exists\n***')
				//res.json({signup: 1});    
				return res.redirect('/signup');  
			} else {
				var user = new User(_user);    //不存在，新加user
				user.save(function(err, user) {
					if(err) {
						console.log(err);
					} 
						res.redirect('/');
					
				})
			}
		})
	}
	
	
	/*signin*/
	exports.signin = function(req, res) {
		var _user = req.body.user;           //获取请求的user对象
			var name = _user.name;
			var password = _user.password;
			
			User.findOne({name: name}, function(err, user){ //User的find方法查找用户输入的user.name
				  if(err){
				  	console.log(err);
				  }
				  if(!user){             //用户输入的user的name在数据库中未匹配到对应的user
				  	//res.json({login: -1}); 
				  	return res.redirect('/signup');
				  }
				  //user是由findOne方法查出来的实例，不是User Model
				  //调用实例对象的方法对比密码
				  user.comparePassword(password, function(err, isMatch){
				  		if(err) {
				  			console.log(err);
				  		}
				  		if(isMatch) {   //匹配
				  			 req.session.user = user;     //设置session的user为user，保持会话时判断是否其为当前用户
				  			 console.log('***\nmatched\n***');
				  			 return res.redirect('/');
				  		}else{   //未匹配
				  			 console.log('***\npassword not matched\n***');  
				  			 //res.json({signin: -1});
				  			 res.redirect('/signin');
				  		}
				  })
			})
	}
	
	
	/*logout*/
	exports.logout = function(req, res) {
		delete req.session.user;    //删除session保存的user
		res.redirect('/');
	}
	
	
	/*user list*/
	exports.list = function(req, res) {
		User.fetch(function(err, users) {
			if(err) {
				console.log(err);
			}
			res.render('userlist', {
				title: 'imooc用户列表',
				users: users
			});
		});
	}
    
    /*middleware for no-signin user*/     
    exports.signinRequired = function(req, res, next) {
    	var user = req.session.user;
    	if(!user) {     //未登录用户
    		console.log('\n\n nno user in session\n\n');
    		return res.redirect('/signin');
    	}
    	next();
    }
    /*middleware for user permission*/
   exports.permission = function(req, res, next) {
   		var user = req.session.user;
   		if(user.role < 10 || !user.role) {  //用户权限小于10或用户role不存在，重定向至首页
   			console.log('\n\n user in session have no permission\n\n');
   			return res.redirect('/'); 
   		}
   		next();
   }
	
    
