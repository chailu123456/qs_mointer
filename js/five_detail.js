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

	$.ajax({
		type:"post",
		url: publicAdress+"api/chargingpile/data/message",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"datatype":"total_quantity","page":1,"rows":16,"provinceid":"","cityid":"","areaid":"","stationname":"","startdate":"","enddate":""}),
		success:function(data){
//			console.log(data)
			var car_net = data.res_station_table;
			var allnums = data.totalcount;
			var notake_car = '';
			allpage(allnums)
			for(var w=0;w<car_net.length;w++){
                notake_car += '<tr><td>' + car_net[w].stationName + '</td><td>'
                + car_net[w].total_charge_num + '</td><td>'
                + car_net[w].total_charge_quantity + '</td><td>'
                + car_net[w].total_charge_times + '</td><td>'
                + car_net[w].total_charge_money + '</td><td>'
                + car_net[w].total_service_money + '</td><td>'
                + car_net[w].total_money + '</td></tr>';
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
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/data/message",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"datatype":"total_quantity","page":curpage,"rows":16,"provinceid":"","cityid":"","areaid":"","stationname":"","startdate":"","enddate":""}),
		success:function(data){
//			console.log(data)
			var car_net = data.res_station_table;
			var allnums = data.totalcount;
			var notake_car = '';
			
			for(var w=0;w<car_net.length;w++){
                notake_car += '<tr><td>' + car_net[w].stationName + '</td><td>'
                + car_net[w].total_charge_num + '</td><td>'
                + car_net[w].total_charge_quantity + '</td><td>'
                + car_net[w].total_charge_times + '</td><td>'
                + car_net[w].total_charge_money + '</td><td>'
                + car_net[w].total_service_money + '</td><td>'
                + car_net[w].total_money + '</td></tr>';
            }
            $('.elec_num').html(notake_car);	
		}
	});
}

	//城市三级联动
	var province_all,city_all,area_all;
	$.ajax({
		type:"get",
		url:"../js/city.json",
		async:false,
		dataType: "json",
		success:function(data){	
			province_all = data.prvince;
			city_all = data.city;
			area_all = data.area_city;
		}
	})
	
	function s_province(){
		var prvince = province_all.length;
		var sele_p = $('#province');
		sele_p.empty();
		var yu = '<option value="">请选择省</option>';
			sele_p.append(yu)
		for(var i=0;i<prvince;i++){
			var op = '<option value="'+ province_all[i]['code'] +'">'+ province_all[i]['name'] +'</option>';
			sele_p.append(op)	
		}
	}
	s_province()
	var change_province = $('#province option:selected').val();
	
	$('#province').bind('change',function(){
//		console.log($(this).val());
		var select_province = $(this).val();
		
		s_city(select_province);
		var s_c = $('#city').val();
		s_county(s_c)
	})
	//选择市
	function s_city(change_province) {
		var sele_c = $('#city');
		sele_c.empty();
		var city = city_all.length;
		var yu = '<option value="">请选择市</option>';
			sele_c.append(yu)
		for(var i=0;i<city;i++){
			if(city_all[i]['code']==change_province){
				var op = '<option class="' + city_all[i]['id'] +'"value="'+ city_all[i]['citycode'] +'">'+ city_all[i]['cityname'] +'</option>';
				sele_c.append(op)
			}
		}
	}
	s_city(change_province);
	//选择区、县
	var change_area = $('#city option:selected').val();
	function s_county(change_area){
		var city_s = $('#city_small');
		city_s.empty();
		var city_sq = area_all.length;
		var yu = '<option value="" class="">请选择县，区</option>';
			city_s.append(yu)
		for(var i=0;i<city_sq;i++){
			if(area_all[i]['citycode'] == change_area){
				var op = '<option class="' + area_all[i]['area_code'] +'" value="'+ area_all[i]['citycode'] +'">'+ area_all[i]['area_name'] +'</option>';
				city_s.append(op)
			}
		}
	}
	s_county(change_area);
	$('#city').bind('change',function(){
//		console.log($(this).val());
		var c = $(this).val();
		s_county(c)
	})
		
	//城市三级联动

//	$('#from').val(formtime)
//	$('#to').val(nowtime)

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
//		console.log($('#province  option:selected').val())
//		console.log($('#city  option:selected').val())
//		console.log($('#city_small  option:selected').prop("class"));
		var station_name = $('.elec_name').val();
		
