/**
 * 检查快捷菜单重复
 * @returns {*}
 */
function checkQuickMenuIsRepeat(){
    var check ;
    var outData_1;
    var treeMenuIds = document.getElementsByName("menuIds")[0].value;
           $.ajax({
            type: 'POST',
            url: 'checkQuickMenuIsRepeat', //用户请求数据的URL
            data: "menuIds=" + treeMenuIds,
            dataType: "text",
            async:false,//将结果返回的时候我们需要将执行方式修改为同步执行才可
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest + ":" + textStatus + ":" + errorThrown);
            },
            success: function (data) {
                outData_1 = data;
            }
        });
        //alert("od: "+outData_1);
        if(outData_1 == 1){
            check=false;
        }else{
            check=true;
        }
    return check;
}


/***
 * 检查合计快捷菜单总数超限
 * @returns {*}
 */
function checkQuickMenuOutSumCount(){
    var check ;
    var outData_2;
    var ids= $("#ids").val();
    var treeMenuIds = document.getElementsByName("menuIds")[0].value;
        $.ajax({
            type: 'POST',
            url: 'checkQuickMenuOutSumCount', //用户请求数据的URL
            data: "menuIds="+treeMenuIds,
            dataType : "text",
            async:false,//想将结果返回的时候我们需要将执行方式修改为同步执行才可
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest+":"+textStatus+":"+errorThrown);
            },
            success: function (data) {
                outData_2 = data;
            }
        });
        //alert("od2: "+outData_2);
        if(outData_2 == 2){
            check=false;
        }else{
            check=true;
        }
    return check;
}



function checkMenuMaxCount(){
    $.ajax({
        type: 'POST',
        url: '/admin/sys/user/checkQuickMenuMaxCount', //用户请求数据的URL
        dataType : "text",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest+":"+textStatus+":"+errorThrown);
        },
        success: function (data) {
            if(data==1){
                parent.alertx("菜单数量超过上限，请先删除部分后再设置!",0);
                return;
            }
        }
    });
}


/***
 * 保存快捷菜单信息
 */
function submitEditQuickMenu(){

        var treeMenuIds = document.getElementsByName("menuIds")[0].value;
        var ids = $("#ids").val();
        //var oldMenuIds= $("#old_menuIds").val();
        if(treeMenuIds == '') {
            parent.alertx('请选择快捷菜单！',0);
            return;
        }
        //if(editType !== null && editType == '0'){//新增时判断
        //    if(!checkQuickMenuIsRepeat()){
        //        parent.alertx("快捷菜单重复，请重新选择!", 0);
        //        return;
        //    }
        //    if(!checkQuickMenuOutSumCount()) {
        //        parent.alertx("合计快捷菜单总数超过上限，请重新选择!", 0);
        //        return;
        //    }
        //}

        var menuIdsAry = [];
        menuIdsAry = treeMenuIds.split(",");
        if(menuIdsAry.length > 4){
            parent.alertx("菜单数量超过上限，请先重新选择!",0);
            return ;
        }

        //if(editType !== null && editType == '1') {//修改时判断
        //    if(menuIdsAry.length > idsAry.length){
        //        parent.alertx("修改数量超过选择数量，请重新选择!", 0);
        //        return;
        //    }else if(menuIdsAry.length < idsAry.length){
        //        parent.alertx("修改数量小于选择数量，请重新选择!", 0);
        //        return;
        //    }
        //}


        $.post('editUserQuickMenu?menuIds=' + treeMenuIds + '&quickmenuIds=' + ids, function (data) {
            //alert("data: "+data);
            if (data == 1) {
                parent.alertx("快捷菜单编辑成功！", 0);
            } else {
                parent.alertx("快捷菜单编辑失败！", 0);
            }
            //parent.closeTip(data);
            parent.location.reload(true);
        });

}


