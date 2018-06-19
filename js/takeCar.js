 $(function(){

//点击维护数据请求地址
var prod_date = publicAdress+'api/operation/maintain';
//挪车数据请求地址
var take_cars = publicAdress+"api/operation/movecar";


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


var provincenum = localStorage.getItem('prov');
//	console.log(provincenum);
var acode_a = localStorage.getItem('acode');
//console.log(acode_a)
if(provincenum ==null){
	provincenum = '';
}
if(acode_a ==null){
	acode_a = '';
}
if(provincenum !=''){
	var s_rang = localStorage.getItem('select_val');
	if(s_rang==null){
		$('.range').html('全国');
	}else{
		$('.range').html(s_rang);
	}
}

$.ajax({
    type:"POST",
    url: take_cars,
    contentType: "application/json;charset=utf-8",
    dataType:"json",
    asnyc:false,
    data:JSON.stringify({"provinceid":provincenum,"cityid":acode_a,"startdate":formatwdate,"enddate":formatnowdate,"platenumber":"","page":1,"rows":2}),
    success:function (data) {
        // console.log(data);
        var takecarPage = data.totalcount;
        //函数调用   获取挪车数据总条数
        takeCar(takecarPage);
        var car_takeing = data.res_move_car;
        var notake_car = '';
        if(car_takeing.length==0){
        	var detail_car = '';
            detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
            $('.needcar_num').html(detail_car);
        }else{
        	for(var w=0;w<car_takeing.length;w++){
	            notake_car += '<tr><td>' + car_takeing[w].carCode + '</td><td>'
	            + car_takeing[w].brandname + '</td><td>'
	            + car_takeing[w].modelnumber + '</td><td>'
	            + car_takeing[w].cardisposition + '</td><td>'
	            + car_takeing[w].status + '</td><td>'
	            + car_takeing[w].plateNumber + '</td><td>' 
	            + car_takeing[w].color + '</td><td>'
	            + car_takeing[w].oddPower + '</td><td>'
	            + car_takeing[w].oddMileage + '</td><td>'
	            + car_takeing[w].lastLocationTxt + '</td></tr>';
	        }
	        $('.needcar_num').html(notake_car)
        } 
    }
})
//挪车页码
var takepage = 1;	
function takeCar(counts){
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
          ,layer = layui.layer;
          //完整功能
          laypage.render({
            elem: 'pages'
            ,count: counts
            ,curr:takepage
            ,limit:2
            ,layout: ['count', 'prev', 'page', 'next', 'skip']
            ,jump: function(obj,first){
//            console.log(obj);
              takepage = obj.curr;
              if(!first){
                $('.needcar_num').html('');
                take_Car()
              }
            }
        });
    })
}
//点击挪车页码数据请求
function take_Car() {
    $.ajax({
        type:"POST",
        url: take_cars,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        asnyc:false,
        data:JSON.stringify({"provinceid":provincenum,"cityid":acode_a,"startdate":formatwdate,"enddate":formatnowdate,"platenumber":"","page":takepage,"rows":2}),
        success:function (data) {
            // console.log(data);
            var takecarPage = data.totalcount;  
            var car_takeing = data.res_move_car;
            var notake_car = '';
            for(var w=0;w<car_takeing.length;w++){
                notake_car += '<tr><td>' + car_takeing[w].carCode + '</td><td>'
                + car_takeing[w].brandname + '</td><td>'
                + car_takeing[w].modelnumber + '</td><td>'
                + car_takeing[w].cardisposition + '</td><td>'
                + car_takeing[w].status + '</td><td>'
                + car_takeing[w].plateNumber + '</td><td>' 
                + car_takeing[w].color + '</td><td>'
                + car_takeing[w].oddPower + '</td><td>'
                + car_takeing[w].oddMileage + '</td><td>'
                + car_takeing[w].lastLocationTxt + '</td></tr>';
            }
            $('.needcar_num').html(notake_car)
        }
    })
}
//请求省，市，县
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
		var prin = '<option value="">请选择省</option>';
			sele_p.append(prin)
		
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
		var xian = '<option value="">请选择县，区</option>';
			city_s.append(xian)
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
	
	// 文档加载完3s后清除缓存
	function det(){
		console.log(9090)
		localStorage.clear()
	}
	window.setTimeout(det,3000);
	
	// 保存搜索条件
	var moveCar = {};
	
	$('.selects').click(function(){
		localStorage.clear();
		var p_code = $('#province option:selected').val();
		var c_code = $('#city option:selected').val();
//		var a_code = $('#city_small option:selected').prop("class");
		var car_number = $('.layui-input').val();
		
		moveCar.princode = p_code;
		moveCar.cycode = c_code;
		moveCar.carnum = car_number;
		var p_text = $('#province option:selected').text();
		var c_text = $('#city option:selected').text();
//		var a_text = $('#city_small option:selected').text();	
		if(p_text =='请选择省'){
			p_text = '';
		}
		if(c_text =='请选择市'){
			c_text = '';
		}
//		if(a_text =='请选择县，区'){
//			a_text = '';
//		}
//		console.log(p_text+ '-' +c_text+ '-' +a_text);
		var rangs = p_text+ c_text;
//		console.log(rangs)
		if(rangs ==''){
			$('.range').html('全国');
		}else{
			$('.range').html(rangs);
		}
		takepage = 1;
		$.ajax({
	        type:"POST",
	        url: take_cars,
	        contentType: "application/json;charset=utf-8", 
	        dataType:"json",
	        asnyc:false,
	        data:JSON.stringify({"provinceid":p_code,"cityid":c_code,"platenumber":car_number,"startdate":formatwdate,"enddate":formatnowdate,"page":1,"rows":2}),
	        success:function (data) {
//	             console.log(data);
	            var takecarPage = data.totalcount;
	            //函数调用   获取挪车数据总条数
	            s_takeCar(takecarPage);
	            var car_takeing = data.res_move_car;
	            if(car_takeing.length==0){
	                var detail_car = '';
	                detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
	                $('.needcar_num').html(detail_car);
                }else{
                    var notake_car = '';
                    for(var w=0;w<car_takeing.length;w++){
                        notake_car += '<tr><td>' + car_takeing[w].carCode + '</td><td>'
                        + car_takeing[w].brandname + '</td><td>'
                        + car_takeing[w].modelnumber + '</td><td>'
                        + car_takeing[w].cardisposition + '</td><td>'
                        + car_takeing[w].status + '</td><td>'
                        + car_takeing[w].plateNumber + '</td><td>' 
                        + car_takeing[w].color + '</td><td>'
                        + car_takeing[w].oddPower + '</td><td>'
                        + car_takeing[w].oddMileage + '</td><td>'
                        + car_takeing[w].lastLocationTxt + '</td></tr>';
                	}
                    $('.needcar_num').html(notake_car);
            	}
	            
	        }
	    })
	})
	//搜索后页码
	var takepage = 1;	
	function s_takeCar(counts){
	    layui.use(['laypage', 'layer'], function(){
	        var laypage = layui.laypage
	          ,layer = layui.layer;
	          //完整功能
	          laypage.render({
	            elem: 'pages'
	            ,count: counts
	            ,curr:takepage
	            ,limit:2
	            ,layout: ['count', 'prev', 'page', 'next', 'skip']
	            ,jump: function(obj,first){
	//            console.log(obj);
	              takepage = obj.curr;
	              if(!first){
	                $('.needcar_num').html('');
	                s_Car()
	              }
	            }
	        });
	    })
	}
	//搜索后页码数据请求
	function s_Car() {
	    $.ajax({
	        type:"POST",
	        url: take_cars,
	        contentType: "application/json;charset=utf-8", 
	        dataType:"json",
	        asnyc:false,
	        data:JSON.stringify({"provinceid":moveCar.princode,"cityid":moveCar.cycode,"startdate":formatwdate,"enddate":formatnowdate,"platenumber":moveCar.carnum,"page":takepage,"rows":2}),
	        success:function (data) {
	            // console.log(data);
	            var takecarPage = data.totalcount;  
	            var car_takeing = data.res_move_car;
	            var notake_car = '';
	            for(var w=0;w<car_takeing.length;w++){
	                notake_car += '<tr><td>' + car_takeing[w].carCode + '</td><td>'
	                + car_takeing[w].brandname + '</td><td>'
	                + car_takeing[w].modelnumber + '</td><td>'
	                + car_takeing[w].cardisposition + '</td><td>'
	                + car_takeing[w].status + '</td><td>'
	                + car_takeing[w].plateNumber + '</td><td>' 
	                + car_takeing[w].color + '</td><td>'
	                + car_takeing[w].oddPower + '</td><td>'
	                + car_takeing[w].oddMileage + '</td><td>'
	                + car_takeing[w].lastLocationTxt + '</td></tr>';
	            }
	            $('.needcar_num').html(notake_car)
	        }
	    })
	}
	
})