<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ taglib prefix="sys" tagdir="/WEB-INF/tags" %>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>登陆页面</title>
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">

  <link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
  <link rel="stylesheet" href="${basePath}/statics/modules/sys/index/css/login.css">
  <!-- jQuery 2.2.0 -->
  <script src="${basePath}/statics/thirdparty/jquery/jquery.min.js"></script>
  <!--[if lt IE 9]>
  <script src="${basePath}/statics/thirdparty/html5shiv/html5shiv.min.js"></script>
  <script src="${basePath}/statics/thirdparty/respond/respond.min.js"></script>
  <![endif]-->
  <!-- Bootstrap 3.3.6 -->
  <script src="${basePath}/statics/thirdparty/bootstrap/js/bootstrap.min.js"></script>
  <!--app -->
  <script src="${basePath}/statics/commons/app/js/app.js"></script>
</head>
<body class="hold-transition login-page login_bg_water2">

<!-- 消息提示-->
<sys:message msgContent="${message}" msgType="error"></sys:message>
<div class="login-box" >
  <div class="login-logo" style="background: url(${basePath}/statics/modules/sys/index/img/login_logo.png) ;width:307px; height:38px; margin-bottom:25px;margin-left: 40px;">
  </div>
  <div class="login-box-body" style="width: 400px;border-radius: 6px;">

    <form class="form-horizontal" style="margin-top: 10px" action="${basePath}/admin/login" method="post" onsubmit="return submitB();">
      <div class="form-group">
        <label for="user" class="col-md-3 control-label">用户名:</label>
        <div class="col-md-9">
          <input type="text" class="form-control" id="user" name="username" value="${username}" placeholder="用户名" style="margin-left: -15px;border-radius: 4px;" onblur="checkUser()">
        </div>
        <div id="user_pass"></div>
      </div>
      <div class="form-group">
        <label for="pwd" class="col-md-3 control-label">密码:</label>
        <div class="col-md-9">
          <input type="password" class="form-control" id="pwd" name="password"  placeholder="密码" style="margin-left: -15px;border-radius: 4px;" onblur="checkPwd()">
        </div>
        <div id="pwd_pass"></div>
      </div>
      <div class="form-group">
        <label for="surePwd" class="col-md-3 control-label">验证码:</label>
        <div class="form-group col-md-9">
          <div class="col-md-7" style="float:left;">
            <input type="text" class="form-control" id="surePwd" name="captcha" placeholder="验证码" style="margin-left: -15px;border-radius: 4px;" onblur="checkCaptch()">
          </div>
          <div class="col-md-5" style="float:left;">
              <img src="${basePath}/captcha/Kaptcha"  onclick="javascript:this.src='${basePath}/captcha/Kaptcha?d='+new Date()*1"  title="点击重新获取验证码" width="80" height="34"  style="cursor: pointer;"/>
          </div>
        </div>
        <div id="surePwd_pass"></div>
      </div>
      <div class="row">
        <div style="display: inline;float: right">
          <button type="submit" class="btn btn-primary " style="margin-right: 10px">登录</button>
          <button type="reset"  class="btn btn-default" style="margin-right: 30px">重置</button>
        </div>
      </div>
    </form>
  </div>
</div>

<!-- login -->
<script type="text/javascript" src="${basePath}/statics/modules/sys/index/js/login.js"></script>

</body>
</html>
