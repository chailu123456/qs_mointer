$(function(){
	//获取现在时间
    var nowdate = new Date();
    var y = nowdate.getFullYear();
    var m = nowdate.getMonth()+1;
    var d = nowdate.getDate();
    var nowtime = y+'-'+m+'-'+d;
    
    //获取系统前1年的时间
    var lastdate = new Date(nowdate-365*24*3600*1000);
    var y = lastdate.getFullYear();
    var m = lastdate.getMonth()+1;
    var d = lastdate.getDate();
    var formtime = y+'-'+m+'-'+d;
$('#from').val(formtime);
$('#to').val(nowtime);

var getnews = JSON.parse(localStorage.getItem('temp'));
var getcityname = localStorage.getItem('city');
$('#where').text(getcityname);
var prov_id = getnews.ctcode;
var city_id = getnews.code_c;

if(prov_id == "undefined"){
	prov_id = ''
}
if(city_id == "undefined"){
	city_id = ''
}
	$.ajax({
		type:"post",
		url: publicAdress+"api/operation/ordermessage",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"mobileNo":"","page":"1","rows":"16","provinceid":prov_id,"cityid":city_id,"startdate":formtime,"enddate":nowtime}),
		success:function(data){
			console.log(data)
			var car_net = data.res_opr_message;
			var allnums = data.totalcount;
			var notake_car = '';
			allpage(allnums)
			for(var w=0;w<car_net.length;w++){
	        notake_car += '<tr><td>' + car_net[w].relName + '</td><td>'
	        + car_net[w].mobileNo + '</td><td>'
	        + car_net[w].borrowType + '</td><td>'
	        + car_net[w].carmileage + '</td><td>'
	        + car_net[w].cartime + '</td><td>'
	        + car_net[w].mileageconsum + '</td><td>'
	        + car_net[w].timeconsum + '</td><td>'
	        + car_net[w].electricconsum + '</td><td>'
	        + car_net[w].parkedamount + '</td><td>'
	        + car_net[w].totalConsum + '</td><td>'
	        + car_net[w].payAmount + '</td></tr>';
	    }
    	$('.elec_num').html(notake_car);	
		}
	});
	
var currentPage=1;
function allpage(count){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo6'
	        ,count: count
	        ,limit:16
	        ,curr:currentPage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPage = obj.curr
	          if(!first){
	           	$('.elec_num').html('');
	            pagebtn(currentPage)
	          }
	        }
	    });
	})
}	

function pagebtn(curpage) {
	var curpage = curpage.toString();
	$.ajax({
		type:"post",
		url: publicAdress+"api/operation/ordermessage",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"mobileNo":"","page":curpage,"rows":"16","provinceid":prov_id,"cityid":city_id,"startdate":formtime,"enddate":nowtime}),
		success:function(data){
			console.log(data)
			var car_net = data.res_opr_message;
			var allnums = data.totalcount;
			var notake_car = '';

			for(var w=0;w<car_net.length;w++){
	        notake_car += '<tr><td>' + car_net[w].relName + '</td><td>'
	        + car_net[w].mobileNo + '</td><td>'
	        + car_net[w].borrowType + '</td><td>'
	        + car_net[w].carmileage + '</td><td>'
	        + car_net[w].cartime + '</td><td>'
	        + car_net[w].mileageconsum + '</td><td>'
	        + car_net[w].timeconsum + '</td><td>'
	        + car_net[w].electricconsum + '</td><td>'
	        + car_net[w].parkedamount + '</td><td>'
	        + car_net[w].totalConsum + '</td><td>'
	        + car_net[w].payAmount + '</td></tr>';
	    }
    	$('.elec_num').html(notake_car);	
		}
	});
}

	$( "#from" ).datepicker({
		defaultDate: formtime,
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: 'yy-mm-dd',//日期格式 
		onClose: function( selectedDate ) {
			$("#to").datepicker( "option", "minDate", selectedDate);
		}
	});
	
	$( "#to" ).datepicker({
		defaultDate: nowtime,
		changeMonth: true,
		numberOfMonths:1,	
		maxDate:nowtime,
		dateFormat: 'yy-mm-dd',//日期格式 
		onClose: function( selectedDate ) {
			$("#from").datepicker( "option", "maxDate", selectedDate );
		}
	});

	var selectdetail ={};
	$('#finddetail').click(function(){
		var station_name = $('.elec_name').val();
		var statetime = $('#from').val();
		var endtime = $('#to').val();
		currentPage = 1;
		selectdetail.val= station_name;
	
		selectdetail.stime= statetime;
		selectdetail.etime= endtime;
		if(statetime!=''&& endtime==''){
			alert('请选择时间范围')
		}
		if(statetime ==''&& endtime!=''){
			alert('请选择时间范围')
		}else{
			$.ajax({
				type:"post",
				url: publicAdress+"api/operation/ordermessage",
				async:false,
				contentType: "application/json;charset=utf-8", 
				dataType:"json",
				data:JSON.stringify({"mobileNo":station_name,"page":"1","rows":"16","provinceid":prov_id,"cityid":city_id,"startdate":selectdetail.stime,"enddate":selectdetail.etime}),
				success:function(data){
					var car_net = data.res_opr_message;
					var allnums = data.totalcount;
					var notake_car = '';
					S_allpage(allnums)
					if(car_net.length==0){
						var detail_car = '';
            detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
            $('.elec_num').html(detail_car);
					}else{
						for(var w=0;w<car_net.length;w++){
				        notake_car += '<tr><td>' + car_net[w].relName + '</td><td>'
				        + car_net[w].mobileNo + '</td><td>'
				        + car_net[w].borrowType + '</td><td>'
				        + car_net[w].carmileage + '</td><td>'
				        + car_net[w].cartime + '</td><td>'
				        + car_net[w].mileageconsum + '</td><td>'
				        + car_net[w].timeconsum + '</td><td>'
				        + car_net[w].electricconsum + '</td><td>'
				        + car_net[w].parkedamount + '</td><td>'
				        + car_net[w].totalConsum + '</td><td>'
				        + car_net[w].payAmount + '</td></tr>';
				    }
			    	$('.elec_num').html(notake_car);	
					}
					
				}
			});
		}
		
	})
