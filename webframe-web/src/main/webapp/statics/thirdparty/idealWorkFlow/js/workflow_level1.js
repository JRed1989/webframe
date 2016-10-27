/**
 * Created by xushanshan on 16/3/9.
 */
(function ($, window) {

    //拖拽插件定义
    /*
     * xmlContent xml内容
     * rootPath 项目路径
     * isContainFrameFlag 插件是否包含边框
     * workDivName 要将整体画布拖拽加载在哪个位置 div的id
     *
     * */
    //jQuery.fn.workflow = function (xmlContent, rootPath,isContainFrameFlag,workDivName,initPluginString) {
    jQuery.fn.workflow = function (xmlContent, settings) {
        //别名
        var _self = this;
        //键盘码
        var keyboardCode = {
            ALT: 18,
            BACKSPACE: 8,
            COMMA: 188,
            CTRL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            SHIFT: 16,
            TAB: 9,
            UP: 38
        };

        // 默认参数
        var config = {
            //网页宽度
            //canvas 宽度
            canvasWidth: 800,
            //canvas 高度
            canvasHeight: 600,
            //图标宽度
            nodeWidth: 40,
            //图标高度
            nodeHeight: 40,
            //连线线宽
            hopWidth: 1,
            //连线箭头高度
            arrowHeight: 18,
            //连线箭头宽度
            arrowWidth: 6,
            //圆形按钮半径
            radius: 5,
            menuHeight: 100,
            //左侧菜单宽度
            leftBoxWidth: 200,
            //画布总宽度
            mainWidth: 1200,
            //右侧画布宽度
            rightWorkWidth: 1000,
            //属性框宽度
            propertyDivWidth: 800,

            //控件是否包含边框
            nodeBorder: "no",
            //默认加载插件
            initPluginString: "",
            //是否显示左侧工具栏
            leftBoxDisplay: "no",
            lineChangeCircle: "ok",
            lineDeleteCircle: "ok",
            nodeDeleteCircle: "ok",
            nodeDeleteMenuEnable: "ok",
            nodeConnectMenuEnable: "ok",
            nodeOnDblClick: "showTable()"
        };
        //  alert(config.rightWorkDiv)
        //全局参数
        var globalParam = {
            xmlContent: null,
            canvas: null,
            canvasDiv: null,
            canvasContext: null,
            mouseDragNode: null,
            copyNode: null,
            clickSelectNode: null,
            mouseClickX: null,
            mouseClickY: null,
            onDrawLine: false,
            propertyTable: null,
            copyCount: null,
            publicParam: new Object(),
            workflowDivId: "workflowDiv",
            imageRootPath: "",
            titleButton: null
        };


        // 初始化函数
        var _init = function () {
            //只初始化一次
            if (settings != null) {
                config.arrowHeight = settings.arrowHeight || 15;
                config.arrowWidth = settings.arrowWidth || 6;
                config.canvasHeight = settings.canvasHeight || 500;
                config.canvasWidth = settings.canvasWidth || 800;
                config.nodeWidth = settings.nodeWidth || 40;
                config.nodeHeight = settings.nodeHeight || 40;
                config.hopWidth = settings.hopWidth || 1;
                config.radius = settings.radius || 5;
                config.menuHeight = settings.menuHeight || 100;
                config.mainWidth = settings.mainWidth || 1200;


                config.leftBoxDisplay = settings.leftBoxDisplay || "no";
                if (settings.leftBoxDisplay == "ok") {
                    config.leftBoxWidth = settings.leftBoxWidth || 200;
                } else {
                    config.leftBoxWidth = -5;
                }
                config.rightWorkWidth = settings.mainWidth - config.leftBoxWidth || 1000;
                config.nodeBorder = settings.nodeBorder || "no";
                //alert(config.nodeBorder);
                config.initPluginString = settings.initPluginString || "";
                config.lineChangeCircle = settings.lineChangeCircle || "ok";
                config.lineDeleteCircle = settings.lineDeleteCircle || "ok";
                config.nodeDeleteCircle = settings.nodeDeleteCircle || "ok";
                config.nodeOnDblClick = settings.nodeOnDblClick || "showTable()";
                globalParam.titleButton = settings.titleButton;

                config.nodeDeleteMenuEnable = settings.nodeDeleteMenuEnable || "ok";
                config.nodeConnectMenuEnable = settings.nodeConnectMenuEnable || "ok";

            }
            if (globalParam.xmlContent == null) {
                _initData();
                // 事件绑定
                _loadEvent();
                // 加载内容
                _loadContent();

                canvasContentDraw();
            } else {
                alert("workflow has been initialized, never initialize again");
            }
        }

        // 初始化数据
        var _initData = function () {
            if (xmlContent == null) {
                xmlContent = parseStringToXmlDocument('<?xml version="1.0" encoding="utf-8"?><flow><files></files><nodes></nodes><hops></hops></flow>');
            } else if (Object.prototype.toString.call(xmlContent) === "[object String]") {
                if (xmlContent.length > 0) {
                    xmlContent = parseStringToXmlDocument(xmlContent);
                } else {
                    xmlContent = parseStringToXmlDocument('<?xml version="1.0" encoding="utf-8"?><flow><files></files><nodes></nodes><hops></hops></flow>');
                }

            }
            globalParam.xmlContent = xmlContent;

            // 生成拖拽框
            // 生成拖拽框
            // alert($("#workDiv"));
            var mainDiv = $('<div></div>');
            mainDiv.attr("style", "width: " + config.mainWidth + "px; height: " + config.canvasHeight + "px; background-color: white; border: 1px solid #C0C0C0; margin: 0 auto; position: relative; padding: 0;z-index:9;");
            var mainTitle = $('<p>作业设计</p>');
            mainTitle.attr("style", "background-color: white; width: 100%; height: 36px; color: black; position: absolute; top: 0px; line-height: 35px; text-indent: 1em; font-weight: bold; font-size: 14px; margin: 0; padding: 0;");
            var leftBox = $('<div></div>');
            leftBox.attr("style", "width: " + config.leftBoxWidth + "px; background: white; position: absolute; top: 0px; bottom: 0px; left: 0px; margin: 0; padding: 0;");
            var leftBoxTitle = $('<p>选择组件</p>');
            leftBoxTitle.attr("style", "background-color: white; width: 100%; height: 30px; color: black; position: absolute; top: 0px; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; margin: 0; padding: 0;");
            var chooseBox = $('<div></div>');
            chooseBox.attr("style", "margin-top: 30px; border:1px solid #c3c3c3;");
            var rightBox = $('<div onselectstart="return false;"></div>');
            rightBox.attr("style", "width: " + config.rightWorkWidth + "px; position: absolute; top: 0px; left: " + (config.leftBoxWidth + 5) + "px; bottom: 0px; margin: 0; padding: 0;");
            var workflowDiv = $('<div tabindex="0" onselectstart="return false;"></div>');
            workflowDiv.attr("style", "width: 100%; height:" + config.canvasHeight + "px; background-color: white; margin: 0; padding: 0; z-index:10;");
            //var workflowTitle = $('<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="100%" style="text-align: left">' +
            //'<a style="font-size: 12px;font-weight: 100;"id="toolDelete">删除节点</a>' +
            //'<a style="font-size: 12px;font-weight: 100;margin-left: 10px;" id="toolCopy">复制</a>' +
            //'<a style="font-size: 12px;font-weight: 100;margin-left: 10px;"id="toolConnectHop">连线</a>' +
            //'<a style="font-size: 12px;font-weight: 100;margin-left: 10px;"id="clearCanvasContent">清除画板</a></td>' +
            //'</tr></table> ');

            var workflowTitle = $('<div></div>');

            for (var index = 0; index < globalParam.titleButton.length; index++) {
                var button = globalParam.titleButton[index];
                var buttonHTML = $(button['html']);
                var buttonClick = button['click'];
                $(buttonHTML).click(buttonClick);
                workflowTitle.append(buttonHTML);
            }
            workflowTitle.attr("style", "background-color:white; width: 100%; height: 30px; color: black; position: absolute; top: 0px; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; margin: 0; padding: 0;");

            var canvas = $('<canvas onselectstart="return false;" style="-moz-user-select:none;">您的浏览器不支持canvas，请升级浏览器</canvas>').attr("style", "margin-top: 31px;");

            var propertyDiv = $('<div id="propertyDiv"></div>');
            propertyDiv.attr("style", "width: " + config.propertyDivWidth + "px; bottom: 0px;display:none; background: white; position: absolute; top: 678px;left:-200px; margin: 0; padding: 0;overflow: hidden;z-index:3000;filter:alpha(opacity=20);opacity: 0.8; -moz-border-radius: 5px; -webkit-border-radius: 5px;");
            var propertyTitle = $('<p>属性</p>');
            propertyTitle.attr("style", "background-color: rgb(237, 249, 251); width: 100%; height: 30px; color: black; position: absolute; top: 0px; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; margin: 0; padding: 0; z-index:3000");
            //propertyTitle.attr("style", "background-color: rgb(237, 249, 251); width: 100%; height: 30px; color: black; position: absolute; top: 0px; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; margin: 0; padding: 0;");

            var tableDiv = $('<div></div>');
            tableDiv.attr("style", "width: 100%; background: white; overflow: auto; position: absolute; top: 30px; bottom: 0px; margin: 0; padding: 0;z-index:3000; ");
            var table = $('<table border="1" cellspacing="0" bordercolor="#000000" id="propertyDivTable"></table>');
            table.attr("style", "border-collapse:collapse; width: 100%; font-size: 14px; position: absolute; top: 0px;z-index:3000");

            var titleTr = $('<thead><tr><td style="text-align: center; width: 150px;">属性名</td><td style="text-align: center;">属性值</td><td style="text-align: center; width: 150px;">属性说明</td></tr></thead><tbody style="font-size: 12px;"></tbody>');

            table.append(titleTr);

            var rightClickMenuDiv = $('<div id="rightClickMenuDiv" class="rightClickMenuDiv"   style="position:absolute; display:none; background-color:white; height:100px; width:140px; overflow-x: hidden; ' +
                'overflow-y:hidden;border:1px solid #919999; z-index: 20;filter:alpha(opacity=20);opacity: 0.8; ' +
                '-moz-border-radius: 5px; -webkit-border-radius: 5px;  ">' +
                '<ul style="list-style:none; margin-left:0px;margin-top: 4px; padding-left:0px;padding-top:0px;" id="menuListLi">' +
                '</ul></div>');
            var dragNodeDiv = $('<div id="dragNodeDiv" style="position:absolute; display:none; background-color:white; height:42px; width:42px; overflow-x: hidden; ' +
                'overflow-y:hidden;border:1px solid #919999; z-index: 20;filter:alpha(opacity=50);opacity: 0.5; ' +
                '-moz-border-radius: 5px; -webkit-border-radius: 5px;  "></div>');
            var shadeDiv = $('<div id="shade" style="display:none;position:absolute;background:#bcbcbc; filter:alpha(opacity=50);-moz-opacity:0.5;opacity:0.5;z-index:900;"></div>');
            //属性框
            tableDiv.append(table);
            propertyDiv.append(propertyTitle);
            propertyDiv.append(tableDiv);
            //拖拽中显示的节点
            workflowDiv.append(dragNodeDiv);

            //拖拽框
            workflowDiv.append(rightClickMenuDiv);

            workflowDiv.append(workflowTitle);
            workflowDiv.append(canvas);

            //右边框
            rightBox.append(workflowDiv);
            rightBox.append(propertyDiv);
            rightBox.append(shadeDiv);

            //左边框
            leftBox.append(leftBoxTitle);
            leftBox.append(chooseBox);

            //大框
            //mainDiv.append(mainTitle);
            if (config.leftBoxDisplay == "ok") {
                mainDiv.append(leftBox);
            }
            mainDiv.append(rightBox);
            //mainDiv.append(hideMenuBox);

            $(_self).append(mainDiv);
            canvas.attr("width", workflowDiv.width() - 2);
            canvas.attr("height", workflowDiv.height() - 30);
            config.canvasWidth = workflowDiv.width() - 2;
            config.canvasHeight = workflowDiv.height() - 30;
            chooseBox.width(leftBox.width() - 1);
            chooseBox.height(leftBox.height() - 30);

            //加载插件
            for (var index = 0; index < plugins.length; index++) {
                var plugin = plugins[index];
                var image = plugin['image'];
                var type = plugin['type'];
                var name = plugin['name'];
                if (config.initPluginString.indexOf(type) > -1) {
                    //  plugin['properties']['lable'];
                    var pluginNode = $('<img src="' + image + '" draggable="true" width="' + config.nodeWidth + '" height="' + config.nodeHeight + '"  style="border:1px solid #c3c3c3;vertical-align: middle; margin-top:8px;margin-left:3px;margin-right:3px;" id="' + type + '"><label style="font-size: 12px; font-weight: 700;width: 50px; display:inline-block;">' + plugin['properties'].label + '&nbsp;</label>');
                    pluginNode[0].ondragstart = function (ev) {
                        dragStart(ev);
                    };
                    chooseBox.append(pluginNode);
                }
            }

            canvas[0].ondragover = function (ev) {
                canvasDragOver(ev);
            };

            canvas[0].ondrop = function (ev) {
                canvasDrop(ev);
            }

            $(workflowDiv).keydown(function (ev) {
                if (ev && ev.keyCode == keyboardCode.SHIFT) { // 按 SHIFT
                    globalParam.onDrawLine = true;
                    $(globalParam.canvasDiv).css("cursor", "pointer");
                    //css('cursor', 'default');
                }
                //快捷键复制
                if (ev.ctrlKey && ev.keyCode == 67) {
                    if (globalParam.clickSelectNode != null) {
                        menuCopyNote(globalParam.clickSelectNode);
                    }
                }//快捷键粘贴
                if (ev.ctrlKey && ev.keyCode == 86) {
                    menuPasteNote(globalParam.mouseClickX, globalParam.mouseClickY);
                }
            });
            $(workflowDiv).keyup(function (ev) {
                if (ev && ev.keyCode == keyboardCode.SHIFT) { // 松开 SHIFT
                    globalParam.onDrawLine = false;
                }

                if (ev.keyCode == keyboardCode.DELETE || (ev.ctrlKey && ev.keyCode == keyboardCode.BACKSPACE)) {
                    var selectedNode = getSelectedNode();
                    var name = $(selectedNode).children("name").text();
                    //删除一个节点以及这个节点上的连线
                    deleteNode(name);
                    deleteNodeHops(name);
                    canvasContentDraw();
                }

            });
            //$(workflowDiv).ondblclick(function (ev){
            //    alert("dsfdsf");
            //});

            globalParam.propertyTable = table;
            globalParam.canvas = canvas;
            globalParam.canvasDiv = workflowDiv;
            globalParam.canvasContext = globalParam.canvas[0].getContext("2d");
            $(workflowDiv).bind("contextmenu", function (e) {
                return false;
            });
            $(workflowDiv).bind("dblclick", canvasOndblClick);
            $("#dragNodeDiv").bind("mouseup", canvasOnMouseUp);
            $("#toolDelete").click(function () {
                menuDeleteNote();
            });
            $("#toolCopy").click(function () {
                menuCopyNote();
            });
            $("#toolConnectHop").click(function () {
                connectHop();
            });
            $("#shade").click(function () {
                $("#shade").hide();
                $("#propertyDiv").hide();

            });
            $("#clearCanvasContent").click(function () {
                clearCanvasContent();
            });
            //兼容不同屏幕大小
            var wh = getXMLWidthHeight();
            var xmlWidth = wh.width;
            var xmlHeight = wh.height;
            if (xmlWidth != null && xmlHeight != null) {
                var widthRate = config.canvasWidth / xmlWidth;
                var heightRate = config.canvasHeight / xmlHeight;
                updateNodesXY(widthRate, heightRate);
            }
            setXMLWidthHeight(config.canvasWidth, config.canvasHeight);
        };

        // 绑定事件
        var _loadEvent = function () {
            // ondbclick
            // $(globalParam.canvas).ondblclick(canvasOndbClick)
            $(globalParam.canvas).mousedown(canvasOnMouseDown);
            $(globalParam.canvas).mouseup(canvasOnMouseUp);
            $(globalParam.canvas).mousemove(canvasMouseMove);
            $(globalParam.canvas).contextmenu(function (ev) {
                //允许拖放
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    event.returnValue = false;
                }
            });
            $("#dragNodeDiv").bind("mouseup", canvasOnMouseUp);
        };

        var _loadContent = function () {

        };
        var canvasOndblClick = function (ev) {
            if (globalParam.clickSelectNode != null) {
                eval(config.nodeOnDblClick);
            }
        }

        //获取xml文件中的画板长和宽
        var getXMLWidthHeight = function () {
            var width = $(globalParam.xmlContent).find("flow").attr("width");
            var height = $(globalParam.xmlContent).find("flow").attr("height");
            return {
                width: width,
                height: height
            }
        }

        //写入xml文件中的画板长和宽
        var setXMLWidthHeight = function (width, height) {
            var width = $(globalParam.xmlContent).find("flow").attr("width", width);
            var height = $(globalParam.xmlContent).find("flow").attr("height", height);
        }

        //更新所有节点的坐标
        var updateNodesXY = function (widthRate, heightRate) {
            $(globalParam.xmlContent).find("node").each(function (index, ele) {
                var x = $(ele).attr("x");
                var y = $(ele).attr("y");
                $(ele).attr("x", x * widthRate - 10);
                $(ele).attr("y", y * heightRate);
            });
        }

        var canvasOnMouseDown = function (ev) {
            //在画布其他位置左击右击时隐藏菜单
            $(globalParam.canvasDiv).css("cursor", 'default');
            $('#rightClickMenuDiv').hide();
            var mousePosition = getMousePosition(ev);
            var evx = mousePosition.x;
            var evy = mousePosition.y;
            globalParam.clickSelectNode = getClickNode(evx, evy);
            globalParam.mouseClickX = mousePosition.x;
            globalParam.mouseClickY = mousePosition.y;
            if (ev.button == 0) {
                //点击了左键
                if (globalParam.onDrawLine == true) {
                    $("#propertyDiv").hide();
                    var startNode = getSelectedNode();
                    var endNode = getClickNode(evx, evy);
                    //判断是否是有效的连线
                    if (startNode != null && endNode != null && startNode != endNode) {
                        var startNodeName = $(startNode).children("name").text();
                        var endNodeName = $(endNode).children("name").text();
                        var hasLine = hasHop(startNode, endNode);
                        if (hasLine == false) {
                            var hop = $('<hop></hop>');
                            $(hop).append($('<type>connect</type>'));
                            $(hop).append($('<from>' + startNodeName + '</from>'));
                            $(hop).append($('<to>' + endNodeName + '</to>'));
                            $(hop).append($('<enabled>Y</enabled>'));
                            $(hop).append($('<evaluation>Y</evaluation>'));
                            $(hop).append($('<unconditional>N</unconditional>'));
                            $(hop).append($('<properties>' +
                                '<label readonly="false" type="text" >成功</label>' +
                                '</properties>'));
                            addHop(hop);
                        } else {
                            alert("连线已存在");
                        }
                    }
                    globalParam.onDrawLine = false;
                    clearAllSelectedNode();
                    $(endNode).attr("selected", "true");
                    canvasContentDraw();

                } else {

                    //不是连线动作
                    var selectedNode = getClickNode(evx, evy);
                    if (selectedNode != null) {
                        //显示属性框
                        //点击的是节点
                        var selected = $(selectedNode).attr("selected");
                        var name = $(selectedNode).children("name").text();
                        if (selected == "true") {
                            //判断鼠标是否在删除按钮上
                            var isDelete = checkClickNodeDelete(name, evx, evy);
                            if (isDelete == true) {
                                //删除一个节点以及这个节点上的连线
                                deleteNode(name);
                                deleteNodeHops(name);
                                canvasContentDraw();
                            } else {
                                //重新点击了一个选中的节点
                                //清除所有选中的节点
                                clearAllSelectedNode();
                                //设置这个节点为新的被选中的节点
                                $(selectedNode).attr("selected", "true");
                                //canvasContentDraw();
                                //可能是拖拽
                                globalParam.mouseDragNode = selectedNode;

                                // 计算x轴y轴偏移量为拖拽准备
                                var nodeX = parseInt($(globalParam.mouseDragNode).attr("x"));
                                var nodeY = parseInt($(globalParam.mouseDragNode).attr("y"));
                                var px = evx - nodeX; // x轴偏移量
                                var py = evy - nodeY; // y轴偏移量
                                globalParam.publicParam.px = px;
                                globalParam.publicParam.py = py;
                            }
                        } else {
                            //点击的是一个未选中的节点
                            //清除所有选中的节点
                            var mousePosition = getMousePosition(ev);
                            var evx = mousePosition.x;
                            var evy = mousePosition.y;
                            clearAllSelectedNode();
                            //设置这个节点为新的被选中的节点
                            $(selectedNode).attr("selected", "true");
                            //canvasContentDraw();
                            //可能是拖拽
                            globalParam.mouseDragNode = selectedNode;

                            // 计算x轴y轴偏移量为拖拽准备
                            var nodeX = parseInt($(globalParam.mouseDragNode).attr("x"));
                            var nodeY = parseInt($(globalParam.mouseDragNode).attr("y"));
                            var mousePosition = getMousePosition(ev);
                            var evx = mousePosition.x;
                            var evy = mousePosition.y;

                            var px = evx - nodeX; // x轴偏移量
                            var py = evy - nodeY; // y轴偏移量
                            globalParam.publicParam.px = px;
                            globalParam.publicParam.py = py;

                        }

                    } else {
                        //点击的是线
                        $("#propertyDiv").hide();
                        var isDeleteHop = checkClickHopDelete(evx, evy);
                        if (isDeleteHop == false) {
                            var isChangeHop = checkClickHopChange(evx, evy);
                            if (isChangeHop == false) {
                                //点击的是空白区域
                                //清除所有选中的节点
                                //取消拖拽
                                globalParam.mouseDragNode = null;
                                var result = clearAllSelectedNode();
                                if (result != 0) {
                                    canvasContentDraw();
                                }

                            } else {
                                //改变了一条线的状态
                                canvasContentDraw();
                            }
                        } else {
                            //删除了一条线
                            canvasContentDraw();
                        }
                    }
                }

            } else if (ev.button == 1) {
                // 点击了滑轮
            } else if (ev.button == 2) {
                //右击菜单，当鼠标右击时就出现菜单
                /*
                 var selectedNode = getClickNode(evx, evy);
                 var divWidth = $("#rightClickMenuDiv").width();
                 //判断是否是在节点上，在节点上右击会显示全菜单
                 if (selectedNode == null) {
                 //判断是否处于复制状态，处于复制状态时右击只显示粘贴
                 if (globalParam.copyNode != null) {
                 //生成菜单样式
                 $("#rightClickMenuDiv").css("margin-left", evx + "px");
                 $("#rightClickMenuDiv").css("margin-top", evy + "px");
                 var liString =
                 '<li id="pasteLi" style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">粘贴</li>';
                 $("#menuListLi").html("");
                 $("#menuListLi").append(liString);
                 $("#rightClickMenuDiv").css("height", "30px");
                 if (divWidth > (config.canvasWidth - evx)) {
                 if ((config.canvasWidth - evx) >= config.nodeWidth / 2) {
                 $("#rightClickMenuDiv").css("margin-left", evx - divWidth + "px");
                 } else {
                 $("#rightClickMenuDiv").css("margin-left", evx - divWidth - config.nodeWidth / 2 + "px");
                 }
                 }
                 //绑定事件
                 $("#pasteLi").click(function () {
                 menuPasteNote(evx, evy);
                 });
                 $('#rightClickMenuDiv').show();
                 }
                 } else {
                 var selected = $(selectedNode).attr("selected");
                 //点击的是一个未选中的节点
                 //清除所有选中的节点
                 clearAllSelectedNode();
                 //设置这个节点为新的被选中的节点
                 $(selectedNode).attr("selected", "true");
                 canvasContentDraw();
                 var mousePosition = getMousePosition(ev);
                 var evx = mousePosition.x;
                 var evy = mousePosition.y;
                 $("#rightClickMenuDiv").css("margin-left", evx + 2 + "px");
                 $("#rightClickMenuDiv").css("margin-top", evy + 20 + "px");
                 var liString =
                 '<li id="deleteLi" style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">删除节点</li>' +
                 '<li id="copyLi" style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">复制</li>' +
                 '<li id="connectHop" style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">连线</li>' +
                 '<li id="viewLog" style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px;padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;" onclick="viewLog()">查看日志</li>'
                 $("#menuListLi").html("");
                 $("#menuListLi").append(liString);
                 if (divWidth > (config.canvasWidth - evx)) {
                 if ((config.canvasWidth - evx) >= config.nodeWidth / 2) {
                 $("#rightClickMenuDiv").css("margin-left", evx - divWidth + "px");
                 } else {
                 $("#rightClickMenuDiv").css("margin-left", evx - divWidth - config.nodeWidth / 2 + "px");
                 }

                 }

                 if (config.menuHeight > (config.canvasHeight - evy)) {
                 if ((config.canvasHeight - evy) >= config.nodeHeight / 2) {
                 $("#rightClickMenuDiv").css("margin-top", evy - config.menuHeight + config.nodeWidth + "px");
                 } else {
                 $("#rightClickMenuDiv").css("margin-top", evy - config.menuHeight + config.nodeWidth / 2 + "px");
                 }

                 }
                 $("#rightClickMenuDiv").css("height", config.menuHeight + "px");
                 $("#deleteLi").click(function () {
                 menuDeleteNote();
                 });
                 $("#copyLi").click(function () {
                 menuCopyNote();
                 });
                 $("#connectHop").click(function () {
                 connectHop();
                 });

                 $('#rightClickMenuDiv').show();

                 }*/
            }
            /*
             $('#menuListLi li').hover(function () {
             $('#menuListLi li').css("background-color", "");
             $(this).css('background-color', '#0084dd');
             $(this).css('cursor', 'default');
             });
             */
        };

        var canvasOnMouseUp = function (ev) {
            //  alert("songkai");
            //如果选中的是节点 属性框显示这个节点的属性
            //  alert(globalParam.mouseDragNode);
            if (ev.button == 0) {
                //点击了左键
                if (globalParam.mouseDragNode != null) {
                    //alert("12")
                    $("#dragNodeDiv").hide();
                    var mousePosition = getMousePosition(ev);
                    var evx = mousePosition.x;
                    var evy = mousePosition.y;

                    //实现图片粘在鼠标上的效果
                    var px = globalParam.publicParam.px; // x轴偏移量
                    var py = globalParam.publicParam.py; // y轴偏移量

                    var nodeX1 = evx - px;
                    var nodeY1 = evy - py;

                    //不允许图标超出画图框
                    nodeX1 = (nodeX1 > 0) ? nodeX1 : 0;
                    nodeY1 = (nodeY1 > 0) ? nodeY1 : 0;
                    nodeX1 = (nodeX1 < (config.canvasWidth - config.nodeWidth)) ? nodeX1 : (config.canvasWidth - config.nodeWidth);
                    nodeY1 = (nodeY1 < (config.canvasHeight - config.nodeHeight)) ? nodeY1 : (config.canvasHeight - config.nodeHeight);

                    $(globalParam.mouseDragNode).attr("x", nodeX1);
                    $(globalParam.mouseDragNode).attr("y", nodeY1);
                    //alert("luodix"+px+"y"+py);
                    // if(globalParam.mouseDragNode != globalParam.clickSelectNode){
                    canvasContentDraw();
                    //  }
                }
                globalParam.mouseDragNode = null;
                //加载节点属性
                var selectedNode = getSelectedNode();
                globalParam.clickSelectNode = selectedNode;
                if (selectedNode == null) {
                } else {
                    // showTable();
                }
            } else if (ev.button == 1) {
                // 点击了滑轮
            } else if (ev.button == 2) {
                //点击了右键

                var mousePosition = getMousePosition(ev);
                var evx = mousePosition.x;
                var evy = mousePosition.y;
                var selectedNode = getClickNode(evx, evy);
                if (selectedNode != null) { //节点右击事件

                    //移除上一个右键菜单
                    $(globalParam.canvasDiv).find("#rightClickMenuDiv").remove();
                    //生成这个节点的右键菜单
                    var menus = $('<div id="rightClickMenuDiv" style="position:absolute; background-color:white; width:140px; overflow-x: hidden; ' +
                        'overflow-y:hidden;border:1px solid #919999; z-index: 20;filter:alpha(opacity=20);opacity: 0.8; -moz-border-radius: 5px; -webkit-border-radius: 5px;  ">' +
                        '<ul style="list-style:none; margin-left:0px;margin-top: 0px; margin-bottom: 5px; padding-left:0px;padding-top:0px;" id="menuListUl"></ul></div>');
                    //右键菜单坐标
                    $(menus).css("margin-left", evx + 2 + "px");
                    $(menus).css("margin-top", evy - config.canvasHeight + "px");

                    var menuUl = $(menus).find("#menuListUl");
                    //加载默认的右键菜单
                    if (config.nodeDeleteMenuEnable == "ok") {
                        var deleteNodeMenu = $('<li style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">删除节点</li>');
                        $(deleteNodeMenu).click(function () {
                            $(globalParam.canvasDiv).find("#rightClickMenuDiv").remove();
                            var name = $(selectedNode).children("name").text();
                            deleteNode(name);
                            deleteNodeHops(name);
                            canvasContentDraw();
                        });
                        $(deleteNodeMenu).hover(function () {
                            $(this).css('background-color', '#0084dd');
                        }, function () {
                            $(this).css("background-color", "");
                        });
                        menuUl.append(deleteNodeMenu);
                    }


                    //var copyNodeMenu = $('<li style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">复制节点</li>');
                    //$(copyNodeMenu).click(function () {
                    //    $(globalParam.canvasDiv).find("#rightClickMenuDiv").remove();
                    //    alert("复制节点")
                    //});
                    //$(copyNodeMenu).hover(function () {
                    //    $(this).css('background-color', '#0084dd');
                    //}, function () {
                    //    $(this).css("background-color", "");
                    //});
                    //menuUl.append(copyNodeMenu);

                    if (config.nodeConnectMenuEnable == "ok") {
                        var connectHopMenu = $('<li style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">连线</li>');
                        $(connectHopMenu).click(function () {
                            $(globalParam.canvasDiv).find("#rightClickMenuDiv").remove();
                            //--------开始连线
                            globalParam.onDrawLine = true;
                            clearAllSelectedNode();
                            $(globalParam.canvasDiv).css("cursor", "pointer");
                            $(selectedNode).attr("selected", "true");
                        });
                        $(connectHopMenu).hover(function () {
                            $(this).css('background-color', '#0084dd');
                        }, function () {
                            $(this).css("background-color", "");
                        });
                        menuUl.append(connectHopMenu);
                    }

                    //加载节点特有菜单
                    $(selectedNode).find('nemu').each(function (index, ele) {
                        var menuName = $(ele).children("name").text();
                        var clickFunction = $(ele).children("click").text();
                        var menu = $('<li style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">' + menuName + '</li>');
                        $(menu).click(function () {
                            $(globalParam.canvasDiv).find("#rightClickMenuDiv").remove();
                            var name = $(selectedNode).children("name").text();
                            eval(clickFunction)(name);
                        });

                        $(menu).hover(function () {
                            $(this).css('background-color', '#0084dd');
                        }, function () {
                            $(this).css("background-color", "");
                        });
                        menuUl.append(menu);
                    });

                    if (menuUl.find("li").length > 0) {
                        $(globalParam.canvasDiv).append(menus);
                    }

                }


            }
        };
        var showTable = function () {
            $(globalParam.propertyTable).find("tbody").html("");
            var selectedNode = globalParam.clickSelectNode;
            var properties = $(selectedNode).find("properties").children();
            for (var index = 0; index < properties.length; index++) {
                var ele = properties[index];
                var tagName = ele.tagName;
                var type = $(ele).attr("type");
                var name = $(ele).attr("title");
                var value = $(ele).text().trim();
                var description = $(ele).attr("description");
                //alert("dangji"+tagName);
                if ("file" == type) {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%; font-size:12px; color:blue;"  id="' + tagName + '">' + value.replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    //alert("danjin"+$(selectedNode).find(tagName).text());
                    $(inputBox).click(function () {
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                        //chooseFile($(selectedNode).find("type").text(), $(selectedNode).find(tagName).text().replace("<![CDATA[", "").replace("]]>", ""));
                        //chooseRelationFiles($(selectedNode).find(tagName).text().replace("<![CDATA[", "").replace("]]>", ""));
                        chooseFile();
                        //$(this).val(value);
                        //chooseStartFile(tagName,$(selectedNode).find(tagName).text());//弹出选文件的框子

                    });
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                } else if ("scriptcontent" == type) {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%; font-size:12px; color:blue;"  id="' + tagName + '">' + value.replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    //alert("danjin"+$(selectedNode).find(tagName).text());
                    $(inputBox).click(function () {
                        //alert("tanchu neitong"+$(selectedNode).find(tagName).text());
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                        //chooseFile($(selectedNode).find("type").text(), $(selectedNode).find(tagName).text());
                        //chooseStartFile($(selectedNode).find(tagName).text());
                        chooseFile();
                        //$(this).val(value);
                        //chooseStartFile(tagName,$(selectedNode).find(tagName).text());//弹出选文件的框子
                    });
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                } else if ("files" == type) {
                } else if ("selectText" == type) {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><select id="' + tagName + '"><option  value="1">1小时</option><option  value="2">2小时</option><option  value="3">3小时</option><option  value="4">4小时</option><option  value="5">5小时</option><option  value="6">6小时</option></select></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                    if ($(selectedNode).find(tagName).text() == "") {
                        $("#" + tagName).val(1);
                    } else {
                        $("#" + tagName).val($(selectedNode).find(tagName).text());
                    }
                    $("#" + tagName).change(function () {
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($("#" + tagName).val());
                    });
                } else if ("text" == type) {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    $(inputBox).keyup(function () {
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($(this).val());
                        canvasContentDraw();
                    });
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                } else if ("password" == type) {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" type="password" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    $(inputBox).keyup(function () {
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($(this).val());
                    });
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                } else if (type == "normalText") {
                    var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                    var inputBox = $(oneProperty).find("#" + tagName);
                    $(inputBox).keyup(function () {
                        var tagName = $(this).attr("id");
                        $(selectedNode).find(tagName).text($(this).val());
                    });
                    $(globalParam.propertyTable).find("tbody").append(oneProperty);
                }

            }
            $("#propertyDiv").show();
            //alert($("#propertyDivTable").height());
            //alert($("#propertyDiv").offset().top);
            //$("#propertyDiv").css("top", evx - divWidth + "px");
            //alert($("#propertyDivTable").height());
            //alert(678-$("#propertyDivTable").height());
            var width;
            var height;
            width = document.body.clientWidth;
            height = document.body.clientHeight;
            $("#shade").css({width: width, height: height, left: -config.leftBoxWidth, top: 0}).show();
            $("#propertyDiv").css("height", $("#propertyDivTable").height() + 33 + "px");
            $("#propertyDiv").css("top", config.canvasHeight / 2 - $("#propertyDivTable").height() / 2 + "px");
            $("#propertyDiv").css("left", config.rightWorkWidth / 2 - $("#propertyDivTable").width() / 2 + "px");
            $("#propertyDiv").show();
        };
        var canvasMouseMove = function (ev) {
            if (globalParam.mouseDragNode != null) {
                //拖动节点
                var mousePosition = getMousePosition(ev);
                var evx = mousePosition.x;
                var evy = mousePosition.y;

                //实现图片粘在鼠标上的效果
                var px = globalParam.publicParam.px; // x轴偏移量
                var py = globalParam.publicParam.py; // y轴偏移量

                var nodeX1 = evx - px;
                var nodeY1 = evy - py + 36;

                //不允许图标超出画图框
                nodeX1 = (nodeX1 > 0) ? nodeX1 : 0;
                nodeY1 = (nodeY1 > 0) ? nodeY1 : 0;
                nodeX1 = (nodeX1 < (config.canvasWidth - config.nodeWidth)) ? nodeX1 : (config.canvasWidth - config.nodeWidth);
                nodeY1 = (nodeY1 < (config.canvasHeight - config.nodeHeight / 2)) ? nodeY1 : (config.canvasHeight - config.nodeHeight / 2);
                var imageSrc = $(globalParam.mouseDragNode).attr("image");
                //alert($(globalParam.mouseDragNode).attr("image"))
                $("#dragNodeDiv").css("margin-top", nodeY1).css("margin-left", nodeX1).css("background-image", "url('" + imageSrc + "')").css("background-size", "cover").show();

            } else {
                //正常的移动鼠标非拖拽
                //鼠标悬停变色？
                var mousePosition = getMousePosition(ev);
                var evx = mousePosition.x;
                var evy = mousePosition.y;
                var node = getClickNode(evx, evy);
                _self.onmousemove($(node).children("name").text(), evx, evy, config.canvasWidth, config.canvasHeight);

            }
        };
        var canvasDragOver = function (ev) {
            //允许拖放

            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                event.returnValue = false;
            }


        };

        var canvasDrop = function (ev) {
            //允许拖放
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                event.returnValue = false;
            }

            var type = globalParam.publicParam.type;
            var position = getMousePosition(ev);

            var evx = position.x;
            var evy = position.y;
            //不允许图标超出画图框
            evx = (evx > (config.nodeWidth / 2)) ? evx : config.nodeWidth / 2;
            evy = (evy > (config.nodeHeight / 2)) ? evy : config.nodeHeight / 2;
            evx = (evx < (config.canvasWidth - config.nodeWidth / 2)) ? evx : (config.canvasWidth - config.nodeWidth / 2);
            evy = (evy < (config.canvasHeight - config.nodeHeight / 2)) ? evy : (config.canvasHeight - config.nodeHeight / 2);

            //清除其他节点选中状态
            clearAllSelectedNode();
            for (var index = 0; index < plugins.length; index++) {
                var n = plugins[index];
                var nType = n['type'];
                if (type == nType) {
                    var nodeString = n.getXmlContent();
                    var node = $(nodeString).attr("x", (evx - config.nodeWidth / 2)).attr("y", (evy - config.nodeHeight / 2));
                    addNode(node);
                    canvasContentDraw();
                }
            }
        };

        var dragStart = function (ev) {
            if (ev.target) {
                globalParam.publicParam.type = ev.target.id;
                globalParam.publicParam.image = ev.target.src;
            } else {
                globalParam.publicParam.type = event.srcElement.id;
                globalParam.publicParam.image = event.srcElement.src;
            }
            console.log("globalParam.publicParam.type=" + globalParam.publicParam.type);
            console.log("globalParam.publicParam.image=" + globalParam.publicParam.image);
        };

        var getMousePosition = function (evt) {
            var rect = globalParam.canvas[0].getBoundingClientRect();
            return {
                x: evt.clientX - rect.left * (globalParam.canvas[0].width / rect.width),
                y: evt.clientY - rect.top * (globalParam.canvas[0].height / rect.height)
            }
        }

        //获取选中的节点
        var getSelectedNode = function () {
            var n = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var selected = $(node).attr("selected");
                if (selected == "true") {
                    n = node;
                    return false;
                }
            });
            return n;
        };

        //判断坐标位于哪个节点内
        var getClickNode = function (clientX, clientY) {
            var clickNode = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var x = parseInt($(node).attr("x"));
                var y = parseInt($(node).attr("y"));
                var label = $(node).children("properties").children("label").text();
                if ($(node).attr("layout") == "flow") {
                    var wordArray = [];
                    var textMaxWidth = globalParam.canvasContext.measureText(label).width;
                    var words = $(node).children("keyword").children("word");
                    words.each(function (index, word) {
                        var wordContent = $(word).text();
                        var wordWidth = globalParam.canvasContext.measureText(wordContent).width;
                        wordArray[index] = wordContent;
                        if (wordWidth > textMaxWidth) {
                            textMaxWidth = wordWidth;
                        }
                    });
                    //画流式节点


                    //节点边框
                    var imageWidth = 30;
                    var imageHeight = 30;
                    var rectWidth = 3 + imageWidth + 3 + textMaxWidth + 10;
                    var rectHeight = 15 + 15 * wordArray.length + 5;

                    if (imageHeight + 10 > rectHeight) {
                        rectHeight = imageHeight + 10;
                    }

                    if (clientX > x && clientX < x + rectWidth && clientY > y && clientY < y + rectHeight) {
                        clickNode = node;
                        return false;
                    }
                } else {
                    if (clientX > x && clientX < (x + config.nodeWidth) && clientY > y && clientY < (y + config.nodeHeight)) {
                        clickNode = node;
                        return false;
                    }
                }

            });
            return clickNode;
        };

        var checkClickNodeDelete = function (nodeName, clientX, clientY) {
            var clickNodeDelete = false;
            if (config.nodeDeleteCircle == "ok") {
                $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                    var x = parseInt($(node).attr("x"));
                    var y = parseInt($(node).attr("y"));
                    var name = $(node).children("name").text();
                    if (name == nodeName) {
                        //判断鼠标是否在删除按钮上
                        if (clientX > (x + config.nodeWidth - config.radius * 2) && clientX < (x + config.nodeWidth) && clientY > y && clientY < (y + config.radius * 2)) {
                            clickNodeDelete = true;
                        }
                    }
                });
            }

            return clickNodeDelete;
        }

        var checkClickHopDelete = function (clientX, clientY) {
            var result = false;
            if (config.lineDeleteCircle == "ok") {
                $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {     //查找所有nodes节点并遍历
                    var startNodeName = $(hop).children("from").text();
                    var endNodeName = $(hop).children("to").text();
                    var enabled = $(hop).children("enabled").text();
                    var evaluation = $(hop).children("evaluation").text();
                    var unconditional = $(hop).children("unconditional").text();

                    var startNode = getNode(startNodeName);
                    var startNodeX = parseInt($(startNode).attr("x"));
                    var startNodeY = parseInt($(startNode).attr("y"));
                    var startX = startNodeX + config.nodeWidth / 2;
                    var startY = startNodeY + config.nodeHeight / 2;

                var endNode = getNode(endNodeName);
                var endNodeX = parseInt($(endNode).attr("x"));
                var endNodeY = parseInt($(endNode).attr("y"));
                var endX = endNodeX + config.nodeWidth / 2;
                var endY = endNodeY + config.nodeHeight / 2;

                    //判断点击的位置
                    var middleX = (startX + endX) / 2;
                    var middleY = (startY + endY) / 2;
                    //删除按钮边框
                    var deleteArcX = middleX + config.radius;
                    var deleteArcY = middleY + config.radius;

                    if (clientX > (deleteArcX - config.radius) && clientX < (deleteArcX + config.radius) && clientY > (deleteArcY - config.radius) && clientY < (deleteArcY + config.radius)) {
                        //点中的是删除按钮
                        $(hop).detach();
                        result = true;
                        return false;
                    }
                });
            }
            return result;
        }

        var checkClickHopChange = function (clientX, clientY) {
            var result = false;
            if (config.lineChangeCircle == "ok") {
                $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {     //查找所有nodes节点并遍历
                    var startNodeName = $(hop).children("from").text();
                    var endNodeName = $(hop).children("to").text();
                    var enabled = $(hop).children("enabled").text();
                    var evaluation = $(hop).children("evaluation").text();
                    var unconditional = $(hop).children("unconditional").text();

                    var startNode = getNode(startNodeName);
                    var startNodeX = parseInt($(startNode).attr("x"));
                    var startNodeY = parseInt($(startNode).attr("y"));
                    var startX = startNodeX + parseInt(config.nodeWidth) / 2;
                    var startY = startNodeY + parseInt(config.nodeHeight) / 2;

                    var endNode = getNode(endNodeName);
                    var endNodeX = parseInt($(endNode).attr("x"));
                    var endNodeY = parseInt($(endNode).attr("y"));
                    var endX = endNodeX + parseInt(config.nodeWidth) / 2;
                    var endY = endNodeY + parseInt(config.nodeHeight) / 2;

                    //判断点击的位置
                    var middleX = (startX + endX) / 2;
                    var middleY = (startY + endY) / 2;
                    var conditionArcX = middleX - config.radius;
                    var conditionArcY = middleY - config.radius;

                    if (clientX > (conditionArcX - config.radius) && clientX < (conditionArcX + config.radius) && clientY > (conditionArcY - config.radius) && clientY < (conditionArcY + config.radius)) {
                        //点中的是条件按钮
                        if (enabled == "N") { //灰色
                            //变黑色
                            $(hop).children("enabled").text("Y");
                            $(hop).children("evaluation").text("Y");
                            $(hop).children("unconditional").text("Y");
                            $(hop).children("properties").children("label").text("不判断");
                        } else if (enabled == "Y" && unconditional == "Y") { //黑色
                            //变绿色
                            $(hop).children("enabled").text("Y");
                            $(hop).children("evaluation").text("Y");
                            $(hop).children("unconditional").text("N");
                            $(hop).children("properties").children("label").text("成功");
                        } else if (enabled == "Y" && unconditional == "N" && evaluation == "Y") { //绿色
                            //变红色
                            $(hop).children("enabled").text("Y");
                            $(hop).children("evaluation").text("N");
                            $(hop).children("unconditional").text("N");
                            $(hop).children("properties").children("label").text("失败");
                        } else if (enabled == "Y" && unconditional == "N" && evaluation == "N") { //红色
                            //变灰色
                            $(hop).children("enabled").text("N");
                            $(hop).children("evaluation").text("N");
                            $(hop).children("unconditional").text("N");
                            $(hop).children("properties").children("label").text("不执行");
                        }
                        result = true;
                        return false;
                    }
                });
            }
            return result;
        };
        //根据传进来的节点名字获取到节点
        var getNode = function (nodeName) {
            var n = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var name = $(node).children("name").text();
                if (name == nodeName) {
                    n = node;
                }
            });
            return n;
        }

        var hasHop = function (node1, node2) {
            var has = false;
            $(xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {     //查找所有nodes节点并遍历
                var startN = $(hop).children("from").text();
                var endN = $(hop).children("to").text();
                if ((node1 == startN && node2 == endN) || (node1 == endN && node2 == startN)) {
                    has = true;
                    return false;
                }
            });
            return has;
        }

        var clearAllSelectedNode = function () {
            var result = 0;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var selected = $(node).attr("selected");
                if (selected == "true") {
                    $(node).attr("selected", "false");
                    result++;
                }

            });
            return result;
        };

        var deleteNode = function (nodeName) {
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var name = $(node).children("name").text();
                if (name == nodeName) {
                    $(node).detach();
                    return;
                }
            });

        };

        var addNode = function (node) {
            if (window.ActiveXObject) {
                var newNodeString = node[0].outerHTML;
                var xmlContent = globalParam.xmlContent.xml;
                xmlContent = xmlContent.replace("</nodes>", newNodeString + "\r</nodes>");
                globalParam.xmlContent = parseStringToXmlDocument(xmlContent);

            } else {
                $(globalParam.xmlContent).find("nodes").append(node);
            }

        }

        var addHop = function (hop) {
            if (window.ActiveXObject) {
                var newHopString = hop[0].outerHTML;
                var xmlContent = globalParam.xmlContent.xml;
                xmlContent = xmlContent.replace("</hops>", newHopString + "\r</hops>");
                globalParam.xmlContent = parseStringToXmlDocument(xmlContent);

            } else {
                $(globalParam.xmlContent).find("hops").append(hop);
            }

        }

        var deleteNodeHops = function (nodeName) {
            $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {
                var startNode = $(hop).children("from").text();
                var endNode = $(hop).children("to").text();
                if (startNode == nodeName || endNode == nodeName) {
                    $(hop).detach();
                }
            });
        }
        var clearCanvasContent = function () {
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                $(node).detach();
            });
            $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {
                $(hop).detach();
            });
            canvasContentDraw();
        }

        var canvasContentDraw = function () {
            //清理画板
            if (globalParam.clickSelectNode == null) {
                $("#propertyDiv").hide();
            }
            globalParam.canvasContext.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
            //画图标
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {     //查找所有nodes节点并遍历
                var type = $(node).children("type").text();
                var name = $(node).children("name").text();
                var label = $(node).children("properties").children("label").text();
                var x = parseInt($(node).attr("x"));
                var y = parseInt($(node).attr("y"));
                var selected = $(node).attr("selected");
                var control = new Image();
                control.src = $(node).attr("image");
                control.onload = function () {
                    if ($(node).attr("layout") == "flow") {

                        //流式平台布局
                        //
                        //     |--------------------------------------------
                        //     |                                       X  |
                        //     |  |------|        1.                      |
                        //     |  | 图   |        2.                      |
                        //     |  | 片   |        3.                       |
                        //     |  |------|                                |
                        //     |                                          |
                        //     |--------------------------------------------

                        var wordArray = [];
                        var textMaxWidth = globalParam.canvasContext.measureText(label).width;
                        var words = $(node).children("keyword").children("word");
                        words.each(function (index, word) {
                            var wordContent = $(word).text();
                            var wordWidth = globalParam.canvasContext.measureText(wordContent).width;
                            wordArray[index] = wordContent;
                            if (wordWidth > textMaxWidth) {
                                textMaxWidth = wordWidth;
                            }
                        });
                        //画流式节点


                        //节点边框
                        var imageWidth = 30;
                        var imageHeight = 30;
                        var rectWidth = 3 + imageWidth + 3 + textMaxWidth + 10;
                        var rectHeight = 15 + 15 * wordArray.length + 5;

                        if (imageHeight + 10 > rectHeight) {
                            rectHeight = imageHeight + 10;
                        }

                        if (selected == "true") {
                            globalParam.canvasContext.strokeStyle = "white";
                        } else {
                            globalParam.canvasContext.strokeStyle = "white";
                        }

                        var background = $(node).attr("background");

                        globalParam.canvasContext.lineWidth = 1;
                        globalParam.canvasContext.strokeRect(x, y, rectWidth, rectHeight);
                        globalParam.canvasContext.fillStyle = background || "#F0F9FB";
                        //globalParam.canvasContext.globalAlpha=0.5;
                        globalParam.canvasContext.fillRect(x, y, rectWidth, rectHeight);

                        //节点图片
                        var imageX = x + 3;
                        var imageY = y + (rectHeight / 2) - (imageHeight / 2);
                        globalParam.canvasContext.drawImage(control, imageX, imageY, 30, 30);

                        //节点文字
                        var textX = x + 3 + imageWidth + 8;
                        globalParam.canvasContext.strokeText(label, textX, y + 15);
                        for (var index = 0; index < wordArray.length; index++) {
                            var word = wordArray[index];
                            globalParam.canvasContext.strokeText(word, textX, y + 15 + 15 * (index + 1));
                        }


                    } else {

                        //默认布局

                        globalParam.canvasContext.drawImage(control, x, y, config.nodeWidth, config.nodeHeight);
                        if (selected == "true") {
                            globalParam.canvasContext.strokeStyle = "blue";
                        } else {
                            globalParam.canvasContext.strokeStyle = "white";
                        }

                        globalParam.canvasContext.font="12px 宋体";
                        //画节点边框
                        if (config.nodeBorder == "ok") {
                            globalParam.canvasContext.lineWidth = 1;
                            globalParam.canvasContext.strokeRect(x, y, config.nodeWidth, config.nodeHeight);
                        }
                        //画节点名称
                        var textWidth = globalParam.canvasContext.measureText(label).width;
                        globalParam.canvasContext.strokeText(label, x + parseInt(config.nodeWidth) / 2 - (textWidth / 2), y + config.nodeHeight + 12);

                        //选中状态下可以删除
                        if (config.nodeDeleteCircle == "ok") {
                            if (selected == "true") {
                                //画删除按钮边框
                                var arcX = x + parseInt(config.nodeWidth) - parseInt(config.radius);
                                var arcY = y + parseInt(config.radius);
                                globalParam.canvasContext.beginPath();
                                globalParam.canvasContext.fillStyle = '#c3c3c3';
                                globalParam.canvasContext.arc(arcX, arcY, config.radius, 0, Math.PI * 2, true);
                                globalParam.canvasContext.closePath();
                                globalParam.canvasContext.fill();
                                //画删除按钮X
                                globalParam.canvasContext.beginPath();
                                globalParam.canvasContext.lineWidth = 1;
                                globalParam.canvasContext.strokeStyle = "brown";
                                globalParam.canvasContext.moveTo(arcX - config.radius * 0.5, arcY - config.radius * 0.5);
                                globalParam.canvasContext.lineTo(arcX + config.radius * 0.5, arcY + config.radius * 0.5);
                                globalParam.canvasContext.moveTo(arcX - config.radius * 0.5, arcY + config.radius * 0.5);
                                globalParam.canvasContext.lineTo(arcX + config.radius * 0.5, arcY - config.radius * 0.5);
                                globalParam.canvasContext.closePath();
                                globalParam.canvasContext.stroke();
                            }
                        }
                    }


                }
            });

            //画带箭头连线
            $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {     //查找所有nodes节点并遍历
                var startNodeName = $(hop).children("from").text();
                var endNodeName = $(hop).children("to").text();
                var enabled = $(hop).children("enabled").text();
                var evaluation = $(hop).children("evaluation").text();
                var unconditional = $(hop).children("unconditional").text();
                var label = $(hop).children("properties").children("label").text();

                var startNode = getNode(startNodeName);
                var startNodeX = parseInt($(startNode).attr("x"));
                var startNodeY = parseInt($(startNode).attr("y"));
                var startX = startNodeX + config.nodeWidth / 2;
                var startY = startNodeY + config.nodeHeight / 2;

                var endNode = getNode(endNodeName);
                var endNodeX = parseInt($(endNode).attr("x"));
                var endNodeY = parseInt($(endNode).attr("y"));
                var endX = endNodeX + config.nodeWidth / 2;
                var endY = endNodeY + config.nodeHeight / 2;

                //=====画连线=====
                globalParam.canvasContext.beginPath();
                globalParam.canvasContext.lineWidth = config.hopWidth;
                if (enabled == "N") {
                    globalParam.canvasContext.strokeStyle = "gray";
                } else if (unconditional == "Y") {
                    globalParam.canvasContext.strokeStyle = "black";
                } else if (evaluation == "Y") {
                    globalParam.canvasContext.strokeStyle = "green";
                } else {
                    globalParam.canvasContext.strokeStyle = "red";
                }

                globalParam.canvasContext.moveTo(startX, startY);
                globalParam.canvasContext.lineTo(endX, endY);
                //画箭头
                var middleX = (startX + endX) / 2;
                var middleY = (startY + endY) / 2;
                var arrowHeight = config.arrowHeight;
                var arrowWidth = config.arrowWidth;
                var angle = Math.atan2(endY - startY, endX - startX);

                globalParam.canvasContext.moveTo(middleX - arrowHeight * Math.cos(angle) - arrowWidth * Math.sin(angle),
                    middleY - arrowHeight * Math.sin(angle) + arrowWidth * Math.cos(angle));
                globalParam.canvasContext.lineTo(middleX, middleY);
                globalParam.canvasContext.lineTo(middleX - arrowHeight * Math.cos(angle) + arrowWidth * Math.sin(angle),
                    middleY - arrowHeight * Math.sin(angle) - arrowWidth * Math.cos(angle));

                globalParam.canvasContext.closePath();
                globalParam.canvasContext.stroke();

                //画条件按钮
                if (config.lineChangeCircle == "ok") {
                    var conditionArcX = middleX - config.radius;
                    var conditionArcY = middleY - config.radius;
                    globalParam.canvasContext.beginPath();
                    globalParam.canvasContext.fillStyle = globalParam.canvasContext.strokeStyle;
                    globalParam.canvasContext.arc(conditionArcX, conditionArcY, config.radius, 0, Math.PI * 2, true);
                    globalParam.canvasContext.closePath();
                    globalParam.canvasContext.fill();
                }
                if (config.lineDeleteCircle == "ok") {
                    //画删除按钮边框
                    var deleteArcX = middleX + config.radius;
                    var deleteArcY = middleY + config.radius;
                    globalParam.canvasContext.beginPath();
                    globalParam.canvasContext.fillStyle = '#c3c3c3';
                    globalParam.canvasContext.arc(deleteArcX, deleteArcY, config.radius, 0, Math.PI * 2, true);
                    globalParam.canvasContext.closePath();
                    globalParam.canvasContext.fill();
                    //画删除按钮X
                    globalParam.canvasContext.beginPath();
                    globalParam.canvasContext.lineWidth = config.hopWidth;
                    globalParam.canvasContext.strokeStyle = "brown";
                    globalParam.canvasContext.moveTo(deleteArcX - config.radius * 0.5, deleteArcY - config.radius * 0.5);
                    globalParam.canvasContext.lineTo(deleteArcX + config.radius * 0.5, deleteArcY + config.radius * 0.5);
                    globalParam.canvasContext.moveTo(deleteArcX - config.radius * 0.5, deleteArcY + config.radius * 0.5);
                    globalParam.canvasContext.lineTo(deleteArcX + config.radius * 0.5, deleteArcY - config.radius * 0.5);
                    globalParam.canvasContext.closePath();
                    globalParam.canvasContext.stroke();
                }

                //画节点名称
                globalParam.canvasContext.strokeStyle = "#555A5A";
                var textWidth = globalParam.canvasContext.measureText(label).width;
                globalParam.canvasContext.strokeText(label, deleteArcX, deleteArcY + 15);

            });
        };
        // 提供外部函数 改变input(type=text)的内容
        _self.fileContentToProperty = function (tagNames, values) {
            var selectedNode = globalParam.clickSelectNode;
            $(selectedNode).find("scriptcontent").text(values);
            showTable();
        };
        _self.setRelationFile = function (tagNames, values) {
            //alert("在workflow中依赖值" + values);
            var selectedNode = globalParam.clickSelectNode;
            $(selectedNode).find("file").text(values);
            showTable();
        }

        //删除节点
        _self.deleteNode = function (name) {
            deleteNode(name);
        };

        //删除节点上的连线
        _self.deleteNodeHops = function (name) {
            deleteNodeHops(name);
        };

        _self.onmousemove = function () {
        }

        //开始连线和结束连线
        _self.setDrawLine = function (trueOrFalse) {
            globalParam.onDrawLine = trueOrFalse;
        }

        // 提供外部函数 导出 xml 内容
        _self.getXmlContent = function () {
            //alert($(globalParam.xmlContent).find("nodes").append(node));
            $(globalParam.xmlContent).find("nodes").each(function () {
                var field = $(this);
                var type = field.find("type").text();//读取节点属性,所有节点
            });
            //alert("导出内容"+$(globalParam.xmlContent).find("hive").attr("type"));

            return globalParam.xmlContent;
        };

        _self.drawLine = function () {
            globalParam.onDrawLine = true;
        }
        //提供外部参数 提供节点name查看日志
        _self.getNoteName = function () {
            $("#rightClickMenuDiv").hide();
            return $(globalParam.clickSelectNode).children("name").text();
        }
        // 提供外部函数获取所选节点类型
        _self.getNoteType = function () {
            return $(globalParam.clickSelectNode).children("type").text();
            ;
        };
        //提供外部方法获取文件内容
        _self.getNoteFileContent = function () {
            // $("#rightClickMenuDiv").hide();
            return $(globalParam.clickSelectNode).find("properties").children("scriptcontent").text();
        };

        _self.getNodeWithNameStart = function (nodeName) {
            var n = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var name = $(node).children("name").text();
                if (name.indexOf(nodeName) != -1) {
                    n = node;
                }
            });
            return n;
        };

        _self.getNodeIdWithNodeIdPrefix = function (nodeName) {
            var n = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var name = $(node).children("name").text();
                if (name.indexOf(nodeName) != -1) {
                    n = name;
                }
            });
            return n;
        };

        _self.getNode = function (nodeName) {
            return getNode(nodeName);
        }


        //改变线的状态颜色和描述
        _self.changeLine = function (linInfoSettings) {
            $(globalParam.xmlContent).find("hops").children("hop").each(function (hopIndex, hop) {     //查找所有nodes节点并遍历
                if (linInfoSettings.from == $(hop).children("from").text() && linInfoSettings.to == $(hop).children("to").text()) {
                    var status = linInfoSettings.status;
                    if (status != "") {
                        status = status.split(',');
                        $(hop).children("enabled").text(status[0]);
                        $(hop).children("evaluation").text(status[1]);
                        $(hop).children("unconditional").text(status[2]);
                    }
                    $(hop).children("properties").children("label").text(linInfoSettings.description);
                    canvasContentDraw();
                }
            });
        }


        //刷新画布
        _self.refreshWorkFlow = function () {
            canvasContentDraw();
        };

        _self.addNodeFromJson = function (node) {
            var image = node['image'];
            var type = node['type'];
            var name = node['name'];
            var label = node['label'];
            var x = node['x'];
            var y = node['y'];
            var layout = node['layout'];
            var background = node['background'];

            var newNodeString =
                '<node selected="true" x="' + x + '" y="' + y + '" image="' + image + '" layout="' + layout + '" background="' + background + '">\n' +
                '<type>' + type + '</type>\n' +
                '<name>' + name + '_' + new UUID().toString() + '</name>\n' +
                '<properties>' +
                '<label readonly="false" type="text" title="开始" description="开始">' + label + '</label>\n' +
                '</properties>' +
                '</node>';

            if (window.ActiveXObject) {
                var xmlContent = globalParam.xmlContent.xml;
                xmlContent = xmlContent.replace("</nodes>", newNodeString + "\r</nodes>");
                globalParam.xmlContent = parseStringToXmlDocument(xmlContent);

            } else {
                $(globalParam.xmlContent).find("nodes").append($(newNodeString));
            }

        }

        _self.addNodeFromXML = function (node) {
            addNode($(node));
        }

        //允许更新节点
        _self.updateNodeMenu = function (nodeName, menuArray) {
            var nodeXmlObject = getNode(nodeName);
            if (window.ActiveXObject) {
                var newNodeString = nodeXmlObject[0].outerHTML;
                var xmlContent = globalParam.xmlContent.xml;
                console.log("暂不支持")

            } else {
                $(nodeXmlObject).children("menus").remove();
                var menuParent = $("<menus></menus>");
                for (var index = 0; index < menuArray.length; index++) {
                    var m = menuArray[index];
                    var menuName = m['name'];
                    var menuEvent = m['click'];
                    var oneMenu = $('<nemu><name>' + menuName + '</name><click>' + menuEvent + '</click></nemu>');
                    menuParent.append(oneMenu);
                }
                $(nodeXmlObject).append(menuParent);
            }
        };

        //允许更新节点关键词
        _self.updateNodeTitle = function (nodeName, titleArray) {
            var nodeXmlObject = getNode(nodeName);
            if (window.ActiveXObject) {
                var newNodeString = nodeXmlObject[0].outerHTML;
                var xmlContent = globalParam.xmlContent.xml;
                console.log("暂不支持")

            } else {
                $(nodeXmlObject).children("keyword").remove();
                var titleParent = $("<keyword></keyword>");
                $(titleArray).each(function (index, title) {
                    var oneTitle = $('<word>' + title + '</word>');
                    titleParent.append(oneTitle);
                });
                $(nodeXmlObject).append(titleParent);
            }
        };

        //允许更新节点基本信息
        _self.updateNode = function (nodeName, node) {
            var nodeXmlObject = getNode(nodeName);

            var image = $(nodeXmlObject).attr("image");
            var x = $(nodeXmlObject).attr("x");
            var y = $(nodeXmlObject).attr("y");
            var label = $(node).children("properties").children("label").text();

            $(nodeXmlObject).attr("image", node['image'] || image);
            $(nodeXmlObject).attr("x", node['x'] || x);
            $(nodeXmlObject).attr("y", node['y'] || y);
            $(node).children("properties").children("label").text(node['label'] || label);

        };

        _self.deleteNode = function (nodeName) {
            deleteNode(nodeName);
            deleteNodeHops(nodeName);
        };

        _self.destroy = function () {
            clearCanvasContent();
        }


        // 右击菜单连线
        var connectHop = function (evx, evy) {
            globalParam.onDrawLine = true;
            $(globalParam.canvasDiv).css("cursor", "pointer");
            $("#rightClickMenuDiv").hide();
        };

        // 右击菜单删除节点
        var menuDeleteNote = function () {
            var selectedNode = globalParam.clickSelectNode;
            //删除一个节点以及这个节点上的连线
            var name = $(selectedNode).children("name").text();
            deleteNode(name);
            deleteNodeHops(name);
            canvasContentDraw();
            $('#rightClickMenuDiv').hide();
        };

        // 右击菜单复制
        var menuCopyNote = function () {
            globalParam.copyNode = globalParam.clickSelectNode;
            globalParam.copyCount = 1;
            $("#rightClickMenuDiv").hide();
        }

        // 右击菜单粘贴
        var menuPasteNote = function (evxMouse, evyMouse) {
            $("#rightClickMenuDiv").hide();
            var selectedNode = globalParam.copyNode;
            var type = $(selectedNode).children("type").text();
            var evx = evxMouse;
            var evy = evyMouse;
            evx = (evx > (config.nodeWidth / 2)) ? evx : config.nodeWidth / 2;
            evy = (evy > (config.nodeHeight / 2)) ? evy : config.nodeHeight / 2;
            evx = (evx < (config.canvasWidth - config.nodeWidth / 2)) ? evx : (config.canvasWidth - config.nodeWidth / 2);
            evy = (evy < (config.canvasHeight - config.nodeHeight / 2)) ? evy : (config.canvasHeight - config.nodeHeight / 2);

            //清除其他节点选中状态
            clearAllSelectedNode();
            for (var index = 0; index < plugins.length; index++) {
                var n = plugins[index];
                var nType = n['type'];
                if (type == nType) {
                    var nodeString = n.getXmlContent();
                    // alert(nodeString);
                    var node = $(nodeString).attr("x", (evx - config.nodeWidth / 2)).attr("y", (evy - config.nodeHeight / 2));
                    addNode(node);
                    $(globalParam.propertyTable).find("tbody").html("");
                    var properties = $(selectedNode).find("properties").children();
                    for (var index = 0; index < properties.length; index++) {
                        var ele = properties[index];
                        var tagName = ele.tagName;
                        var name = $(ele).attr("title");
                        var value = "";
                        value = $(ele).text().trim();
                        if (tagName == "label") {
                            value = $(ele).text().trim() + "_" + "副本_" + globalParam.copyCount;
                        } else {
                            value = $(ele).text().trim();
                        }
                        $(node).find(tagName).text(value.replace("&lt;", "<").replace("&gt;", ">"));

                    }

                    selectedNode = node;
                    $(globalParam.propertyTable).find("tbody").html("");
                    var properties = $(selectedNode).find("properties").children();
                    for (var index = 0; index < properties.length; index++) {
                        var ele = properties[index];
                        var tagName = ele.tagName;
                        var type = $(ele).attr("type");
                        var name = $(ele).attr("title");
                        var value = $(ele).text().trim();
                        var description = $(ele).attr("description");
                        if ("file" == type) {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%;  font-size:12px; color:blue;"  id="' + tagName + '">' + $(selectedNode).find(tagName).text().replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            $(inputBox).click(function () {
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                                //chooseStartFile(tagName, $(selectedNode).find(tagName).text());//;//弹出选文件的框子
                                chooseFile();
                                //var tagName = $(this).attr("id");
                                //$(selectedNode).find(tagName).text(values);
                                //// $(this).val(value);
                                //chooseStartFile(tagName,values);//;//弹出选文件的框子

                            });

                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                        } else if ("scriptcontent" == type) {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%; font-size:12px; color:blue;"  id="' + tagName + '">' + value.replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            //alert("danjin"+$(selectedNode).find(tagName).text());
                            $(inputBox).click(function () {
                                //alert("tanchu neitong"+$(selectedNode).find(tagName).text());
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                                //chooseFile($(selectedNode).find("type").text(), $(selectedNode).find(tagName).text());
                                //chooseStartFile($(selectedNode).find(tagName).text());
                                chooseFile();
                                //$(this).val(value);
                                //chooseStartFile(tagName,$(selectedNode).find(tagName).text());//弹出选文件的框子
                            });
                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                        }
                        else if ("files" == type) {

                        } else if ("selectText" == type) {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><select id="' + tagName + '"><option  value="1">1小时</option><option  value="2">2小时</option><option  value="3">3小时</option><option  value="4">4小时</option><option  value="5">5小时</option><option  value="6">6小时</option></select></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                            if ($(selectedNode).find(tagName).text() == "") {
                                $("#" + tagName).val(1);
                            } else {
                                $("#" + tagName).val($(selectedNode).find(tagName).text());
                            }
                            $("#" + tagName).change(function () {
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($("#" + tagName).val());
                            });
                        } else if ("text" == type) {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            $(inputBox).keyup(function () {
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($(this).val());
                                canvasContentDraw();
                            });
                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                        } else if ("password" == type) {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" type="password" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            $(inputBox).keyup(function () {
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($(this).val());
                            });
                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                        } else if (type == "normalText") {
                            var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><input style="width: 98%" value="' + value + '" id="' + tagName + '"></td><td style="text-align: center">' + description + '</td></tr>');
                            var inputBox = $(oneProperty).find("#" + tagName);
                            $(inputBox).keyup(function () {
                                var tagName = $(this).attr("id");
                                $(selectedNode).find(tagName).text($(this).val());
                            });
                            $(globalParam.propertyTable).find("tbody").append(oneProperty);
                        }

                    }
                    ++globalParam.copyCount;
                    clearAllSelectedNode();
                    ////设置这个节点为新的被选中的节点
                    //$(selectedNode).attr("selected", "true");
                    canvasContentDraw();

                }
            }

        };

        //供给外部回调 用于设置文本域内容
        var setTextAreaValue = function () {
            if (typeof textAreaClick == "function") {
                return textAreaClick();
            }
            return "";
        }

        //供给外部回调 用户设置输入框内容
        var setInputValue = function (value) {
            if (typeof inputClick == "function") {
                if (inputClick() == "" || inputClick() == null) {
                    return value;
                } else {
                    return inputClick();
                }
            }
            return "";
        }
        var parseStringToXmlDocument = function (xmlString) {
            var xmlDoc = null;
            if (window.ActiveXObject) {
                var xmlDomVersions = [
                    "Microsoft.XmlDom",
                    "MSXML2.DOMDocument",
                    "MSXML2.DOMDocument.3.0",
                    "MSXML2.DOMDocument.4.0",
                    "MSXML2.DOMDocument.5.0"
                ];
                for (var i = xmlDomVersions.length - 1; i >= 0; i--) {
                    try {
                        var xmlDom = new ActiveXObject(xmlDomVersions[i]);
                        xmlDom.async = false;//同步载入,阻塞
                        xmlDom.loadXML(xmlString);
                        return xmlDom;
                    } catch (e) {
                        continue;
                    }
                }

            } else {
                var parser = new DOMParser();
                xmlDom = parser.parseFromString(xmlString, "text/xml");
                return xmlDom;
            }

        }


        var plugins = [
            {
                type: "start",
                name: "开始",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/start.jpg",
                properties: {
                    label: "start"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="开始" description="开始">' + this.name + '</label>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "success",
                name: "成功",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/success.jpg",
                properties: {
                    label: "success"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.name + '</label>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "error",
                name: "出错",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/error.png",
                properties: {
                    label: "error"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.name + '</label>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "shell",
                name: "shell",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/shell.png",
                properties: {
                    label: "shell"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<scriptcontent readonly="true" type="scriptcontent" title="启动文件" description="选择一个脚本文件"></scriptcontent>\n' +
                        '<file readonly="true" type="file" title="依赖文件" description="选择依赖文件"></file>\n' +
                        '<attempt readonly="false" type="text" title="重试次数" description="填写数字">0</attempt>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "hive",
                name: "hive",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/hive.png",
                properties: {
                    label: "hive",
                    sql: ""
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<scriptcontent readonly="true" type="scriptcontent" title="启动文件" description="选择一个脚本文件"></scriptcontent>\n' +
                        '<file readonly="true" type="file" title="依赖文件" description="选择依赖文件"></file>\n' +
                        '<attempt readonly="false" type="text" title="重试次数" description="填写数字">0</attempt>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "ssh",
                name: "ssh",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/ssh.png",
                properties: {
                    label: "ssh"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<ip readonly="false" type="normalText" title="ip地址" description=""></ip>\n' +
                        '<port readonly="false" type="normalText" title="端口号" description=""></port>\n' +
                        '<username readonly="false" type="normalText" title="用户名" description=""></username>\n' +
                        '<password readonly="false" type="password" title="密码" description=""></password>\n' +
                        '<timeout readonly="false" type="selectText" title="超时时间" description="超时时间"></timeout>\n' +
                        '<scriptcontent readonly="true" type="scriptcontent" title="启动文件" description="选择一个脚本文件"></scriptcontent>\n' +
                        '<file readonly="true" type="file" title="依赖文件" description="选择依赖文件"></file>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "kv",
                name: "kv",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/kv.png",
                properties: {
                    label: "kv"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<hdfsPath readonly="false" type="normalText" title="hdfsPath" description=""></hdfsPath>\n' +
                        '<tableName readonly="false" type="normalText" title="tableName" description=""></tableName>\n' +
                        '<expireAt readonly="false" type="normalText" title="有效天数" description=""></password>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "mr",
                name: "mr",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/mr.png",
                properties: {
                    label: "mr"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<file readonly="true" type="file" title="启动文件" description="选择一个文件"></file>\n' +
                        '<command_args readonly="false" type="normalText" title="命令行参数" description=""></command_args>\n' +
                        '<attempt readonly="false" type="normalText" title="重试次数" description="填写数字">0</attempt>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "python",
                name: "python",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/python.png",
                properties: {
                    label: "python"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<scriptcontent readonly="true" type="scriptcontent" title="启动文件" description="选择一个脚本文件"></scriptcontent>\n' +
                        '<file readonly="true" type="file" title="依赖文件" description="选择依赖文件"></file>\n' +
                        '<attempt readonly="false" type="normalText" title="重试次数" description="填写数字">0</attempt>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "jar",
                name: "jar",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/jar.png",
                properties: {
                    label: "jar"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<mainClass readonly="false" type="normalText" title="mainClass" description="包含main方法入口类"></mainClass>\n' +
                        '<file readonly="true" type="file" title="依赖jar" description="选择一组文件"></file>\n' +
                        '<command_args readonly="false" type="normalText" title="命令行参数" description=""></command_args>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "tedis",
                name: "tedis",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/tedis.png",
                properties: {
                    label: "tedis"
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<hdfsPath readonly="false" type="normalText" title="hdfsPath" description=""></hdfsPath>\n' +
                        '<tableName readonly="false" type="normalText" title="tableName" description=""></tableName>\n' +
                        '<expireAt readonly="false" type="normalText" title="有效天数" description=""></password>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "spark_sql",
                name: "Spark Sql",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/spark_sql.png",
                properties: {
                    label: "SparkSql",
                    sql: ""
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<scriptcontent readonly="true" type="scriptcontent" title="启动文件" description="选择一个脚本文件"></scriptcontent>\n' +
                        '<file readonly="true" type="file" title="依赖文件" description="选择依赖文件"></file>\n' +
                        '<attempt readonly="false" type="text" title="重试次数" description="填写数字">0</attempt>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
            {
                type: "spark_jar",
                name: "Spark Jar",
                x: 0,
                y: 0,
                selected: false,
                image: globalParam.imageRootPath + "images/spark_jar.png",
                properties: {
                    label: 'SparkJar'
                },
                getXmlContent: function () {
                    //生成node节点字符串
                    var nodeString =
                        '<node selected="true" x="0" y="0" image="' + this.image + '">\n' +
                        '<type>' + this.type + '</type>\n' +
                        '<name>' + this.type + '_' + new UUID().toString() + '</name>\n' +
                        '<properties>' +
                        '<label readonly="false" type="text" title="节点名称" description="节点名称">' + this.type + '</label>\n' +
                        '<mainClass readonly="false" type="normalText" title="mainClass" description="包含main方法入口类"></mainClass>\n' +
                        '<file readonly="true" type="file" title="依赖jar" description="选择一组文件"></file>\n' +
                        '<command_args readonly="false" type="normalText" title="命令行参数" description=""></command_args>\n' +
                        '</properties>' +
                        '</node>';
                    return nodeString;
                }
            },
        ];

        // 启动插件
        _init();
        // 链式调用
        return this;
    };

    var workflowNode = function (type, label, x, y) {
        this.attr.x = x;
        this.attr.y = y;
        this.attr.selected = "false";

        this.type.attribute.readonly = "true";
        this.type.attribute.type = "text";
        this.type.attribute.title = "节点类型";
        this.type.attribute.description = "不可更改";
        this.type.attribute.content = type;

        this.name.attribute.readonly = "true";
        this.name.attribute.type = "text";
        this.name.attribute.title = "节点id";
        this.name.attribute.description = "不可更改";
        this.name.attribute.content = type;

        this.label.attribute.readonly = "false";
        this.label.attribute.type = "text";
        this.label.attribute.title = "节点名称";
        this.label.attribute.description = "节点名称";
        this.label.attribute.content = label;

        this.image = new Image();
        this.image.src = "images/" + type + ".png";

        var workflowNodeSelf = this;


        this.getXmlContent = function () {
            var xmlContent = $("<node></node>");
            $(xmlContent).attr("x", workflowNodeSelf.attr.x);
            $(xmlContent).attr("y", workflowNodeSelf.attr.y);
            $(xmlContent).attr("selected", workflowNodeSelf.attr.selected);

            var type = $('<type></type>');
            $(type).attr("readonly", workflowNodeSelf.type.attribute.readonly);
            $(type).attr("type", workflowNodeSelf.type.attribute.type);
            $(type).attr("title", workflowNodeSelf.type.attribute.title);
            $(type).attr("description", workflowNodeSelf.type.attribute.description);
            $(type).html(workflowNodeSelf.type.attribute.content);

            var name = $('<name></name>');
            $(name).attr("readonly", workflowNodeSelf.name.attribute.readonly);
            $(name).attr("type", workflowNodeSelf.name.attribute.type);
            $(name).attr("title", workflowNodeSelf.name.attribute.title);
            $(name).attr("description", workflowNodeSelf.name.attribute.description);
            $(name).html(workflowNodeSelf.name.attribute.content);

            var label = $('<label></label>');
            $(label).attr("readonly", workflowNodeSelf.label.attribute.readonly);
            $(label).attr("type", workflowNodeSelf.label.attribute.type);
            $(label).attr("title", workflowNodeSelf.label.attribute.title);
            $(label).attr("description", workflowNodeSelf.label.attribute.description);
            $(label).html(workflowNodeSelf.label.attribute.content);

            $(xmlContent).append(type);
            $(xmlContent).append(name);
            $(xmlContent).append(label);

            return $(xmlContent)[0].outerHTML;
        }

        this.initFromXml = function (xmlContent) {

        }


    }

    var hiveNode = function (x, y) {
        workflowNode.call("hive", "hive", x, y);
    }

    var startNode = function (x, y) {
        workflowNode.call("start", "开始", x, y);
    }

    var successNode = function (x, y) {
        workflowNode.call("success", "成功", x, y);
    }

})
(jQuery, window);


