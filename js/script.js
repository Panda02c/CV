	//------------首屏-----------
	$(function(){
		var wHeight = $(window).height(); //获取浏览器窗口宽度
		var wWidth = $(window).width(); //获取浏览器窗口高度
		$('#page0,#banner').height(wHeight).width(wWidth);
		var obtn=$("#list-group");
		var scrollHeight;
		$(window).scroll(function(){
			scrollHeight=$(window).scrollTop();
			if(scrollHeight >= wHeight*0.6){
				obtn.css("display","block");
				}
			else{
				obtn.css("display","none");
				}	
			})
	});
	
	//-------------------点击跳转------------
	$(function(){
	  var _index=0;
	  $("#list-group a").click(function(){
	  	$(this).find("a").addClass("current").siblings().find("a").removeClass("current");
	   _index=$(this).index();
	   
	  	var _top=$("#page"+_index).offset().top;
	   
	  	$("body,html").animate({scrollTop:_top},500);
	  });
	  var nav=$("#list-group"); 
	  var win=$(window); 
	  var sc=$(document);
	  win.scroll(function(){
 
		   if(sc.scrollTop()>=600){
			   $("#list-group").show(); 
			   //获取滚动元素对应的索引!!!重难点
			   var index=Math.floor(sc.scrollTop()/600);
			 
			   $("#list-group a").eq(index-1).addClass("current").siblings().find("a").removeClass("current");
		   }else{
			   $("#list-group").hide();
   				}
	  });
	 });
	
	
//--------------
	
$(document).ready(function () {
            $(window).scroll(function () {
                var pages = $("#container").find(".page");
				
                var listgroup = $("#list-group");
                var top = $(document).scrollTop();
				
                var currentId = ""; //滚动条现在所在位置的item id
                pages.each(function () {
                    var m = $(this);
				
                    //注意：m.offset().top代表每一个item的顶部位置
                    if (top > m.offset().top - 300) {
                        currentId = "#" + m.attr("id");
						
                    } else {
                        return false;
                    }
					
                });

                var currentLink = listgroup.find(".current");
				
                if (currentId && currentLink.attr("href") != currentId) {
                    currentLink.removeClass("current");
                    listgroup.find("[href='" + currentId + "']").addClass("current");
                }
            });
			
	//--------more点击展开 收起--------			
  	$("#more").click(function(){
   	 $("#box").slideToggle(function(){
		 if($("#more span").hasClass("fa-angle-double-down")){
			 $("#more span").addClass("fa-angle-double-up");$("#more span").removeClass("fa-angle-double-down");
			 }
	     else{
			 $("#more span").addClass("fa-angle-double-down");$("#more span").removeClass("fa-angle-double-up");	
			 }
			
		 });
		 
        });

	
	var tableOfContents = function($listContainer) {
  		if ($listContainer.length === 0) return;

	  $('#list-group a').each(function() {
		  
		var listLink = $('<a>').bind('click', scrollTo);
		var listItem = $('#list-group a').append(listLink);
	
		$listContainer.append(listItem);
	  })
}

	var scrollTo = function(e) {
 	 e.preventDefault();
 	 var elScrollTo = $(e.target).attr('href');
 	 var $el = $(elScrollTo);

  $('body,html').animate({ scrollTop: $el.offset().top }, 400, 'swing', function() {
    location.hash = elScrollTo;
  })
}

	//------------专业技能-----------------
	
	$("#page2 .btn button").click(function(){
   	
	$("#page2 li").removeClass("blur highlight");
	var m=$(this);
	
	if(m.attr('id')==="all"){
		$("#page2 li").addClass("highlight");
		}else{
		var btnname = m.attr('id')+'s';
		$("#page2 li").not("."+btnname).addClass("blur");
		$("."+btnname).addClass("highlight");	
			}
	 });
	
	$(function(){
		var sidebar=$("#side-info");
		var box=$("#box");
		var showinfo=$("#showinfo");
		var hideinfo=$("#hideinfo");
		function showSideinfo(){
			sidebar.css('left',0);
			hideinfo.css('left',sidebar.width());
			showinfo.fadeOut();
			hideinfo.css("visibility","visible");
			}
		function hideSideinfo(){
			sidebar.css('left',-sidebar.width());
			showinfo.fadeIn();
			hideinfo.css("visibility","hidden");
			showinfo.css('left',-sidebar.width());
			}
		showinfo.on('click',showSideinfo);
		hideinfo.on('click',hideSideinfo);
		box.on('click',hideSideinfo);
	});
	
});

	
	
   