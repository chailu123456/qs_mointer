$(function(){

    var year,month,day,hours,minute,now;
    function time(){
        now=new Date();
        year=now.getFullYear()+"年";
        month=now.getMonth()+1+'月';
        day=now.getDate()+'日';
        hours=now.getHours();
        if(hours<10){
            hours='0'+hours;
        }else{
            hours=hours+'';
        }
        minute=now.getMinutes();
        if(minute<10){
            minute='0'+minute;
        }else{
            minute=''+minute;
        }
        $("#time").html(year+month+day+'&nbsp;&nbsp;'+hours+':'+minute);
    }
    function move(){
        $("#shade").animate({
            opacity:'0.8',
            left:'740px'
        },6000,function(){
            $("#shade").css({"opacity":"0","left":"0"})
        })
    }
    time();
    move();
    setInterval(time,6000);
    setInterval(move,10000);

    var map = new AMap.Map("map", {
        resizeEnable: true,
        zoom:5,
        center: [114.117533,27.270076]
   
    });
    map.setMapStyle("fresh")
    map.setFeatures(['bg','point','building']);
    map.setFitView();//地图自适应
//  addGZ();
    function addGZ() {
        //加载行政区划插件
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: 'city'  //查询行政级别为市
            };
            //实例化DistrictSearch
            district = new AMap.DistrictSearch(opts);
            district.setLevel('district');
            //行政区查询
            district.search('中国', function(status, result) {
                var bounds = result.districtList[0].boundaries;
                var polygons = [];
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: map,
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.2,
                            fillColor: '#0791c2',
                            strokeColor: '#0791c2'
                        });
                        polygons.push(polygon);
                    }
                    map.setFitView();//地图自适应
                }
            });
        });
    }
