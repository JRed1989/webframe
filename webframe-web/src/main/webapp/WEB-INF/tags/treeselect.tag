<%@ tag language="java" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<%@ attribute name="id" type="java.lang.String" required="true" description="编号"%>
<%@ attribute name="name" type="java.lang.String" required="true" description="隐藏域名称（ID）"%>
<%@ attribute name="value" type="java.lang.String" required="true" description="隐藏域值（ID）"%>
<%@ attribute name="labelName" type="java.lang.String" required="true" description="输入框名称（Name）"%>
<%@ attribute name="labelValue" type="java.lang.String" required="true" description="输入框值（Name）"%>
<%@ attribute name="hideAttrName" type="java.lang.String" required="false" description="自定义隐藏属性的name名称"%>
<%@ attribute name="hideAttrValue" type="java.lang.String" required="false" description="自定义隐藏属性的值"%>
<%@ attribute name="title" type="java.lang.String" required="true" description="选择框标题"%>
<%@ attribute name="url" type="java.lang.String" required="true" description="树结构数据地址"%>
<%@ attribute name="checked" type="java.lang.Boolean" required="false" description="是否显示复选框，如果不需要返回父节点，请设置notAllowSelectParent为true"%>
<%@ attribute name="selectMulti" type="java.lang.Boolean" required="false" description="是否允许多选"%>
<%@ attribute name="extId" type="java.lang.String" required="false" description="排除掉的编号（不能选择的编号）"%>
<%@ attribute name="notAllowSelectRoot" type="java.lang.Boolean" required="false" description="不允许选择根节点"%>
<%@ attribute name="notAllowSelectParent" type="java.lang.Boolean" required="false" description="不允许选择父节点"%>
<%@ attribute name="allowClear" type="java.lang.Boolean" required="false" description="是否允许清除"%>
<%@ attribute name="allowInput" type="java.lang.Boolean" required="false" description="文本框可填写"%>
<%@ attribute name="cssClass" type="java.lang.String" required="false" description="css样式"%>
<%@ attribute name="cssStyle" type="java.lang.String" required="false" description="css样式"%>
<%@ attribute name="smallBtn" type="java.lang.Boolean" required="false" description="缩小按钮显示"%>
<%@ attribute name="hideBtn" type="java.lang.Boolean" required="false" description="是否显示按钮"%>
<%@ attribute name="disabled" type="java.lang.String" required="false" description="是否限制选择，如果限制，设置为disabled"%>
<%@ attribute name="dialogWidth" type="java.lang.Integer" required="false" description="弹出层宽度"%>
<%@ attribute name="dialogHeight" type="java.lang.Integer" required="false" description="弹出层高度"%>
<%@ attribute name="dataMsgRequired" type="java.lang.String" required="false" description=""%>

	<input id="${id}Id" name="${name}" class="${cssClass}" type="hidden" value="${value}"/>
	<input id="${id}Name" name="${labelName}" ${allowInput?'':'readonly="readonly"'} type="text" value="${labelValue}" data-msg-required="${dataMsgRequired}"
		class="${cssClass}" style="${cssStyle}"/>
    <input id="${hideAttrName}" name="${hideAttrName}" type="hidden" value="${hideAttrValue}"/>

<script type="text/javascript">
	$("#${id}Button, #${id}Name").click(function(){
		// 是否限制选择，如果限制，设置为disabled
		if ($("#${id}Button").hasClass("disabled")){
			return true;
		}
		var width = ${empty dialogWidth ? 320 : dialogWidth};
		var height = ${empty dialogHeight ? 440: dialogHeight};
		var selectIds = $("#${id}Id").val();
		top.layer.open({
			id:"treeLayer",
			type: 2,
			title: '选择${title}',
			shadeClose: true,
			shade: 0.8,
			area: [width+'px',height+'px'],
			content: '${basePath}/admin/sys/tags/tree_data?url='+encodeURIComponent("${url}")+'&checked=${checked}&extId=${extId}&selectIds='+selectIds ,//iframe的url
			btn: ['确定', '取消'	//<c:if test="${allowClear}">
					              ,'清除'
				                 //</c:if>
			],
			yes: function(index, layero){
				var tree = top.$("#treeLayer").find("iframe")[0].contentWindow.treeObj;
				var ids = [], names = [], nodes = [],attrs = [];
				if ("${checked}" == "true"){
					nodes = tree.getCheckedNodes(true);
				}else{
					nodes = tree.getSelectedNodes();
				}
				for(var i=0; i<nodes.length; i++) {//<c:if test="${checked && notAllowSelectParent}">
					if (nodes[i].isParent){
						continue; // 如果为复选框选择，则过滤掉父节点
					}//</c:if><c:if test="${notAllowSelectRoot}">
					if (nodes[i].level == 0){
						return false;
					}//</c:if><c:if test="${notAllowSelectParent}">
					if (nodes[i].isParent){
						return false;
					}//</c:if>
					ids.push(nodes[i].id);
					names.push(nodes[i].name);
					if("attr" in nodes[i]){
						attrs.push(nodes[i].attr);
					}
					//<c:if test="${!checked}">
					break; // 如果为非复选框选择，则返回第一个选择  </c:if>
				}
				$("#${id}Id").val(ids.join(",").replace(/u_/ig,""));
				$("#${id}Name").val(names.join(","));
				if(attrs.length>0 && "${hideAttrName}" != ""){
					$("#${hideAttrName}").val(attrs.join(","));
				}
				top.layer.close(index);

		   },btn2: function(index, layero){
				top.layer.close(index);
		   }
		//<c:if test="${allowClear}">
		   ,btn3 : function(index) {
						$("#${id}Id").val("");
						$("#${id}Name").val("");
						if("${hideAttrName}" != ""){
							$("#${hideAttrName}").val("");
						}
				       top.layer.close(index);
			}
		//</c:if>
			,
			cancel:function(index){
				top.layer.close(index);
			},
			end:function(index){
				top.layer.close(index);

			}
		});


	});
</script>