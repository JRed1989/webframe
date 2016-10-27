function init_chosen(){
	   //初始化select的样式
	    var config = {
 		      '.chosen-select'           : {}
 		    }
 		    for (var selector in config) {
 		      $(selector).chosen(config[selector]);
 		    }

 }