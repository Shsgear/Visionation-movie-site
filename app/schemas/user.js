	var mongoose = require('mongoose');
	var bcrypt = require('bcrypt-nodejs'); //require加密模块
	var SALT_WORK_FACTOR = 10;   //定义加密计算强度，计算密码所需要的资源和时间
	/*schema结构*/
	var userSchema = new mongoose.Schema({
		name: {
			type: String,
			unique: true
		},
		password: String,
		//设置用户权限0: normal user || 1: verified user || 2: premium user ||   >10: admin || >50: super admin
		role: {
			type: Number,
			default: 0
		},
		meta: {
	        createAt: {
	            type: Date,
	            default: Date.now()
	        },
	        updateAt: {
	            type: Date,
	            default: Date.now()
	        },
	    }
	});
	
	userSchema.pre('save', function(next){
		var user = this;
		if(this.isNew) {
			this.meta.createAt = this.meta.updateAt = Date.now();    //如果这条数据是新插入的，让创建时间和更新时间等于插入时的时间
		}else{
			this.meta.updateAt = Date.now();    //数据已经存在，只更新更新时间
		}
		/*hash加密用户密码*/
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){//生成随机盐
			if(err) return next(err);
			bcrypt.hash(user.password, salt, null, function(err, hash){//生成hash
				if(err) return next(err);
				user.password = hash;
				next();
			})
		
		});      
		   //执行下一条数据
	})
	
	//添加schema实例方法,是提供给user实例对象的
	userSchema.methods = {
		comparePassword: function(_password, cb){
			bcrypt.compare(_password, this.password, function(err, isMatch){
				if(err) return cb(err);
				
				cb(null, isMatch);
			}) 
		}
	}
	
	
	//添加schema静态方法，静态方法在Model层就能使用
	userSchema.statics = {
		fetch: function(cb){
			return this.find({})
					   .sort('meta.updateAt')
					   .exec(cb);
		},
		findById: function(id, cb){
			return this.findOne({_id: id})
			           .exec(cb);
		}
	}
	//暴露movieSchema供外部调用
	module.exports = userSchema;