<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>

<html>
    <head>
        <title>用户快捷菜单添加页面</title>
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

        <!-- layer-->
        <%--<script src="${basePath}/statics/thirdparty/layer/layer.js"  type="text/javascript"></script>--%>
        <script type="text/javascript" src="${basePath}/statics/commons/js/common.js"></script>

        <script type="text/javascript" src="${basePath}/statics/modules/sys/user/js/user_quickmenu_edit.js"></script>
    </head>
    <body>
    <sys:message msgContent="${message}"/>
    <div class="col-md-6 box-body">
        <form id="quickMenuForm" action=""  method=""   class="form-horizontal">
            <%--<input type="hidden" id="editType" name="editType" value="${editType}"/>--%>
            <input type="hidden" id="ids" name="ids" value="${ids}"/>
            <%--<input type="hidden" id="old_menuIds" name="old_menuIds" value="${menuIds}"/>--%>
            <input type="hidden" id="userId" name="userId" value="${userId}"/>

            <div class="col-sm-3">
                <label for="menuIds" class="col-sm-2 control-label">可选菜单</label>
                <sys:treeselect id="menuIds" name="menuIds" value="${menuIds}" labelName="${menuNames}"
                                labelValue="${menuNames}" title="菜单"
                                url="/admin/sys/user/ajax_userquickmenu_tree"
                                checked="true" notAllowSelectParent="true" allowClear="true" />
            </div>

            <div class="form-group" style="text-align: center;">
            <shiro:hasPermission name="sys:userquick:save">
                <input id="btnSubmit" class="btn btn-primary"  type="button"  onclick="return submitEditQuickMenu();"  value="保存" />&nbsp;
            </shiro:hasPermission>
                <input id="btnCancel" class="btn btn-cancle" type="reset" value="重置" />
            </div>
        </form>
    </div>
    </body>
</html>
