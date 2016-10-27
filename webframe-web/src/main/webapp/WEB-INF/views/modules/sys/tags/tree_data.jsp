<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<html>
<head>
  <title>数据选择</title>
  <meta http-equiv="X-UA-Compatible" content="IE=8,IE=9,IE=10" />
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

  <link rel="stylesheet"
        href="${basePath}/statics/thirdparty/jquery-ztree/css/metroStyle/metroStyle.css"
        type="text/css" />
  <script type="text/javascript"
          src="${basePath}/statics/thirdparty/jquery-ztree/js/jquery.ztree.all.min.js"></script>
  <script type="text/javascript"
          src="${basePath}/statics/thirdparty/jquery-ztree/js/jquery.ztree.exhide.min.js"></script>
  <script type="text/javascript">
    var key, lastValue = "", nodeList = [], type = parent.parent.parent.getQueryString("type",
            "${url}");
    var treeObj, setting = {
      view : {
        selectedMulti : "${selectMulti}",
        dblClickExpand : false
      },
      check : {
        enable : "${checked}",
        nocheckInherit : true
      },
      data : {
        simpleData : {
          enable : true
        }
      },
      callback : {
        onClick : function(event, treeId, treeNode) {
          treeObj.expandNode(treeNode);
        }
      }
    };

    $(document)
            .ready(
            function() {
              $.get(
                      "${basePath}${url}${fn:indexOf(url,'?')==-1?'?':'&'}&extId=${extId}&checkedIds=${checkedIds}&t="
                      + new Date().getTime(),
                      function(zNodes) {
                        zNodes = eval("(" + zNodes + ")");
                        // 初始化树结构
                        treeObj = $.fn.zTree.init($("#tree"),
                                setting, zNodes);
                        selectCheckNode();
                      });
              key = $("#key");
              key.bind("focus", focusKey).bind("blur", blurKey).bind(
                      "change cut input propertychange", searchNode);
              key.bind('keydown', function(e) {
                if (e.which == 13) {
                  searchNode();
                }
              });
              setTimeout("search();", "300");
            });

    // 默认选择节点
    function selectCheckNode() {
      var ids = "${selectIds}".split(",");
      for (var i = 0; i < ids.length; i++) {
        if(ids[i] == "0")continue;
        var node = treeObj.getNodeByParam("id", (type == 3 ? "u_" : "")
                + ids[i]);
        if ("${checked}" == "true") {
          try {
            treeObj.checkNode(node, true, true);
          } catch (e) {
          }
          treeObj.selectNode(node, false);
        } else {
          treeObj.selectNode(node, true);
        }
      }
    }
    function focusKey(e) {
      if (key.hasClass("empty")) {
        key.removeClass("empty");
      }
    }
    function blurKey(e) {
      if (key.get(0).value === "") {
        key.addClass("empty");
      }
      searchNode(e);
    }

    //搜索节点
    function searchNode() {
      // 取得输入的关键字的值
      var value = $.trim(key.get(0).value);

      // 按名字查询
      var keyType = "name";
      // 如果和上次一次，就退出不查了。
      if (lastValue === value) {
        return;
      }

      // 保存最后一次
      lastValue = value;

      var nodes = treeObj.getNodes();
      // 如果要查空字串，就退出不查了。
      if (value == "") {
        showAllNode(nodes);
        return;
      }
      hideAllNode(nodes);
      nodeList = treeObj.getNodesByParamFuzzy(keyType, value);
      updateNodes(nodeList);
    }

    //隐藏所有节点
    function hideAllNode(nodes) {
      nodes = treeObj.transformToArray(nodes);
      for (var i = nodes.length - 1; i >= 0; i--) {
        treeObj.hideNode(nodes[i]);
      }
    }

    //显示所有节点
    function showAllNode(nodes) {
      nodes = treeObj.transformToArray(nodes);
      for (var i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].getParentNode() != null) {
          treeObj.expandNode(nodes[i], false, false, false, false);
        } else {
          treeObj.expandNode(nodes[i], true, true, false, false);
        }
        treeObj.showNode(nodes[i]);
        showAllNode(nodes[i].children);
      }
    }

    //更新节点状态
    function updateNodes(nodeList) {
      treeObj.showNodes(nodeList);
      for (var i = 0, l = nodeList.length; i < l; i++) {

        //展开当前节点的父节点
        treeObj.showNode(nodeList[i].getParentNode());
        //tree.expandNode(nodeList[i].getParentNode(), true, false, false);
        //显示展开符合条件节点的父节点
        while (nodeList[i].getParentNode() != null) {
          treeObj
                  .expandNode(nodeList[i].getParentNode(), true, false,
                  false);
          nodeList[i] = nodeList[i].getParentNode();
          treeObj.showNode(nodeList[i].getParentNode());
        }
        //显示根节点
        treeObj.showNode(nodeList[i].getParentNode());
        //展开根节点
        treeObj.expandNode(nodeList[i].getParentNode(), true, false, false);
      }
    }

    // 开始搜索
    function search() {
      $("#search").slideToggle(200);
      $("#txt").toggle();
      $("#key").focus();
    }
  </script>
</head>
<body>
<div onclick="search();" style="cursor: pointer;">
  <i class="fa fa-search" style="margin-left: 5px;"></i><label id="txt" style="display: none;">搜索</label>
</div>
<div id="search" class="form-search"
     style="padding: 10px 0 0 13px;">
  <label for="key" class="control-label" style="padding: 5px 5px 3px 0;">关键字：</label>
  <input type="text" class="empty" id="key" name="key" maxlength="50"
         style="width: 110px;">
  <button class="btn btn-primary" id="btn" onclick="searchNode()">搜索</button>
</div>
<div id="tree" class="ztree" style="padding: 15px 20px;"></div>
</body>