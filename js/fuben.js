/**
 * Created by Administrator on 2017/07/14.
 */
layui.define(function(exports) {

    //获取现在时间
    var nowdate = new Date();
    var y = nowdate.getFullYear();
    var m = nowdate.getMonth()+1;
    var d = nowdate.getDate();
    var nowdates = y+'-'+m+'-'+d;
    
    //获取系统前1年的时间
    var lastdate = new Date(nowdate-365*24*3600*1000);
    var y = lastdate.getFullYear();
    var m = lastdate.getMonth()+1;
    var d = lastdate.getDate();
    var fo = y+'-'+m+'-'+d;
	
     //默认全国数据请求地址
    var urldata = publicAdress+'api/operation/country';
    //点击维护数据请求地址
    var prod_date = publicAdress+'api/operation/maintain';
    //挪车数据请求地址
    var take_cars = publicAdress+"api/operation/movecar";
    //未还车数据请求地址
    var nogive_car = publicAdress+"api/operation/exorder";
    //点击表格数据 柱形图请求地址
    var columndate = publicAdress+'api/operation/datatype';
  
    //选项卡切换
    $('.tab').find('li').click(function(){
        var index = $(this).index();
        $(this).addClass('tab_on').siblings().removeClass('tab_on');
        $('.tab_cont').find('.alldata').eq(index).show().siblings().hide();
    })

 	//获取现在时间
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
   
    var cityDatas = new Array();
    var item = new Array();
function defaultdate() {
    $.ajax({
        type:"POST",
        url: urldata,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        data:JSON.stringify({"provinceid":"","cityid":"","startdate":formatwdate,"enddate":formatnowdate}),
        success:function (data) {
//          console.log(data);
            var vr = data.res_car_num;
            var i;
            for (i = 0; i < vr.length; i++) {
                item[i] = new Object();
                item[i].name = vr[i].Name;
                item[i].carNum = vr[i].carNum;
                item[i].lat = vr[i].lat*1+1.521839;
                item[i].lon = vr[i].lng*1+0.186059;
                item[i].code = vr[i].Code;
            }   
            opare(data);
        }
    })
}
defaultdate()
setInterval(defaultdate,100000);
//点击维护数据请求
function product_date(){	
    $.ajax({
        type:"POST",
        url: prod_date, 
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        data:JSON.stringify({"provinceid":"","cityid":"","startdate":formatwdate,"enddate":formatnowdate}),
        success:function (data) {
//             console.log(data);
            $('.out_car').html(data.res_exception_num)
            $('.move_car').html(data.res_move_num)
            $('.move_car').attr('acode','')
			$('.out_car').attr('acode','')
            $('.move_car').attr('name',data.provinceid)
            $('.out_car').attr('name',data.provinceid)   
        }
    })
}
product_date()
setInterval(product_date,100000);

//挪车数据点击请求
$('.move_car').click(function(e){
    var provincenum = $(this).attr("name");
    var acode = $(this).attr("acode");
//  take_cityid.code = provincenum;
    var car_take = $(this).attr("data");
    window.location.href= 'takeCar.html';
    localStorage.setItem('prov',provincenum);
    var select_val = $('#det').html();
    localStorage.setItem('select_val',select_val);
    localStorage.setItem('acode',acode);

})

var carProduct =$('.car_product td');
for(var i = 0; i < carProduct.length; i++) {
    carProduct[i].index = i;
    carProduct[i].onclick = function() {
        $(this).addClass('ppp').siblings().removeClass('ppp');
    }
}

//挪车页码
var takepage =1;


//获取json城市三级联动数据编码
var province_all,city_all,area_all;
$.ajax({
    type:"get",
    url:"js/city.json",
    async:false,
    dataType: "json",
    success:function(data){ 
//      console.log(data)
        province_all = data.prvince;
        city_all = data.city;
        area_all = data.area_city;
    }
})

///选择省
	function s_province(a){
		var prvince = province_all.length;
		var sele_p = $('#province');
		sele_p.empty();
		for(var i=0;i<prvince;i++){
			if(province_all[i]['code'] ==a){
				var op = '<option value="'+ province_all[i]['code'] +'">'+ province_all[i]['name'] +'</option>';
				sele_p.append(op)
			}
		}
	}
//	s_province()
	var change_province = $('#province option:selected').val();

	$('#province').bind('change',function(){
		console.log($(this).val());
		var select_province = $(this).val();
		s_city(select_province);
		var s_c = $('#city').val();
		s_county(s_c)
	})
	
	//选择市
	function s_city(change_province,s_code) {
//		console.log(change_province)
		var sele_c = $('#city');
		sele_c.empty();
		var city = city_all.length;
		for(var i=0;i<city;i++){
			if(city_all[i]['code']==change_province){
				var op = '<option class="' + city_all[i]['id'] +'"value="'+ city_all[i]['citycode'] +'">'+ city_all[i]['cityname'] +'</option>';
				sele_c.append(op)
			}
		}
		$('#city option').each(function(){
			if($(this).val()==s_code){
				$(this).prop("selected",true);
			}
		})
		
	}
//	s_city(change_province);
	
	//选择区、县
	var change_area = $('#city option:selected').val();
	
	function s_county(change_area){
		var city_s = $('#city_small');
		city_s.empty();
		var city_sq = area_all.length;
		var define_s = '<option class="" value="">请选择县，区</option>';
		city_s.append(define_s)
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
		s_county(c);
	})

localStorage.setItem('select_val','全国');
//全局保存为还车城市编码
var notake_cityid ={}
var currentPageAllAppoint = 1;
//未还车数据点击请求
$('.out_car').click(function(){
    var cityid_c = $(this).attr("name");
    var acodes = $(this).attr('acode');
    notake_cityid.c_cityid = cityid_c;
    localStorage.setItem("c", cityid_c);  
    localStorage.setItem("acodes",acodes); 
    var select_v = $('#det').html();
//  console.log(select_v)
    localStorage.setItem('select_val',select_v);
    window.location.href='no_takeCar.html';
 
})

//  数据调取公共函数
function opare(a){
    var city_all = a.res_car_num;
    var cardata = a.res_car_data;
//  console.log(cardata)
    // 省份ID
    var datacount = a.res_order_opreation;  
    for(var t=0;t<city_all.length;t++){
        cityDatas[t] = new Object();
        cityDatas[t].lat = city_all[t].lat*1 + 0.22;
        cityDatas[t].lon = city_all[t].lng*1 - 0.12;
        cityDatas[t].name = city_all[t].Name;
        cityDatas[t].carNum = city_all[t].carNum;
        cityDatas[t].code = city_all[t].Code;
    }
//  cityDatas[0].lat = city_all[0].lat*1 + 0.15;
//  cityDatas[0].lon = city_all[0].lng*1 - 0.15;
    var carhtml = '';
    	for(var t=0;t<cardata.length;t++){   
	        carhtml += '<tr class="head databtn"><td citycode="' + cardata[t].citycode + '" name="' + cardata[t].provincecode + '" class="carNum">' + cardata[t].carNum + '</td>' +
	        '<td citycode="' + cardata[t].citycode + '" name="' + cardata[t].provincecode + '" class="mileage">' + cardata[t].mileage + '</td></tr>';
	    }
	    $('.all_three').html(carhtml);
    var counthtml = '';
    for(var w=0;w<datacount.length;w++){
        counthtml += '<tr class="head databtn"><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '" class="orderNum">'+ datacount[w].orderNum + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '" class="cartime">'+ datacount[w].cartime+ '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="mileageConsum">'+ datacount[w].mileageConsum + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="timeConsum">'+ datacount[w].timeConsum+ '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="electricConsum">'+ datacount[w].electricConsum + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="mincarconsum">'+ datacount[w].mincarConsum + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="dayconsum">'+ datacount[w].dayconsum + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="parkedamount">'+ datacount[w].parkedamount + '</td><td citycode="'
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="drivercost">'+ datacount[w].drivercost + '</td><td citycode="' 
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="totalConsum">'+ datacount[w].totalConsum + '</td><td citycode="' 
        + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="payAmount">'
        + datacount[w].payAmount + '</td></tr>';
    }
    $('.all_one').html(counthtml);
    var list = $('.databtn td');
    // 点击表格数据查看统计图
    for(var i = 0; i < list.length; i++) {
        list[i].index = i;
        list[i].onclick = function(e) {
            var classname = $(this).prop("class");
            //类型编码转换为小写
            classname = classname.toLowerCase();   
			//获取现在时间
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
			
            $('#dp1').val(formatnowdate);
            $('#dp0').val(formatwdate);
 			
            var cityid = $(this).attr("name");
            var code = $(this).attr("citycode");
				
			var form_time = $('#dp0').val();
			var now_time = $('#dp1').val();
		
            //调用函数，传参
            showinform(classname,cityid,code,form_time,now_time);
            uptitle()
            $('.contdata').animate({
                top:40 +'px'
            },500);
            $('.shadow').animate({
                top:40 +'px'
            },500)
            
            e = window.event || e;
		    if (e.stopPropagation) {
		         e.stopPropagation();
		    } else {
		         e.cancelBubble = true;
		    } 
        }
    }
}


//点击图标网点数据
function opaton_s(a) {
    // console.log(a);
    
    var netcar = a;
    var netcarhtml = '';
    if(netcar.length ==0){
        netcarhtml += '<tr><td>暂无信息</td></tr>';
    		$('.cityNum').html(netcarhtml);
		}else{
			for(var t=0;t<netcar.length;t++){   
		        netcarhtml += '<tr><td>'
		        + netcar[t].Code + '</td><td>'
		        + netcar[t].Name + '</td><td>'
		        + netcar[t].carNum +'</td><td>'
		        + netcar[t].label +'</td></tr>' 
	    	}
	    	$('.cityNum').html(netcarhtml);
		}
}
var netPage =1;

var n = 0;
var pages =1;

function topaging(allCountpage){
	$("#pagination_3").pagination({
	    totalPage: allCountpage, //可选，总页数
	    showPageNum: 5,  //可选，展示页码数量，默认5个页码数量
	    previousPage: '上一页',
	    nextPage: '下一页',
	    skip: '跳至',
	    confirm: '确认',
	    totalPageText: '共{}页',
	    isShowFL: false,
	    isShowPageSizeOpt: true,   //可选，是否展示跳到指定页数，默认true
	    isShowSkip: true,
	    isShowRefresh: false,
	  	isResetPage: false,
	    isShowTotalPage: true,
	 	//必选，回掉函数，返回参数：第一个参数为页码，第二个参数为每页显示N条
	    callBack: function (currPage, pageSize) {
    		netPage = currPage;
    		$('.cityNum').html('');
    		ner_pagerequest();    
	    }
	});
}


function topage(allCountpage){
	$("#pagination_3").pagination({
	    totalPage: allCountpage, //可选，总页数
	    showPageNum: 5,  //可选，展示页码数量，默认5个页码数量
	    previousPage: '上一页',
	    nextPage: '下一页',
	    skip: '跳至',
	    confirm: '确认',
	    totalPageText: '共{}页',
	    isShowFL: false,
	    isShowPageSizeOpt: true,   //可选，是否展示跳到指定页数，默认true
	    isShowSkip: true,
	    isShowRefresh: true,
	  	isResetPage: false,
	    isShowTotalPage: true,
	 	//必选，回掉函数，返回参数：第一个参数为页码，第二个参数为每页显示N条
	    callBack: function (currPage, pageSize) {
	        switch(n){
	        	case 0:
	        		netPage = currPage;
	        		$('.cityNum').html('');
            		ner_pagerequest();
            		break;
            	case 90:
            		pages = currPage
		        	$('.cityNum').html('');
	            	net_request();
	            	break;
	        }  
	    }
	});
}
//全局保存城市，省市区编码
var find_code={};
function prodId(a,b,c){
    find_code.prvin = a;
    find_code.city = b;
    find_code.arae = c;
}

//网点页码点击请求数据
function ner_pagerequest(){

	//获取现在时间
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
        url: urldata,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":find_code.prvin,"page":netPage,"rows":3,"cityid":find_code.city,"areaid":find_code.arae,"startdate":formatwdate,"enddate":formatnowdate}),
        success:function (data) {
//          console.log(data);
            var netcar = data.res_car_num;
            var allcounts = data.sumpage;
            var netcarhtml = '';
            for(var t=0;t<netcar.length;t++){   
                netcarhtml += '<tr><td>'
                + netcar[t].Code + '</td><td>'
                + netcar[t].Name + '</td><td>'
                +netcar[t].carNum +'</td><td>'
                +netcar[t].label +'</td></tr>' 
            }
            $('.cityNum').html(netcarhtml);
        }
    })
}

