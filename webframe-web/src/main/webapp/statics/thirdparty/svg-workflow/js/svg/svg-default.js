/**
 * Created by xushanshan on 16/8/1.
 */
(function ($, window) {
    $("<style></style>").text(".water {stroke-dasharray: 1200;stroke-dashoffset: 1200;animation-name:dash;animation-duration:5s;" +
    "animation-timing-function:linear;animation-iteration-count: 1000;stroke:blue;stroke-width:2;}" +
    ".dashedWater {stroke-dasharray: 10;stroke-dashoffset: 1000;animation-name:dash;animation-duration:	20s;" +
    "animation-timing-function:linear;animation-iteration-count: 1000;stroke:blue;stroke-width:2;}" +
    "@keyframes dash {to{stroke-dashoffset: 100;}}").appendTo($("head"));
    //拖拽插件定义
    jQuery.fn.workflow = function (xmlContent, settings) {

        //别名
        var _self = this;
        var container = this;  //最外层的div
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
            //canvas 宽度
            canvasWidth: 800,
            //canvas 高度
            canvasHeight: 500,
            //图标宽度
            nodeWidth: 40,
            //图标高度
            nodeHeight: 40,
            //是否显示节点边框，默认显示
            nodeBorder: 1,
            //左侧默认的组件栏是否显示
            defaultPluginEnable: true,
            //连线线宽
            hopWidth: 1,
            //连线箭头高度
            arrowHeight: 18,
            //连线箭头宽度
            arrowWidth: 6,
            //圆形按钮半径
            radius: 5,
            menuHeight: 100,
            //连线删除按钮是否可用
            hopDeleteEnable: true,
            //连线改变颜色按钮是否可用
            hopStatusEnable: true,
            //需要初始化的控件
            initPluginJson: null,
            //左侧控件栏是否显示 默认不显示
            leftBoxDisplay: false,
            //左侧控件栏宽度，leftBoxDisplay为false时失效
            leftBoxWidth: 200,
            //画布总高度
            mainDivHeight: 690,
            //按钮栏html代码，自定义样式，方法
            toolBarHtml: '<a style="font-size: 14px;text-decoration:none;">作业设计</a>',
            //连线上的圆圈图标 默认不显示
            lineCircle: false,
            //连线上的三角图标 默认不显示
            lineTriangle: false,
            //右击菜单默认样式
            menusParentStyle: "position:absolute; background-color:#white; z-index: 100; overflow-x: hidden;overflow-y:hidden;" +
            " border:1px solid #919999; filter:alpha(opacity=5);opacity: 0.95;-moz-border-radius: 4px; -webkit-border-radius: 4px;",
            // 全局右击菜单 true:显示 false:不显示 默认不显示
            globalRightClickMenu: false,
            //删除连线前绑定的事件 默认为空
            hopBeforeDeleteClick: "",
            //删除连线后绑定的事件 默认为空
            hopAfterDeleteClick: "",
            //右击事件中是否包含删除节点或删除连线事件 true:包含 false:不包含 默认为true包含
            menusBaseDeleteItem: true,
            showProperty :false

        };

        //全局参数
        var globalParam = {
            SVG: null,
            svgNodeMap: {},
            contextMenu: null,
            xmlContent: null,
            canvas: null,
            canvasContext: null,
            mouseDragNode: null,
            copyNode: null,
            mouseClickX: null,
            mouseClickY: null,
            onDrawLine: false,
            propertyTable: null,
            copyCount: null,
            publicParam: new Object(),
            workflowDivId: "workflowDiv",
            selectedNode: null,
            tmpHop: null
        };


        // 初始化函数
        var _init = function () {

            //初始化插件参数
            if (settings != null) {
                config.arrowHeight = settings.arrowHeight || 40;
                config.arrowWidth = settings.arrowWidth || 40;
                config.canvasHeight = settings.canvasHeight || 500;
                config.canvasWidth = settings.canvasWidth || 800;
                config.nodeWidth = settings.nodeWidth || 40;
                config.nodeHeight = settings.nodeHeight || 40;
                config.hopWidth = settings.hopWidth || 1;
                config.radius = settings.radius || 5;
                config.menuHeight = settings.menuHeight || 100;
                config.initPluginJson = settings.initPluginJson ||
                [
                    {
                        "pluginType": "start",
                        "width": "40",
                        "height": "40",
                        "imageSrc": "images/start.jpg",
                        "labelName": 'start'
                    },
                    {
                        "pluginType": "success",
                        "width": "40",
                        "height": "40",
                        "imageSrc": "images/success.jpg",
                        "labelName": 'success'
                    },
                    {
                        "pluginType": "error",
                        "width": "40",
                        "height": "40",
                        "imageSrc": "images/error.png",
                        "labelName": 'error'
                    }
                ];
                //是否显示左侧控件栏 默认不显示
                config.leftBoxDisplay = settings.leftBoxDisplay || false;
                //左侧控件栏宽度 默认200
                if (config.leftBoxDisplay) {
                    config.leftBoxWidth = settings.leftBoxWidth || 200;
                } else {
                    config.leftBoxWidth = 0;
                }
                //按钮工具栏
                config.toolBarHtml = settings.toolBarHtml || '<a style="font-size: 14px;text-decoration:none;">作业设计</a>';
                //连线上的圆圈图标 默认不显示
                config.lineCircle = settings.lineCircle || false;
                //连线上的三角 默认不显示
                config.lineTriangle = settings.lineTriangle || false;
                //节点外边框
                config.nodeBorder = settings.nodeBorder || 0;
                // 全局右击菜单 true:显示 false:不显示 默认不显示
                config.globalRightClickMenu = settings.globalRightClickMenu || false;
                //删除连线前绑定的事件(全局)
                config.hopBeforeDeleteClick = settings.hopBeforeDeleteClick || "";
                //删除连线后的绑定事件(全局)
                config.hopAfterDeleteClick = settings.hopAfterDeleteClick || "";
                //菜单中是否包含删除节点或删除连线事件 true:包含 false:不包含 默认为true包含
                if(settings.menusBaseDeleteItem !=null){
                config.menusBaseDeleteItem = settings.menusBaseDeleteItem;
                }
                //默认双击显示属性框
                config.showProperty = settings.showProperty || false;

            }

            //只初始化一次
            if (globalParam.xmlContent == null) {
                _initData();
                // 事件绑定
                _loadEvent();

                xmlToSVG();
            } else {
                alert("workflow has been initialized, do not initialize again");
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
            var svgSetting = {};
            svgSetting.xmlContent = xmlContent;

            svgSetting.menusParentStyle = config.menusParentStyle;
            svgSetting.nodeBorder = config.nodeBorder;
            svgSetting.container = container;
            svgSetting.globalRightClickMenu = config.globalRightClickMenu;
            globalParam.SVG = new svgWorkflow($(container)[0], svgSetting);
            // var initPluginJson = settings.initPluginJson;
            //alert(initPluginJson[0]['imageSrc']);
            $(container).attr("tabindex", 0);
            //按钮栏加载按钮
            $("#toolBar").html(config.toolBarHtml);
            //宽度自适应
            var mainWidth = $("#mainDiv").width();
            $("#leftBoxDiv").width(config.leftBoxWidth);
            $("#rightBoxDiv").width(mainWidth - config.leftBoxWidth);
            $("#rightBoxDiv").css("left", (config.leftBoxWidth + 2) + "px");
            $("#leftBoxDiv").height(config.mainDivHeight);
            var toolBarHeight = $("#toolBar").height();
            $("#workflow").height(config.mainDivHeight - toolBarHeight)
            $("#workflow").css("margin-top", (toolBarHeight) + "px");
            if (config.leftBoxDisplay) {
                for (var i = 0; i < config.initPluginJson.length; i++) {
                    var pluginJson = config.initPluginJson[i];
                    var pluginHtml = '<img src="' + pluginJson['imageSrc'] + '" draggable="true" width="' + pluginJson['width'] + '" height="' + pluginJson['height'] + '" ' +
                        'style="border:' + config.nodeBorder + 'px solid #c3c3c3;vertical-align: middle; margin-top:8px;margin-left:2px;"id="' + pluginJson['pluginType'] + '"> ' +
                        '<label style="font-size: 12px; font-weight: 700;width: 50px;  height:40px; display:inline-block;">' + pluginJson['labelName'] + '&nbsp;</label>'
                    $("#pluginsDiv").append(pluginHtml);
                }
                $("#leftBoxDiv").show();
            }


        };

        // 绑定事件
        var _loadEvent = function () {
            $(container)[0].ondragover = function (ev) {
                svgDragOver(ev);
            };
            $(container)[0].ondrop = function (ev) {
                svgDrop(ev);
            };
            var pluginNodes = $("img");
            for (var i = 0; i < pluginNodes.length; i++) {
                pluginNodes[i].ondragstart = function (ev) {
                    dragStart(ev);
                }
            }
            ;

            $(container).mousemove(function (ev) {
                var p = globalParam.SVG.getMousePosition(ev);
                var x = p.x;
                var y = p.y;
                if (globalParam.mouseDragNode != null) {
                    globalParam.mouseDragNode.nested.attr({"cursor": "move"});
                    var width = $(container).width();
                    var height = $(container).height();
                    globalParam.mouseDragNode.x = x - globalParam.mouseDragNode.deltaX;
                    globalParam.mouseDragNode.y = y - globalParam.mouseDragNode.deltaY;
                    var rXY = limitXY(globalParam.mouseDragNode.x, globalParam.mouseDragNode.y, globalParam.mouseDragNode.content['rect'].width(), globalParam.mouseDragNode.content['rect'].height(), 0, width, height);
                    var nodeXml = getXmlNode(globalParam.mouseDragNode.name);
                    $(nodeXml).attr("x", rXY.x);
                    $(nodeXml).attr("y", rXY.y);
                    $("#mainDiv").find("#suspend").remove();
                    globalParam.mouseDragNode.updatePosition(rXY.x, rXY.y);
                }
                // if (globalParam.onDrawLine == true) {
                //     if (globalParam.selectedNode != null) {
                //         if (globalParam.tmpHop!=null){
                //             globalParam.tmpHop.remove();
                //         }
                //         var startX = globalParam.selectedNode.x + 21;
                //         var startY = globalParam.selectedNode.y + 21;
                //         var endX = x;
                //         var endY = y;
                //         globalParam.tmpHop = globalParam.SVG.createTempHop(startX,startY,endX,endY);
                //     }
                // }
            });

            $(container).click(function (ev) {

            });

            $(container).mouseup(function () {
                if (globalParam.mouseDragNode != null) {
                    globalParam.mouseDragNode = null;
                }
            });

            $(container).keydown(function (ev) {
                if (ev && ev.keyCode == keyboardCode.SHIFT) {
                    $("#mainDiv").find("#suspend").hide();
                    if (globalParam.selectedNode != null) {
                        $(container).css("cursor", "pointer");
                    }
                    globalParam.onDrawLine = true;
                }
            });

            $(container).keyup(function (ev) {
                if (ev && ev.keyCode == keyboardCode.SHIFT) {
                    $("#mainDiv").find("#suspend").show();
                    $(container).css("cursor", "default");
                    globalParam.onDrawLine = false;
                }
            })
            container.propertyPop = function (node) {
                var type = $(node).children("type").text();
                var label = $(node).children("properties").children("label").text();

                var outer = $('<div id="pop" style="position: absolute; width: 500px; z-index: 51; left: 100px; top: 100px; background-color: gray; -moz-border-radius: 2px; -webkit-border-radius: 2px; border: 1px solid black; background-color: white; filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=3); -moz-box-shadow: 7px 7px 15px #909090; -webkit-box-shadow: 7px 7px 15px #909090; box-shadow:7px 7px 15px #909090;">'
                + '<div style="background-color: rgb(237, 249, 251); width: 100%; height: 30px; color: black; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; text-align: center;">' + type + '</div>'
                + '<div class="content" style="max-height: 400px; overflow-y: auto; padding: 5px;"></div>'

                + '<div style="border-top: 1px solid grey; width: 100%; height: 33px; color: black; line-height: 30px; text-indent: 1em; font-weight: bold; font-size: 14px; text-align: center; margin-bottom: 0;">'
                + '<button style="height: 23px; width: 50px; margin-top: 2px; " class="assign">确定</button>'
                + '&nbsp;&nbsp;&nbsp;<button style="height: 23px; width: 50px; margin-top: 2px; " class="cancel">取消'
                + '</button></div></div>');

                var fieldset = $('<fieldset style="font-size: 14px; margin-top: 5px;"><legend>节点属性配置</legend></fieldset>');
                var table = $('<table style="width: 100%; font-size: 13px;"></table>');

                //渲染properties内容
                var properties = $(node).find("properties").children();
                for (var index = 0; index < properties.length; index++) {
                    var ele = properties[index];
                    var tagName = ele.tagName;
                    var type = $(ele).attr("type");
                    if (type != null && type != "") {
                        var title = $(ele).attr("title");
                        var value = $(ele).attr("value");
                        var description = $(ele).attr("description");

                        var oneProperty = $('<tr></tr>');
                        var propertyName = $('<td style="width: 35%; text-align: right;">' + title + '</td>');
                        oneProperty.append(propertyName);

                        if ("file" == type) {
                            //var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%; font-size:12px; color:blue;"  id="' + tagName + '">' + value.replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                            //var inputBox = $(oneProperty).find("#" + tagName);
                            //$(inputBox).click(function () {
                            //    var tagName = $(this).attr("id");
                            //    $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                            //    chooseRelationFiles($(selectedNode).find(tagName).text().replace("<![CDATA[", "").replace("]]>", ""));
                            //});
                            //$(globalParam.propertyTable).find("tbody").append(oneProperty);
                        } else if ("scriptcontent" == type) {
                            //var oneProperty = $('<tr><td style="text-align: center; width: 150px;">' + name + '</td><td><textarea readonly style="width: 98%; font-size:12px; color:blue;"  id="' + tagName + '">' + value.replace("<![CDATA[", "").replace("]]>", "") + '</textarea></td><td style="text-align: center">' + description + '</td></tr>');
                            //var inputBox = $(oneProperty).find("#" + tagName);
                            //$(inputBox).click(function () {
                            //    var tagName = $(this).attr("id");
                            //    $(selectedNode).find(tagName).text($(selectedNode).find(tagName).text());
                            //    chooseStartFile($(selectedNode).find(tagName).text());
                            //});
                            //$(globalParam.propertyTable).find("tbody").append(oneProperty);
                        } else if ("select" == type) {
                            var propertyValue = $('<td></td>');
                            var select = $('<select name="' + tagName + '" style="width: 200px;"></select>');
                            var options = $(ele).find('option');
                            for (var index = 0; index < options.length; index++) {
                                var optionXml = options[index];
                                var optionValue = $(optionXml).attr('value');
                                var optionContent = $(optionXml).html();
                                if (optionValue == value) {
                                    $(select).append('<option value="' + optionValue + '" selected>' + optionContent + '</option>');
                                } else {
                                    $(select).append('<option value="' + optionValue + '">' + optionContent + '</option>');
                                }

                            }
                            propertyValue.append(select);
                            oneProperty.append(propertyValue);

                        } else if ("password" == type) {
                            var propertyValue = $('<td><input type="password" name="' + tagName + '" value="' + value + '" style="width: 200px;"/></td>');
                            oneProperty.append(propertyValue);


                        } else if (type == "text") {
                            var propertyValue = $('<td><input type="text" name="' + tagName + '" value="' + value + '" style="width: 200px;"/></td>');
                            oneProperty.append(propertyValue);
                        }

                        table.append(oneProperty);
                    }

                }

                fieldset.append(table);
                var form = $('<form></form>');
                form.append(fieldset);
                $(outer).find('.content').append(form);

                $(outer).find('.cancel').click(function () {
                    $(outer).remove();
                });
                $(outer).find('.assign').click(function () {
                    if (confirm("保存dialog到这个节点的XML中?")) {
                        //var paramArray = $(outer).find('form').serializeArray();
                        var param = "param : ";
                        //for (var index = 0; index < paramArray.length; index ++) {
                        //    var field = paramArray[index];
                        //    param = param + (field.name + ":" + field.value + " , ");
                        //}
                        console.log(param);
                        $(outer).remove();
                    }
                });

                $(container).append(outer);
            };

            globalParam.SVG.backgroundClick(function () {
                if (globalParam.selectedNode != null) {
                    globalParam.selectedNode.selected = false;
                    globalParam.selectedNode.content["rect"].attr({"stroke": "#444444"});
                    globalParam.selectedNode = null;

                }
            });
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

        var svgDragOver = function (ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                event.returnValue = false;
            }

        };

        var svgDrop = function (ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                event.returnValue = false;
            }
            var type = globalParam.publicParam.type;
            for (var i = 0; i < plugins.length; i++) {
                var n = plugins[i];
                var nType = n['type'];
                if (type == nType) {
                    var width = $(container).width();
                    var height = $(container).height();
                    var position = globalParam.SVG.getMousePosition(ev);
                    var x = position.x;
                    var y = position.y;
                    var nodeString = n.getXmlContent();
                    var node = $(nodeString).attr("x", (x - 21)).attr("y", (y - 21));
                    var cx = node.attr("x");
                    var cy = node.attr("y");
                    var rXY = limitXY(cx, cy, 42, 42, 20, width, height);
                    node.attr("x", rXY.x).attr("y", rXY.y);
                    var nodeSettings = {};
                    nodeSettings['type'] = node.children("type").text();
                    nodeSettings['name'] = node.children("name").text();
                    nodeSettings['label'] = node.children("properties").children("label").text();
                    nodeSettings['x'] = parseInt(node.attr("x"));
                    nodeSettings['y'] = parseInt(node.attr("y"));
                    nodeSettings['image'] = node.attr("image");
                    nodeSettings['selected'] = n.selected;
                    nodeSettings['nodeBorder'] = config.nodeBorder;
                    nodeSettings['menusBaseDeleteItem'] = config.menusBaseDeleteItem;
                    var newNode = createNodeBindEvents(nodeSettings);
                    newNode.dblclick(function (_self, ev) {
                        container.propertyPop(getXmlNode(_self.name));
                    });
                    addNode(node);
                }
            }
        };

        var limitXY = function (x, y, nodeWidth, nodeHeight, nodeTextHeight, width, height) {
            x = (x > 0) ? x : 0;
            y = (y > 0) ? y : 0;
            x = (x < width - nodeWidth) ? x : width - nodeWidth;
            y = (y < height - nodeHeight) ? y : height - nodeHeight - nodeTextHeight;
            return {x: x, y: y};
        }

        var createNodeBindEvents = function (nodeSettings) {
            var nodeName = nodeSettings['name'];
            var newNode = globalParam.SVG.createNode(nodeSettings);
            globalParam.svgNodeMap[nodeName] = newNode;
            newNode.click(function (_self, ev) {

            });


            newNode.mousedown(function (_self, ev) {
                var mousePosition = globalParam.SVG.getMousePosition(ev);
                var evx = mousePosition.x;
                var evy = mousePosition.y;
                globalParam.mouseClickX = mousePosition.x;
                globalParam.mouseClickY = mousePosition.y;
                if (globalParam.onDrawLine == true) {
                    var startNode = globalParam.selectedNode;

                    var endNode = _self;
                    var x1 = startNode.x;
                    var y1 = startNode.y;
                    var x2 = endNode.x;
                    var y2 = endNode.y;
                    if (startNode != null && endNode != null && startNode != endNode) {
                        if (hasHop(startNode, endNode) == false) {
                            var hopSettings = {};
                            hopSettings['lineCircle'] = config.lineCircle;
                            hopSettings['lineTriangle'] = config.lineTriangle;
                            hopSettings['from'] = startNode;
                            hopSettings['to'] = endNode;
                            hopSettings['label'] = "连线";
                            hopSettings['startX'] = x1;
                            hopSettings['startY'] = y1;
                            hopSettings['endX'] = x2;
                            hopSettings['endY'] = y2;
                            hopSettings['status'] = "success";
                            hopSettings['menusParentStyle'] = config.menusParentStyle;
                            hopSettings['beforeDelete'] = function (fromNodeName, toNodeName) {
                                if (config.hopBeforeDeleteClick != "") {
                                    eval(config.hopBeforeDeleteClick + "('" + fromNodeName + "','" + toNodeName + "')");
                                }
                                return true;
                            }
                            hopSettings['afterDelete'] = function (fromNodeName, toNodeName) {
                                if (config.hopAfterDeleteClick != "") {
                                    eval(config.hopAfterDeleteClick + "('" + fromNodeName + "','" + toNodeName + "')");
                                }
                            }
                            hopSettings['menusBaseDeleteItem'] = config.menusBaseDeleteItem;
                            createHopBindEvents(startNode.name, endNode.name, hopSettings);
                            var hop = $('<hop></hop>');
                            $(hop).append($('<type>connect</type>'));
                            $(hop).append($('<from>' + startNode.name + '</from>'));
                            $(hop).append($('<to>' + endNode.name + '</to>'));
                            $(hop).append($('<enabled>Y</enabled>'));
                            $(hop).append($('<evaluation>Y</evaluation>'));
                            $(hop).append($('<unconditional>N</unconditional>'));
                            $(hop).append($('<properties>' +
                            '<label readonly="false" type="text" >成功</label>' +
                            '</properties>'));
                            addHop(hop);
                        }
                    }
                }
                globalParam.mouseDragNode = _self;
                var position = globalParam.SVG.getMousePosition(ev);
                _self.deltaX = position.x - _self.x;
                _self.deltaY = position.y - _self.y;
            });
            newNode.mouseup(function (_self, ev) {
                for (var name in globalParam.svgNodeMap) {
                    globalParam.svgNodeMap[name].selected = false;
                    globalParam.svgNodeMap[name].content["rect"].attr({"stroke": "#444444"});
                }
                globalParam.selectedNode = _self;
                _self.selected = true;
                _self.content['rect'].attr({"stroke": "#0000FF"});
                _self.nested.attr({"cursor": "default"});
            });
            return newNode;
        }

        var createHopBindEvents = function (startNodeName, endNodeName, hopSettings) {
            var hop = globalParam.SVG.createHop(hopSettings);
            hop.click(function (_self, ev) {
                var xmlHop = getXmlHop(_self.from.name, _self.to.name);
                if (_self.status == _self.statusEnum.ignore) {
                    _self.updateStatus(_self.statusEnum.success);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("Y");
                    $(xmlHop).children("unconditional").text("N");
                } else if (_self.status == _self.statusEnum.success) {
                    _self.updateStatus(_self.statusEnum.error);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("N");
                    $(xmlHop).children("unconditional").text("N");
                } else if (_self.status == _self.statusEnum.error) {
                    _self.updateStatus(_self.statusEnum.ignore);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("Y");
                    $(xmlHop).children("unconditional").text("Y");
                }
            });


            var svgStartNode = globalParam.svgNodeMap[startNodeName];
            svgStartNode.outHop[endNodeName] = hop;

            var svgEndNode = globalParam.svgNodeMap[endNodeName];
            svgEndNode.inHop[startNodeName] = hop;
            return hop;
        }
        //根据传进来的节点名字获取到节点
        var getXmlNode = function (nodeName) {
            var n = null;
            $(globalParam.xmlContent).find("nodes").children("node").each(function (nodeIndex, node) {
                var name = $(node).children("name").text();
                if (name == nodeName) {
                    n = node;
                }
            });
            return n;
        }

        var getXmlHop = function (fromNodeName, toNodeName) {
            var h = null;
            $(globalParam.xmlContent).find("hop").each(function (hopIndex, hop) {
                var from = $(hop).children("from").text();
                var to = $(hop).children("to").text();
                if (fromNodeName == from && toNodeName == to) {
                    h = hop;
                }
            });
            return h;
        }
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
        };
        var deleteHopByFromAndTo = function (from, to) {
            var hopArray = $(globalParam.xmlContent).find("hop");
            for (var index = 0; index < hopArray.length; index++) {
                //获取xml中的hop连线/**/
                var hop = $(hopArray[index]);
                if (hop.children("from").text() == from && hop.children("to").text() == to) {
                    hop.remove();
                }
            }
        }
        var hasHop = function (node1, node2) {
            for (var name in node1.inHop) {
                var hopIn = node1.inHop[name];
                if (hopIn.from.name == node1.name && hopIn.to.name == node2.name) {
                    hopIn.nested.remove();
                    deleteHopByFromAndTo(node1.name, node2.name);
                    return false;
                }
            }
            for (var name in node2.inHop) {
                var hopIn = node2.inHop[name];
                if (hopIn.from.name == node1.name && hopIn.to.name == node2.name) {
                    hopIn.nested.remove();
                    deleteHopByFromAndTo(node1.name, node2.name);
                    return false;
                }
            }
            return false;
        };

        var plugins = [
            {
                type: "start",
                name: "开始",
                x: 0,
                y: 0,
                selected: false,
                image: "images/start.jpg",
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
                image: "images/success.jpg",
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
                image: "images/error.png",
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
                image: "images/shell.png",
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
                image: "images/hive.png",
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
                image: "images/ssh.png",
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
                image: "images/kv.png",
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
                image: "images/mr.png",
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
                image: "images/python.png",
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
                image: "images/jar.png",
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
                image: "images/tedis.png",
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
                image: "images/spark_sql.png",
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
                image: "images/spark_jar.png",
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

        //xml到SVG对象的转换，频繁调用会闪瞎眼
        var xmlToSVG = function () {

            //画节点
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                var node = nodeArray[index];
                var $node = $(node);
                var selected = $node.attr("selected");
                var nodeSettings = {};
                nodeSettings['type'] = $node.children("type").text();
                nodeSettings['name'] = $node.children("name").text();
                nodeSettings['label'] = $node.children("properties").children("label").text();
                nodeSettings['x'] = parseInt($node.attr("x"));
                nodeSettings['y'] = parseInt($node.attr("y"));
                nodeSettings['image'] = $node.attr("image");
                nodeSettings['background'] = $node.attr("background") || "";
                nodeSettings['fontSize'] = $node.attr("fontsize") || "";
                nodeSettings['fontColor'] = $node.attr("fontcolor") || "";
                nodeSettings['menusParentStyle'] = $node.attr("menusparentstyle") || "";
                nodeSettings['mouseHoverShowHtmlClick'] = $node.attr("mousehovershowhtmlclick") || "";
                nodeSettings['nodeBorder'] = config.nodeBorder;
                nodeSettings['globalRightClickMenu'] = config.globalRightClickMenu;
                nodeSettings['menusParentClassName'] = $node.attr("menusparentclassname") || "";
                nodeSettings['beforeDeleteClick'] = $node.attr("beforedeleteclick") || "";
                nodeSettings['afterDeleteClick'] = $node.attr("afterdeleteclick") || "";
                nodeSettings['nodeDblclick'] = $node.attr("nodedblclick") || "";
                var menusArray = [];
                var menus = $node.children("menus");
                if (menus != null) {
                    var menuArray = menus.find("menu");
                    //alert(menuArray.length);
                    for (var i = 0; i < menuArray.length; i++) {
                        var menuNode = $(menuArray[i]);
                        menusArray.push({
                            "name": menuNode.children("name").text(),
                            "click": menuNode.children("click_event").text()
                        });
                    }
                }
                nodeSettings['menus'] = menusArray;
                nodeSettings['beforeDelete'] = function (nodeName) {
                    var beforeDeleteClick = $(getXmlNode(nodeName)).attr("beforedeleteclick");
                    if (beforeDeleteClick != null && beforeDeleteClick != "") {
                        eval(beforeDeleteClick + "(_self.getNodeByName(nodeName))");
                    }
                    return true
                }

                nodeSettings['afterDelete'] = function (nodeName) {
                    //if(nodeSettings['afterDeleteClick'] != ""){
                    //    eval(nodeSettings['afterDeleteClick']+"()");
                    //}
                }
                nodeSettings['menusBaseDeleteItem'] = config.menusBaseDeleteItem;
                var newNode = createNodeBindEvents(nodeSettings);
                newNode.dblclick(function (_self, ev) {
                    if(config.showProperty){
                        container.propertyPop(getXmlNode(_self.name));
                    }else {
                        var nodeDblClick = $(getXmlNode(_self.name)).attr("nodedblclick");
                        if (nodeDblClick != null && nodeDblClick != "" && nodeDblClick != undefined && nodeDblClick != "showproperty") {
                            eval(nodeDblClick + "(_self.name)");
                        } else if (nodeDblClick == "showproperty") {
                            container.propertyPop(getXmlNode(_self.name));
                        }
                    }
                });
            }


            //划连线
            var hopArray = $(globalParam.xmlContent).find("hop");
            for (var index = 0; index < hopArray.length; index++) {
                var hop = hopArray[index];
                var startNodeName = $(hop).children("from").text();
                var endNodeName = $(hop).children("to").text();
                var enabled = $(hop).children("enabled").text();
                var evaluation = $(hop).children("evaluation").text();
                var unconditional = $(hop).children("unconditional").text();
                var label = $(hop).children("properties").children("label").text();
                var waterClass = $(hop).attr("waterclass");

                //计算连线的起点终点
                var r = 23;
                var startNode = getXmlNode(startNodeName);
                var x1 = parseInt($(startNode).attr("x"));
                var y1 = parseInt($(startNode).attr("y"));


                var endNode = getXmlNode(endNodeName);
                var x2 = parseInt($(endNode).attr("x"));
                var y2 = parseInt($(endNode).attr("y"));


                var startX = x1 + Math.round(((x2 - x1) * r) / Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
                var startY = y1 + Math.round(((y2 - y1) * r) / Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
                var endX = x2 - Math.round(((x2 - x1) * r) / Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
                var endY = y2 - Math.round(((y2 - y1) * r) / Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));

                var hopSettings = {};
                hopSettings['lineCircle'] = config.lineCircle;
                hopSettings['lineTriangle'] = config.lineTriangle;
                hopSettings['from'] = globalParam.svgNodeMap[startNodeName];
                hopSettings['to'] = globalParam.svgNodeMap[endNodeName];
                hopSettings['label'] = label;
                hopSettings['startX'] = x1;
                hopSettings['startY'] = y1;
                hopSettings['endX'] = x2;
                hopSettings['endY'] = y2;
                hopSettings['status'] = "success";
                hopSettings['menusParentStyle'] = config.menusParentStyle;
                hopSettings['waterClass'] = waterClass;
                if (enabled == "Y" && unconditional == "N" && evaluation == "Y") {
                    hopSettings['status'] = "success";
                } else if (enabled == "Y" && unconditional == "N" && evaluation == "N") {
                    hopSettings['status'] = "error";
                } else if (enabled == "Y" && unconditional == "Y" && evaluation == "Y") {
                    hopSettings['status'] = "ignore";
                }
                hopSettings['beforeDelete'] = function (fromNodeName, toNodeName) {
                    if (config.hopBeforeDeleteClick != "") {
                        eval(config.hopBeforeDeleteClick + "('" + fromNodeName + "','" + toNodeName + "')");
                    }
                    return true;
                }

                hopSettings['afterDelete'] = function (fromNodeName, toNodeName) {
                    if (config.hopAfterDeleteClick != "") {
                        eval(config.hopAfterDeleteClick + "('" + fromNodeName + "','" + toNodeName + "')");
                    }
                }
                hopSettings['menusBaseDeleteItem'] = config.menusBaseDeleteItem;
                createHopBindEvents(startNodeName, endNodeName, hopSettings);
            }
        };

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

        };
        //提供外部函数 根据节点id前缀(即name前缀)判断该节点是否已经存在
        _self.getNodeArrayByNamePrefix = function (nodeNamePrefix) {
            var resultArray = new Array();
            var s = globalParam.svgNodeMap;
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                var node = $(nodeArray[index]);
                var name = node.children("name").text();
                if (name.indexOf(nodeNamePrefix) > -1) {
                    var svgNode = globalParam.svgNodeMap[name];
                    var nodeResult = {};
                    $(node.children()).each(function (i, firstLevelNode) {
                        var firstChildName = $(firstLevelNode)[0].nodeName;
                        var firstChildNodeValue = $(firstLevelNode)[0].childNodes[0].nodeValue;
                        if (firstChildNodeValue == null && firstChildName != 'menus') {
                            var properties = {};
                            $(node.children(firstChildName).children()).each(function (n, secondLevelNode) {
                                var secondChildName = $(secondLevelNode)[0].nodeName;
                                var secondChildNodeValue = $(secondLevelNode)[0].childNodes[0].nodeValue
                                if (secondChildNodeValue == null) {
                                    var propertiesSecond = {};
                                    $(node.children(firstChildName).children(secondChildName).children()).each(function (s, thirdLevelNode) {
                                        var thirdChileName = $(thirdLevelNode)[0].nodeName;
                                        var thirdChildNodeValue = $(thirdLevelNode)[0].childNodes[0].nodeValue;
                                        propertiesSecond[thirdChileName] = thirdChildNodeValue;
                                    });
                                    properties[secondChildName] = propertiesSecond;
                                } else {
                                    properties[$(secondLevelNode)[0].nodeName] = secondChildNodeValue;
                                }
                                //properties[$(secondLevelNode)[0].nodeName] = $(secondLevelNode)[0].childNodes[0].nodeValue;
                            });
                            nodeResult[firstChildName] = properties;
                        } else if (firstChildNodeValue == null && firstChildName == 'menus') {
                            var menusArray = new Array();
                            $(node.children("menus").children()).each(function (s, menuNode) {
                                var name = $(menuNode).children("name").text();
                                var clickEvent = $(menuNode).children("click_event").text()
                                menusArray.push({"name": name, "click": clickEvent});
                            });
                            nodeResult["menus"] = menusArray;
                        } else {
                            nodeResult[firstChildName] = firstChildNodeValue;
                        }
                    })
                    nodeResult["x"] = svgNode.x;
                    nodeResult["y"] = svgNode.y;
                    resultArray.push(nodeResult);
                }
            }
            return resultArray;
        };
        //提供外部函数 根据节点全称获取节点
        _self.getNodeByName = function (nodeName) {
            var s = globalParam.svgNodeMap;
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                var node = $(nodeArray[index]);
                var name = node.children("name").text();
                if (name == nodeName) {
                    var svgNode = globalParam.svgNodeMap[name];
                    var nodeResult = {};
                    $(node.children()).each(function (i, firstLevelNode) {
                        var firstChildName = $(firstLevelNode)[0].nodeName;
                        var firstChildNodeValue = $(firstLevelNode)[0].childNodes[0].nodeValue;
                        if (firstChildNodeValue == null && firstChildName != 'menus') {
                            var properties = {};
                            $(node.children(firstChildName).children()).each(function (n, secondLevelNode) {
                                var secondChildName = $(secondLevelNode)[0].nodeName;
                                var secondChildNodeValue = $(secondLevelNode)[0].childNodes[0].nodeValue
                                if (secondChildNodeValue == null) {
                                    var propertiesSecond = {};
                                    $(node.children(firstChildName).children(secondChildName).children()).each(function (s, thirdLevelNode) {
                                        var thirdChileName = $(thirdLevelNode)[0].nodeName;
                                        var thirdChildNodeValue = $(thirdLevelNode)[0].childNodes[0].nodeValue;
                                        propertiesSecond[thirdChileName] = thirdChildNodeValue;
                                    });
                                    properties[secondChildName] = propertiesSecond;
                                } else {
                                    properties[$(secondLevelNode)[0].nodeName] = secondChildNodeValue;
                                }
                                //properties[$(secondLevelNode)[0].nodeName] = $(secondLevelNode)[0].childNodes[0].nodeValue;
                            });
                            nodeResult[firstChildName] = properties;
                        } else if (firstChildNodeValue == null && firstChildName == 'menus') {
                            var menusArray = new Array();
                            $(node.children("menus").children()).each(function (s, menuNode) {
                                var name = $(menuNode).children("name").text();
                                var clickEvent = $(menuNode).children("click_event").text();
                                menusArray.push({"name": name, "click": clickEvent});
                            });
                            nodeResult["menus"] = menusArray;
                        } else {
                            nodeResult[firstChildName] = firstChildNodeValue;
                        }
                    })
                    nodeResult["x"] = svgNode.x;
                    nodeResult["y"] = svgNode.y;
                    return nodeResult;
                }
            }
        };
        // 提供外部函数 导出 xml 内容
        _self.getXmlContent = function () {

            return globalParam.xmlContent;
        };
        //提供外部函数 清空画布

        _self.cleanSvg = function () {
            var s = globalParam.svgNodeMap;
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                //获取xml中的node
                var node = $(nodeArray[index]);
                var name = node.children("name").text();
                //alert(name);
                node.remove();
                //获取svg中的node

                var svgNode = globalParam.svgNodeMap[name];
                svgNode.nested.remove();
                //删除svg节点对象的的相关连线
                for (var name in svgNode.inHop) {
                    var hopIn = svgNode.inHop[name];
                    hopIn.nested.remove();
                }
                for (var name in svgNode.outHop) {
                    var hopOut = svgNode.outHop[name];
                    hopOut.nested.remove();
                }
            }
            var hopArray = $(globalParam.xmlContent).find("hop");
            for (var index = 0; index < hopArray.length; index++) {
                //获取xml中的hop连线/**/
                //alert($(hopArray[index]));
                $(hopArray[index]).remove();
            }
        }
        //添加自定义节点
        _self.addNodeFromJson = function (nodeSettings) {
            nodeSettings['name'] = nodeSettings['name'] + '_' + new UUID().toString();
            var image = nodeSettings['image'] || "";
            var type = nodeSettings['type'] || "";
            var name = nodeSettings['name'] || "";
            var label = nodeSettings['label'] || "";
            var x = nodeSettings['x'] || 100;
            var y = nodeSettings['y'] || 100;
            var layout = nodeSettings['layout'];
            var background = nodeSettings['background'] || "#FFFFFF";
            var fontSize = nodeSettings['fontSize'] || 12;
            var fontColor = nodeSettings['fontColor'] || "#2C0C35";
            var menusParentStyle = nodeSettings['menusParentStyle'] || "";
            var menusParentClassName = nodeSettings['menusParentClassName'] || "";
            var mouseHoverShowHtmlClick = nodeSettings['mouseHoverShowHtmlClick'] || "";
            var beforeDeleteClick = nodeSettings['beforeDeleteClick'] || "";
            var afterDeleteClick = nodeSettings['afterDeleteClick'] || "";
            var nodeDblClick = nodeSettings['nodeDblClick'] || "";
            nodeSettings['menusBaseDeleteItem'] = config.menusBaseDeleteItem || false;
            nodeSettings['nodeBorder'] = config.nodeBorder;
            nodeSettings['globalRightClickMenu'] = config.globalRightClickMenu
            nodeSettings['container'] = container;
            nodeSettings['selected'] = false;
            nodeSettings['beforeDelete'] = function (nodeName) {
                if (nodeSettings['beforeDeleteClick'] != null && nodeSettings['beforeDeleteClick'] != "" && nodeSettings['beforeDeleteClick'] != undefined) {
                    eval(nodeSettings['beforeDeleteClick'] + "(_self.getNodeByName(nodeName))");
                }
                return true;
            }

            nodeSettings['afterDelete'] = function (nodeName) {
                if (nodeSettings['afterDeleteClick'] != null && nodeSettings['afterDeleteClick'] != "" && nodeSettings['afterDeleteClick'] != undefined) {
                    eval(nodeSettings['afterDeleteClick'] + "()");
                }
            }
            var menuString = "";
            if (nodeSettings['menus'] != null && nodeSettings['menus'] != "") {
                for (var i = 0; i < nodeSettings['menus'].length; i++) {
                    menuString = menuString + '<menu>' +
                    '<name>' + nodeSettings['menus'][i]['name'] + '</name>' +
                    '<click_event>' + nodeSettings['menus'][i]['click'] + '</click_event>' +
                    '</menu>';
                }
                if (menuString != "") {
                    menuString = '<menus>' + menuString + '</menus>'
                }
            }
            var propertiesString = "";
            if (nodeSettings['properties'] != null && nodeSettings['properties'] != "") {
                for (var i = 0; i < nodeSettings['properties'].length; i++) {
                    var firstObj = nodeSettings['properties'][i];
                    var secondLevelString = "";
                    for (var str in firstObj) {
                        if (firstObj[str] != null && typeof (firstObj[str]) == "object") {
                            var secondObj = firstObj[str];
                            var secondLevelString = "";
                            for (var str2 in secondObj) {
                                secondLevelString = secondLevelString + '<' + str2 + '>' + secondObj[str2] + '</' + str2 + '>\n';
                            }
                            if (secondLevelString != "") {
                                secondLevelString = '<' + str + '>' + secondLevelString + '</' + str + '>\n'
                            }
                            propertiesString = propertiesString + secondLevelString;
                        } else {
                            propertiesString = propertiesString + '<' + str + '>' + firstObj[str] + '</' + str + '>\n';
                        }
                    }
                }
            }
            var newNodeString =
                '<node selected="true" ' +
                'x="' + x + '" ' +
                'y="' + y + '" ' +
                'image="' + image + '" ' +
                'layout="' + layout + '" ' +
                'fontsize="' + fontSize + '" ' +
                'background="' + background + '" ' +
                'fontcolor="' + fontColor + '" ' +
                'menusparentStyle="' + menusParentStyle + '" ' +
                'mousehovershowhtmlclick="' + mouseHoverShowHtmlClick + '" ' +
                'menusparentClassname="' + menusParentClassName + '" ' +
                'beforedeleteclick="' + beforeDeleteClick + '" ' +
                'afterdeleteclick="' + afterDeleteClick + '" ' +
                'nodedblclick="' + nodeDblClick + '">\n' +
                '<type>' + type + '</type>\n' +
                '<name>' + name + '</name>\n' +
                '<properties>' +
                '<label>' + label + '</label>\n' +
                propertiesString +
                '</properties>' +
                menuString +
                '</node>';
            if (window.ActiveXObject) {
                var xmlContent = globalParam.xmlContent.xml;
                xmlContent = xmlContent.replace("</nodes>", newNodeString + "\r</nodes>");
                globalParam.xmlContent = parseStringToXmlDocument(xmlContent);
            } else {
                $(globalParam.xmlContent).find("nodes").append($(newNodeString));
            }
            var newNode = createNodeBindEvents(nodeSettings);
            newNode.dblclick(function (_self, ev) {
                if(config.showProperty){
                    container.propertyPop(getXmlNode(_self.name));
                }else {
                    if (nodeDblClick != "" && nodeDblClick != "showproperty") {
                        eval(nodeDblClick + "(_self.name)");
                    } else if (nodeDblClick == "showproperty") {
                        container.propertyPop(getXmlNode(_self.name));
                    }
                }
            });

        }
        //改变连线的颜色和和描述
        _self.changeLine = function (lineInfoSettings) {
            var fromName = lineInfoSettings.from;
            var toName = lineInfoSettings.to;
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                //获取xml中的node
                var node = $(nodeArray[index]);
                //var name = node.children("name").text();
                var nodeName = "";
                if (node.children("name").text() == fromName) {
                    nodeName = fromName;
                }
                if (node.children("name").text() == toName) {
                    nodeName = toName;
                }
                var svgNode = globalParam.svgNodeMap[nodeName];
                //svgNode.nested.remove();
                //删除svg节点对象的的相关连线
                //alert(svgNode.inHop[name]);

                var hopSvg = null;
                var fromNode = globalParam.svgNodeMap[fromName];
                for (var name in fromNode.inHop) {
                    var hopIn = fromNode.inHop[name];
                    if (hopIn.from.name == fromName && hopIn.to.name == toName) {
                        hopSvg = hopIn;
                        break;
                    }
                }
                if (hopSvg == null) {
                    var toNode = globalParam.svgNodeMap[toName];
                    for (var name in toNode.inHop) {
                        var hopOut = toNode.inHop[name];
                        if (hopOut.from.name == fromName && hopOut.to.name == toName) {
                            hopSvg = hopOut;
                            break;
                        }
                    }
                }


                _self = hopSvg;
                var twoThirdX = _self.startX + (_self.endX - _self.startX) / 3 * 2;
                var twoThirdY = _self.startY + (_self.endY - _self.startY) / 3 * 2;
                var oneThirdX = _self.startX + (_self.endX - _self.startX) / 3;
                var oneThirdY = _self.startY + (_self.endY - _self.startY) / 3;
                //_self.status = _self.statusEnum.error;
                _self.status = lineInfoSettings.lineStatusAndColor["status"];
                var iconPath = _self.successIconPath(oneThirdX, oneThirdY);
                var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                _self.content['outerPath'].attr({
                    "stroke": lineInfoSettings.lineStatusAndColor["color"],
                    "stroke-width": 1,
                    "fill": lineInfoSettings.lineStatusAndColor["color"],
                    d: arrowPath
                });
                _self.content['innerPath'].attr({
                    "stroke": lineInfoSettings.lineStatusAndColor["color"],
                    "stroke-width": 1,
                    "fill": lineInfoSettings.lineStatusAndColor["color"],
                    d: arrowPath
                });
                if (config.lineCircle) {
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": lineInfoSettings.lineStatusAndColor["color"]});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                }

                _self.content['label'].text(lineInfoSettings.label);
                var xmlHop = getXmlHop(_self.from.name, _self.to.name);
                if (_self.status == _self.statusEnum.success) {
                    _self.updateStatus(_self.statusEnum.success);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("Y");
                    $(xmlHop).children("unconditional").text("N");
                } else if (_self.status == _self.statusEnum.error) {
                    _self.updateStatus(_self.statusEnum.error);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("N");
                    $(xmlHop).children("unconditional").text("N");
                } else if (_self.status == _self.statusEnum.ignore) {
                    _self.updateStatus(_self.statusEnum.ignore);
                    $(xmlHop).children("enabled").text("Y");
                    $(xmlHop).children("evaluation").text("Y");
                    $(xmlHop).children("unconditional").text("Y");
                }
                $(xmlHop).find("properties").children("label").text(lineInfoSettings.label);
                _self.updateStatus(_self.status);
            }
        };
        //使线变为流动
        _self.openOrCloseTap = function (openSetting) {

            var fromName = openSetting['from'];
            var toName = openSetting['to'];
            var waterClass = openSetting['waterClass'] || "";
            var hopSvg = null;
            var fromNode = globalParam.svgNodeMap[fromName];
            for (var name in fromNode.inHop) {
                var hopIn = fromNode.inHop[name];
                if (hopIn.from.name == fromName && hopIn.to.name == toName) {
                    hopSvg = hopIn;
                    break;
                }
            }
            if (hopSvg == null) {
                var toNode = globalParam.svgNodeMap[toName];
                for (var name in toNode.inHop) {
                    var hopOut = toNode.inHop[name];
                    if (hopOut.from.name == fromName && hopOut.to.name == toName) {
                        hopSvg = hopOut;
                        break;
                    }
                }
            }
            _self = hopSvg;
            //alert("开始："+hopSvg.from.name +"结束："+ hopSvg.to.name);
            var twoThirdX = _self.startX + (_self.endX - _self.startX) / 3 * 2;
            var twoThirdY = _self.startY + (_self.endY - _self.startY) / 3 * 2;
            var oneThirdX = _self.startX + (_self.endX - _self.startX) / 3;
            var oneThirdY = _self.startY + (_self.endY - _self.startY) / 3;
            var iconPath = _self.successIconPath(oneThirdX, oneThirdY);
            var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
            _self.content['outerPath'].attr({
                "class": waterClass,
                d: arrowPath
            });
            _self.updateStatus(_self.status);
            //更改xml内容
            var xmlHop = getXmlHop(fromName, toName);
            $(xmlHop).attr("waterclass", waterClass);

        }
        //更新节点
        _self.updateNode = function (nodeSettings) {
            var svgNode = globalParam.svgNodeMap[nodeSettings['name']];
            _self = svgNode;
            var label = nodeSettings['label'] || _self.label;
            var text = _self.nested.text(getMaxText(label)).font({"size": _self.fontSize});
            var textWidth = text.length();
            text.remove();
            var textX = _self.width / 2 - (textWidth / 2);
            var textY = _self.height + _self.border * 2 + 2;
            var rectWidth = _self.width;
            var rectHeight = _self.height;
            var textNumber = label.split("\n").length;
            if (textNumber > 1) {
                //真实的宽度
                var textWidthTrue = textWidth;
                textX = _self.width;
                textY = 0;
                rectWidth = _self.width + textWidthTrue + 2;
                rectHeight = 1.4 * _self.fontSize * (textNumber);
            }

            _self.type = nodeSettings['type'] || _self.type;
            _self.label = nodeSettings['label'] || _self.label;
            _self.x = nodeSettings['x'] || _self.x;
            _self.y = nodeSettings['y'] || _self.y;
            _self.image = nodeSettings['image'] || _self.image;
            _self.width = nodeSettings['width'] || _self.width;
            _self.height = nodeSettings['height'] || _self.height;
            _self.border = nodeSettings['border'] || _self.border;
            _self.fontSize = nodeSettings['fontSize'] || _self.fontSize;
            _self.fontColor = nodeSettings['fontColor'] || _self.fontColor;
            _self.background = nodeSettings['background'] || _self.background;
            _self.menus = nodeSettings['menus'] || _self.menus;
            _self.beforeDeleteClick = nodeSettings['beforeDeleteClick'] || _self.beforeDeleteClick;
            if (nodeSettings['menusParentStyle'] != null || nodeSettings['menusParentClassName'] != null) {
                _self.menusParentStyle = nodeSettings['menusParentStyle'] || "";
                _self.menusParentClassName = nodeSettings['menusParentClassName'] || "";
            } else {
                _self.menusParentStyle = nodeSettings['menusParentStyle'] || _self.menusParentStyle;
                _self.menusParentClassName = nodeSettings['menusParentClassName'] || _self.menusParentClassName;
            }
            _self.mouseHoverShowHtmlClick = nodeSettings['mouseHoverShowHtmlClick'] || _self.mouseHoverShowHtmlClick;
            _self.mouseHover = false;
            _self.deltaX = 21;
            _self.deltaY = 21;
            _self.nodeBorder = nodeSettings['nodeBorder'] || _self.nodeBorder;
            _self.container = nodeSettings['container'] || _self.container;
            _self.globalRightClickMenu = nodeSettings['globalRightClickMenu'] || _self.globalRightClickMenu;
            _self.menus = nodeSettings['menus'];
            _self.content['rect'].attr("fill", _self.background);
            _self.content['rect'].width(rectWidth);
            _self.content['rect'].height(rectHeight);
            _self.content['text'].text(label).font({"size": _self.fontSize}).attr({
                "fill": _self.fontColor
            });

            //"fill": _self.background, /**/
            _self.content['image'].attr({
                "href": _self.image
            });
            _self.content['image'].x(_self.border).y(rectHeight / 2 - _self.height / 2 + _self.border);
            //alert(_self.content['image'].a);
            _self.updatePosition(_self.x, _self.y);


            var nodeXml = $(getXmlNode(nodeSettings['name']));
            nodeXml.find("properties").children("label").text(label);

            if (nodeSettings['menus'] != null && nodeSettings['menus'] != "") {
                var menuString = "";
                for (var i = 0; i < nodeSettings['menus'].length; i++) {
                    menuString = menuString + '<menu>' +
                    '<name>' + nodeSettings['menus'][i]['name'] + '</name>' +
                    '<click_event>' + nodeSettings['menus'][i]['click'] + '</click_event>' +
                    '</menu>';
                }
                nodeXml.find("menus").text(menuString);
            }
            if (nodeSettings['properties'] != null && nodeSettings['properties'].length > 0) {
                var propertiesString = "";
                for (var i = 0; i < nodeSettings['properties'].length; i++) {
                    var firstObj = nodeSettings['properties'][i];
                    var secondLevelString = "";
                    for (var str in firstObj) {
                        if (firstObj[str] != null && typeof (firstObj[str]) == "object") {
                            var secondObj = firstObj[str];
                            var secondLevelString = "";
                            for (var str2 in secondObj) {
                                secondLevelString = secondLevelString + '<' + str2 + '>' + secondObj[str2] + '</' + str2 + '>\n';
                            }
                            if (secondLevelString != "") {
                                secondLevelString = '<' + str + '>' + secondLevelString + '</' + str + '>\n'
                            }
                            propertiesString = propertiesString + secondLevelString;
                        } else {
                            propertiesString = propertiesString + '<' + str + '>' + firstObj[str] + '</' + str + '>\n';
                        }
                    }
                }
                propertiesString = '<label>' + label + '</label>\n' + propertiesString;
                nodeXml.find("properties").text(propertiesString);
            }

            nodeXml.attr("x", _self.x);
            nodeXml.attr("y", _self.y);
            nodeXml.attr("image", _self.image);
            nodeXml.attr("fontsize", _self.fontSize);
            nodeXml.attr("background", _self.background);
            nodeXml.attr("fontcolor", _self.fontColor);
            nodeXml.attr("menusparentstyle", _self.menusParentStyle);
            nodeXml.attr("menusparentclassname", _self.menusParentClassName);
            nodeXml.attr("beforedeleteclick", _self.beforeDeleteClick);
            var xmlDom = globalParam.xmlContent;
            var xmlString = '';
            if (xmlDom.xml) {//不在IE中,会返回undefined
                xmlString = xmlDom.xml;
            } else {
                xmlString = new XMLSerializer().serializeToString(xmlDom);
            }
            xmlString = xmlString.replace(new RegExp("&lt;", 'gm'), "<").replace(new RegExp("&gt;", 'gm'), ">").replace(new RegExp("&amp;", 'gm'), "&");
            globalParam.xmlContent = parseStringToXmlDocument(xmlString);
        }


        // 启动插件
        _init();
        // 链式调用
        return this;
    };

    var getMaxText = function (text) {
        var textArray = text.split("\n");
        var text = "";
        var n = 0;
        for (var i = 0; i < textArray.length; i++) {
            var testText = textArray[i].replace(/(^\s*)|(\s*$)/g, '');
            if (testText.length > n) {
                n = testText.length;
                text = testText;
            }
        }
        return text;
    }
    var svgWorkflow = function (container, svgSetting) {
        var svgNode;
        var _workflow = this;
        //全局参数
        var globalParam = {
            SVG: SVG($(container)[0]),
            contextMenu: function () {
            }
        };

        //工厂方法产生新节点
        _workflow.createNode = function (nodeSettings) {
            return new svgNode(nodeSettings);
        };

        //工厂方法产生新节点连线
        _workflow.createHop = function (hopSettings) {

            return new svgHop(hopSettings);
        };

        //工厂方法产生菜单外框
        _workflow.createMenu = function (x, y) {
            return new menu(x, y);
        };

        //工厂方法产生菜单项
        _workflow.createMenuItem = function (menuName, clickFunction) {
            return new menuItem(menuName, clickFunction);
        };

        _workflow.createTempHop = function (startX, startY, endX, endY) {
            var arrowPath = function (startX, startY, endX, endY, arrowX, arrowY) {
                var arrowHeight = 13;
                var arrowWidth = 4;
                var angle = Math.atan2(endY - startY, endX - startX);
                var path = "M " + startX + "," + startY
                    + " L " + endX + "," + endY
                    + " M " + arrowX + "," + arrowY
                    + " L " + (arrowX - arrowHeight * Math.cos(angle) - arrowWidth * Math.sin(angle))
                    + "," + (arrowY - arrowHeight * Math.sin(angle) + arrowWidth * Math.cos(angle))
                    + " L " + (arrowX - arrowHeight * Math.cos(angle) + arrowWidth * Math.sin(angle))
                    + "," + (arrowY - arrowHeight * Math.sin(angle) - arrowWidth * Math.cos(angle))
                    + " M " + arrowX + "," + arrowY
                    + " L " + (arrowX - arrowHeight * Math.cos(angle) + arrowWidth * Math.sin(angle))
                    + "," + (arrowY - arrowHeight * Math.sin(angle) - arrowWidth * Math.cos(angle))
                    + " M " + arrowX + "," + arrowY
                    + " Z ";
                return path;
            };
            var twoThirdX = startX + (endX - startX) / 3 * 2;
            var twoThirdY = startY + (endY - startY) / 3 * 2;
            var arrowPath = arrowPath(startX, startY, endX, endY, twoThirdX, twoThirdY);
            var outerPath = globalParam.SVG.path(arrowPath).attr({
                "stroke": "#00DD00",
                "stroke-width": 1,
                "fill": "#00DD00"
            });
            return outerPath;
        }

        _workflow.getMousePosition = function (evt) {
            return {
                //获取当前鼠标位置，考虑滚动条，若不支持pageX/pageY属性，则通过自行计算得到
                x: evt.pageX - $(container).offset().left || evt.clientX + document.body.scrollLeft - document.body.clientLeft - $(container).offset().left,
                y: evt.pageY - $(container).offset().top || evt.clientY + document.body.scrollTop - document.body.clientTop - $(container).offset().top
            }
        };

        //生成菜单父层
        var menu = function (x, y, nodeSettings) {
            var rightClickMenuDivStyle = svgSetting.menusParentStyle;
            var menus = "";
            //alert(nodeSettings['menusParentStyle'] + " " + nodeSettings['menusParentClassName']);
            if (nodeSettings['menusParentStyle'] != "" || nodeSettings['menusParentClassName'] != "") {
                menus = $('<div id="rightClickMenuDiv" style="' + nodeSettings['menusParentStyle'] + '" class="' + nodeSettings['menusParentClassName'] + '">' +
                '<ul style="list-style:none; margin:0px; padding-left: 0px; padding-top: 2px; padding-bottom: 2px;" id="menuListUl"></ul></div>');
            } else if (nodeSettings['menusParentStyle'] == "" && nodeSettings['menusParentClassName'] == "") {
                menus = $('<div id="rightClickMenuDiv" style="' + rightClickMenuDivStyle + '" class="' + nodeSettings['menusParentClassName'] + '">' +
                '<ul style="list-style:none; margin:0px; padding-left: 0px; padding-top: 2px; padding-bottom: 2px;" id="menuListUl"></ul></div>');
            }

            //右键菜单坐标
            $(menus).css("margin-left", (x - 3) + "px");
            $(menus).css("margin-top", (y - 3) + "px");
            menus.addMenuItem = function (menuItem) {
                var _menus = menus;
                $(menuItem).click(function () {
                    $(_menus).detach();
                });
                $(_menus).find("#menuListUl").append(menuItem);
            }
            menus.removeOld = function () {
                $(container).find("#rightClickMenuDiv").remove();
            }
            return menus;
        };

        //生成菜单项
        var menuItem = function (menuName, clickFunction) {
            var menuItem = $('<li style="list-style:none; height: 20px; margin: 1px; padding-left: 6px; padding-right: 6px; font-size: 12px; line-height: 20px;color:#505555;">' + menuName + '</li>');
            $(menuItem).click(function () {
                if (Object.prototype.toString.call(clickFunction) === '[object Function]') {
                    eval(clickFunction)();
                } else {
                    eval(clickFunction);
                }
            });
            $(menuItem).hover(function () {
                $(this).css({"background-color": '#0084dd', "color": "#FFFFFF", "cursor": "pointer"});
            }, function () {
                $(this).css("background-color", "").css("color", "#505555").css("cursor", "default");
            });
            return menuItem;
        };
        var deleteXmlNote = function (name) {
            //alert(svgSetting.xmlContent);
            var nodeArray = $(svgSetting.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                var node = $(nodeArray[index]);
                //alert(node.children("name").text());
                if (node.children("name").text() == name) {
                    node.remove();
                }
            }
        }
        var deleteHopByNoteName = function (name) {
            var hopArray = $(svgSetting.xmlContent).find("hop");
            for (var index = 0; index < hopArray.length; index++) {
                //获取xml中的hop连线/**/
                var hop = $(hopArray[index]);
                if (hop.children("from").text() == name || hop.children("to").text() == name) {
                    hop.remove();
                }
            }
        }
        var deleteHopByFromAndTo = function (from, to) {
            var hopArray = $(svgSetting.xmlContent).find("hop");
            for (var index = 0; index < hopArray.length; index++) {
                //获取xml中的hop连线/**/
                var hop = $(hopArray[index]);
                if (hop.children("from").text() == from && hop.children("to").text() == to) {
                    hop.remove();
                }
            }
        }

        //私有方法
        svgNode = function (nodeSettings) {
            var _self = this;
            _self.nested = globalParam.SVG.nested();
            _self.content = {};
            _self.inHop = {};
            _self.outHop = {};
            _self.selected = nodeSettings['selected'] || false;
            _self.type = nodeSettings['type'];
            _self.name = nodeSettings['name'] || "";
            _self.label = nodeSettings['label'] || "";
            _self.x = nodeSettings['x'] || 0;
            _self.y = nodeSettings['y'] || 0;
            _self.image = nodeSettings['image'] || "";
            _self.nested.x(_self.x).y(_self.y);
            _self.width = nodeSettings['width'] || 42;
            _self.height = nodeSettings['height'] || 42;
            _self.border = nodeSettings['border'] || 1;
            _self.fontSize = nodeSettings['fontSize'] || 12;
            _self.fontColor = nodeSettings['fontColor'] || "#2C0C35"
            _self.background = nodeSettings['background'] || "#FFFFFF";
            _self.menus = nodeSettings['menus'] || "";
            _self.menusParentStyle = nodeSettings['menusParentStyle'] || "";
            _self.menusParentClassName = nodeSettings['menusParentClassName'] || "";
            _self.mouseHoverShowHtmlClick = nodeSettings['mouseHoverShowHtmlClick'] || "";
            _self.mouseHover = false;
            _self.deltaX = 21;
            _self.deltaY = 21;
            _self.nodeBorder = nodeSettings['nodeBorder'];
            _self.container = nodeSettings['container'];
            _self.globalRightClickMenu = nodeSettings['globalRightClickMenu'];

            _self.beforeDelete = nodeSettings['beforeDelete'] || function (nodeName) {
                return true;
            };
            _self.afterDelete = nodeSettings['afterDelete'] || function (nodeName) {
                return true;
            };
            _self.menusBaseDeleteItem = nodeSettings['menusBaseDeleteItem'] || false;
            //节点文字
            //font({"size": 12})
            var text = _self.nested.text(getMaxText(_self.label)).font({"size": _self.fontSize});
            var textWidth = text.length();
            var textX = _self.width / 2 - (textWidth / 2);
            var textY = _self.height + _self.border * 2 + 2;
            var rectWidth = _self.width;
            var rectHeight = _self.height;
            var textNumber = _self.label.split("\n").length;
            if (textNumber > 1) {
                //真实的宽度
                var textWidthTrue = textWidth;
                //textWidth = textWidth / 3;
                textX = _self.width;
                textY = 0;
                rectWidth = _self.width + textWidthTrue + 2;
                rectHeight = 1.4 * _self.fontSize * (textNumber);
            }
            var rect = this.nested.rect(rectWidth, rectHeight).attr({
                "fill": _self.background, /**/
                "stroke-width": _self.nodeBorder,
                "stroke": "#444444",
                "rx": 2,
                "ry": 2
            });
            _self.content['rect'] = rect;
            var textNow = _self.nested.text(_self.label).font({"size": _self.fontSize}).attr({
                "fill": _self.fontColor
            });
            text.remove();
            textNow.x(textX).y(textY);
            _self.content['text'] = textNow;

            if (_self.selected) {
                rect.attr({"stroke": "#0000FF"});
            } else {
                rect.attr({"stroke": "#000000"});
            }

            var image = _self.nested.image(_self.image, _self.width - _self.border * 2, _self.height - _self.border * 2).x(_self.border).y(rectHeight / 2 - _self.height / 2 + _self.border);
            _self.content['image'] = image;


            _self.nested.mousemove(function (ev) {
                globalParam.contextMenu = function (ev) {
                    var p = _workflow.getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    y = y - $(container).height();
                    //菜单组
                    nodeSettings['menusParentStyle'] = _self.menusParentStyle;

                    nodeSettings['menusParentClassName'] = _self.menusParentClassName;
                    var contextMenuContent = new menu(x, y, nodeSettings);

                    //菜单项1删除节点 所有节点默认右键菜单

                    if (_self.menusBaseDeleteItem) {
                        var deleteNodeContextMenuItem = new menuItem("删除节点", function () {
                            if (_self.beforeDelete(_self.name)) {
                                ////删除svg hop对象
                                for (var name in _self.inHop) {
                                    var hop = _self.inHop[name];
                                    hop.nested.remove();
                                }
                                for (var name in _self.outHop) {
                                    var hop = _self.outHop[name];
                                    hop.nested.remove();
                                }
                                //删除svg node对象
                                //alert(_self.name);
                                _self.nested.remove();
                                //删除xml node节点
                                deleteXmlNote(_self.name);
                                //删除xml hop节点
                                deleteHopByNoteName(_self.name);

                            }

                            _self.afterDelete(_self.name);
                        });
                        contextMenuContent.addMenuItem(deleteNodeContextMenuItem);
                    }
                    //$(svgSetting.xmlContent).find("menus").children();
                    //自定义菜单选项
                    for (var i = 0; i < _self.menus.length; i++) {
                        var clickFunction = _self.menus[i]['click'];
                        contextMenuContent.addMenuItem(new menuItem(_self.menus[i]['name'], clickFunction));
                    }
                    //移除上一次菜单
                    contextMenuContent.removeOld();
                    //菜单定位防止超出拖拽界面
                    var menuItems = $(contextMenuContent).find('li');
                    var menuWidth = 0;
                    var menuHeight = 6 + menuItems.length * 21;
                    var maxMenuStr = "";
                    for (var i = 0; i < menuItems.length; i++) {
                        var oneMenu = menuItems[i];
                        var str = $(oneMenu).html();
                        if (str.length > maxMenuStr) {
                            maxMenuStr = str;
                        }
                    }

                    if (maxMenuStr.length > 0) {
                        menuWidth = 36 + maxMenuStr.length * 8;
                    }
                    var containerWidth = $(container).width();
                    if ((x + menuWidth) > containerWidth) {
                        $(contextMenuContent).css("margin-left", (x - menuWidth) + "px");
                    }
                    if (y + menuHeight > 0) {
                        $(contextMenuContent).css("margin-top", (y - menuHeight) + "px");
                    }
                    if (maxMenuStr.length > 0) {
                        $(container).append(contextMenuContent);
                    }
                    contextMenuContent.mouseleave(function () {
                        contextMenuContent.removeOld();
                    });
                };
            });

            _self.updatePosition = function (nodeX, nodeY) {

                _self.nested.x(nodeX).y(nodeY);
                _self.x = nodeX;
                _self.y = nodeY;

                //计算连线的起点终点
                for (var name in _self.inHop) {
                    //更新连线的结束点坐标
                    var r = 23;
                    var hop = _self.inHop[name];
                    var startNodeX = hop.from.x;
                    var startNodeY = hop.from.y;
                    //var startNodeWidth = hop.from.width;
                    //var startNodeHeight = hop.from.height;
                    var startNodeWidth = hop.from.content['rect'].width();
                    var startNodeHeight = hop.from.content['rect'].height();
                    var endNodeX = _self.x;
                    var endNodeY = _self.y;
                    //var endNodeWidth = hop.to.width;
                    //var endNodeHeight = hop.to.height;
                    //alert(hop.to.width+" "+hop.to.content['rect'].width());
                    var endNodeWidth = hop.to.content['rect'].width();
                    var endNodeHeight = hop.to.content['rect'].height();
                    var hopInfo = hop.getCoordinate(startNodeX, startNodeY, startNodeWidth, startNodeHeight, endNodeX, endNodeY, endNodeWidth, endNodeHeight);
                    hop.endX = hopInfo["endX"];
                    hop.endY = hopInfo["endY"];
                    hop.startX = hopInfo["startX"];
                    hop.startY = hopInfo["startY"];
                    hop.updateHops(hop.startX, hop.startY, hop.endX, hop.endY);
                }
                for (var name in _self.outHop) {
                    //更改连线的起始点坐标
                    var r = 23;
                    var hop = _self.outHop[name];
                    var startNodeX = _self.x;
                    var startNodeY = _self.y;
                    /*var startNodeWidth = hop.from.width;
                     var startNodeHeight = hop.from.height;*/
                    var startNodeWidth = hop.from.content['rect'].width();
                    var startNodeHeight = hop.from.content['rect'].height();
                    var endNodeX = hop.to.x;
                    var endNodeY = hop.to.y;
                    //var endNodeWidth = hop.to.width;
                    //var endNodeHeight = hop.to.height;
                    var endNodeWidth = hop.to.content['rect'].width();
                    var endNodeHeight = hop.to.content['rect'].height();
                    var hopInfo = hop.getCoordinate(startNodeX, startNodeY, startNodeWidth, startNodeHeight, endNodeX, endNodeY, endNodeWidth, endNodeHeight);
                    hop.endX = hopInfo["endX"];
                    hop.endY = hopInfo["endY"];
                    hop.startX = hopInfo["startX"];
                    hop.startY = hopInfo["startY"];
                    hop.updateHops(hop.startX, hop.startY, hop.endX, hop.endY);
                }

            }

            _self.click = function (clickFunction) {
                _self.nested.click(function (ev) {
                    clickFunction(_self, ev);
                });
            };

            _self.mousedown = function (mouseDownFunc) {
                $("#mainDiv").find("#suspend").remove();
                _self.nested.mousedown(function (ev) {
                    mouseDownFunc(_self, ev);
                })
            };

            _self.mouseup = function (mouseUpFunc) {
                _self.nested.mouseup(function (ev) {
                    mouseUpFunc(_self, ev);
                })
            }
            _self.setSelected = function (selected) {
                _self.selected = selected || _self.selected;
                if (_self.selected == true) {
                    rect.attr({"stroke": "#0000FF"});
                } else {
                    rect.attr({"stroke": "#000000"});
                }
            };

            _self.dblclick = function (clickFunction) {
                _self.nested.dblclick(function (ev) {
                    clickFunction(_self, ev);
                });
            };

            //节点鼠标移入特效
            _self.nested.mouseover(function (ev) {
                _self.content['rect'].attr({"stroke-width": _self.nodeBorder});
                if (_self.mouseHoverShowHtmlClick != "") {
                    var p = _workflow.getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    if (!_self.mouseHover) {
                        $("#mainDiv").find("#suspend").remove();
                        var suspend = eval(_self.mouseHoverShowHtmlClick + "('" + _self.name + "')");
                        $("#mainDiv").append(suspend);
                        $(suspend).attr("id", "suspend");
                        var suspendWidth = $(suspend).width();
                        var suspendHeight = $(suspend).height();
                        if (x < suspendWidth) {
                            x = x + suspendWidth + _self.content['rect'].width();
                        }
                        if (y < suspendHeight) {
                            y = y + suspendHeight;
                        }
                        if ($(container).height() - y < suspendHeight) {
                            y = $(container).height() - suspendHeight;
                        }
                        $(suspend).css("left", x);
                        $(suspend).css("top", y);
                        _self.mouseHover = true;
                    } else {
                        var suspendWidth = $("#suspend").width();
                        var suspendHeight = $("#suspend").height();
                        if (x < suspendWidth) {
                            x = _self.x + _self.content['rect'].width();
                        }
                        if (y < suspendHeight) {
                            y = y + suspendHeight;
                        }
                        $(suspend).css("left", x);
                        $(suspend).css("top", y);
                    }
                }
            });

            //节点鼠标移出特效
            _self.nested.mouseout(function () {
                $("#mainDiv").find("#suspend").remove();
                _self.mouseHover = false;
                _self.content['rect'].attr({"stroke-width": _self.nodeBorder});
            });


        };

        //私有方法
        var svgHop = function (hopSettings) {
            var _self = this;

            _self.statusEnum = {success: "success", error: "error", ignore: "ignore"};
            _self.nested = globalParam.SVG.nested();
            _self.content = {};
            _self.from = hopSettings['from'];
            _self.to = hopSettings['to'];
            _self.label = hopSettings['label'] || "";
            _self.status = hopSettings['status'] || _self.statusEnum.success;


            _self.startX = hopSettings['startX'] || 0;
            _self.startY = hopSettings['startY'] || 0;
            _self.endX = hopSettings['endX'] || 0;
            _self.endY = hopSettings['endY'] || 0;
            _self.lineCircle = hopSettings['lineCircle'] || false;
            _self.lineTriangle = hopSettings['lineTriangle'] || false;
            _self.menusParentStyle = hopSettings['menusParentStyle'] || "";
            _self.menusParentClassName = hopSettings['menusParentClassName'] || "";
            _self.waterClass = hopSettings['waterClass'] || "";
            _self.beforeDelete = hopSettings['beforeDelete'] || function (fromNodeName, toNodeName) {
                return true;
            };
            _self.afterDelete = hopSettings['afterDelete'] || function (fromNodeName, toNodeName) {
                return true
            };
            _self.menusBaseDeleteItem = hopSettings['menusBaseDeleteItem'] || false;
            _self.successIconPath = function (x, y) {
                var path = " M " + (x - 3) + "," + y
                    + " L " + x + "," + (y + 3)
                    + " M " + x + "," + (y + 3)
                    + " L " + (x + 3) + "," + (y - 3)
                    + " Z ";
                return path;
            }

            _self.errorIconPath = function (x, y) {
                var path = " M " + (x - 3) + "," + (y - 3)
                    + " L " + (x + 3) + "," + (y + 3)
                    + " M " + (x - 3) + "," + (y + 3)
                    + " L " + (x + 3) + "," + (y - 3)
                    + " Z ";
                return path;
            }

            _self.ignoreIconPath = function (x, y) {
                var path = " M " + (x - 3.5) + "," + y
                    + " L " + (x - 3.5) + "," + (y + 3.5)
                    + " M " + (x - 3.5) + "," + (y + 3.5)
                    + " L " + (x + 3.5) + "," + (y + 3.5)
                    + " M " + (x + 3.5) + "," + (y + 3.5)
                    + " L " + (x + 3.5) + "," + y
                    + " M " + (x + 3.5) + "," + y
                    + " L " + (x - 3.5) + "," + y

                    + " M " + (x - 3.5) + "," + y
                    + " A " + 3 + "," + 3.5 + " 0 0 1 " + +" " + (x + 3.5) + "," + y
                    + " Z ";
                return path;
            }

            //生成带箭头线的路径
            _self.arrowPath = function (startX, startY, endX, endY, arrowX, arrowY) {
                var arrowHeight = 13;
                var arrowWidth = 4;
                var angle = Math.atan2(endY - startY, endX - startX);
                var path = "M " + startX + "," + startY
                var arrowHeight = 13;
                var arrowWidth = 4;
                var angle = Math.atan2(endY - startY, endX - startX);
                if (_self.lineTriangle) {
                    var path = "M " + startX + "," + startY
                        + " L " + endX + "," + endY
                        + " M " + arrowX + "," + arrowY
                        + " L " + (arrowX - arrowHeight * Math.cos(angle) - arrowWidth * Math.sin(angle))
                        + "," + (arrowY - arrowHeight * Math.sin(angle) + arrowWidth * Math.cos(angle))
                        + " L " + (arrowX - arrowHeight * Math.cos(angle) + arrowWidth * Math.sin(angle))
                        + "," + (arrowY - arrowHeight * Math.sin(angle) - arrowWidth * Math.cos(angle))
                        + " M " + arrowX + "," + arrowY
                        + " L " + (arrowX - arrowHeight * Math.cos(angle) + arrowWidth * Math.sin(angle))
                        + "," + (arrowY - arrowHeight * Math.sin(angle) - arrowWidth * Math.cos(angle))
                        + " M " + arrowX + "," + arrowY
                        + " Z ";
                    return path;
                } else {
                    var path = "M " + startX + "," + startY
                        + " L " + endX + "," + endY;
                    return path;
                }
            };

            //根据两个节点的属性计算起始坐标
            _self.getCoordinate = function (startNodeX, startNodeY, startNodeWidth, startNodeHeight, endNodeX, endNodeY, endNodeWidth, endNodeHeight) {
                var halfStartH = 0.5 * startNodeHeight;
                var halfEndH = 0.5 * endNodeHeight;
                var halfStartW = 0.5 * startNodeWidth;
                var halfEndW = 0.5 * endNodeWidth;
                var startMiddlePoint = {};
                var endMiddlePoint = {};
                startMiddlePoint.x = startNodeX + halfStartW;
                startMiddlePoint.y = startNodeY + halfStartH;
                endMiddlePoint.x = endNodeX + halfEndW;
                endMiddlePoint.y = endNodeY + halfEndH;
                var k = (endMiddlePoint.y - startMiddlePoint.y) / (endMiddlePoint.x - startMiddlePoint.x);
                if (startNodeX < endNodeX && Math.abs(k) <= 1) {
                    var startX = startNodeX + startNodeWidth;
                    var startY = startNodeY + halfStartH + k * halfStartH;
                    var endX = endNodeX;
                    var endY = endNodeY + halfEndH - k * halfEndH;
                    return {
                        "startX": startX, "startY": startY, "endX": endX, "endY": endY
                    };
                } else if (startNodeX > endNodeX && Math.abs(k) <= 1) {
                    var startX = startNodeX;
                    var startY = startNodeY + halfStartH - k * halfStartH;
                    var endX = endNodeX + endNodeWidth;
                    var endY = endNodeY + halfEndH + k * halfEndH;
                    return {
                        "startX": startX, "startY": startY, "endX": endX, "endY": endY
                    };
                } else if (startNodeY < endNodeY && Math.abs(k) >= 1) {
                    var startX = startNodeX + halfStartW + 1 / k * halfStartW;
                    var startY = startNodeY + startNodeHeight;
                    var endX = endNodeX + halfEndW - 1 / k * halfEndW;
                    var endY = endNodeY;
                    return {
                        "startX": startX, "startY": startY, "endX": endX, "endY": endY
                    };
                } else if (startNodeY > endNodeY && Math.abs(k) >= 1) {
                    var startX = startNodeX + halfStartW - 1 / k * halfStartW;
                    var startY = startNodeY;
                    var endX = endNodeX + halfEndW + 1 / k * halfEndW;
                    var endY = endNodeY + endNodeHeight;
                    return {
                        "startX": startX, "startY": startY, "endX": endX, "endY": endY
                    };
                } else {
                    alert("error!");
                }
            }


            var _init = function () {
                var startNodeX = _self.from.x;
                var startNodeY = _self.from.y;
                //var startNodeWidth = _self.from.width;
                //var startNodeHeight = _self.from.height;
                var startNodeWidth = _self.from.content['rect'].width();
                var startNodeHeight = _self.from.content['rect'].height();
                var endNodeX = _self.to.x;
                var endNodeY = _self.to.y;
                var endNodeWidth = _self.to.content['rect'].width();
                var endNodeHeight = _self.to.content['rect'].height();
                var hopInfo = _self.getCoordinate(startNodeX, startNodeY, startNodeWidth, startNodeHeight, endNodeX, endNodeY, endNodeWidth, endNodeHeight);
                _self.startX = hopInfo["startX"];
                _self.startY = hopInfo["startY"];
                _self.endX = hopInfo["endX"];
                _self.endY = hopInfo["endY"];

                var twoThirdX = _self.startX + (_self.endX - _self.startX) / 3 * 2;
                var twoThirdY = _self.startY + (_self.endY - _self.startY) / 3 * 2;
                var oneThirdX = _self.startX + (_self.endX - _self.startX) / 3;
                var oneThirdY = _self.startY + (_self.endY - _self.startY) / 3;
                if (_self.status == _self.statusEnum.success) {
                    var iconPath = _self.successIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    var outerPath = _self.nested.path(arrowPath).attr({
                        "class": _self.waterClass
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        //"stroke": "#00DD00",
                        //"stroke-width": 1,
                        //"fill": "#00DD00"

                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00"
                    });
                    _self.content['innerPath'] = innerPath;
                    if (_self.lineCircle) {
                        var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                        _self.content['iconCircle'] = iconCircle;
                        var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                        _self.content['icon'] = icon;
                    }
                } else if (_self.status == _self.statusEnum.error) {
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    var outerPath = _self.nested.path(arrowPath).attr({
                        "class": _self.waterClass
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        //"stroke": "#FF0000",
                        //"stroke-width": 1,
                        //"fill": "#FF0000"
                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000"
                    });
                    _self.content['innerPath'] = innerPath;
                    if (_self.lineCircle) {
                        var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                        _self.content['iconCircle'] = iconCircle;
                        var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                        _self.content['icon'] = icon;
                    }

                } else if (_self.status == _self.statusEnum.ignore) {
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    var outerPath = _self.nested.path(arrowPath).attr({
                        "class": _self.waterClass
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        //"stroke": "#000000",
                        //"stroke-width": 1,
                        //"fill": "#000000"
                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        //"stroke-dasharray": 10,
                        //"stroke-dashoffset": 10,
                        //"animation": "run 10s linear infinite",
                        //"class": "path",
                        "stroke": "#000000",
                        "stroke-width": 1,
                        "fill": "#000000"
                    });
                    _self.content['innerPath'] = innerPath;
                    if (_self.lineCircle) {
                        var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#000000"});
                        _self.content['iconCircle'] = iconCircle;
                        var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                        _self.content['icon'] = icon;
                    }
                }
                var label = _self.nested.text(_self.label).font({"size": 12}).x((_self.startX + _self.endX) / 2 + 3).y((_self.startY + _self.endY) / 2 + 3);
                _self.content['label'] = label;
            };

            _self.nested.mouseout(function () {
                _self.nested.attr({"cursor": "default"});
                //_self.content['outerPath'].attr({"stroke-width": 1});
            });

            _self.nested.mouseover(function () {
                _self.nested.attr({"cursor": "pointer"});
                //_self.content['outerPath'].attr({"stroke-width": 1.5});
            });

            _self.click = function (clickFunction) {
                _self.nested.click(function (ev) {
                    clickFunction(_self, ev);
                });
            };

            _self.nested.mousemove(function () {
                globalParam.contextMenu = function (ev) {
                    var p = _workflow.getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    y = y - $(container).height();
                    //菜单组
                    var contextMenuContent = new menu(x, y, hopSettings);
                    //基础菜单 删除连线
                    if (_self.menusBaseDeleteItem) {
                        var deleteNodeContextMenuItem = new menuItem("删除连线", function () {
                            if (_self.beforeDelete(_self.from.name, _self.to.name)) {
                                //删除svg hop
                                _self.nested.remove();

                                //alert(_self.from.name);
                                //删除 xml hop
                                deleteHopByFromAndTo(_self.from.name, _self.to.name);
                            }
                            _self.afterDelete(_self.from.name, _self.to.name);

                        });
                        contextMenuContent.addMenuItem(deleteNodeContextMenuItem);
                    }
                    //移除上一次菜单
                    contextMenuContent.removeOld();
                    //菜单定位防止超出拖拽界面
                    var menuItems = $(contextMenuContent).find('li');
                    var menuWidth = 0;
                    var menuHeight = 6 + menuItems.length * 21;
                    var maxMenuStr = "";
                    for (var i = 0; i < menuItems.length; i++) {
                        var oneMenu = menuItems[i];
                        var str = $(oneMenu).html();
                        if (str.length > maxMenuStr) {
                            maxMenuStr = str;
                        }
                    }

                    if (maxMenuStr.length > 0) {
                        menuWidth = 36 + maxMenuStr.length * 8;
                    }
                    var containerWidth = $(container).width();
                    if ((x + menuWidth) > containerWidth) {
                        $(contextMenuContent).css("margin-left", (x - menuWidth) + "px");
                    }
                    if (y + menuHeight > 0) {
                        $(contextMenuContent).css("margin-top", (y - menuHeight) + "px");
                    }
                    if (maxMenuStr.length > 0) {
                        $(container).append(contextMenuContent);
                    }
                    contextMenuContent.mouseleave(function () {
                        contextMenuContent.removeOld();
                    });
                };
            });

            _self.updateStatus = function (status) {
                var twoThirdX = _self.startX + (_self.endX - _self.startX) / 3 * 2;
                var twoThirdY = _self.startY + (_self.endY - _self.startY) / 3 * 2;
                var oneThirdX = _self.startX + (_self.endX - _self.startX) / 3;
                var oneThirdY = _self.startY + (_self.endY - _self.startY) / 3;
                if (status == _self.statusEnum.success) {
                    _self.status = _self.statusEnum.success
                    var iconPath = _self.successIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#00DD00",
                        //"stroke-width": 1,
                        //"fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                } else if (status == _self.statusEnum.error) {
                    _self.status = _self.statusEnum.error
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#FF0000",
                        //"stroke-width": 1,
                        //"fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                } else if (status == _self.statusEnum.ignore) {
                    _self.status = _self.statusEnum.ignore
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#444444",
                        //"stroke-width": 1,
                        //"fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#444444"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                }

            };

            _self.updateHops = function (startX, startY, endX, endY) {

                _self.startX = startX || _self.startX;
                _self.startY = startY || _self.startY;
                _self.endX = endX || _self.endX;
                _self.endY = endY || _self.endY;
                var twoThirdX = _self.startX + (_self.endX - _self.startX) / 3 * 2;
                var twoThirdY = _self.startY + (_self.endY - _self.startY) / 3 * 2;
                var oneThirdX = _self.startX + (_self.endX - _self.startX) / 3;
                var oneThirdY = _self.startY + (_self.endY - _self.startY) / 3;

                if (_self.status == _self.statusEnum.success) {
                    var iconPath = _self.successIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#00DD00",
                        //"stroke-width": 1,
                        //"fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                } else if (_self.status == _self.statusEnum.error) {
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#FF0000",
                        //"stroke-width": 1,
                        //"fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                } else if (_self.status == _self.statusEnum.ignore) {
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        //"stroke": "#444444",
                        //"stroke-width": 1,
                        //"fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    if (_self.lineCircle) {
                        _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#444444"});
                        _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                    }
                }
                //var label = _self.nested.text("连线dsfsdf").font({"size": 12}).x((_self.startX + _self.endX) / 2 + 3).y((_self.startY + _self.endY) / 2 + 3);
                //_self.content['label'] = label;
                _self.content['label'].x((_self.startX + _self.endX) / 2 + 3).y((_self.startY + _self.endY) / 2 + 3);

            };

            _init();
        };
        _workflow.backgroundClick = function (clickFunc) {
            _workflow.background.click(function () {
                $(container).find("#rightClickMenuDiv").remove();
                clickFunc();
            });
        }
        var _init = function () {
            //背景画板
            _workflow.background = globalParam.SVG.rect($(container).width(), $(container).height()).attr({"fill": "#FFFFFF"});

            _workflow.background.mousemove(function () {
                //绑定空白区域的右键菜单
                globalParam.contextMenu = function (ev) {
                    var p = _workflow.getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    y = y - $(container).height();

                    //菜单组
                    if (svgSetting['globalRightClickMenu']) {
                        var contextMenuContent = _workflow.createMenu(x, y);
                        //菜单项1
                        var testContextMenuItem = _workflow.createMenuItem("测试1", function () {
                            alert("测试菜单的点击事件");
                        });
                        contextMenuContent.addMenuItem(testContextMenuItem);

                        //菜单项2
                        var testContextMenuItem3 = _workflow.createMenuItem("测试2", function () {
                            alert("测试菜单的点击事件3333333");
                        });
                        contextMenuContent.addMenuItem(testContextMenuItem3);
                        //}
                        //移除上一次菜单
                        contextMenuContent.removeOld();

                        //菜单定位防止超出拖拽界面
                        var menuItems = $(contextMenuContent).find('li');
                        var menuWidth = 0;
                        var menuHeight = 6 + menuItems.length * 21;
                        var maxMenuStr = "";
                        for (var i = 0; i < menuItems.length; i++) {
                            var oneMenu = menuItems[i];
                            var str = $(oneMenu).html();
                            if (str.length > maxMenuStr) {
                                maxMenuStr = str;
                            }
                        }

                        if (maxMenuStr.length > 0) {
                            menuWidth = 36 + maxMenuStr.length * 8;
                        }
                        var containerWidth = $(container).width();
                        if ((x + menuWidth) > containerWidth) {
                            $(contextMenuContent).css("margin-left", (x - menuWidth) + "px");
                        }
                        if (y + menuHeight > 0) {
                            $(contextMenuContent).css("margin-top", (y - menuHeight) + "px");
                        }
                        if (maxMenuStr.length > 0) {
                            $(container).append(contextMenuContent);
                        }
                    }

                }
            });


            //屏蔽默认的右键菜单
            $(container).contextmenu(function (ev) {
                if (Object.prototype.toString.call(globalParam.contextMenu) === '[object Function]') {
                    globalParam.contextMenu(ev);
                }
                return false;
            });


        };

        _init();

    };

})(jQuery, window);

