$(function(){
	
	$.ajax({
		type:"get",
		url:"json/num_elec.json",
		async:true,
		success:function(data){
			console.log(data)
			var car_net = data.elec_all;
			var notake_car = '';
		
			for(var w=0;w<car_net.length;w++){
                notake_car += '<tr><td>' + car_net[w].local + '</td><td>'
                + car_net[w].elec + '</td><td>'
                + car_net[w].kwh + '</td><td>'
                + car_net[w].mint + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].money + '</td><td>'
                + car_net[w].serve + '</td></tr>';
            }
            $('.elec_num').html(notake_car);	
		}
	});
	
	var currentPageAllAppoint=1;
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo6'
	        ,count: 21
	        ,limit:4
	        ,curr:1
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPageAllAppoint = obj.curr
	          if(!first){
	           
	                
	          }
	        }
	    });
	})
	

	$.ajax({
		type:"get",
		url:"json/elec_head.json",
		async:true,
		success:function(data){
			console.log(data)
			var gun_num = data.elec_head;
			var gun_cont = '';
		
			for(var w=0;w<gun_num.length;w++){
                gun_cont += '<tr><td>' + gun_num[w].stat + '</td><td class="num">'
                + gun_num[w].num + '</td><td>'
                + gun_num[w].adress + '</td></tr>';
            }
            $('.gun_num').html(gun_cont);	
		}
	});
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能user_money.js
	    laypage.render({
	        elem: 'demo7'
	        ,count: 100
	        ,limit:4
	        ,curr:1
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPageAllAppoint = obj.curr
	          if(!first){
	                
	          }
	        }
	    });
	})

	//新增用户
	$.ajax({
		type:"get",
		url:"json/today_money.json",
		async:true,
		success:function(data){
			console.log(data)
			var income = data.t_income;
			var income_cont = '';
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].t_id + '</td><td class="num">'
              + income[w].t_mon + '</td><td>'
              + income[w].t_give + '</td><td>'
              + income[w].t_mobile + '</td><td>'
              + income[w].t_style + '</td><td>'
              + income[w].t_trade + '</td><td>'
              + income[w].t_time + '</td></tr>';
          }
          $('.today_num').html(income_cont);	
		}
	});
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo9'
	        ,count: 100
	        ,limit:4
	        ,curr:1
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPageAllAppoint = obj.curr
	          if(!first){
	                
	          }
	        }
	    });
	})
	//新增用户
	//今日电费
	$.ajax({
		type:"get",
		url:"json/elec_fee.json",
		async:true,
		success:function(data){
			console.log(data)
			var t_elec = data.e_fei;
			var elec_cont = '';
			for(var w=0;w<t_elec.length;w++){
              elec_cont += '<tr><td>' + t_elec[w].f_id + '</td><td class="num">'
              + t_elec[w].f_state + '</td><td>'
              + t_elec[w].f_end + '</td><td>'
              + t_elec[w].f_mobile + '</td><td>'
              + t_elec[w].f_pay + '</td><td>'
              + t_elec[w].f_elec + '</td><td>'
              + t_elec[w].f_serve + '</td><td>'
              + t_elec[w].f_method + '</td><td>'
              + t_elec[w].f_atate + '</td><td>'
              + t_elec[w].f_adress + '</td></tr>';
          }
          $('.today_static').html(elec_cont);	
		}
	});
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo1'
	        ,count: 100
	        ,limit:4
	        ,curr:1
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPageAllAppoint = obj.curr
	          if(!first){
	                
	          }
	        }
	    });
	})
	//今日电费
	
	//今日充值金额
	$.ajax({
		type:"get",
		url:"json/recharge_money.json",
		async:true,
		success:function(data){
			console.log(data)
			var income = data.r_income;
			var income_cont = '';
			for(var w=0;w<income.length;w++){
              income_cont += '<tr><td>' + income[w].t_id + '</td><td class="num">'
              + income[w].t_mon + '</td><td>'
              + income[w].t_give + '</td><td>'
              + income[w].t_mobile + '</td><td>'
              + income[w].t_style + '</td><td>'
              + income[w].t_trade + '</td><td>'
              + income[w].t_time + '</td></tr>';
          }
          $('.recharge_num').html(income_cont);	
		}
	});
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo2'
	        ,count: 100
	        ,limit:4
	        ,curr:1
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPageAllAppoint = obj.curr
	          if(!first){
	                
	          }
	        }
	    });
	})
	//今日充值金额
	

	var c =  "2017-02-21";
	var s = "2017-02-21";
	var e = "2017-05-17";
	$( "#from" ).datepicker({
		defaultDate: c,
		changeMonth: true,
		numberOfMonths: 1,
	
		dateFormat: 'yy-mm-dd',//日期格式 
		onClose: function( selectedDate ) {
//			console.log(selectedDate)
			s = selectedDate;
			console.log(s)
			console.log(e)
			$( "#to" ).datepicker( "option", "minDate", selectedDate );
		}
	});
	
	$( "#to" ).datepicker({
		defaultDate: "2018-05-04",
		changeMonth: true,
		numberOfMonths:1,	
		dateFormat: 'yy-mm-dd',//日期格式 
		onClose: function( selectedDate ) {
			console.log('mo')
			e= selectedDate;
			console.log(e);
			console.log(s)
			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
		}
	});
	
	
	
	var option5,option6,chart5,chart6;
    /*折线图*/
    chart5=echarts.init(document.getElementById('l1'));
    chart6=echarts.init(document.getElementById('l2'));
	option5 = {
            title: {
                text: '最近15天新增用户',
                textStyle :{
                    color:"#000",
                    fontSize:14,
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
                    name :"（个）",
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
                    name:'新增用户',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#1f93ba'   //面积边线
                        }
                    },
                    areaStyle: {
                        normal: {
                            color:"#1f93ba"    // 面积图颜色
                        }
                    },
                    data : ["0"]
                }
        };
        option6 = {
            title: {
                text: '最近15天充值金额',
                textStyle :{
                    color:"#000",
                    fontSize:14,
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
                    name :"（元）",
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
                    name:'充值金额',
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
                            color: '#000',
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
        
        /*****************************************  刷新折线图方法     ***************************************/    
        function queryDisplayData(){
            var line_time=["00:00"];
            var line_quantity=["0"];
            $.ajax({
                type:'get',
                url:'json/time_elec.json',
                success:function(data){ 
                	console.log(data)
                    var lineData = data.time_e;
                    /* console.log(data); */
                    $.each(lineData, function(i, value) {
                        /*时间  */
                        line_time.push(value.time);
                        /* 电量 */
                        line_quantity.push(value.s_ele_quantity);
                    });
                    option5.xAxis.data=line_time;
                    option5.series.data=line_quantity;
                    chart5.setOption(option5);
                    
                }
            });
        }
        queryDisplayData(); 
//      setInterval(queryDisplayData,300000);
        /*历史10天数据  */
        function tenday(){
            var line_time10 = [];
            var line_quantity10 = [];
            $.ajax({
                type:'get',
                url:'json/fifty.json',
//              data:{'pageSize':'15'},
                success:function(data){
                    console.log(data);
                    var lineData = data.elec;
                    $.each(lineData, function(i, value) {                       
                        line_time10.push(parseInt(value.month)+"."+parseInt(value.day));
                        line_quantity10.push(value.t_quantity);
                        option6.xAxis.data=line_time10;
                        option6.series.data=line_quantity10;
                        chart6.setOption(option6); 
                    }); 
                }
            });
        }
        tenday();
	
	
	
	
	
	
	
})
