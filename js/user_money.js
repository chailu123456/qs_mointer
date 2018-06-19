$(function(){

	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/operation",
		contentType: "application/json;charset=utf-8",
    	dataType:"json",
    	data:JSON.stringify({}),
    	success:function(data){
//  		console.log(data)
    		var alldatas = data.res_sta_opreation[0];
    		$('.alluser').html(alldatas.total_users)
    		$('.allmoney').html(alldatas.total_charge_records_money)	
    	}
	});

	var option5,option6,chart5,chart6;
    /*折线图*/
    chart5=echarts.init(document.getElementById('l1'));
    chart6=echarts.init(document.getElementById('l2'));
	option5 = {
            title: {
                text: '',
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
                    data : [],
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
                    data : []
                }
        };
        option6 = {
            title: {
                text: '',
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
                    type:'line',
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
                            color: '#1f93ba',
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "top", 
                        }
                    },
                    data : []
                }
        };
        
        //获取现在时间
	    var nowdate = new Date();
	    var y = nowdate.getFullYear();
	    var m = nowdate.getMonth()+1;
	    var d = nowdate.getDate();
	    var nowtime = y+'-'+m+'-'+d;
	    
	    //获取系统前60天的时间
	    var lastdate = new Date(nowdate-60*24*3600*1000);
	    var y = lastdate.getFullYear();
	    var m = lastdate.getMonth()+1;
	    var d = lastdate.getDate();
	    var formtime = y+'-'+m+'-'+d;
        
        /*****************************************  刷新折线图方法     ***************************************/    
        function queryDisplayData(){
            var line_time=[];
            var line_quantity=[];
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/data/message',
                contentType: "application/json;charset=utf-8",
		        dataType:"json",
		        asnyc:false,
		        data:JSON.stringify({"datatype":"total_users","startdate":formtime,"enddate":nowtime}),
                success:function(datas){ 
           
                    var lineData = datas.res_users_table;
                    /* console.log(data); */
                    $.each(lineData, function(i, value) {
                        /*时间  */
                        line_time.push(value.x.replace(/^0/, ''));
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
        
        $('#from').val(formtime)
        $('#to').val(nowtime)

		var s = formtime;
		var e = nowtime;
		$( "#from" ).datepicker({
			defaultDate: formtime,
			changeMonth: true,
			numberOfMonths: 1,
			dateFormat: 'yy-mm-dd',//日期格式 
			onClose: function( selectedDate ) {
	//			console.log(selectedDate)
				s = selectedDate;
//				console.log(s)
//				console.log(e)
				$( "#to" ).datepicker( "option", "minDate", selectedDate);
				var line_time10 = [];
            	var line_quantity10 = [];
				$.ajax({
	                type:'post',
	                url:publicAdress+'api/chargingpile/data/message',
					contentType: "application/json;charset=utf-8",
			        dataType:"json",
			        asnyc:false,
			        data:JSON.stringify({"datatype":"total_users","startdate":s,"enddate":e}),
	                success:function(data){
	                    var lineData = data.res_money_table;
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
		});
		
		$( "#to" ).datepicker({
			defaultDate: nowtime,
			changeMonth: true,
			numberOfMonths:1,	
			maxDate:nowtime,
			dateFormat: 'yy-mm-dd',//日期格式 
			onClose: function( selectedDate ) {
				e= selectedDate;
				$( "#from" ).datepicker( "option", "maxDate", selectedDate );
				var line_time10 = [];
            	var line_quantity10 = [];
				$.ajax({
	                type:'post',
	                url:publicAdress+'api/chargingpile/data/message',
					contentType: "application/json;charset=utf-8",
			        dataType:"json",
			        asnyc:false,
			        data:JSON.stringify({"datatype":"total_users","startdate":s,"enddate":e}),
	                success:function(data){
	           
	                    var lineData = data.res_money_table;
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
		});

		$('#find').click(function(){
			var line_time10 = [];
            var line_quantity10 = [];
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/data/message',
				contentType: "application/json;charset=utf-8",
		        dataType:"json",
		        asnyc:false,
		        data:JSON.stringify({"datatype":"total_users","startdate":formtime,"enddate":nowtime}),
                success:function(data){
           
                    var lineData = data.res_money_table;
                    $.each(lineData, function(i, value) {                       
                        line_time10.push(value.x.replace(/^0/, ''));
                        line_quantity10.push(value.y);
                        option6.xAxis.data=line_time10;
                        option6.series.data=line_quantity10;
                        chart6.setOption(option6); 
                    }); 
                }
            });
		})

        /*历史10天数据  */
        function tenday(){
            var line_time10 = [];
            var line_quantity10 = [];
            $.ajax({
                type:'post',
                url:publicAdress+'api/chargingpile/data/message',
				contentType: "application/json;charset=utf-8",
		        dataType:"json",
		        asnyc:false,
		        data:JSON.stringify({"datatype":"total_users","startdate":formtime,"enddate":nowtime}),
                success:function(data){
           
                    var lineData = data.res_money_table;
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
