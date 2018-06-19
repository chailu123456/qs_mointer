$(function(){
	//新增用户
	$.ajax({
		type:"post",
		url: publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		async:true,
		data:JSON.stringify({"datatype":"addUserNumber","page":1,"rows":16}),
		success:function(data){
//			console.log(data)
			var income = data.res_adduser_table;
			var income_cont = '';
			pages(data.totalcount)
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].managerUsername + '</td><td class="num">'
              + income[w].managerSex + '</td><td>'
              + income[w].managerPhone + '</td><td>'
              + income[w].managerStatus + '</td><td>'
              + income[w].createdDate + '</td><tr>'
          }
          $('.today_num').html(income_cont);	
		}
	});
var currpage =1;
function pages(cont){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo9'
	        ,count: cont
	        ,limit:16
	        ,curr:currpage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currpage = obj.curr
	          if(!first){
	          	$('.today_num').html('');
	            pagebtn(currpage)
	          }
	        }
	    });
	})
}

function pagebtn(currpage){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		async:false,
		data:JSON.stringify({"datatype":"addUserNumber","page":currpage,"rows":16}),
		success:function(data){
//			console.log(data)
			var income = data.res_adduser_table;
			var income_cont = '';
		
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].managerUsername + '</td><td class="num">'
              + income[w].managerSex + '</td><td>'
              + income[w].managerPhone + '</td><td>'
              + income[w].managerStatus + '</td><td>'
              + income[w].createdDate + '</td><tr>'

          }
          $('.today_num').html(income_cont);	
		}
	});
}
	
	//新增用户
$('.godata').click(function(e){
	e = window.event || e;
    if (e.stopPropagation) {
         e.stopPropagation();
    } else {
         e.cancelBubble = true;
    } 
	$('.slide').slideToggle()
})
$('body').click(function(){
	$('.slide').slideUp()
})
//全部导出
$('#allexport').click(function(){
	$.ajax({
		type:"post",
		url: publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		async:false,
		data:JSON.stringify({"datatype":"addUserNumber","page":1,"rows":0}),
		success:function(data){
//			console.log(data)
			var income = data.res_adduser_table;
			var income_cont = '';
			pages(data.totalcount)
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].managerUsername + '</td><td class="num">'
              + income[w].managerSex + '</td><td>'
              + income[w].managerPhone + '</td><td>'
              + income[w].managerStatus + '</td><td>'
              + income[w].createdDate + '</td><tr>'

          }
          $('.alltoday_num').html(income_cont);	
		}
	});
	$("#all").table2excel({  
        exclude: ".noExl",  
        name: "Excel Document Name",  
        filename: "今日新增用户"
     
    });
})
	
	// 表格导出
	$('#export').click(function(){
		
        $(".layui-table").table2excel({  
            exclude: ".noExl",  
            name: "Excel Document Name",  
            filename: "今日新增用户"
        }); 
	})
})
