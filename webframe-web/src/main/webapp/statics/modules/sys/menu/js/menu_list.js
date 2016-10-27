
$(document).ready(function() {
    $("#treeTable").treeTable({
        expandLevel : 2
    }).show();;
});
function updateSort() {
    $("#listForm").attr("action", "batch_update_sort");
    $("#listForm").submit();
}
function deleteMenu(id){
    top.layer.confirm('确定删除该菜单及其子菜单?', {icon: 3, title:'提示'}, function(index) {
        layer.close(index);
        location.href="menu_delete?id="+id;
    });
}


