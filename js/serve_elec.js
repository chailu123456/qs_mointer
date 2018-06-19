$(function(){

	//今日电费
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8",
	    dataType:"json",
	    asnyc:true,
	    data:JSON.stringify({"datatype":"today_charge_money","page":1,"rows":16}),
		success:function(data){
			console.log(data)
			var t_elec = data.res_charge_table;
			var elec_cont = '';
			pages(data.totalcount)
			for(var w=0;w<t_elec.length;w++){
              elec_cont += '<tr><td>' + t_elec[w].orderID + '</td><td class="num">'
              + t_elec[w].mobileNo + '</td><td>'
              + t_elec[w].today_charge_money + '</td><td>'
              + t_elec[w].total_sevice_money + '</td><td>'
              + t_elec[w].stationName + '</td></tr>';
          }
          $('.today_static').html(elec_cont);	
		}
	});
	
var currentpage =1;
function pages(countnum){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo1'
	        ,count: countnum
	        ,limit:16
	        ,curr:currentpage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentpage = obj.curr
	          if(!first){
	            $('.today_static').html('');  
	            btnpage(currentpage)
	          }
	        }
	    });
	})
}

function btnpage(currentpage){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8",
	    dataType:"json",
	    asnyc:false,
	    data:JSON.stringify({"datatype":"today_charge_money","page":currentpage,"rows":16}),
		success:function(data){
			console.log(data)
			var t_elec = data.res_charge_table;
			var elec_cont = '';
			for(var w=0;w<t_elec.length;w++){
              elec_cont += '<tr><td>' + t_elec[w].orderID + '</td><td class="num">'
              + t_elec[w].mobileNo + '</td><td>'
              + t_elec[w].today_charge_money + '</td><td>'
              + t_elec[w].total_sevice_money + '</td><td>'
              + t_elec[w].stationName + '</td></tr>';
          	}
          	$('.today_static').html(elec_cont);	
		}
	});
}
	//今日电费
	
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

$('#allexport').click(function(){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8",
	    dataType:"json",
	    asnyc:false,
	    data:JSON.stringify({"datatype":"today_charge_money","page":1,"rows":0}),
		success:function(data){
			console.log(data)
			var t_elec = data.res_charge_table;
			var elec_cont = '';
		
			for(var w=0;w<t_elec.length;w++){
              elec_cont += '<tr><td>' + t_elec[w].orderID + '</td><td class="num">'
              + t_elec[w].mobileNo + '</td><td>'
              + t_elec[w].today_charge_money + '</td><td>'
              + t_elec[w].total_sevice_money + '</td><td>'
              + t_elec[w].stationName + '</td></tr>';
          }
          $('.alltoday_static').html(elec_cont);	
		}
	});
	
	$(".#all").table2excel({  
        exclude: ".noExl",  
        fileext: ".xls",
        name: "Excel Document Name",  
        filename: "今日电费-服务费",  
        exclude_img: true,  
        exclude_links: true,  
        exclude_inputs: true  
    }); 
})


	$('#export').click(function(){
		 console.log(1)  
    $(".datas").table2excel({  
        exclude: ".noExl",  
        fileext: ".xls",
        name: "Excel Document Name",  
        filename: "今日电费-服务费",  
        exclude_img: true,  
        exclude_links: true,  
        exclude_inputs: true  
    }); 
	})
	
	
	
	
	
})
