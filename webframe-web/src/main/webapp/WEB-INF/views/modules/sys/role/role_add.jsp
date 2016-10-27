<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>

<html>
<head>
    <title>角色添加页面</title>
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
  <link rel="stylesheet" href="${basePath}/statics/commons/app/css/skins/_all-skins.css">
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/icheck/all.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/ionicons/css/ionicons.min.css">
  <!-- 加载jquery -->
  <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery/jquery.min.js"></script>
  <script type="text/javascript" src="${basePath}/statics/thirdparty/bootstrap/js/bootstrap.min.js"></script>
  <script type="text/javascript" src="${basePath}/statics/thirdparty/icheck/icheck.min.js"></script>
  <script type="text/javascript" src="${basePath}/statics/commons/app/js/app.js"></script>
  <script type="text/javascript" src="${basePath}/statics/commons/js/icheck.js"></script>
  <link
          href="${basePath}/statics/thirdparty/jquery-validation/1.11.0/jquery.validate.min.css"
          type="text/css" rel="stylesheet" />
  <script
          src="${basePath}/statics/thirdparty/jquery-validation/1.11.0/jquery.validate.min.js"
          type="text/javascript"></script>
  <script type="text/javascript" src="${basePath}/statics/modules/sys/role/js/role_add.js"></script>
</head>
<body>
<sys:message msgContent="${message}"/>
  <div class="col-md-6 box-body">
      <form id="inputForm" action="role_save" method="post"  class="form-horizontal">
        <input type="hidden" id="id" name="id" value="${ empty role.id ? 0 :role.id}"/>
          <div class="row form-group">
            <label for="roleName" class="col-sm-2 control-label">角色名称:</label>
              <input type="text" class="required" id="roleName" name="roleName" placeholder="角色名称"  value="${role.roleName}">
          </div>
          <div class="row form-group">
              <label for="permIds" class="col-sm-2 control-label">功能权限:</label>
              <sys:treeselect id="permIds" name="permIds" value="${selPermIds}" labelName="${selPermNames}"
                              labelValue="${selPermNames}"	title="功能权限"
                              url="/admin/sys/menu/ajax_power_menutree" checked="true"/>

          </div>

          <div class="row form-group">
            <label  class="col-sm-2 control-label">是否可用:</label>
              <input type="radio"  class="minimal  {required:true} " ${empty role.isshow || role.isshow == 0 ? 'checked':''}  name="isshow" id="isshow" value="0"   />启用
              <input type="radio"  class="minimal "  name="isshow" id="isshow1" value="1"   ${ role.isshow == 1 ? 'checked':''}  }/>禁用
          </div>

          <div class="row form-group">
            <label for="remark" class="col-sm-2 control-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注:</label>
              <textarea  id="remark" name="remark" placeholder="备注"  cols="40" rows="7">${role.remark}</textarea>
          </div>
          <div class="row form-group" style="text-align: center;">
            <shiro:hasPermission name="sys:role:save">
              <input id="btnSubmit" class="btn btn-primary"  type="submit"
                     value="保存" />&nbsp;
            </shiro:hasPermission>
            <input id="btnCancel" class="btn btn-cancle" type="reset" value="重置" />
          </div>
      </form>
    </div>
</body>
</html>
