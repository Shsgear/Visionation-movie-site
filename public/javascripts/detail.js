// 处理删除电影数据的ajax请求
$(function(){
	$('.comment').click(function(){
		var toId = $(this).attr('data-tid');
		var commentId = $(this).attr('data-cid');
		
		if($("#commentId").length > 0) { //多次点击不同用户重新赋值
			$("#commentId").attr('value', commentId);
		}else{
			$("<input>").attr({
			type: 'hidden',
			id: 'commentId',
			name: 'comment[cid]',
			value: commentId
		}).appendTo('#commentForm');
		}
		
		if($("#toId").length > 0) {
			$("#toId").attr('value', toId);
		}else{
			$("<input>").attr({
			type: 'hidden',
			id: 'toId',
			name: 'comment[tid]',
			value: toId
		}).appendTo('#commentForm')
		}
		/*
		
		
	    */
	
	
	})
})