
$(function(){
	// 处理删除电影数据的ajax请求
	$('.del').click(function(){
		var id = $(this).attr('data-id');
		var tr = $('.item-id-' + id);
		var deleteName = tr.children('td').eq(0).html();
		var confirmDel = confirm("确认删除 " + deleteName +' ?');
		if(confirmDel == true){
			$.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/movie/list?id=' + id,
        	})
        	.done(function (results) {
            	if (results.success === 1) {
                if (tr.length > 0) {
                    tr.remove();
                }
             }else if(results.success === -1){
             	alert('id不存在或错误')
             }
        	});
		}else{
			return false;
		}
	})
		
		//通过豆瓣API获取电影详情
		$("#douban").blur(function(){
			var douban = $(this);
			var id = douban.val();
			
			if(id){
				$.ajax({
				type:"get",
				url:"https://api.douban.com/v2/movie/subject/" + id,
				cache: true,
				dataType: 'jsonp',
				crossDomain: true,
				async:true,
				jsonp: 'callback',
				success: function(data){
					//$("#inputCategory").val(data.genres);
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputLanguage').val()
					$('#inputPoster').val(data.images['large'])
					$('#inputYear').val(data.year)
					$('#inputSummary').html(data.summary)
				}
			})
		}
	})		
			
})

