<%--
  Created by IntelliJ IDEA.
  User: snow
  Date: 2016/6/23
  Time: 15:14
  To change this template use File | Settings | File Templates.
--%>
<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>角色管理页面</title>
    <!-- Bootstrap-->
    <link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
    <link rel="stylesheet" href="${basePath}/statics/commons/app/css/skins/skin-blue.css">
    <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="${basePath}/statics/thirdparty/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery-easyui/jquery.easyui.min.js"></script>
    <link rel="stylesheet" type="text/css" href="${basePath}/statics/thirdparty/jquery-easyui/themes/metro/datagrid.css" />
    <link rel="stylesheet" type="text/css" href="${basePath}/statics/thirdparty/jquery-easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="${basePath}/statics/thirdparty/jquery-easyui/themes/icon.css">

    <!-- layer-->
    <script src="${basePath}/statics/thirdparty/layer/layer.js"  type="text/javascript"></script>
    <script type="text/javascript" src="${basePath}/statics/commons/js/common.js"></script>

    <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery-addclear/addclear.js"></script>


    <script type="text/javascript" src="${basePath}/statics/modules/sys/role/js/role_list.js"></script>


</head>
<body >

<sys:message msgContent="${message}" />
    <div class="box-body" style="display: block;">

      <div id="search" style="padding:3px" class="pull-left">
        <label>角色名称:</label>
        <input type="text" id="roleName" name="roleName" style="padding:6px 12px;">
        <button type="button" class="btn btn-primary" onclick="search()">查询</button>
      </div>

      <div class="box-tools pull-right">
     <shiro:hasPermission name="sys:role:add">
        <input  class="btn btn-primary " type="button"
                value="添加" onclick="addRole();" />
     </shiro:hasPermission>

         <shiro:hasPermission name="sys:role:add">
        <input  class="btn btn-info " type="button"
                value="修改" onclick="updateRole();" />
         </shiro:hasPermission>

         <shiro:hasPermission name="sys:role:delete">
        <input id="btnSubmit" class="btn btn-danger" type="button"
               value="删除" onclick="batchDelete();" />
     </shiro:hasPermission>
       </div>
    </div>
    <div class="easyui-datagrid" id="roleGrid" ></div>
</body>

</html>