//    自定义添加覆盖物
    
    //控制预警灯的数量
    function warn(n){
        if(n>=6){
            $("#pointList div").addClass("bad");    
        }else if(n>0&&n<6){
            var $div=$("#pointList div");
            for(var i=$div.length-1;i>$div.length-1-n;i--){
                $($div[i]).addClass("bad")
            }
        }else{
            $("#pointList div").removeClass('bad');
        }
    }
     var infoWindow = new AMap.InfoWindow({offset:new AMap.Pixel(0,-30)});
     
    //桩点分布地图数据
    function queryPilesData(){
        $.ajax({
            type:'post',
            url: publicAdress+'api/chargingpile/message',
            contentType: "application/json;charset=utf-8",
        	dataType:"json",
        	data:JSON.stringify({}),
//          url:'json/maplocal.json',
            success:function(data){
//              console.log(data);
                //桩故障数
//              for(var t=0;t<data.res_sta_message.length;t++){
//              	var errorCount = data.res_sta_message[t].errorStatus+data.res_sta_message[t].farStatus;
//              	option4.series.data[0].value=errorCount;
//               	chart4.setOption(option4);
//              }
                var content,markerPosition;
                for(var i=0;i<data.res_sta_message.length;i++){
                    markerPosition=[parseFloat(data.res_sta_message[i].lon),parseFloat(data.res_sta_message[i].lat),data.res_sta_message[i].stationName];
                    if(data.res_sta_message[i].errorStatus != 0){  //故障数
                        content='<div style="width:12px;height:12px;border-radius: 6px;background-color:red;"></div>';
                    }else if(data.res_sta_message[i].farStatus != 0){  //离线数
                        content='<div style="width:12px;height:12px;border-radius: 6px;background-color: orange;"></div>';
                        
                    }else{  //使用
                        content='<div style="width:12px;height:12px;border-radius: 6px;background-color:#009d9a;"></div>';
                    }
                    var marker=new AMap.Marker();
                    marker.content='<div style="background-color:#ffffff;padding:2px;">名称:'
    				+ data.res_sta_message[i].stationName+ '</div><div style="background-color:#ffffff;padding:2px;">地址:  '
    				+ data.res_sta_message[i].stationDetail + '</div><div style="padding:2px;">使用中:<span style="color:#009d9a;font-size:18px;padding:0 2px;">'
    				+ data.res_sta_message[i].useStatus  + '</span>空闲:<span style="color:#009d9a;font-size:18px;padding:0 8px;">'
    				+ data.res_sta_message[i].leisureStatus  + '</span>离线:<span style="color:#ffa500;font-size:18px;padding:0 8px;">'
    				+ data.res_sta_message[i].farStatus + '</span>故障:<span style="color:red;font-size:18px;padding:0 8px;">'
    				+ data.res_sta_message[i].errorStatus+'</span>总桩数:<span style="color:#009d9a;font-size:18px;padding:0 8px;">'
    				+ data.res_sta_message[i].sumStatus+'</div>'
                    marker.on('mouseover', markerClick);
                    marker.setContent(content);
                    marker.setPosition(markerPosition);
                    marker.setMap(map);
                }
            }
        });
    }
    queryPilesData();
    setInterval(queryPilesData,100000);

	function markerClick(e){
//		console.log(e)
//		console.log(e.target.content)
		infoWindow.setContent(e.target.content);
		infoWindow.open(map, e.target.getPosition());
	}
	
	//查询有充电桩统计运营数据
	function totaldata(){
		$.ajax({
			type:"post",
			url:publicAdress+"api/chargingpile/operation",
			contentType: "application/json;charset=utf-8",
        	dataType:"json",
        	data:JSON.stringify({}),
        	success:function(data){
//      		console.log(data)
        		var alldatas = data.res_sta_opreation[0];
        		$('.allelec').html(alldatas.total_quantity)
        		$('.elec_number').html(alldatas.total_charge_times)
        		$('.minuter').html(alldatas.total_time)
        		$('.allgun').html(alldatas.total_piles)
        		$('.allelecmoney').html(alldatas.total_charge_money)
        		$('.allserve').html(alldatas.total_sevice_money)
        		$('.alluesr').html(alldatas.total_users)
        		$('.allmoneys').html(alldatas.total_charge_records_money)	
        	}
		});
	}
	totaldata()
	setInterval(totaldata,100000);
    //最近充电数据
    function queryOrderData(){
        $.ajax({
            type:'post',
            url:publicAdress+'api/chargingpile/order/data',
            contentType: "application/json;charset=utf-8",
        	dataType:"json",
        	data:JSON.stringify({'pageSize':'5'}),
            success:function(data){
//          	console.log(data)
                var data = data.res_order_data;
                var str="";
                for(var i=0;i<data.length;i++){
                    var name=data[i].order_state=="02"?data[i].stationName+'<span style="font-size:0.7rem;color:red;">(充电中)</span>':data[i].stationName;
                    var total_charge_money=data[i].total_charge_money;
                    var total_charge_quantity=data[i].total_charge_quantity;
                    var total_charge_times=data[i].total_charge_times;
                    str+="<tr><td class='tl'><i>"+name+"</i></td><td>"+total_charge_quantity+"</td><td>"+total_charge_times+"</td><td>"+total_charge_money+"</td></tr>"
                }
                $("#recently").html(str);
            }
        });
    }
    queryOrderData();
    setInterval(queryOrderData,60000);
    

    var option1,option2,option3,option4,option5,option6,option7,option8,chart1,chart2,chart3,chart4,chart5,chart6,chart7,chart8;
    chart1=echarts.init(document.getElementById('main1'));
    chart2=echarts.init(document.getElementById('main2'));
    chart3=echarts.init(document.getElementById('main3'));
    chart4=echarts.init(document.getElementById('main4'));
    /*折线图*/
    chart5=echarts.init(document.getElementById('l1'));
    chart6=echarts.init(document.getElementById('l2'));