function S_allpage(count){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo6'
	        ,count: count
	        ,limit:16
	        ,curr:currentPage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPage = obj.curr
	          if(!first){
	          	console.log('jjj')
	           	$('.elec_num').html('');
	            Pagebtn(currentPage)
	          }
	        }
	    });
	})
}	

function Pagebtn(curpage) { 
	var curpage = curpage.toString();
	$.ajax({
		type:"post",
		url: publicAdress+"api/operation/ordermessage",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"mobileNo":"","page":curpage,"rows":"16","provinceid":prov_id,"cityid":city_id,"startdate":selectdetail.stime,"enddate":selectdetail.etime}),
		success:function(data){
			console.log(data)
			var car_net = data.res_opr_message;
			var allnums = data.totalcount;
			var notake_car = '';
			for(var w=0;w<car_net.length;w++){
	        notake_car += '<tr><td>' + car_net[w].relName + '</td><td>'
	        + car_net[w].mobileNo + '</td><td>'
	        + car_net[w].borrowType + '</td><td>'
	        + car_net[w].carmileage + '</td><td>'
	        + car_net[w].cartime + '</td><td>'
	        + car_net[w].mileageconsum + '</td><td>'
	        + car_net[w].timeconsum + '</td><td>'
	        + car_net[w].electricconsum + '</td><td>'
	        + car_net[w].parkedamount + '</td><td>'
	        + car_net[w].totalConsum + '</td><td>'
	        + car_net[w].payAmount + '</td></tr>';
	    }
    	$('.elec_num').html(notake_car);	
		}
	});
}

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

//登陆
$('#username').focus(function(){
    $('.prompt_pass').fadeOut(600);
 })
 $('#password').focus(function(){
    $('.prompt_pass').fadeOut(600);
 })
 $('.shadow').click(function(){
    $('.shadow').hide()
 })
 $('.loginmodal').click(function(e){
 	e = window.event || e;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
 })
 var getdetail = sessionStorage.getItem('user');
 var get = JSON.parse(getdetail);
 
 var userdetail ={}
	//导出当前数据
	$('#export').click(function(){
		if(get != null || $.isEmptyObject(userdetail) == false){
			$(".datas").table2excel({  
		        exclude: ".noExl",  
		        name: "Excel Document Name",  
		        filename: "共享汽车运营表",  
		        exclude_img: true,  
		        exclude_links: true,  
		        exclude_inputs: true  
		    });
		}else{
			$('.shadow').show();
			$('#loginbtn').click(function(){
		        var account = $('#username').val();
		        var pass_word = $('#password').val();
		        
	        	userdetail.name = account;
	        	userdetail.pass = pass_word;
		      
		        sessionStorage.setItem('user', JSON.stringify(userdetail));
		        if(account.length <= 6|| pass_word.length <= 6){
		          $('.prompt_pass').fadeIn(600).html('账号或密码不能少于6位')
		          return false;
		        }else{
			        $('.prompt_pass').fadeOut(600);
			       
			        $('.shadow').hide();
			        $(".datas").table2excel({  
				        exclude: ".noExl",  
				        name: "Excel Document Name",  
				        filename: "共享汽车运营表",  
				        exclude_img: true,  
				        exclude_links: true,  
				        exclude_inputs: true  
				    });
		        }
			});
		}
	})
	//导出全部数据
	$('#allexport').click(function(){
		$.ajax({
			type:"post",
			url: publicAdress+"api/operation/ordermessage",
			async:false,
			contentType: "application/json;charset=utf-8", 
			dataType:"json",
			data:JSON.stringify({"mobileNo":"","page":"0","rows":"16","provinceid":prov_id,"cityid":city_id,"startdate":formtime,"enddate":nowtime}),
			success:function(data){
				console.log(data)
				var car_net = data.res_opr_message;
				var allnums = data.totalcount;
				var notake_car = '';
				allpage(allnums)
				for(var w=0;w<car_net.length;w++){
			        notake_car += '<tr><td>' + car_net[w].relName + '</td><td>'
			        + car_net[w].mobileNo + '</td><td>'
			        + car_net[w].borrowType + '</td><td>'
			        + car_net[w].carmileage + '</td><td>'
			        + car_net[w].cartime + '</td><td>'
			        + car_net[w].mileageconsum + '</td><td>'
			        + car_net[w].timeconsum + '</td><td>'
			        + car_net[w].electricconsum + '</td><td>'
			        + car_net[w].parkedamount + '</td><td>'
			        + car_net[w].totalConsum + '</td><td>'
			        + car_net[w].payAmount + '</td></tr>';
				}
			    $('.allelec_num').html(notake_car);	
			}
		});
	 
    $("#all").table2excel({  
        exclude: ".noExl",  
        name: "Excel Document Name",  
        filename: "共享汽车运营表",  
        exclude_img: true,  
        exclude_links: true,  
        exclude_inputs: true  
    }); 
	})
	
	
})