var finddate = {};
var newpage =1;
	// 查询网点数据
$('.find_carnet').click(function(){
	//获取现在时间
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
	n=90;
	var province_id = $('#province option:selected').val();
	var city_id = $('#city option:selected').val();
	var area_id = $('#city_small option:selected').prop("class");
//	console.log(area_id)
	finddate.p_code = province_id;
	finddate.c_code = city_id;
	finddate.a_code = area_id;
	$.ajax({
		type:"POST",
        url: urldata,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":province_id,"cityid":city_id,"startdate":formatwdate,"enddate":formatnowdate,"areaid":area_id,"page":1,"rows":3}),
        success:function (data) {
//	            console.log(data); 
            newtopage(data.sumpage);
            if(data.res_car_num ==0){
            	var netcarhtml = '';
			    netcarhtml += '<tr><td>暂无信息</td></tr>';
			    $('.cityNum').html(netcarhtml);
            }else{
            	opaton_s(data.res_car_num);
            	
            }
           
        }
	})
	
})

function newtopage(allCount){
	$("#pagination_3").pagination('setPage', 1, allCount);
}


//网点页码点击请求数据  搜索后

function net_request(){
	//获取现在时间
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
        url: urldata,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":finddate.p_code,"page":pages,"rows":3,"cityid":finddate.c_code,"areaid":finddate.a_code,"startdate":formatwdate,"enddate":formatnowdate}),
        success:function (data) {
            console.log(data);
            var netcar = data.res_car_num;
            var allcounts = data.sumpage;
            var netcarhtml = '';
            for(var t=0;t<netcar.length;t++){   
                netcarhtml += '<tr><td>'
                + netcar[t].Code + '</td><td>'
                + netcar[t].Name + '</td><td>'
                +netcar[t].carNum +'</td><td>'
                +netcar[t].label +'</td></tr>' 
            }
            $('.cityNum').html(netcarhtml);
        }
    })
}
var map = null,
geochina = 'https://data.jianshukeji.com/jsonp?filename=geochina/';
$.getJSON(geochina + 'china.json&callback=?', function(mapdata) {
    var data = [];
    // console.log(mapdata)
    // 随机数据
    Highcharts.each(mapdata.features, function(md, index) {
        var tmp = {
            name: md.properties.name,
            value: Math.floor((Math.random() * 100) + 1) // 生成 1 ~ 100 随机值
        };
        if(md.properties.drilldown) {
            tmp.drilldown = md.properties.drilldown;
        }
        data.push(tmp);
    });
    var provinceCode;
  
    map = new Highcharts.Map('container', {
        chart: {
            events: {
                drilldown: function(e) {
                    this.tooltip.hide();
                    console.log(e.point.drilldown);
               
//                  console.log(item)
                    // 异步下钻
                    if (e.point.drilldown=='guangdong') {
						document.getElementById('det').innerHTML=e.point.properties.fullname;
                        var pointName = e.point.properties.fullname;
                        cityCode = e.point.properties.areacode;
                        map.showLoading('加载中，请稍后...');
                        // 获取二级行政地区数据并更新图表
                        $.getJSON(geochina +  e.point.drilldown + '.json&callback=?', function(data) {
                        	
                            data = Highcharts.geojson(data);
                            Highcharts.each(data, function(d) {
                                if(d.properties.drilldown) {
                                    d.drilldown = d.properties.drilldown;
                                }
                                d.value = Math.floor((Math.random() * 100) + 1); 
                            });
                            map.hideLoading();
                            map.addSingleSeriesAsDrilldown(e.point, {
                                name: e.point.name,
                                data: data
                            });
                 
			                var provinceid,cityid;
                            if(e.point.properties.level == 'province') {
                                provinceid = e.point.properties.areacode;
                                provinceCode = e.point.properties.areacode;
                            }
                            if(e.point.properties.level == 'city'){
                                cityid = e.point.properties.areacode;
                            }
                            //获取现在时间
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
                       
                            // console.log(provinceid+'ssssss'+cityid)
                             $.ajax({
                                type:"POST",
                                url: urldata,
                                contentType: "application/json;charset=utf-8", 
                                dataType:"json",
                                async:false,
                                data:JSON.stringify({"provinceid":provinceid,"cityid":cityid,"startdate":formatwdate,"enddate":formatnowdate}),
                                success:function (data) {
                                    // console.log(data);
                                    //函数调用，传参
                                    opare(data);
                                }
                            })
              		
                           	// 车辆维护数据请求
                            $.ajax({
                                type:"POST",
                                    url: prod_date,
                                    contentType: "application/json;charset=utf-8", 
                                    dataType:"json",
                                    data:JSON.stringify({"provinceid":provinceid,"cityid":cityid,"startdate":formatwdate,"enddate":formatnowdate}),
                                    success:function (data) {
//                                         console.log(data);
                                        $('.move_car').attr('name',data.provinceid)
                                        $('.out_car').attr('name',data.provinceid)
                                        $('.move_car').attr('acode','')
										$('.out_car').attr('acode','')
                                        $('.out_car').html(data.res_exception_num)
                                        $('.move_car').html(data.res_move_num)
                                    }
                            })
                            map.addSingleSeriesAsDrilldown(e.point, {
                                type:'mappoint',
                                color:'red',
                                marker: {
                                    symbol: 'url(images/d.png)',
                                    width:50,
                                    height:50
							
                                },
                                point:{
                                    events:{
                                        //点击二级地图上的标记
                                        click:function(e) {
                                        	var showname = e.point.name;
                                        	document.getElementById('det').innerHTML=e.point.name;
											
											var title = {
						                        text: showname
						                   }
						                    map.setTitle(title);
											
//                                          console.log(e.point);
                                            netPage =1;
                                           //获取现在时间
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
								                                  
                                            var cityscode = e.point.code;
//                                          console.log(provinceid+'二级');
                                            if(e.point.name == '广东省'){
                                                console.log('奇速');
                                            }else{
                                            	$('.detdate').animate({
												    right: 0
												},500)
                                                $.ajax({
                                                    type:"POST",
                                                    url: urldata,
                                                    contentType: "application/json;charset=utf-8", 
                                                    dataType:"json",
                                                    async:false,
                                                    data:JSON.stringify({"provinceid":provinceid,"page":1,"rows":3,"cityid":cityscode,"areaid":"","startdate":formatwdate,"enddate":formatnowdate}),
                                                    success:function (data) {
//                                                      console.log(data)
                                                        var allcounts = data.sumpage;
                                                        //保存省份和城市编码
                                                        var p_code = data.provinceid;
                                                        var c_code = data.cityid;
                                                        var ar_code = data.areaid;
                                                        
                                                        find_code.prvin = p_code;
													    find_code.city = c_code;
													    find_code.arae = ar_code;
													                                                        
                                                        prodId(p_code,c_code,ar_code);
                                                        //保存省份和城市编码
                                                        //函数调用，传参
                                                        opare(data);
                                                        var n=0;
                                                        opaton_s(data.res_car_num);
                                                        topaging(allcounts);
                                                        newtopage(allcounts)
                                                    }
                                                })
//                                              console.log(provinceid+'二级');
//                                              console.log(cityscode+'二级');
                                                
                                                // 车辆维护数据请求
					                            $.ajax({
					                                type:"POST",
					                                    url: prod_date,
					                                    contentType: "application/json;charset=utf-8", 
					                                    dataType:"json",
					                                    data:JSON.stringify({"provinceid":provinceid,"cityid":cityscode,"startdate":formatwdate,"enddate":formatnowdate}),
					                                    success:function (data) {
//										                     console.log(data);
					                                        $('.move_car').attr('name',data.provinceid)
					                                        $('.out_car').attr('name',data.provinceid)
					                                        $('.move_car').attr('acode',data.cityid)
					                                        $('.out_car').attr('acode',data.cityid)
					                                        $('.out_car').html(data.res_exception_num)
					                                        $('.move_car').html(data.res_move_num)
					                                    }
					                            })
							                    s_province(provinceid)
							                    s_city(provinceid,cityscode);
							                    s_county(cityscode)
	            							}
                                            e = window.event || e;
											if(e.stopPropagation) {
											    e.stopPropagation();
											}else{
											    e.cancelBubble = true;
											}
                                        }
                                    }
                                },
                                data: cityDatas,
                                tooltip: {
                                    enabled: true,
                                    headerFormat: '',
                                    pointFormat: '<b>{point.name}</b><br>车辆总数: {point.carNum}'
                                }
                            });
                            map.applyDrilldown();
                            map.setTitle({
                                text: pointName
                            });
                        });       
                    }
                },
                drillup: function(e) {
                    cityDatas.splice(0,cityDatas.length);
                    //调取车辆维护数据
                    product_date()
                    document.getElementById('det').innerHTML = e.seriesOptions.name;
                    console.log('返回地图')
                    var title = {
                        text: '全国',
                    }
                    //调取车辆运营数据
                    defaultdate();
                    document.getElementById('det').innerHTML='全国';
                    map.setTitle(title);
                }
            }
        },
        title: {
            text: '全国'
        },
        subtitle: {
            useHTML: true
        },
        credits: {
        	enabled: false 
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.properties.name}</b>',
                },
                marker: {
                    radius: 5,
                    color:'#fff'
                }
            }
        },
        colorAxis: {
            stops: [
                [0, '#009d9a'],
                [0.8, '#207776'],
                [1,'#38cac8']
            ]
        },
        tooltip: {
            enabled:false,
            useHTML: true,
            events:{
                click:function() {
                    console.log('提示了吗')
                }
            },
            headerFormat: '<b>{point.name}</b>',   
        },
        mapNavigation: {
            enabled: false,
            enableDoubleClickZoomTo: false
        },
        series: [
        {
            data: data,
            mapData: mapdata,
            joinBy: 'name',
            name: '全国',
            states: {
                hover: {
                    color: '#a4edba'
                }
            }
        },{
            type: 'mappoint',
            color: 'red',
            marker: {
                symbol: 'url(images/d.png)',
                width:40,
                height:40
		
            },
            tooltip: {
                enabled: true,
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>车辆总数: {point.carNum}'
            },
            point:{
                events:{
                    click:function() {
                        console.log('奇速')
                   	
                    }
                }
            },
            data: item
        }]
    });
})

