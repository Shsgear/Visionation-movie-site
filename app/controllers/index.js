	var Movie = require('../models/movie');
	var Category = require('../models/category');
	/* GET index page. */
	exports.index = function(req, res){
		console.log('***\nIndex Page: user in session:');
		console.log(req.session.user);
		console.log('***');
		Category
		  .find({})
		  .populate({path: 'movies', select: 'title poster', option:{limit: 5}}) //限制取5条数据
		  .exec(function(err, categories){
		  	if(err) {
		  		console.log(err);
		  	}
		  	res.render('index', {
		  		title: 'imooc首页',
		  		categories: categories
		  	});
		  })
    }
	//categorySearch page
	exports.categorySearch = function(req, res){  //通过分类搜索
		var catId = req.query.cat;
		var page = parseInt(req.query.p);  //要看第几页，默认为第一页(数据库数据集合中为0),jade页面中分页按钮依次为a(href='results/?cat=...&p=1/2/3/4/5...')
		var moviesPerPage = 2;  //设置每页显示数量
		var index = page * moviesPerPage;  
		
		/*根据ID从分类中查找到数组集合，在这个集合中查找对应的ref的电影，，并把结果返回给前台*/
		Category
		  .find({_id: catId})//找到的集合为数组
		  .populate({path: 'movies', select: 'title poster'}) 
		  .exec(function(err, categories){
		  	if(err) {
		  		console.log(err);
		  	}
		  	var category = categories[0] || {};
		  	var movies = category.movies || [];
		  	var results = movies.slice(index, index + moviesPerPage);
		  	
		  	console.log('category: ' + category._id)
		  	res.render('results', {
		  		title: '结果列表页',
		  		keyword: category.name,
		  		query: 'cat=' + catId,
		  		currentPage: (page + 1),
		  		totalPage: Math.ceil(movies.length / moviesPerPage),
		  		movies: results
		  	});
		  })
    }
	
	
	exports.search = function(req, res){  ////通过搜索框模糊搜索
		var query = req.query.q;
		console.log('query'+query);
		if(query) {
			var reg = new RegExp(query + '.*', 'i');
		}
		Movie.find({title: reg}, function(err, movies) {
			if(err){
				console.log(err);
			}
			console.log('searchMovies: ' + movies)
			res.render('results',{
			title: '搜索列表页',
			searchMovies: movies
		});
		})
		
	}