//		console.log(station_name)
		var province_id = $('#province  option:selected').val();
		var city_id = $('#city  option:selected').val();
		var area_id = $('#city_small option:selected').prop("class");
//		console.log($('#from').val())
//		console.log($('#to').val())
		var statetime = $('#from').val();
		var endtime = $('#to').val();
		
		selectdetail.val= station_name;
		selectdetail.pid= province_id;
		selectdetail.cid= city_id;
		selectdetail.aid= area_id;
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
				url:publicAdress+"api/chargingpile/data/message",
				async:false,
				contentType: "application/json;charset=utf-8", 
				dataType:"json",
				data:JSON.stringify({"datatype":"total_quantity","page":1,"rows":16,"provinceid":province_id,"cityid":city_id,"areaid":area_id,"stationname":station_name,"startdate":statetime,"enddate":endtime}),
				success:function(data){
					var car_net = data.res_station_table;
					var allnums = data.totalcount;
					var notake_car = '';
					S_allpage(allnums)
					if(car_net.length==0){
						var detail_car = '';
			            detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
			            $('.elec_num').html(detail_car);
					}else{
						for(var w=0;w<car_net.length;w++){
			                notake_car += '<tr><td>' + car_net[w].stationName + '</td><td>'
			                + car_net[w].total_charge_num + '</td><td>'
			                + car_net[w].total_charge_quantity + '</td><td>'
			                + car_net[w].total_charge_times + '</td><td>'
			                + car_net[w].total_charge_money + '</td><td>'
			                + car_net[w].total_service_money + '</td><td>'
			                + car_net[w].total_money + '</td></tr>';
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
	           	$('.elec_num').html('');
	            Pagebtn(currentPage)
	          }
	        }
	    });
	})
}	

function Pagebtn(curpage) {
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/data/message",
		async:false,
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"datatype":"total_quantity","page":curpage,"rows":16,"provinceid":selectdetail.pid,"cityid":selectdetail.cid,"areaid":selectdetail.aid,"stationname":selectdetail.val,"startdate":selectdetail.stime,"enddate":selectdetail.etime}),
		success:function(data){
//			console.log(data)
			var car_net = data.res_station_table;
			var allnums = data.totalcount;
			var notake_car = '';
			
			for(var w=0;w<car_net.length;w++){
                notake_car += '<tr><td>' + car_net[w].stationName + '</td><td>'
                + car_net[w].total_charge_num + '</td><td>'
                + car_net[w].total_charge_quantity + '</td><td>'
                + car_net[w].total_charge_times + '</td><td>'
                + car_net[w].total_charge_money + '</td><td>'
                + car_net[w].total_service_money + '</td><td>'
                + car_net[w].total_money + '</td></tr>';
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
	
	//导出当前数据
	$('#export').click(function(){
		 console.log(1)  
            $(".datas").table2excel({  
                exclude: ".noExl",  
                name: "Excel Document Name",  
                filename: "充电桩运营表",  
                exclude_img: true,  
                exclude_links: true,  
                exclude_inputs: true  
            }); 
	})
	
	//导出全部数据
	$('#allexport').click(function(){
		$.ajax({
			type:"post",
			url: publicAdress+"api/chargingpile/data/message",
			async:false,
			contentType: "application/json;charset=utf-8", 
			dataType:"json",
			data:JSON.stringify({"datatype":"total_quantity","page":1,"rows":0,"provinceid":"","cityid":"","areaid":"","stationname":"","startdate":formtime,"enddate":nowtime}),
			success:function(data){
	//			console.log(data)
				var car_net = data.res_station_table;
				var allnums = data.totalcount;
				var notake_car = '';
				for(var w=0;w<car_net.length;w++){
	                notake_car += '<tr><td>' + car_net[w].stationName + '</td><td>'
	                + car_net[w].total_charge_num + '</td><td>'
	                + car_net[w].total_charge_quantity + '</td><td>'
	                + car_net[w].total_charge_times + '</td><td>'
	                + car_net[w].total_charge_money + '</td><td>'
	                + car_net[w].total_service_money + '</td><td>'
	                + car_net[w].total_money + '</td></tr>';
	            }
	            $('.allelec_num').html(notake_car);	
			}
		});
		 console.log(1)  
        $("#all").table2excel({  
            exclude: ".noExl",  
            name: "Excel Document Name",  
            filename: "充电桩运营表",  
            exclude_img: true,  
            exclude_links: true,  
            exclude_inputs: true  
        }); 
	})
	
	
})