var options = {
    chart: {
        type: 'column', //指定图表的类型，默认是折线图（line）
        zoopType:'x',
        style: {
            fontFamily: "",
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#009d9a'
        },
        events:{
            load: function(e) {
//              console.log(e)
            }
        }
    },

    xAxis: {
        title:{
            text:''
        },
        categories: []   // x 轴分类
    },
    yAxis: {
        title: {
            text: '',                // y 轴标题
            style:{
                fontSize: '16px',
                fontWeight:'normal'
            }
        },
        plotLines:[{
            events:{
                click:function(){
                    console.log(888888888)	
                }
            }
        }]
    },
    tooltip: {
        enabled: true  //是否禁用提示框
    },
    plotOptions:{
        column:{
            colorByPoint:true
        }
    },
    series: [{       // 数据列
        name:'奇速',                    // 数据列名
        animation: true,
        data: []                     // 数据
    }]
};
// 图表初始化函数
var chart = Highcharts.chart('showdata', options); 


//创建对象 将城市编码，k值保存下来  留着
var getid = {};
var xdate = new Array();
var ydate = new Array();
var title_name={};
//  点击表格数据---函数调取--柱形图展示
function showinform(a,b,c,d,f) {
    xdate.splice(0,xdate.length);
    ydate.splice(0,ydate.length);
    var provinceid = b;
    if(provinceid =='undefined'){
        provinceid  = ''
    }
    var conttype = a;
    var cityid =c;
    if(cityid=='undefined'){
    	cityid =''
    }
    //获取时间  
    var f_time = d;
    var n_time = f;
    
    // 调取函数
    xdate.length = 0;
    ydate.length =0;
	$.ajax({
        type:"POST",
        url: columndate,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        async:false,    
        data:JSON.stringify({"provinceid":provinceid,"cityid":cityid,"datatype":conttype,"startdate":f_time,"enddate":n_time}),
        success:function (data) {
//      	console.log(data)
            title_name.ytitle =data.dataunit;
            var countdate = data.res_opr_datatype;
            for(var i=0;i<countdate.length;i++){
                xdate.push(countdate[i].x)
            }
            for(var i=0;i<countdate.length;i++){
                ydate.push(countdate[i].y)
            }
        }
    })
    // options.chart.type = 'line';
    // 跟新X轴
    options.xAxis.categories = xdate;
    //y轴名称
    options.yAxis.title.text = title_name.ytitle;
    //悬浮框名称显示
	options.series[0].name = title_name.ytitle;
    //更新纵坐标数据
    chart.update({
        series: [{
            data: ydate
        }]
    })
    getid.contname = a;
    getid.ctcode = b;
    getid.code_c = c;
    chart = Highcharts.chart('showdata', options);
    
}
$('.exportable').click(function(){
	var cityname = $('#det').html();
	getid = JSON.stringify(getid);
   	localStorage.setItem("temp",getid); 
   	localStorage.setItem("city",cityname);
   	window.location.href= 'html/car_detail.html';
})
//标题更新数据
function uptitle(){
//  console.log(title_name.ytitle)
    chart.title.update({ text: title_name.ytitle});
}

