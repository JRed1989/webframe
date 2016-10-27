//页面加载
$(document).ready(function(){
    loadGrid();
    $("#roleName").addClear();
    $("#roleName").bind("keypress",function(event){
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
    $('#roleGrid').datagrid({
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
        url: 'ajax_role_data',
        method: 'post',
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'roleName', title: '角色名称',width:'20%',align:'center',sortable:true},
            {field: 'remark', title: '角色描述',width:'20%',align:'center',sortable:true},
            {field: 'isshow', title: '是否可用',width:'15%',align:'center',sortable:true
                ,
                formatter: function (value, row, index) {
                    return value == '0'?'启用':'禁用';
                }},
            {field: 'createDate', title: '创建时间',width:'20%',align:'center',sortable:true
                ,
                formatter:function (value, rec, index) {
                return formatDate(new Date(value));
              }},
            {field: 'modifyDate', title: '修改时间',width:'20%',align:'center',sortable:true
                ,
                formatter:function (value, rec, index) {
                    return formatDate(new Date(value));
                }}
        ]],


    });

    //设置分页控件
    var p = $('#roleGrid').datagrid('getPager');
    $(p).pagination({
        pageSize: 10,////每页显示的记录条数，默认为10
        pageList: [10],//可以设置每页记录条数的列表
        beforePageText: '第',//页数文本框前显示的汉字
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
    });
}
/**
 * 删除角色的方法
 */
function batchDelete(){
    var ids = [];
    var rows = $('#roleGrid').datagrid('getSelections');
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
        $.post('role_delete',{"idStr":idStr},function(data){
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
 * 更新角色的方法
 */
function updateRole(){
    var ids = [];
    var rows = $('#roleGrid').datagrid('getSelections');
    for(var i=0; i<rows.length; i++){
        ids.push(rows[i].id);
    }
    if(ids.length == 0 || ids.length >1){
        alertx("只能选择一项",0);
        return ;
    }
    layer.open({
        type: 2,
        title: '修改角色页面',
        shadeClose: true,
        shade: 0.8,
        area: ['50%', '90%'],
        content: 'role_add?id='+ids[0],
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
 * 添加角色
 */
function addRole() {
    layer.open({
        type: 2,
        title: '添加角色页面',
        shadeClose: true,
        shade: 0.8,
        area: ['50%', '90%'],//宽高
        content: 'role_add',
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
    $("#roleGrid").datagrid('load', {
        roleName: $("#roleName").val()
    });
}

