<%
  String _path = request.getContextPath();
  String _nosheme_basePath = request.getServerName()+":"+request.getServerPort()+_path;
  String _basePath = request.getScheme()+"://"+_nosheme_basePath;
%>
<script>
  var PATH = {
  VERSION : "1.0",
  CXTPATH: "<%=_path%>",
  BASEPATH : "<%=_basePath%>",
  NOSCHEME_BASEPATH : "<%=_nosheme_basePath%>",
  SESSIONID: "<%=request.getSession().getId()%>"
  };
</script>