//  时间选取后调取函数，更新统计图数据
function statics(c,d) {

    xdate.splice(0,xdate.length);
    ydate.splice(0,ydate.length);
    var startdate = c;
    var enddate = d;
    xdate.length = 0;
    ydate.length =0;
    var conttype = getid.contname;
    var cityids = getid.ctcode; //省编码
    
    if(cityids =='undefined'){
        cityids  = ''
    }
    var city_s = getid.code_c; //市编码
    if(city_s == 'undefined'){
    	city_s =''
    }
    $.ajax({
        type:"POST",
        url: columndate,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":cityids,"cityid":city_s,"datatype":conttype,"startdate":startdate,"enddate":enddate}),
        success:function (data) {
//          console.log(data);
            title_name.ytitle =data.dataunit;
            // console.log(data.res_opr_datatype);
            var countdate = data.res_opr_datatype;
            for(var i=0;i<countdate.length;i++){
                xdate.push(countdate[i].x)
            }
            for(var i=0;i<countdate.length;i++){
                ydate.push(countdate[i].y)
            }
            // console.log(xdate)
            // console.log(ydate)
        }
    })

    // 跟新X轴
    options.xAxis.categories = xdate;

    //更新纵坐标数据
    chart.update({
        series: [{
            data: ydate
        }]
    })
    chart = Highcharts.chart('showdata', options);
}


