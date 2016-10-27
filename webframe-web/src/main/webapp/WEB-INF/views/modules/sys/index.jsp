<%--
  Created by IntelliJ IDEA.
  User: snow
  Date: 2016/6/14
  Time: 11:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>流式处理平台首页</title>
  <%@ include file="/WEB-INF/views/commons/common.jsp"%>
  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
  <!-- Bootstrap-->
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/bootstrap/css/bootstrap.min.css">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="${basePath}/statics/thirdparty/ionicons/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="${basePath}/statics/commons/app/css/app.css">
  <link rel="stylesheet" href="${basePath}/statics/commons/app/css/skins/_all-skins.css">

  <!-- 加载jquery -->
  <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery/jquery.min.js"></script>
  <!-- 加载jquery-easyui -->
  <link rel="stylesheet" type="text/css" href="${basePath}/statics/thirdparty/jquery-easyui/themes/metro/easyui.css"/>
  <link rel="stylesheet" type="text/css" href="${basePath}/statics/thirdparty/jquery-easyui/themes/icon.css"/>

  <!-- 加载自定义样式 user-->
  <link rel="stylesheet"  type="text/css" href="${basePath}/statics/modules/sys/user/css/user_quickmenu.css" />

  <script type="text/javascript" src="${basePath}/statics/thirdparty/jquery-easyui/jquery.easyui.min.js"></script>
  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="${basePath}/statics/thirdparty/html5shiv/html5shiv.min.js"></script>
  <script src="${basePath}/statics/thirdparty/respond/respond.min.js"></script>
  <![endif]-->

  <!-- Bootstrap js-->
  <script src="${basePath}/statics/thirdparty/bootstrap/js/bootstrap.min.js"></script>
  <!--app -->
  <script src="${basePath}/statics/commons/app/js/app.js"></script>

  <!-- layer-->
  <script src="${basePath}/statics/thirdparty/layer/layer.js"  type="text/javascript"></script>
  <script src="${basePath}/statics/commons/js/common.js"></script>

   <!--nicescroll -->
  <script src="${basePath}/statics/thirdparty/nicescroll/jquery.nicescroll.min.js"  type="text/javascript"></script>

  <!-- 加载自定义js index-->
  <script src="${basePath}/statics/modules/sys/index/js/index.js" type="text/javascript"></script>


