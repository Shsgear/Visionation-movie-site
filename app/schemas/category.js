	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var ObjectId = Schema.Types.ObjectId;
	/*schema结构*/
	var categorySchema = new Schema({
		name: String,
		movies: [{
			type: ObjectId,
			ref: 'movie'
		}],    //映射存放的电影的ObjectId
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
	
	categorySchema.pre('save', function(next){
		if(this.isNew) {
			this.meta.createAt = this.meta.updateAt = Date.now();    //如果这条数据是新插入的，让创建时间和更新时间等于插入时的时间
		}else{
			this.meta.updateAt = Date.now();    //数据已经存在，只更新电影更新时间
		}
		next();   //执行下一条数据
	})
	
	//添加schema静态方法，静态方法在Model层就能使用
	categorySchema.statics = {
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
	module.exports = categorySchema;