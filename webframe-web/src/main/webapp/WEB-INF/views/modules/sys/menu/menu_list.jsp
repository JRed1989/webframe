<%--
  Created by IntelliJ IDEA.
  User: snow
  Date: 2016/6/21
  Time: 12:04
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>
<html>
<head>
    <title>菜单列表页</title>
<!-- Bootstrap-->
<link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">

<link href="${basePath}/statics/thirdparty/treeTable/themes/vsStyle/treeTable.min.css"
        rel="stylesheet" type="text/css" />
<!-- Theme style -->
<link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
<link rel="stylesheet" href="${basePath}/statics/commons/app/css/skins/_all-skins.css">
<!-- Font Awesome -->
<link rel="stylesheet" href="${basePath}/statics/thirdparty/font-awesome/css/font-awesome.min.css">
<!-- Ionicons -->
<link rel="stylesheet" href="${basePath}/statics/thirdparty/ionicons/css/ionicons.min.css">
<!-- 加载jquery -->
<script type="text/javascript" src="${basePath}/statics/thirdparty/jquery/jquery.min.js"></script>
<script type="text/javascript" src="${basePath}/statics/thirdparty/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="${basePath}/statics/commons/app/js/app.js"></script>
<script  type="text/javascript"  src="${basePath}/statics/thirdparty/treeTable/jquery.treeTable.min.js"></script>

<!-- layer-->
<script src="${basePath}/statics/thirdparty/layer/layer.js"  type="text/javascript"></script>
<script type="text/javascript" src="${basePath}/statics/commons/js/common.js"></script>

<script type="text/javascript" src="${basePath}/statics/modules/sys/menu/js/menu_list.js"></script>
</head>
<body>
<sys:message msgContent="${message}" />
        <div class="box-body" style="display: block;">
            <div class="box-tools pull-right">
                <shiro:hasPermission name="sys:menu:add">
                <input  class="btn btn-primary " type="button"
                        value="添加" onclick="javascript:location.href='./menu_add'" />
                </shiro:hasPermission>

                 <shiro:hasPermission name="sys:menu:save">
                <input id="btnSubmit" class="btn btn-info" type="button"
                       value="保存排序" onclick="updateSort();" />
                 </shiro:hasPermission>

            </div>


            <form id="listForm" method="post">
                <table id="treeTable"  class="table table-striped table-bordered table-condensed" style="font-size: 13px;">
                    <thead>
                    <tr>
                        <th width="20%">名称</th>
                        <th width="20%">链接</th>
                        <th width="20%">排序</th>
                        <th width="20%">可见</th>
                        <th width="20%">权限标识</th>
                        <shiro:hasPermission name="sys:menu:edit">
                            <th width="20%">操作</th>
                        </shiro:hasPermission>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach items="${menuList}" var="menu">
                        <tr id="${menu.id}"
                            pId="${menu.parentId}">
                            <td nowrap>
                                <shiro:hasPermission name="sys:menu:edit">
                                    <a href="${basePath}/admin/sys/menu/menu_edit?id=${menu.id}">${menu.menuName}</a>
                                </shiro:hasPermission>
                                <shiro:lacksPermission name="sys:menu:edit">
                                    ${menu.menuName}
                                </shiro:lacksPermission>
                            </td>

                            <td title="${menu.href}">${not empty menu.href && fn:length(menu.href)>40 ? fn:substring(menu.href,0,41).concat('...') : menu.href}</td>
                            <td style="text-align: center;"><shiro:hasPermission
                                    name="sys:menu:edit">
                                <input type="hidden" name="ids" value="${menu.id}" />
                                <input name="sorts" type="text" value="${menu.sortNumber}"
                                       style="width: 50px; margin: 0; padding: 0; text-align: center;">
                            </shiro:hasPermission> <shiro:lacksPermission name="sys:menu:edit">
                                ${menu.sortNumber}
                            </shiro:lacksPermission></td>
                            <td>${menu.isShow == 0 ?'显示':'隐藏'}</td>
                            <td title="${menu.permission}">${not empty menu.permission && fn:length(menu.permission)>20 ? fn:substring(menu.permission,0,21).concat('...') : menu.permission}</td>
                            <td nowrap>
                                <shiro:hasPermission name="sys:menu:edit">
                                    <a href="${basePath}/admin/sys/menu/menu_edit?id=${menu.id}">修改</a>
                                </shiro:hasPermission>
                                <shiro:hasPermission name="sys:menu:delete">
                                    <a href="javascript:deleteMenu('${menu.id}');"
                                       onclick="">删除</a>
                                </shiro:hasPermission>
                                <shiro:hasPermission name="sys:menu:add">
                                    <a href="${basePath}/admin/sys/menu/menu_add?parentId=${menu.id}">添加下级菜单</a>
                                </shiro:hasPermission>
                            </td>

                        </tr>
                    </c:forEach>
                    </tbody>
                </table>

            </form>
        </div>
</body>
</html>