</head>
<body class="hold-transition skin-black-light sidebar-mini">
<div class="wrapper">

    <!-- 头部部分-->
    <jsp:include page="header.jsp" />

    <!-- 左侧菜单部分-->
    <jsp:include page="left.jsp"/>

    <!-- 内容部分-->

    <!-- Content Wrapper. Contains page content -->
   <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="main easyui-tabs" id="tabs"  data-options="tools:'#tab-tools'">
      <div title="首页">
        <div class="tabs-panels"  >
          <section class="content">
            <%--快捷入口 >>--%>
              <div class="row" id="hideid">
                <c:forEach items="${sysList}" var="sys"  varStatus="status">
                  <div class="col-md-2 col-sm-6 col-xs-12">
                    <div class="info-box">

                      <c:if test="${status.index == 0}">
                        <span class="info-box-icon bg-aqua" style="width:110%;" >
                          <i class="fa fa-folder-open"></i>
                          <a  style="font-size:14px;color:lightyellow" href="javascript:addTab('${sys.menuName}','${basePath}/${sys.href}')">
                              ${sys.menuName}
                              <%--<i class="fa fa-fast-forward"></i>--%>
                          </a>
                          <div class="hideimg1">
                            <a class="action1" href="#"   onclick="delUserQuickMenu(${sys.id});">
                              <img style="margin-top:-290px;margin-left:155px" src="${basePath}/statics/modules/sys/user/img/del_show.png"   style="cursor: pointer" />
                            </a>
                          </div>
                          </span>
                      </c:if>

                      <c:if test="${status.index == 1}">
                        <span class="info-box-icon bg-red" style="width:110%;" >
                          <i class="fa fa-cubes"></i>
                          <a style="font-size:14px;color:lightyellow" href="javascript:addTab('${sys.menuName}','${basePath}/${sys.href}')">
                              ${sys.menuName}
                            <%--<i class="fa fa-fast-forward"></i>--%>
                          </a>

                          <div class="hideimg2">
                            <a class="action2" href="#"   onclick="delUserQuickMenu(${sys.id});">
                              <img style="margin-top:-290px;margin-left:155px" src="${basePath}/statics/modules/sys/user/img/del_show.png"   style="cursor: pointer" />
                            </a>
                          </div>
                           </span>
                      </c:if>

                      <c:if test="${status.index == 2}">
                        <span class="info-box-icon bg-green" style="width:110%;" >
                          <i class="fa fa-skyatlas"></i>
                          <a style="font-size:14px;color:lightyellow" href="javascript:addTab('${sys.menuName}','${basePath}/${sys.href}')">
                              ${sys.menuName}
                            <%--<i class="fa fa-fast-forward"></i>--%>
                          </a>

                          <div class="hideimg3">
                           <a class="action3" href="#"   onclick="delUserQuickMenu(${sys.id});">
                             <img style="margin-top:-290px;margin-left:155px" src="${basePath}/statics/modules/sys/user/img/del_show.png"   style="cursor: pointer" />
                           </a>
                         </div>

                        </span>
                      </c:if>

                      <c:if test="${status.index == 3}">
                        <span class="info-box-icon bg-yellow" style="width:110%;" >
                          <i class="fa fa-area-chart"></i>
                          <a style="font-size:14px;color:lightyellow" href="javascript:addTab('${sys.menuName}','${basePath}/${sys.href}')">
                              ${sys.menuName}
                            <%--<i class="fa fa-fast-forward"></i>--%>
                          </a>

                         <div class="hideimg4">
                           <a class="action4" href="#"   onclick="delUserQuickMenu(${sys.id});">
                             <img style="margin-top:-290px;margin-left:155px" src="${basePath}/statics/modules/sys/user/img/del_show.png"   style="cursor: pointer" />
                           </a>
                         </div>

                        </span>
                      </c:if>
                  </div>
                 </div>
                </c:forEach>

                 <div class="col-md-2 " >
                    <div class="info-box" >
                      <span class="info-box-icon bg-gray-light" style="width:100%;">
                        <i class="fa fa-user-plus"></i>
                        <a style="font-size:15px;" href="#" onclick="toEditUserQuickMenu();">快捷菜单设置</a>
                      </span>
                    </div>
                </div>
            </div>

            <%--<div class="row">--%>
              <%--<div class="col-md-2 col-sm-6 col-xs-12"><div class="info-box">--%>
                <%--<br/>--%>
              <%--</div>--%>
            <%--</div>--%>

              <div class="row">
                <div class="col-md-12">
                  <div class="box">
                    <div class="box-header with-border">
                      <h3 class="box-title">Monthly Recap Report</h3>

                      <div class="box-tools pull-right">
                        <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                        </button>
                        <div class="btn-group">
                          <button type="button" class="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                            <i class="fa fa-wrench"></i></button>
                          <ul class="dropdown-menu" role="menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li class="divider"></li>
                            <li><a href="#">Separated link</a></li>
                          </ul>
                        </div>
                        <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                      <div class="row">
                        <div class="col-md-8">
                          <p class="text-center">
                            <strong>Sales: 1 Jan, 2014 - 30 Jul, 2014</strong>
                          </p>

                          <div class="chart">
                            <!-- Sales Chart Canvas -->
                            <canvas id="salesChart" style="height: 180px; width: 703px;" width="703" height="180"></canvas>
                          </div>
                          <!-- /.chart-responsive -->
                        </div>
                        <!-- /.col -->
                        <div class="col-md-4">
                          <p class="text-center">
                            <strong>Goal Completion</strong>
                          </p>

                          <div class="progress-group">
                            <span class="progress-text">Add Products to Cart</span>
                            <span class="progress-number"><b>160</b>/200</span>

                            <div class="progress sm">
                              <div class="progress-bar progress-bar-aqua" style="width: 80%"></div>
                            </div>
                          </div>
                          <!-- /.progress-group -->
                          <div class="progress-group">
                            <span class="progress-text">Complete Purchase</span>
                            <span class="progress-number"><b>310</b>/400</span>

                            <div class="progress sm">
                              <div class="progress-bar progress-bar-red" style="width: 80%"></div>
                            </div>
                          </div>
                          <!-- /.progress-group -->
                          <div class="progress-group">
                            <span class="progress-text">Visit Premium Page</span>
                            <span class="progress-number"><b>480</b>/800</span>

                            <div class="progress sm">
                              <div class="progress-bar progress-bar-green" style="width: 80%"></div>
                            </div>
                          </div>
                          <!-- /.progress-group -->
                          <div class="progress-group">
                            <span class="progress-text">Send Inquiries</span>
                            <span class="progress-number"><b>250</b>/500</span>

                            <div class="progress sm">
                              <div class="progress-bar progress-bar-yellow" style="width: 80%"></div>
                            </div>
                          </div>
                          <!-- /.progress-group -->
                        </div>
                        <!-- /.col -->
                      </div>
                      <!-- /.row -->
                    </div>
                    <!-- ./box-body -->
                    <div class="box-footer">
                      <div class="row">
                        <div class="col-sm-3 col-xs-6">
                          <div class="description-block border-right">
                            <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> 17%</span>
                            <h5 class="description-header">$35,210.43</h5>
                            <span class="description-text">TOTAL REVENUE</span>
                          </div>
                          <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-3 col-xs-6">
                          <div class="description-block border-right">
                            <span class="description-percentage text-yellow"><i class="fa fa-caret-left"></i> 0%</span>
                            <h5 class="description-header">$10,390.90</h5>
                            <span class="description-text">TOTAL COST</span>
                          </div>
                          <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-3 col-xs-6">
                          <div class="description-block border-right">
                            <span class="description-percentage text-green"><i class="fa fa-caret-up"></i> 20%</span>
                            <h5 class="description-header">$24,813.53</h5>
                            <span class="description-text">TOTAL PROFIT</span>
                          </div>
                          <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-3 col-xs-6">
                          <div class="description-block">
                            <span class="description-percentage text-red"><i class="fa fa-caret-down"></i> 18%</span>
                            <h5 class="description-header">1200</h5>
                            <span class="description-text">GOAL COMPLETIONS</span>
                          </div>
                          <!-- /.description-block -->
                        </div>
                      </div>
                      <!-- /.row -->
                    </div>
                    <!-- /.box-footer -->
                  </div>
                  <!-- /.box -->
                </div>
                <!-- /.col -->
              </div>
            </section>
          <!-- /.content -->

        </div>
        <!-- /.content-wrapper -->
      </div>
    </div>
  </div>
    <!-- 底部部分-->
    <jsp:include page="footer.jsp"/>


  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Create the tabs -->
    <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
      <li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
      <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content">
      <!-- Home tab content -->
      <div class="tab-pane active" id="control-sidebar-home-tab">
        <h3 class="control-sidebar-heading">Recent Activity</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript::;">
              <i class="menu-icon fa fa-birthday-cake bg-red"></i>

              <div class="menu-info">
                <h4 class="control-sidebar-subheading">Langdon's Birthday</h4>

                <p>Will be 23 on April 24th</p>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->

        <h3 class="control-sidebar-heading">Tasks Progress</h3>
        <ul class="control-sidebar-menu">
          <li>
            <a href="javascript::;">
              <h4 class="control-sidebar-subheading">Out
                Custom Template Design
                <span class="label label-danger pull-right">70%</span>
              </h4>

              <div class="progress progress-xxs">
                <div class="progress-bar progress-bar-danger" style="width: 70%"></div>
              </div>
            </a>
          </li>
        </ul>
        <!-- /.control-sidebar-menu -->

      </div>
      <!-- /.tab-pane -->
      <!-- Stats tab content -->
      <div class="tab-pane" id="control-sidebar-stats-tab">Stats Tab Content</div>
      <!-- /.tab-pane -->
      <!-- Settings tab content -->
      <div class="tab-pane" id="control-sidebar-settings-tab">
        <form method="post">
          <h3 class="control-sidebar-heading">General Settings</h3>

          <div class="form-group">
            <label class="control-sidebar-subheading">
              Report panel usage
              <input type="checkbox" class="pull-right" checked>
            </label>

            <p>
              Some information about this general settings option
            </p>
          </div>
          <!-- /.form-group -->
        </form>
      </div>
      <!-- /.tab-pane -->
    </div>
  </aside>
  <!-- /.control-sidebar -->
  <!-- Add the sidebar's background. This div must be placed
       immediately after the control sidebar -->
  <div class="control-sidebar-bg"></div>
</div>
<!-- ./wrapper -->

<!-- tab页签右键菜单-->
<div id="tabsMenu" class="easyui-menu" style="width:120px;">
  <div name="close">关闭</div>
  <div name="all">关闭所有</div>
</div>

</body>

</html>
