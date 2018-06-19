$(function(){

	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/data/message",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		data:JSON.stringify({"datatype":"total_pile","page":1,"rows":16}),
		success:function(data){
//			console.log(data)
			var gun_num = data.res_pile_table;
			var gun_cont = '';	
			pagebtn(data.totalcount);
			for(var w=0;w<gun_num.length;w++){
                gun_cont += '<tr><td>' + gun_num[w].stationName + '</td><td class="num">'
                + gun_num[w].total_num + '</td><td class="num">'
                + gun_num[w].DC_num + '</td><td class="num">'
                + gun_num[w].AC_num + '</td><td>'
                + gun_num[w].stationDetail + '</td></tr>';
            }
            $('.gun_num').html(gun_cont);	
		}
	});
	
var currentPage =1;
function pagebtn(num){
	layui.use(['laypage', 'layer'], function(){
	    var laypage = layui.laypage
	      ,layer = layui.layer;
	      //完整功能
	    laypage.render({
	        elem: 'demo7'
	        ,count: num
	        ,limit:16
	        ,curr:currentPage
	        ,layout: ['count', 'prev', 'page', 'next', 'skip']
	        ,jump: function(obj,first){
	          currentPage= obj.curr
	          if(!first){
	          	 $('.gun_num').html('');	
	             pagedata(currentPage)
	          }
	        }
	    });
	})
}

function pagedata(cur){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/data/message",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		async:false,
		data:JSON.stringify({"datatype":"total_pile","page":cur,"rows":16}),
		success:function(data){
//			console.log(data)
			var gun_num = data.res_pile_table;
			var gun_cont = '';
			for(var w=0;w<gun_num.length;w++){
                gun_cont += '<tr><td>' + gun_num[w].stationName + '</td><td class="num">'
                + gun_num[w].total_num + '</td><td class="num">'
                + gun_num[w].DC_num + '</td><td class="num">'
                + gun_num[w].AC_num + '</td><td>'
                + gun_num[w].stationDetail + '</td></tr>';
            }
            $('.gun_num').html(gun_cont);	
		}
	});
	
}
 var getdetail = sessionStorage.getItem('user');
 var get = JSON.parse(getdetail);
  var userdetail ={}
  
$('.godata').click(function(e){
	e = window.event || e;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    } 
    
    
    if(get != null || $.isEmptyObject(userdetail) == false){
		$(".layui-table").table2excel({  
	        exclude: ".noExl",  
	        fileext: ".xls",
	        name: "Excel Document Name",  
	        filename: '总枪数',  
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
//		        $('.prompt_pass').fadeOut(600);
//			        alert('登陆成功');
				$('.success').html('登陆成功')
				$('.shadow').fadeOut(2000)
				setTimeout($('.slide').slideToggle(),3000)
				
	        }
		 });
	}

    
	
	//权限
//	$('.popup').show()
//	$('.popup').delay(2000).hide(0);	
	//权限
})
$('body').click(function(){
	$('.slide').slideUp()
})

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

 
//本页导出
	$('#export').click(function(){
		if(get != null){
			$(".layui-table").table2excel({  
		        exclude: ".noExl",  
		        fileext: ".xls",
		        name: "Excel Document Name",  
		        filename: '总枪数',  
		        exclude_img: true,  
		        exclude_links: true,  
		        exclude_inputs: true  
		    });
		}else{
			$('.shadow').show();
			$('#loginbtn').click(function(){
		        var account = $('#username').val();
		        var pass_word = $('#password').val();
		        var userdetail ={
		        	name: account,
		        	pass: pass_word
		        }
		        sessionStorage.setItem('user', JSON.stringify(userdetail));
		        if(account.length <= 6|| pass_word.length <= 6){
		          $('.prompt_pass').fadeIn(600).html('账号或密码不能少于6位')
		          return false;
		        }else{
			        $('.prompt_pass').fadeOut(600);
//			        alert('登陆成功');
					$('.success').html('登陆成功')
				setTimeout(function(){
					$('.shadow').hide();
			        
			        $(".layui-table").table2excel({  
				        exclude: ".noExl",  
				        fileext: ".xls",
				        name: "Excel Document Name",  
				        filename: '总枪数',  
				        exclude_img: true,  
				        exclude_links: true,  
				        exclude_inputs: true  
				    });
				},2000)
			        
		        }
			 });
		}
		
		  
	})
	
	//全部导出
