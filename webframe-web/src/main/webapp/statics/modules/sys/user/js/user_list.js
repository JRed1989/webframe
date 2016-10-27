//页面加载
$(document).ready(function(){
    loadGrid();
    $("#username").addClear();
    $("#username").bind("keypress",function(event){
        if(event.keyCode == 13){
            search();
        }
    });
});

//加载表格datagrid
function loadGrid() {
    var url;
    var clientH = document.documentElement.clientHeight;
    var offsetH =clientH - 61;
    //加载数据
    $('#dataGrid').datagrid({
        width:'100%',
        height:offsetH,
        idField: 'id',
        nowrap: false,
        striped: true,
        border: true,
        loadMsg: "数据加载中，请稍后...",
        collapsible:false,//是否可折叠的
        fit: false,//自动大小
        pagination:true,//分页控件
        rownumbers:true,//行号
        fitcolumns:true,
        url: 'ajax_user_data',
        method: 'post',
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'username', title: '用户名',width:'20%',align:'center',sortable:true},
            {field: 'realname', title: '真实姓名',width:'20%',align:'center',sortable:true},

            {field: 'status', title: '是否可用',width:'15%',align:'center',sortable:true,
                formatter: function (value, row, index) {
                    return value == '0'?'启用':'禁用';
                }},
            {field: 'createDate', title: '创建时间',width:'20%',align:'center',sortable:true,
                formatter:function (value, rec, index) {
                    return formatDate(new Date(value));
                }},
            {field: 'modifyDate', title: '修改时间',width:'20%',align:'center',sortable:true,
                formatter:function (value, rec, index) {
                    return formatDate(new Date(value));
                }},
        ]],


    });

    //设置分页控件
    var p = $('#dataGrid').datagrid('getPager');
    $(p).pagination({
        pageSize: 10,////每页显示的记录条数，默认为10
        pageList: [10],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
    });
}
function batchDelete(){
    var ids = [];
    var rows = $('#dataGrid').datagrid('getSelections');
    for(var i=0; i<rows.length; i++){
        ids.push(rows[i].id);
    }
    if(ids.length == 0){
        alertx("请至少选择一项",0);
        return ;
    }
    var idStr = ids.join(",");
    layer.confirm('确定删除所选数据吗?', {icon: 3, title:'提示'}, function(index) {
        layer.close(index);
        $.post('user_delete',{"idStr":idStr},function(data){
            if(data == 0){
                alertx('删除成功',1);
                search();
            }else{
                alertx('删除失败',2);
            }
        });
    });
}

/**
 * 修改用户信息
 */
function updateUser(){
    var ids = [];
    var rows = $('#dataGrid').datagrid('getSelections');
    for(var i=0; i<rows.length; i++){
        ids.push(rows[i].id);
    }
    if(ids.length == 0 || ids.length >1){
        alertx("只能选择一项",0);
        return ;
    }
    layer.open({
        type: 2,
        title: '修改用户页面',
        shadeClose: true,
        shade: 0.8,
        area: ['40%', '90%'],
        content: "user_add?id="+ids[0],
        cancel:function (index) {
            layer.close(index);
            search();
        },
        end:function (index) {
            layer.close(index);
            search();
        }
    });

}

/**
 * 添加用户信息
 */
function addUser(){
    layer.open({
        type: 2,
        title: '添加用户页面',
        shadeClose: true,
        shade: 0.8,
        area: ['40%', '90%'],
        content: 'user_add',
        cancel:function (index) {
            layer.close(index);
            search();
        },
        end:function (index) {
            layer.close(index);
            search();
        }
    });

}


/**
 * 模糊查询方法
 */
function search() {
    $("#dataGrid").datagrid('load', {
        username: $("#username").val()
    });
}
