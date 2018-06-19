$(function(){

    //未还车数据请求地址
    var nogive_car = publicAdress+"api/operation/exorder";

    var cityid_c = localStorage.getItem('c');
    var acode_a = localStorage.getItem('acodes');
    if(cityid_c==null){
    	acode_a ='';
    }
//  console.log(acode_a)
    if(cityid_c==null){
    	cityid_c ='';
    }
    if(cityid_c != ''){
   
    	var s_rang = localStorage.getItem('select_val');
    	if(s_rang==null){
    		$('.ranges').html('全国');
    	}else{
    		$('.ranges').html(s_rang);
    	}	
    }
    var nowdate = new Date();
    var y = nowdate.getFullYear();
    var m = nowdate.getMonth()+1;
    var d = nowdate.getDate();
    var formatnowdate = y+'-'+m+'-'+d;
    //获取系统前1年的时间
    var lastdate = new Date(nowdate-365*24*3600*1000);
    var y = lastdate.getFullYear();
    var m = lastdate.getMonth()+1;
    var d = lastdate.getDate();
    var formatwdate = y+'-'+m+'-'+d;
   
    

    $.ajax({
        type:"POST",
        url: nogive_car,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        asnyc:false,
        data:JSON.stringify({"provinceid":cityid_c,"cityid":acode_a,"startdate":formatwdate,"enddate":formatnowdate,"mobileno":"","ordercode":"","page":1,"rows":4}),
        success:function (data) {
//          console.log(data);
            //函数调用，获取总条数
            no_take(data.totalcount);
            var car_net = data.res_exception;
            var notake_car = '';
             if(car_net.length==0){
            	var detail_car = '';
                detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
                $('.car_num').html(detail_car);
            }else{
            	for(var w=0;w<car_net.length;w++){
	                notake_car += '<tr><td>' + car_net[w].ordercode + '</td><td>'
	                + car_net[w].mobileno + '</td><td>'
	                + car_net[w].city + '</td><td>'
	                + car_net[w].cityname + '</td><td>'
	                + car_net[w].status + '</td><td>'
	                + car_net[w].borrowtime + '</td><td>' 
	                + car_net[w].usemileage + '</td><td>'
	                + car_net[w].usetime + '</td><td>'
	                + car_net[w].beginstation + '</td><td>'
	                + car_net[w].platenumber + '</td></tr>';
	            }
	            $('.car_num').html(notake_car);
            }
            
        }
    })	
    //未还车页码
    var currentPageAllAppoint = 1;
	function no_take(allcount){
	    layui.use(['laypage', 'layer'], function(){
	        var laypage = layui.laypage
	          ,layer = layui.layer;
	          //完整功能
	        laypage.render({
	            elem: 'demo6'
	            ,count: allcount
	            ,limit:4
	            ,curr:currentPageAllAppoint
	            ,layout: ['count', 'prev', 'page', 'next', 'skip']
	            ,jump: function(obj,first){
	              currentPageAllAppoint = obj.curr
	              if(!first){
	                $('.car_num').html('');
	                pagerequest()
	                    
	              }
	            }
	        });
	    })
	}

//未还车点击页码数据请求
function pagerequest() {
    $.ajax({
        type:"POST",
        url: nogive_car,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        asnyc:false,
        data:JSON.stringify({"provinceid":cityid_c,"cityid":acode_a,"startdate":formatwdate,"enddate":formatnowdate,"mobileno":"","ordercode":"","page":currentPageAllAppoint,"rows":4}),
        success:function (data) {
            // console.log(data);
            //函数调用，获取总条数
            no_take(data.totalcount);
            var car_net = data.res_exception;
            var notake_car = '';
            if(car_net.length==0){
            	var detail_car = '';
                detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
                $('.car_num').html(detail_car);
            }else{
            	for(var w=0;w<car_net.length;w++){
	                notake_car += '<tr><td>' + car_net[w].ordercode + '</td><td>'
	                + car_net[w].mobileno + '</td><td>'
	                + car_net[w].city + '</td><td>'
	                + car_net[w].cityname + '</td><td>'
	                + car_net[w].status + '</td><td>'
	                + car_net[w].borrowtime + '</td><td>' 
	                + car_net[w].usemileage + '</td><td>'
	                + car_net[w].usetime + '</td><td>'
	                + car_net[w].beginstation + '</td><td>'
	                + car_net[w].platenumber + '</td></tr>';
	            }
	            $('.car_num').html(notake_car);
            }  
        }
    })
}
// 文档加载完3s后清除缓存
function det(){
	localStorage.clear()
}
 window.setTimeout(det,3000);

// 保存查询数据
var prod_data ={};

$('.select_nocar').click(function(){
	localStorage.clear();	
	var select_order = $('.car_type').val();
	var select_mobile = $('.car_p').val();
	var p_code = $('#province option:selected').val();
	var c_code = $('#city option:selected').val();
	prod_data.s_order = select_order;
	prod_data.s_mobile = select_mobile
	prod_data.p_code = p_code;
	prod_data.c_code = c_code;
	
	var p_text = $('#province option:selected').text();
	var c_text = $('#city option:selected').text();
	if(p_text =='请选择省'){
		p_text = '';
	}
	if(c_text =='请选择市'){
		c_text = '';
	}
	var rangs = p_text +c_text;
//	console.log(rangs)
	if(rangs ==''){
		$('.ranges').html('全国');
	}else{
		$('.ranges').html(rangs);
	}
	currpage = 1;
	$.ajax({
        type:"POST",
        url: nogive_car,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        asnyc:false,
        data:JSON.stringify({"provinceid":p_code,"cityid":c_code,"startdate":formatwdate,"enddate":formatnowdate,"mobileno":select_mobile,"ordercode":prod_data.s_order,"page":1,"rows":4}),
        success:function (data) {
//          console.log(data);
            //函数调用，获取总条数
            find_cars(data.totalcount);
            var car_net = data.res_exception;
            if(car_net.length==0){
                var detail_car = '';
                detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
                $('.car_num').html(detail_car);
            }else{
                var notake_car = '';
                for(var w=0;w<car_net.length;w++){
                    notake_car += '<tr><td>' + car_net[w].ordercode + '</td><td>'
                    + car_net[w].mobileno + '</td><td>'
                    + car_net[w].city + '</td><td>'
                    + car_net[w].cityname + '</td><td>'
                    + car_net[w].status + '</td><td>'
                    + car_net[w].borrowtime + '</td><td>' 
                    + car_net[w].usemileage + '</td><td>'
                    + car_net[w].usetime + '</td><td>'
                    + car_net[w].beginstation + '</td><td>'
                    + car_net[w].platenumber + '</td></tr>';
                }
            }
            $('.car_num').html(notake_car);
        }
    })
})
// 输入条件查询
var currpage = 1;
function find_cars(allcount){
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
          ,layer = layui.layer;
          //完整功能
          laypage.render({
            elem: 'demo6'
            ,count: allcount
            ,limit:4
            ,curr:currpage
            ,layout: ['count', 'prev', 'page', 'next', 'skip']
            ,jump: function(obj,first){
              currpage = obj.curr
              if(!first){
                $('.car_num').html('');
                request_car()
    
              }
            }
        });
    })
}
// 搜索后页面请求
function request_car() {
    $.ajax({
        type:"POST",
        url: nogive_car,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        asnyc:false,
        data:JSON.stringify({"provinceid":prod_data.p_code,"cityid":prod_data.c_code,"startdate":formatwdate,"enddate":formatnowdate,"mobileno":prod_data.s_mobile,"ordercode":"","page":currpage,"rows":4}),
        success:function (data) {
            // console.log(data);
            //函数调用，获取总条数
            find_cars(data.totalcount);
            var car_net = data.res_exception;
            var notake_car = '';
            if(car_net.length==0){
            	var detail_car = '';
                detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
                $('.car_num').html(detail_car);
            }else{
            	for(var w=0;w<car_net.length;w++){
	                notake_car += '<tr><td>' + car_net[w].ordercode + '</td><td>'
	                + car_net[w].mobileno + '</td><td>'
	                + car_net[w].city + '</td><td>'
	                + car_net[w].cityname + '</td><td>'
	                + car_net[w].status + '</td><td>'
	                + car_net[w].borrowtime + '</td><td>' 
	                + car_net[w].usemileage + '</td><td>'
	                + car_net[w].usetime + '</td><td>'
	                + car_net[w].beginstation + '</td><td>'
	                + car_net[w].platenumber + '</td></tr>';
	            }
	            $('.car_num').html(notake_car);
            }
        }
    })
}

var province_all,city_all,area_all;
	$.ajax({
		type:"get",
		url:"./js/city.json",
		async:false,
		dataType: "json",
		success:function(data){	
			province_all = data.prvince;
			city_all = data.city;
			area_all = data.area_city;
		}
	})
//选择省
	function s_province(){
		var prvince = province_all.length;
		var sele_p = $('#province');
		sele_p.empty();
		var sheng = '<option value="">请选择省</option>';
			sele_p.append(sheng)
		for(var i=0;i<prvince;i++){
			var op = '<option value="'+ province_all[i]['code'] +'">'+ province_all[i]['name'] +'</option>';
			sele_p.append(op)
		}
	}
	s_province()
	var change_province = $('#province option:selected').val();
	
	$('#province').bind('change',function(){
		console.log($(this).val());
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
		var shi = '<option value="">请选择市</option>';
			sele_c.append(shi)
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
		var yu = '<option value="请选择县，区">请选择县，区</option>';
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
		console.log($(this).val());
		var c = $(this).val();
		s_county(c)
	})
    	

})