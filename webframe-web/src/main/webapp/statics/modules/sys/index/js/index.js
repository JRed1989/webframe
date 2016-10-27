/**
 * Created by snow on 2016/6/14.
 */
//打开页签
var dialogShow;
var lineWidth = 0;
var time;
var time1;
var winWidth = $(window).width()+15;
var iniLeft = 0;
var index = 0;
function addTab(title, url){
    index++;
    // 屏幕适配
    var ClientH = document.documentElement.clientHeight;
    var offsetH = ClientH - 130;

    $('.panel').find('iframe').css('height',offsetH+'px');
    $('#tabs').tabs('close',title);
    var content = '<iframe scrolling="auto"  id="iframe_tab_'+index+'"frameborder="0" allowTransparency="true"  src="'+url+'" style="width:100%;height:'+offsetH+'px"></iframe>';
    $('#tabs').tabs('add',{
        title:title,
        content:content,
        closable:true
    });

    $('.panel').find('.panel-body').css('height',offsetH+'px');
}
$(document).ready(function(){

    var nice = $("html").niceScroll();

    //绑定tabs的右键菜单
    $("#tabs").tabs({
        onContextMenu : function (e, title) {
            if (title != '首页') {
                e.preventDefault();
                $('#tabsMenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                }).data("tabTitle", title);
          }
        }
    });
//实例化menu的onClick事件
    $("#tabsMenu").menu({
        onClick : function (item) {
            closeTab(this, item.name);
        }
    });

});

//关闭所有
function closeTab(menu, type) {
    var curTabTitle = $(menu).data("tabTitle");
    var tabs = $("#tabs");
    if (type === "close") {
        tabs.tabs("close", curTabTitle);
        return;
    }
    var allTabs = tabs.tabs("tabs");
    var closeTabsTitle = [];
    $.each(allTabs, function () {
        var opt = $(this).panel("options");
        if (opt.closable && type === "all") {
            closeTabsTitle.push(opt.title);
        }
    });
    for (var i = 0; i < closeTabsTitle.length; i++) {
        tabs.tabs("close", closeTabsTitle[i]);
    }
}


/**
 * 编辑快捷菜单
 */
function toEditUserQuickMenu(){

    var url='/admin/sys/user/ajax_userquickmenu_tree';

    top.layer.open({
        id:"treeLayer",
        type: 2,
        title: '选择快捷菜单',
        shadeClose: true,
        shade: 0.8,
        area: ['35%', '70%'],
        content: '/admin/sys/user/toUserQuickMenuEdit?url='+encodeURIComponent(url)+'&checked=true&extId=&selectIds=',//iframe的url
        btn: ['保存', '取消'],
        yes:function(index, layero){
                var tree = top.$("#treeLayer").find("iframe")[0].contentWindow.treeObj;
                var ids = [], names = [];
                var nodes = [];
                nodes = tree.getCheckedNodes();
                //alert("nodes_len_: "+nodes.length);
                for(var i=0; i<nodes.length; i++) {
                   if (nodes[i].isParent){
                       continue; // 如果为复选框选择，则过滤掉父节点
                   }
                   //alert("node[i]_id:  "+nodes[i].id);
                   //alert("node[i]_nm:  "+nodes[i].name);
                   ids.push(nodes[i].id);
                   names.push(nodes[i].name);
                }

                var treeMenuIds  = ids.join(",");
                var treeMenuNames= names.join(",");
                if(treeMenuIds == '') {
                    parent.alertx('请选择快捷菜单！',0);
                    return;
                }else if(ids.length > 4){
                    parent.alertx("菜单数量超过上限，请先重新选择!",0);
                    return ;
                }else {
                    layer.confirm("确认更新?", function(index){
                        layer.close(index);
                        $.post('/admin/sys/user/editUserQuickMenu?menuIds=' + treeMenuIds, function (data) {//+ '&quickmenuIds=' + ids, function (data) {
                            if (data == 1) {
                                parent.alertx("快捷菜单编辑成功！", 0);
                            } else {
                                parent.alertx("快捷菜单编辑失败！", 0);
                            }
                            //parent.closeTip(data);
                            parent.location.reload(true);
                        });

                    });
                }
        },
        btn2: function(index, layero){
            top.layer.close(index);
        },
        cancel: function (index) {
            layer.close(index);
        },
        end: function (index) {
            layer.close(index);
        }
    });

    //layer.open({
    //    type: 2,
    //    title: '编辑快捷菜单',
    //    shadeClose: false,
    //    //btn: ['保存', '取消'],
    //    shade: 0.8,
    //    area: ['40%', '90%'],
    //    //offset: ['50px'],
    //    content: '/admin/sys/user/toUserQuickMenuEdit',//?quickmenuIds='+idStrs,
    //    cancel: function (index) {
    //        layer.close(index);
    //    },
    //    end: function (index) {
    //        layer.close(index);
    //    }
    //});
}

function delUserQuickMenu(quickMenuId){

    layer.confirm('确定删除所选数据吗?', {icon: 3, title:'提示'}, function(index) {
        layer.close(index);
        $.post('/admin/sys/user/delUserQuickMenu' ,{"quickMenuIdStr":quickMenuId},function(data){
            if(data == 0){
                alertx('删除成功',1);
            }else{
                alertx('删除失败',2);
            }
            closeTip(data);
            location.reload(true);
        });
    });
}









