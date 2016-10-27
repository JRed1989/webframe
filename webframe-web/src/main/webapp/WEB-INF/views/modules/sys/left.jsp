<%--
  Created by IntelliJ IDEA.
  User: snow
  Date: 2016/6/14
  Time: 11:38
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!-- left menu begin-->
<aside class="main-sidebar">
  <!-- sidebar: style can be found in sidebar.less -->
  <section class="sidebar">

    <!-- Sidebar Menu -->
    <ul class="sidebar-menu">
      <li class="header">菜单导航</li>
      <%--最多遍历到4级菜单--%>
     <c:forEach  items="${menuList}" var="menu" varStatus="index">
        <c:if test="${menu.parentId == 0}" >
          <li class="treeview">
            <%--一级菜单--%>
            <a href="#">
              <i class="fa ${empty menu.menuIcon ? 'fa-share' : menu.menuIcon}"></i> <span>${menu.menuName}</span>
              <i class="fa fa-angle-left pull-right"></i>
            </a>
              <ul class="treeview-menu">
               <%--二级菜单--%>
              <c:forEach items="${menuList}" var="subMenu1" >
                 <c:if test="${subMenu1.parentId == menu.id}" >
                    <c:if test="${empty subMenu1.href}">
                      <li>
                        <a href="#"><i class="fa ${empty subMenu1.menuIcon ? 'fa-location-arrow': subMenu1.menuIcon}"></i> ${subMenu1.menuName} <i class="fa fa-angle-left pull-right"></i></a>
                        <ul class="treeview-menu">
                        <c:forEach items="${menuList}" var="subMenu2" >
                          <c:if test="${subMenu2.parentId == subMenu1.id }">

                              <c:if test="${empty subMenu2.href}" >
                                <li>
                                   <%-- 三级菜单--%>
                                  <a href="#"><i class="fa ${empty subMenu2.menuIcon ? 'fa-location-arrow':subMenu2.menuIcon}"></i>${subMenu2.menuName}<i class="fa fa-angle-left pull-right"></i></a>
                                   <%--四级菜单--%>
                                     <ul class="treeview-menu">
                                     <c:forEach items="${menuList}" var="subMenu3" >
                                             <c:if test="${subMenu3.parentId == subMenu2.id}">
                                                 <li><a href="javascript:addTab('${subMenu3.menuName}','${basePath}/${subMenu3.href}');"><i class="fa ${empty subMenu3.menuIcon ? 'fa-location-arrow':subMenu3.menuIcon}"></i>${subMenu3.menuName}</a></li>
                                             </c:if>
                                     </c:forEach>
                                     </ul>
                                </li>
                              </c:if>
                            <c:if test="${not empty subMenu2.href}" >
                              <li><a href="javascript:addTab('${subMenu2.menuName}','${basePath}/${subMenu2.href}');"><i class="fa ${empty subMenu2.menuIcon ? 'fa-location-arrow': subMenu2.menuIcon}"></i>${subMenu2.menuName}</a></li>
                            </c:if>
                          </c:if>
                        </c:forEach>
                        </ul>
                      </li>
                   </c:if>
                    <c:if test="${not empty subMenu1.href}">
                      <li><a href="javascript:addTab('${subMenu1.menuName}','${basePath}/${subMenu1.href}');"><i class="fa ${empty subMenu1.menuIcon ? 'fa-location-arrow' : subMenu1.menuIcon}"></i> ${subMenu1.menuName}</a></li>
                    </c:if>
                 </c:if>
              </c:forEach>
            </ul>
          </li>
        </c:if>
     </c:forEach>
    </ul>
  </section>
  <!-- /.sidebar -->
</aside>
<!-- left menu end-->