$('#allexport').click(function(){
	$.ajax({
		type:"post",
		url:publicAdress+"api/chargingpile/data/message",
		contentType: "application/json;charset=utf-8", 
		dataType:"json",
		async:false,
		data:JSON.stringify({"datatype":"total_pile","page":1,"rows":0}),
		success:function(data){
//			console.log(data)
			var gun_num = data.res_pile_table;
			var gun_cont = '';
			pagebtn(data.totalcount);
			for(var w=0;w<gun_num.length;w++){
                gun_cont += '<tr><td>' + gun_num[w].stationName + '</td><td class="num">'
                + gun_num[w].total_num + '</td><td class="num">'
                + gun_num[w].DC_num + '</td><td class="num">'
                + gun_num[w].AC_num + '</td><td>'
                + gun_num[w].stationDetail + '</td></tr>';
            }
            $('.allelec_num').html(gun_cont);	
		}
	});
	$("#all").table2excel({  
        exclude: ".noExl",  
        fileext: ".xls",
        name: "Excel Document Name",  
        filename: "总枪数",  
        exclude_img: true,  
        exclude_links: true,  
        exclude_inputs: true  
    });
})
	
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
		var select_province = $(this).val();
		s_city(select_province);
	
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
		
	
	
	var gundate = {};
	$('#finddetail').click(function(){
		var province_id = $('#province option:selected').val();
		var city_id = $('#city option:selected').val();
		var elecname = $('#gunname').val();
		gundate.pr_id = province_id;
		gundate.cy_id = city_id;
		gundate.el_name = elecname;
		$.ajax({
			type:"post",
			url:publicAdress+"api/chargingpile/data/message",
			contentType: "application/json;charset=utf-8", 
			dataType:"json",
			data:JSON.stringify({"datatype":"total_pile","page":1,"rows":16,"provinceid":province_id,"cityid":city_id,"stationname":elecname}),
			success:function(data){
//				console.log(data)
				var gun_num = data.res_pile_table;
				var gun_cont = '';
				
				Pagebtn(data.totalcount);
				if(gun_num.length==0){
					var detail_car = '';
            detail_car ='<tr><td style="border:none;">暂无信息</td></tr>';
            $('.gun_num').html(detail_car);
				}else{
					for(var w=0;w<gun_num.length;w++){
	            gun_cont += '<tr><td>' + gun_num[w].stationName + '</td><td class="num">'
	            + gun_num[w].total_num + '</td><td class="num">'
	            + gun_num[w].DC_num + '</td><td class="num">'
	            + gun_num[w].AC_num + '</td><td>'
	            + gun_num[w].stationDetail + '</td></tr>';
	        }
	        $('.gun_num').html(gun_cont);	
				}
				
			}
		});
		
	})
	
	function Pagebtn(num){
		layui.use(['laypage', 'layer'], function(){
		    var laypage = layui.laypage
		      ,layer = layui.layer;
		      //完整功能
		    laypage.render({
		        elem: 'demo7'
		        ,count: num
		        ,limit:16
		        ,curr:currentPage
		        ,layout: ['count', 'prev', 'page', 'next', 'skip']
		        ,jump: function(obj,first){
		          currentPage= obj.curr
		          if(!first){
		          	 $('.gun_num').html('');	
		             Spagedata(currentPage)
		          }
		        }
		    });
		})
	}

	function Spagedata(cur){
		$.ajax({
			type:"post",
			url:publicAdress+"api/chargingpile/data/message",
			contentType: "application/json;charset=utf-8", 
			dataType:"json",
			async:false,
			data:JSON.stringify({"datatype":"total_pile","page":cur,"rows":16,"provinceid":gundate.pr_id,"cityid":gundate.cy_id,"stationname":gundate.el_name}),
			success:function(data){
	//			console.log(data)
				var gun_num = data.res_pile_table;
				var gun_cont = '';
				for(var w=0;w<gun_num.length;w++){
	                gun_cont += '<tr><td>' + gun_num[w].stationName + '</td><td class="num">'
	                + gun_num[w].total_num + '</td><td class="num">'
	                + gun_num[w].DC_num + '</td><td class="num">'
	                + gun_num[w].AC_num + '</td><td>'
	                + gun_num[w].stationDetail + '</td></tr>';
	            }
	            $('.gun_num').html(gun_cont);	
			}
		});
		
	}
	
	
})
