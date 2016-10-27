<%--
    Created by IntelliJ IDEA.
    User: snow
Date: 2016/6/23
Time: 17:12
To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
    <%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>

<html>
    <head>
    <title>用户添加页面</title>
    <link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">
        <!-- Theme style -->
    <link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
    <link rel="stylesheet" href="${basePath}/statics/commons/app/css/skins/skin-blue.css">
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
    <link href="${basePath}/statics/thirdparty/jquery-validation/1.11.0/jquery.validate.min.css" type="text/css" rel="stylesheet" />
    <script src="${basePath}/statics/thirdparty/jquery-validation/1.11.0/jquery.validate.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="${basePath}/statics/modules/sys/user/js/user_add.js"></script>
    </head>
    <body>
    <sys:message msgContent="${message}"/>
    <div class="col-md-6 box-body">
    <form id="inputForm" action="user_save" method="post"  class="form-horizontal">
    <input type="hidden" id="id" name="id" value="${ empty user.id ? 0 :user.id}"/>

    <div class="row form-group">
        <label for="username" class="col-sm-2 control-label">&nbsp;&nbsp;&nbsp;用户名:</label>
        <input type="text" class="required" id="username" name="username" placeholder="用户名"  value="${user.username}">
    </div>

        <div class="row form-group">
            <label for="realname" class="col-sm-2 control-label">真实姓名:</label>
            <input type="text" class="required" id="realname" name="realname" placeholder="真实姓名"  value="${user.realname}">
        </div>

        <div class="row form-group" >
            <label for="password" class="col-sm-2 control-label">用户密码:</label>
            <input type="password" class="required" id="password" name="password"  maxlength="50" value=""/>
        </div>

        <div class="row form-group">
            <label for="rePassword"  class="col-sm-2 control-label">确认密码:</label>
                <input type="rePassword" id="rePassword" name="rePassword"   maxlength="50" value=""/>
        </div>

        <div class="row form-group">
            <label for="gender" class="col-sm-2 control-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性别:</label>
                <input type="radio" name="gender" id="gender" value="0"  class="minimal  {required:true} "  ${empty user || user.gender == 0 ? 'checked':''}/>男
                <input type="radio" name="gender" id="gender2" value="1"  class="minimal " ${user.gender == 1 ? 'checked':''}/>女
                <input type="radio" name="gender" id="gender3" value="2"  class="minimal "  ${empty user.gender || user.gender == 2 ? 'checked':''}/>保密
        </div>

        <div class="row form-group" >
            <label class="col-sm-2 control-label">手机号码:</label>
            <input name="mobile"  maxlength="50"  value="${user.mobile}"/>
        </div>

    <div class="row form-group">
       <label for="roleIds" class="col-sm-2 control-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;角色:</label>
        <sys:treeselect id="roleIds" name="roleIds" value="${selRoleIds}"
                          labelName="${selPermNames}" labelValue="${selRoleNames}"
                          title="角色列表"
         url="/admin/sys/role/ajax_roles_tree" checked="true" />
    </div>

        <div class="row form-group">
           <label  class="col-sm-2 control-label">是否可用:</label>
            <input type="radio"  class="minimal {required:true} " ${empty user.status || user.status == 0 ? 'checked':''}  name="status" id="status" value="0"   />启用
            <input type="radio"  class="minimal"  name="status" id="status1" value="1"   ${ user.status == 1 ? 'checked':''}  }/>禁用
    </div>
    <div class="form-group" style="text-align: center;">
    <shiro:hasPermission name="sys:user:save">
        <input id="btnSubmit" class="btn btn-primary"  type="submit"  value="保存" />&nbsp;
     </shiro:hasPermission>

   <input id="btnCancel" class="btn btn-cancle" type="reset" value="重置" />
    </form>
    </div>

    </body>
</html>
