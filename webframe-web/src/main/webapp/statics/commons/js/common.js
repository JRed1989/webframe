

//显示提示框
function showMsg(msg,timeout,type){
    timeout=timeout==null||timeout==undefined?3*1000:timeout;
    type=type==null||type==undefined?1:type;
    layer.msg(msg,{
        icon: type,
        time: timeout
    });
}

// 显示加载框
function loading(msg){
    var index = layer.load(0);
     return index;
}
//关闭提示框
function closeTip(index){
    layer.close(index);
}

/**
 * 关闭所有的提示框
 * @param type; 提示框类型:loading,dialog,
 */
function closeAllTips(type) {
    layer.closeAll(type);
}


// 警告对话框
function alertx(msg,type){
    type=type==undefined||type==null?1:type;
    layer.alert(msg, {icon: type});
}

// 确认对话框
function confirmx(msg, href){
    layer.confirm(msg, {icon: 3, title:'提示'}, function(index){
        location.href=href;
        layer.close(index);
    });
}



//获取URL地址参数
function getQueryString(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    if (!url || url == ""){
        url = window.location.search;
    }else{
        url = url.substring(url.indexOf("?"));
    }
    r = url.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null;
}

/**
 * 格式化日期输出
 * @param now
 * @param format
 * @returns {string}
 */
function formatDate(dateObj,format) {

    var year=dateObj.getFullYear();
    var month=((dateObj.getMonth() + 1) >= 10 ? (dateObj.getMonth() + 1) : "0" + (dateObj.getMonth() + 1));
    var date=((dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate()));
    var hour=((dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours()));
    var minute=((dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes()));
    var second=((dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds()));
    if(format == undefined || format == "" || format == "yyyy-mm-dd HH:MM:ss"){
        return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    }else if( format == "yyyy-mm-dd"){
        return year+"-"+month+"-"+date;
    }else if( format == "HH:MM:ss"){
        return hour+":"+minute+":"+second;
    }
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}

/**
 * 将秒转换成时分秒
 * @param seconds
 */
function formatSeconds(seconds){
    var secondTime = parseInt(seconds);
    var minuteTime = 0; //分
    var hourTime = 0; //时
    if(secondTime > 60){
        minuteTime = parseInt(secondTime/60);
        secondTime = parseInt(secondTime%60);

        if(minuteTime > 60){
            hourTime = parseInt(minuteTime/60);
            minuteTime = parseInt(minuteTime%60);
        }
    }
    var result = secondTime + "秒";
    if(minuteTime > 0){
        result = minuteTime + "分" +result;
    }
    if(hourTime > 0){
        result = hourTime + "时" +result;
    }
    return result;
}





//格式化数据格式  添加逗号
function addCommas(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


function numberFormat(number, decimals, decPoint, thousandsSep) {
    var lang = defaultOptions.lang,
    // http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_number_format/
        n = +number || 0,
        c = decimals === -1 ?
            (n.toString().split('.')[1] || '').length : // preserve decimals
            (isNaN(decimals = mathAbs(decimals)) ? 2 : decimals),
        d = decPoint === undefined ? lang.decimalPoint : decPoint,
        t = thousandsSep === undefined ? lang.thousandsSep : thousandsSep,
        s = n < 0 ? "-" : "",
        i = String(pInt(n = mathAbs(n).toFixed(c))),
        j = i.length > 3 ? i.length % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
        (c ? d + mathAbs(n - i).toFixed(c).slice(2) : "");
}

