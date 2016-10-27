<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ attribute name="msgContent" type="java.lang.String" required="true" description="消息内容" %>
<%@ attribute name="msgType"  type="java.lang.String" description="消息类型:info、success、warning、error"  %>
<c:if test="${not empty msgContent}">
       <c:if test="${not empty msgType}">
           <c:set var="type" value="${msgType}" />
       </c:if>
      <c:if test="${empty msgType}">
        <c:set var="type" value="info" />
      </c:if>
    <div id="messageBox" class="alert alert-${type}" style="display: none;">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
             ${msgContent}
    </div>
    <script type="text/javascript">
        $("#messageBox").show();
        //3秒后,消息提示消失
        setTimeout('$("#messageBox").remove();',3000);
    </script>
</c:if>