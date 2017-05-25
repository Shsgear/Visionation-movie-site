	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var ObjectId = Schema.Types.ObjectId;
	/*schema结构*/
	var movieSchema = new Schema({
		title: String,
		doctor: String,
		language: String,
		country: String,
		poster: String,
		flash: String,
		summary: String,
	    year: Number,
	    pv: {           //访问统计
	    	type: Number,
	    	default: 0
	    },
	    category: {
	    	type: ObjectId,
	    	ref: 'category'
	    },
	    //meta对象存储电影的更新时间和创建时间
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
	//每次存储数据之前都都调用pre方法，回调next存储下一条数据
	//中间件是一种控制函数，类似插件，能控制流程中的init、validate、save、remove方法
	
	//pre分两种中间件，这里是一种serial中间件，连续中间件，一个执行完接着下一个
	//还有一个是并行中间件Parallel，并行中间件提供更细粒度的流量控制
	/*var schema = new Schema(..);
	
	// `true` means this is a parallel middleware. You **must** specify `true`
	// as the second parameter if you want to use parallel middleware.
	schema.pre('save', true, function(next, done) {
	  // calling next kicks off the next middleware in parallel
	  next();
	  setTimeout(done, 100);
	});*/    //done结束完了才能执行next();
	movieSchema.pre('save', function(next){
		if(this.isNew) {
			this.meta.createAt = this.meta.updateAt = Date.now();    //如果这条数据是新插入的，让创建时间和更新时间等于插入时的时间
		}else{
			this.meta.updateAt = Date.now();    //数据已经存在，只更新电影更新时间
		}
		next();   //执行下一条数据
	})
	
	//添加schema静态方法，静态方法在Model层就能使用
	movieSchema.statics = {
		fetch: function(cb){
			return this.find({})
					   /*.sort('meta.updateAt')*/
					   .exec(cb);
		},
		findById: function(id, cb){
			return this.findOne({_id: id})
			           .exec(cb);
		}
	}
	//暴露movieSchema供外部调用
	module.exports = movieSchema;