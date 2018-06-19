$(function(){
//公共地址
	//今日充值金额
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8",
		dataType:"json",
		asnyc:true,
		data:JSON.stringify({"datatype":"chargeMoney","page":1,"rows":16}),
		success:function(data){
//			console.log(data)
			var income = data.res_amount_table;
			var income_cont = '';
			pages(data.totalcount)
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].mobileNo + '</td><td class="num">'
              + income[w].chargeMoney + '</td><td>'
              + income[w].feeGift + '</td><td>'  
              + income[w].sourceNo + '</td><td>'
              + income[w].payType + '</td><td>'
              + income[w].createTime + '</td></tr>';
          }
          $('.recharge_num').html(income_cont);	
		}
	});
var currpage = 1;
function pages(num){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo2'
	        ,count: num
	        ,limit:16
	        ,curr:currpage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currpage = obj.curr
	          if(!first){
	          	$('.recharge_num').html('');	
	            pagebtn(currpage)
	          }
	        }
	    });
	})
}

function pagebtn(pagenum){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/today",
		contentType: "application/json;charset=utf-8",
		dataType:"json",
		asnyc:false,
		data:JSON.stringify({"datatype":"chargeMoney","page":pagenum,"rows":16}),
		success:function(data){
//			console.log(data)
			var income = data.res_amount_table;
			var income_cont = '';
		
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].mobileNo + '</td><td class="num">'
              + income[w].chargeMoney + '</td><td>'
              + income[w].feeGift + '</td><td>'
         
              + income[w].sourceNo + '</td><td>'
              + income[w].payType + '</td><td class="payType">'
              + income[w].createTime + '</td></tr>';
          }
          $('.recharge_num').html(income_cont);	
		}
	});
}
	//今日充值金额
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
		data:JSON.stringify({"datatype":"chargeMoney","page":1,"rows":0}),
		success:function(data){
//			console.log(data)
			var income = data.res_amount_table;
			var income_cont = '';
			pages(data.totalcount)
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].mobileNo + '</td><td class="num">'
              + income[w].chargeMoney + '</td><td>'
              + income[w].feeGift + '</td><td>'
              + income[w].sourceNo + '</td><td class="payType">'
              + income[w].payType + '</td><td>'
              + income[w].createTime + '</td></tr>';
          }
          $('.allrecharge_num').html(income_cont);	
		}
	});
	
	$("#all").table2excel({  
        exclude: ".noExl", 
        fileext: ".xls",
        name: "Excel Document Name",  
        filename: "今日充值金额",  
        exclude_img: true,  
        exclude_links: true,  
        exclude_inputs: true  
    }); 
})

	$('#export').click(function(){
        $(".datas").table2excel({  
            exclude: ".noExl", 
            fileext: ".xls",
            name: "Excel Document Name",  
            filename: "今日充值金额",  
            exclude_img: true,  
            exclude_links: true,  
            exclude_inputs: true  
        }); 
	})
	
})
