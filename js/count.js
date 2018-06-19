$(function(){

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

	// 查询网点数据
$('.find_carnet').click(function(){
	var province_id = $('#province option:selected').val();
	var city_id = $('#city option:selected').val();
	var area_id = $('#city_small option:selected').prop("class");
//	console.log(area_id)

	$.ajax({
		type:"POST",
        url: 'http://192.168.1.204:9005/api/operation/country',
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":province_id,"cityid":city_id,"startdate":formatwdate,"enddate":formatnowdate,"areaid":area_id,"page":1,"rows":3}),
        success:function (data) {
//	            console.log(data); 
            topage(data.totalcount);
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
        counthtml += '<tr class="head databtn"><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '" class="cartime">'
        + datacount[w].cartime + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '" class="dayconsum">'
        + datacount[w].dayconsum + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="drivercost">'
        + datacount[w].drivercost + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="electricConsum">'
        + datacount[w].electricConsum + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="mileageConsum">'
        + datacount[w].mileageConsum + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="orderNum">'
        + datacount[w].orderNum + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="parkedamount">' 
        + datacount[w].parkedamount + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="payAmount">'
        + datacount[w].payAmount + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="timeConsum">'
        + datacount[w].timeConsum + '</td><td citycode="' + datacount[w].citycode + '" name="' + datacount[w].provincecode + '"  class="totalConsum">'
        + datacount[w].totalConsum + '</td></tr>';
    }
    $('.all_one').html(counthtml);
    var list = $('.databtn td');
    // 点击表格数据查看统计图
    for(var i = 0; i < list.length; i++) {
        list[i].index = i;
        list[i].onclick = function(e) {
        	e = window.event || e;
		    if (e.stopPropagation) {
		         e.stopPropagation();
		    } else {
		         e.cancelBubble = true;
		    } 
            var classname = $(this).prop("class");
            //类型编码转换为小写
            classname = classname.toLowerCase();
            nam = classname;
//          $(this).addClass("ppp").siblings().removeClass('ppp');
//          $(this).attr("id","ppp").siblings().removeAttr("id","ppp");
            $('#test1').val('');
            $('#test3').val('');
            //默认时间范围  今天
            $('#test1').attr('placeholder',formatnowdate);
            $('#test3').attr('placeholder',formatwdate);
            var cityid = $(this).attr("name");
            var code = $(this).attr("citycode");

            //调用函数，传参
            showinform(classname,cityid,code);
            uptitle()
            $('.contdata').animate({
                top:40 +'px'
            },500);
            $('.shadow').animate({
                top:40 +'px'
            },500)
	
        }
    }
}
//全局保存城市，省份编码
var find_code={};
function prodId(a,b){
    find_code.prvin = a;
    find_code.city = b;
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
	        +netcar[t].carNum +'</td><td>'
	        +netcar[t].label +'</td></tr>' 
	    }
	    $('.cityNum').html(netcarhtml);
		}
}
var netPage =1;
//网点页码数据
function topage(allCountpage){
    layui.use(['laypage', 'layer'], function(){
        var laypage = layui.laypage
          ,layer = layui.layer;
          //完整功能
          laypage.render({
            elem: 'net'
            ,count: allCountpage
            ,layout: ['count', 'prev', 'page', 'next', 'skip']
            ,limit: 3
            ,curr: netPage
            ,jump: function(obj,first){
              netPage = obj.curr;
              if(!first){
                $('.cityNum').html('');
                ner_pagerequest();
              }

            }
        });
    })
}

//网点页码点击请求数据
function ner_pagerequest(){
    $.ajax({
        type:"POST",
        url: urldata,
        contentType: "application/json;charset=utf-8",
        dataType:"json",
        async:false,
        data:JSON.stringify({"provinceid":find_code.prvin,"page":netPage,"rows":3,"cityid":find_code.city,"startdate":formatwdate,"enddate":formatnowdate}),
        success:function (data) {
            console.log(data);
            var netcar = data.res_car_num;
            var allcounts = data.totalcount;
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

Highcharts.setOptions({
    lang: {
        drillUpText: '< 返回 “{series.name}”',
        downloadJPEG:"下载JPEG图片",
        downloadPDF:"下载PDF文件",
        downloadPNG:"下载PNG文件",
        downloadSVG:"下载SVG文件",
        loading:"加载中"
    }
});

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
//                  item.splice(0,item.length);
//                  console.log(item)
                    // 异步下钻
                    if (e.point.drilldown=='guangdong' || e.point.drilldown =='hunan') {
                   			
//               				console.log(e.point.properties)
												document.getElementById('det').innerHTML=e.point.properties.fullname;
                        var pointName = e.point.properties.fullname;
                        cityCode=e.point.properties.areacode;
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
                            // console.log(formatwdate);
                           	
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
                                marker: {
                                    symbol: 'url(images/d.png)',
                                    width:50,
                                    height:50
                                },
                                point:{
                                    events:{
                                        //点击二级地图上的标记
                                        click:function(e) {
                                        	e = window.event || e;
																					if (e.stopPropagation) {
																					     e.stopPropagation();
																					} else {
																					     e.cancelBubble = true;
																					} 
																						document.getElementById('det').innerHTML=e.point.name;
//                                          console.log(e.point);
                                            netPage =1;
                                            var cityscode = e.point.code;
//                                          console.log(provinceid+'二级');
                                            if(e.point.name == '广东省'){
                                                console.log('奇速');
                                            }else{
                                                $.ajax({
                                                    type:"POST",
                                                    url: urldata,
                                                    contentType: "application/json;charset=utf-8", 
                                                    dataType:"json",
                                                    async:false,
                                                    data:JSON.stringify({"provinceid":provinceid,"page":1,"rows":3,"cityid":cityscode,"areaid":"","startdate":formatwdate,"enddate":formatnowdate}),
                                                    success:function (data) {
//                                                      console.log(data)
                                                        var allcounts = data.totalcount;
                                                        //保存省份和城市编码
                                                        var p_code = data.provinceid;
                                                        var c_code = data.cityid;
                                                        prodId(p_code,c_code);
                                                        //保存省份和城市编码
                                                        //函数调用，传参
                                                        opare(data);
                                                        opaton_s(data.res_car_num);
                                                        topage(allcounts);
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
//										                                           console.log(data);
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

																								$('.detdate').animate({
																								    right: 0
																								},500)
																								
																								$('.tell').css({
																									'opacity' :0
																								})
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
            
//             	 radius: 6
            },
            tooltip: {
                enabled: true,
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>车辆总数: {point.carNum}'
            },
            point:{
                events:{
                    click:function() {
                        
                    }
                }
            },
            data: item
        }]
    });

    function getinform(e) {
        e = window.event || e;
	    if (e.stopPropagation) {
	        e.stopPropagation();
	    }else {
	        e.cancelBubble = true;
	    } 
	    $('.detdate').animate({
	        right: 0
	    },600)       
    }
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
//                  console.log(888888888)
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
    series: [{                      // 数据列
        name:'',                    // 数据列名
        data: []                     // 数据
    }]
};
// 图表初始化函数
var chart = Highcharts.chart('showdata', options); 

layui.use('laydate', function(){
  var laydate = layui.laydate;
 // 选择开始时间
 var ready_time = formatwdate;
 var end_time = formatnowdate;
  laydate.render({
    elem: '#test3'
    ,format: 'yyyy-M-d'
    ,theme: '#009d9a'
    ,max: formatnowdate
    ,value: formatwdate
    ,done:function(value,date){
//    	console.log(value)
        ready_time = value;
		statics(ready_time,end_time);   
		uptitle()  
    }
  });
  //选择结束时间
  laydate.render({
    elem: '#test1'
    ,format: 'yyyy-M-d'
    ,theme: '#009d9a'
    ,max: formatnowdate
    ,value: formatnowdate
    ,done:function(value,date){

        // console.log(valuetime)
        // 去除字符串前面空格
//      var lasttimes = valuetime[1].trim();
//      var ntime = valuetime[0];
//      var lasttimes = lasttimes;
		end_time= value;
        statics(ready_time,end_time);   
        uptitle()  
    }
  });
});

//创建对象 将城市编码，k值保存下来  留着
var getid = {};
var xdate = new Array();
var ydate = new Array();
var title_name={};
//  点击表格数据---函数调取--柱形图展示
function showinform(a,b,c) {
    xdate.splice(0,xdate.length);
    ydate.splice(0,ydate.length);
    var provinceid = b;
    if(provinceid =='undefined'){
//      console.log(909)
        provinceid  = ''
    }
    var conttype = a;
    var cityid =c;
    if(cityid=='undefined'){
    	cityid =''
    }
    // 调取函数
    xdate.length = 0;
    ydate.length =0;
    $.ajax({
        type:"POST",
        url: columndate,
        contentType: "application/json;charset=utf-8", 
        dataType:"json",
        async:false,    
        data:JSON.stringify({"provinceid":provinceid,"cityid":cityid,"datatype":conttype,"startdate":formatwdate,"enddate":formatnowdate}),
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
$('.shadow').click(function(){
    $('.contdata').animate({
        top:800 +'px'
    },500);
    $('.shadow').animate({
        top:800 +'px'
    },500);
})

});