/*     chart7=echarts.init(document.getElementById('l3'));
    chart8=echarts.init(document.getElementById('l4')); */    
    
    option1 = {
        tooltip : {
        	show:false,
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series: {
            name:'今日充电量',
            type:'gauge', // 默认全局居中
            radius : '100%',
            min:0,
            max:1500,
            endAngle:-10,
            splitNumber:6,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.29, '#15d0cc'],[0.86,'#009d9a' ],[1, '#015251']],
                    width: 2,
                    shadowColor : '#0a5851',//默认透明
                    shadowBlur: 6
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#009d9a', //默认透明
                    shadowBlur: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#0a5851',
                    shadowColor : '#0a5851',//默认透明
                    shadowBlur: 6
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#0a5851',
                    shadowColor : '#0a5851' ,//默认透明
                    shadowBlur: 6
                }
            },
            pointer: {
                width:5,
                shadowColor : '#000',//默认透明
                shadowBlur: 5
            },
            title : {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontStyle: 'italic',
                    color: '#000',
                    fontSize:16,
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            detail : {
                borderColor: '#000',
                shadowColor : '#000', //默认透明
                shadowBlur: 5,
                width: 80,
                height:30,
                offsetCenter: [15, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#000',
                    fontSize:20
                }
            },
            data:[{value:0, name: '度'}]
        }
    };
    option2 = {
        tooltip : {
        	show:false,
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series: {
            name:'今日充电次数',
            type:'gauge', // 默认全局居中
            radius : '100%',
            min:0,
            max:100,
            endAngle:-10,
            splitNumber:5,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                   	color: [[0.29, '#1e90ff'],[0.86,'lime' ],[1, '#ff4500']],
                    width: 2,
                    shadowColor : '#000',//默认透明
                    shadowBlur: 6
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor : '#000',//默认透明
                    shadowBlur: 6
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#000',
                    shadowColor : '#000' ,//默认透明
                    shadowBlur: 6
                }
            },
            pointer: {
                width:5,
                shadowColor : '#000',//默认透明
                shadowBlur: 5
            },
            title : {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontStyle: 'italic',
                    color: '#000',
                    fontSize:16,
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            detail : {
                //backgroundColor: 'rgba(30,144,255,0.8)',
                // borderWidth: 1,
                borderColor: '#000',
                shadowColor : '#000', //默认透明
                shadowBlur: 5,
                width: 80,
                height:30,
                offsetCenter: [15, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#000',
                    fontSize:20
                }
            },
            data:[{value:0, name: '次'}]
        }
    };
    option3 = {
        tooltip : {
        	show:false,
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series: {
            name:'今日桩使用数',
            type:'gauge', // 默认全局居中
            radius : '100%',
            min:0,
            max:60,
            endAngle:-10,
            splitNumber:6,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.29, '#15d0cc'],[0.86,'#009d9a' ],[1, '#015251']],
                    width: 2,
                    shadowColor : '#000',//默认透明
                    shadowBlur: 6
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor : '#000',//默认透明
                    shadowBlur: 6
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#000',
                    shadowColor : '#000' ,//默认透明
                    shadowBlur: 6
                }
            },
            pointer: {
                width:5,
                shadowColor : '#000',//默认透明
                shadowBlur: 5
            },
            title : {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontStyle: 'italic',
                    fontSize:16,
                    color: '#000',
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            detail : {
                //backgroundColor: 'rgba(30,144,255,0.8)',
                // borderWidth: 1,
                borderColor: '#000',
                shadowColor : '#000', //默认透明
                shadowBlur: 5,
                width: 80,
                height:30,
                offsetCenter: [15, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#000',
                    fontSize:20
                }
            },
            data:[{value:0,color:'blue', name: '个'}]
        }
     };
    option4 = {
        tooltip : {
        	show:false,
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series: {
            name:'今日桩故障数',
            type:'gauge', // 默认全局居中
            radius : '100%',
            min:0,
            max:150,
            endAngle:-10,
            splitNumber:6,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 2,
                    color: [[0.29, '#1e90ff'],[0.86,'lime' ],[1, '#ff4500']],
                    shadowColor : '#fff',//默认透明
                    shadowBlur: 6
                }
            },
       
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#000',
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            axisTick: {            // 坐标轴小标记
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor : '#000',//默认透明
                    shadowBlur: 6
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#000',
                    shadowColor : '#000' ,//默认透明
                    shadowBlur: 6
                }
            },
            pointer: {
                width:5,
                shadowColor : '#000',//默认透明
                shadowBlur: 5
            },
            title : {
                offsetCenter: [0, '-30%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontStyle: 'italic',
                    fontSize:14,
                    color: '#000',
                    shadowColor : '#000', //默认透明
                    shadowBlur: 6
                }
            },
            detail : {
                //backgroundColor: 'rgba(30,144,255,0.8)',
                // borderWidth: 1,
                borderColor: '#000',
                shadowColor : '#000', //默认透明
                shadowBlur: 5,
                width: 80,
                height:30,
                offsetCenter: [15, '50%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#000',
                    fontSize:20
                }
            },
            data:[{value:0, name: '个'}]
        }
    };
    option5 = {
            title: {
                text: '充电分时统计',
                textStyle :{
                    color:"#000",
                    fontWeight:"normal"
                },
                left:20
            },
            tooltip : {
                trigger: 'axis'
            },
            xAxis :
                {
                    name :"（小时）",
                    /* nameGap:-5, */
                    type : 'category',
                    boundaryGap : false,
                    splitLine: {
                        show: false
                    },
                    data : ["0"],
                    axisLine:{
                        lineStyle:{
                            color:"#000",
                        }
                    }
                },
            yAxis : 
                {
                    name :"（kWh）",
                    type : 'value',
                    splitLine: {
                        lineStyle:{
                            color:"#000",
                        }
                    },
                    boundaryGap: [0, '20%'],
                    axisLine:{
                        show: false,
                        lineStyle:{
                            color:"#000",
                        }
                    }
                },
            series :
                {
                    name:'充电电量',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#2094bb'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:"#1f93ba"
                        }
                    },
                    data : ["0"]
                }
        };
        option6 = {
            title: {
                text: '最近10天充电电量',
                textStyle :{
                    color:"#000",
                    fontWeight:"normal"
                },
                left:20
            },
            tooltip : {
                trigger: 'axis'
            },
            xAxis : 
                {
                    name :"（日期）",
                    /* nameGap:-5, */
                    type : 'category',
                    /* boundaryGap : false, */
    /*              splitLine: {
                        show: false
                    }, */
                    data : ["0"],
                    axisLine:{
                        lineStyle:{
                            color:"#000",
                        }
                    }
                },
            yAxis : 
                {
                    name :"（kWh）",
                    type : 'value',
                    splitLine: {
                        show:false,
                        /* lineStyle:{
                            color:"#ffffff",
                        } */
                    }, 
                    /* boundaryGap: [0, '20%'], */
                    axisLine:{
                        show: true,
                        lineStyle:{
                            color:"#000",
                        }
                    } 
                },
            textStyle:{
                    color:"#000",
                },
            series : 
                {
                    name:'充电电量',
                    type:'bar',
                    /* smooth:true, */
                    /* symbol: 'none', */
                    itemStyle: {
                        normal: {
                            color: '#1f93ba',
                            barBorderColor: "#1f93ba",
                        }
                    }, 
                    areaStyle: {
                        normal: {
                            barBorderColor: "#1f93ba",
                            color: '#ffffff',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "top", 
                        }
                    },
                    barWidth:25, 
                    data : ["0"]
                }
        };
        function queryTodayData(){
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/message/today',
                contentType: "application/json;charset=utf-8",
	        	dataType:"json",
	        	data:JSON.stringify({}),
                success:function(data){
//              	console.log(data)
              
                	var alldata = data.res_today_message[0];
                    $("#addUser").html(alldata.addUserNumber+'个');
                    
                    $("#todayCharge").html(alldata.chargeMoney+'元');
                    $("#todayFee").html(alldata.today_charge_money+'元');  // 今日电费
                    $("#todayServiceFee").html(alldata.total_sevice_money+'元');  //今日服务费
                     option1.series.data[0].value=alldata.today_charge_quantity;  //今日充电量
                     option2.series.data[0].value=alldata.charge_times;    //今日充电次数
                     option3.series.data[0].value=alldata.pile_use_times;  //今日桩使用数
                     option4.series.data[0].value=alldata.error_count;    //今日桩故障数
                     chart1.setOption(option1);
                     chart2.setOption(option2);
                     chart3.setOption(option3);
                     chart4.setOption(option4);
                }
            });
        }
        queryTodayData();
        setInterval(queryTodayData,100000);
        
        /*****************************************  刷新折线图方法     ***************************************/    
        function queryDisplayData(){
            var line_time=[];
            var line_quantity=[];
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/sharing',
                contentType: "application/json;charset=utf-8",
	        	dataType:"json",
	        	data:JSON.stringify({}),
                success:function(data){ 
//              	console.log(data)
                    var lineData = data.res_sha_statistics;
                    /* console.log(data); */
                    $.each(lineData, function(i, value) {
                        /*时间  */
                        line_time.push(value.x);
                        /* 电量 */
                        line_quantity.push(value.y);
                    });
                    option5.xAxis.data=line_time;
                    option5.series.data=line_quantity;
                    chart5.setOption(option5);
                    
                }
            });
        }
        queryDisplayData(); 
        setInterval(queryDisplayData,300000);
        /*历史10天数据  */
        function tenday(){
            var line_time10 = [];
            var line_quantity10 = [];
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/recent/data',
                contentType: "application/json;charset=utf-8",
	        	dataType:"json",
	        	data:JSON.stringify({"page": "10"}),
//              data:{'pageSize':'15'},
                success:function(data){
//                  console.log(data);
                    var lineData = data.res_his_opreation;
                    $.each(lineData, function(i, value) {                       
                        line_time10.push(value.x.replace(/^0/, ''));
                        line_quantity10.push(value.y);
                        option6.xAxis.data=line_time10;
                        option6.series.data=line_quantity10;
                        chart6.setOption(option6); 
                    }); 
                }
            });
        }
        tenday();

	
})