$('body').click(function(){
     $('.contdata').animate({
        top:800 +'px'
    },500);
    $('.shadow').animate({
        top:800 +'px'
    },500);
    $('.detdate').animate({
        right: -100 + '%'
    },500);
    $('.car_date').animate({
        top: 100 + '%'
    },500)
    $('.car_usedate').animate({
        top: 100 + '%'
    },500);
    $('.c_order').val('');
    $('.c_usecode').val(''); 
    $('.car_model').val('')
})
$('.car_date').click(function(e){
    e = window.event || e;
    if (e.stopPropagation) {
         e.stopPropagation();
    } else {
         e.cancelBubble = true;
    } 
})
$('.car_usedate').click(function(e){
    e = window.event || e;
    if (e.stopPropagation) {
         e.stopPropagation();
    } else {
         e.cancelBubble = true;
    } 
})
$('.detdate').click(function(e){
    e = window.event || e;
    if (e.stopPropagation) {
         e.stopPropagation();
    } else {
         e.cancelBubble = true;
    } 
})
$('.contdata').click(function(e){
    e = window.event || e;
    if (e.stopPropagation) {
         e.stopPropagation();
    } else {
         e.cancelBubble = true;
    } 
})
$('.close').click(function(){
    $('.contdata').animate({
        top:800 +'px'
    },500);
    $('.detdate').animate({
        right: -100 + '%'
    },500);
})


//  var $ = jQuery = layui.jquery;
    var laydate = layui.laydate;
    var timeId = 0;
        $.fn.dateLay=function(o){
            o=$.extend({},{
                timeLabel:[formatwdate,formatnowdate],//时间节点名称
                dateSelect:true,//是否显示时间段
                istime: true,//是否显示时间
                format: 'YYYY-MM-DD',//时间格式
                start:{//开始日期
                    max:formatnowdate
                    ,istime: this.istime
                    ,format: this.format
                    ,istoday: true
                    ,choose: function(datas){
                        console.log(datas)
                        formatwdate = datas;
//                    	statics(ready_time,end_time);   
						uptitle()  
                        console.log(formatwdate)
                        console.log(formatnowdate)
                        statics(formatwdate,formatnowdate);   
        				uptitle()  
                        o.end.min = datas; //开始日选好后，重置结束日的最小日期
                        o.end.start = datas //将结束日的初始值设定为开始日
                    }
                },

                end:{//结束日期
                    max:formatnowdate
                    ,istime: this.istime
                    ,format: this.format
                    ,istoday: true
                    ,choose: function(datas){
                        formatnowdate = datas;
                        console.log(formatwdate)
                        console.log(formatnowdate)
                        statics(formatwdate,formatnowdate);   
        				uptitle()  
                        o.start.max = datas; //结束日选好后，重置开始日的最大日期
                    }
                },
                dayDefault:'',
                zIndex:210
            },o);
            var global={
                /*创建dom*/
                getOptions:function(){
                    var html=[],listId='timeBox'+timeId++,defaultTime=[formatwdate,formatnowdate],pos = this.getPosition();
                    defaultTime.push(this.inputWrapper.attr('kssj'));
                    defaultTime.push(this.inputWrapper.attr('jssj'));
                    html.push('<div class="ui-time-box" id="'+listId+'" style="top:' + 16 + 'px; left:' + pos.left + 'px;">');
                    html.push('<label class="layui-form-label">开始时间</label>');
                    html.push('<label class="layui-form-label">结束时间</label>');
                    for(var i=0;i<o.timeLabel.length;i++){
                        html.push('<div class="layui-form-item">');
                        html.push('<div class="layui-input-block">');
                        html.push('<input class="layui-input" placeholder="'+o.timeLabel[i]+'" id="dp'+i+'"  value="'+defaultTime[i]+'">');
                        html.push('</div>');
                        html.push('</div>');
                    }

                    if(o.dateSelect){
                        html.push('<div class="layui-form-item">');
                        html.push('<div class="ui-time-btn layui-clear mt5">');
                        if(o.dayLabel){
                            html.push('<ul class="time-dot fl layui-clear">');
                            html.push('<li>过去</li>')
                            for(var i=1;i<o.dayLabel.length;i++){
                                html.push('<li data='+o.dayLabel[i]+'>'+o.dayLabel[i]+'天</li>')
                            }
                            html.push('</ul>');
                        }
                        html.push('</div>');
                        html.push('</div>');
                    }

                    html.push('<div class="ui-time-btn clearfix">');
                    html.push('<span class="layui-btn layui-btn-middle fr" id="timeOk"><label class="ui-button-text">确定</label></span>');
                    html.push('<span class="layui-btn layui-btn-primary layui-btn-middle fr mr5" id="timeNo"><label class="ui-button-text">清空</label></span>');
                    html.push('</div>');
                    html.push('</div>');
                    // 插入到文档流中
                    $('.change_date').append(html.join('')).css('zIndex', o.zIndex);
                    this.timeDot();
                },

            /*时间点事件*/
                timeDot:function(){
               
                    var $list=$('.ui-time-box'),
                        $dp0=$('#dp0'),
                        $dp1=$('#dp1');
                    o.dayDefault=='' ? $list.find('li').eq(0).addClass('active') : $list.find('li').eq(o.dayDefault).addClass('active');
                    $list.off().on('click',function(e){
                        e.stopPropagation();
                    })
                        .on('click.li','.time-dot li',function(e){
                            $(this).addClass('active').siblings().removeClass('active');
                            $list.find('input[id^=dp]').attr('disabled','disabled');
                            var day=$(this).attr('data'),
                                str=new Date(),
                                strYear=str.getFullYear(),
                                strDay=str.getDate(),
                                strMonth=str.getMonth()+1;
                            strMonth=strMonth<10 ? "0"+strMonth : strMonth;
                            strDay=strDay<10 ? "0"+strDay : strDay;
                            var today=strYear+'-'+strMonth+'-'+strDay;
                            if(!day){
                                $list.find('input:text').removeAttr('disabled');
                            }else{
                                $dp0.val(global.timeControl(day));
                                $dp1.val(today);
                            }
                            e.stopPropagation();
                        })
                        .on('click.span','.layui-btn',function(e){
                            if($(this).is('#timeOk')){
                                var valTime= $dp0.val()+' ~ '+$dp1.val(),
                                    kssj=o.timeOr ? $dp0.val()+' '+beginTime :$dp0.val(),
                                    jssj=o.timeOr ? $dp1.val()+' '+endTime :$dp1.val();
                                    global.inputWrapper.val(valTime).attr('kssj',kssj).attr('jssj',jssj);
                                $list.off().remove();
                                global.inputWrapper.parent().css('zIndex', '');
                            }else{
                                global.inputWrapper.val('');
                                global.inputWrapper.attr('kssj','');
                                global.inputWrapper.attr('jssj','');
                                global.inputWrapper.click();
                            }
                            e.stopPropagation();
                        });
                    $dp0.off('click').on('click', function(){
                       o.start.elem = this;
                        laydate(o.start);
                    })
                    $dp1.off('click').on('click', function(){
                       o.end.elem = this
                        laydate(o.end);
                    })

                },
                timeControl:function(day){
                    var today=new Date(),
                        beforeMillSeconds=today.getTime()-1000*3600*24*day,
                        beforeDay=new Date();
                    beforeDay.setTime(beforeMillSeconds);
                    var strYear=beforeDay.getFullYear(),
                        strDay=beforeDay.getDate(),
                        strMonth=beforeDay.getMonth()+1;
                    strMonth=strMonth<10 ? "0"+strMonth : strMonth;
                    strDay=strDay<10 ? "0"+strDay : strDay;
                    var strYesterDay=strYear+'-'+strMonth+'-'+strDay;
                    return strYesterDay;
                },
                getPosition: function () {
                    var pos = {top: 0, left: 0};
                    var os = this.inputWrapper.offset(), iptTop = os.top, iptLeft = os.left, iptHeight = this.inputWrapper.height()+5, w = $(window).width(), h = $(window).height();
                    // top
                    if ((iptTop + iptHeight + 206 + 42) < h) {
                        pos.top = iptTop + iptHeight - 1;

                    } else {
                        pos.top = iptTop+32;

                    }

                    // left
                    if ((iptLeft + 310+15) < w) {
                        pos.left = iptLeft;
                    } else {
                        pos.left = w - (310+15);
                    }

                    return pos;
                },

            };

            return this.each(function(){
                if($(this).is('div.ui-time')){
                    global.inputWrapper = $(this).find('.ui-text-text').eq(0);
                }else if($(this).is('.ui-time-text:text')){
                    global.inputWrapper = $(this);
                }
                global.inputWrapper.off('click').on('click', function(e){
                    e.stopPropagation();
                   
                    // 填充选项
                    if($('.ui-time-box')!=null){
                        $('.ui-time-box').off().remove();
                        global.inputWrapper.parent().css('zIndex', '');
                    }
                    global.getOptions();

                });
                global.getOptions();
                $(document).click(function(e){
                    var id=$(e.target).attr('id')
                    if(id!='laydate_today'&&id!='laydate_clear'&&id!='laydate_ok'){
//                      $('.ui-time-box').off().remove();
                        global.inputWrapper.parent().css('zIndex', '');
                    }
                });


            });
        };

    exports('dateLay','laypage');
});
