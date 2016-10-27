/**
 * Created by xushanshan on 16/8/1.
 */
(function ($, window) {

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
            //是否显示节点边框
            nodeBorder: false,
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
            clickSelectNode: null,
            mouseClickX: null,
            mouseClickY: null,
            onDrawLine: false,
            propertyTable: null,
            copyCount: null,
            publicParam: new Object(),
            workflowDivId: "workflowDiv"
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
            }

            //只初始化一次
            if (globalParam.xmlContent == null) {
                _initData();
                // 事件绑定
                _loadEvent();
                // 加载内容
                _loadContent();
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
            globalParam.SVG = SVG($(container)[0]);
        };

        // 绑定事件
        var _loadEvent = function () {
            //屏蔽默认的右键菜单
            $(container).contextmenu(function (ev) {
                if (Object.prototype.toString.call(globalParam.contextMenu) === '[object Function]') {
                    globalParam.contextMenu(ev);
                }
                return false;
            });
            bindBlankRightClickContextMenu();

        };

        var _loadContent = function () {

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
            return {
                x: evt.clientX - $(container).offset().left,
                y: evt.clientY - $(container).offset().top
            }
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

        //xml到SVG对象的转换，频繁调用会闪瞎眼
        var xmlToSVG = function () {

            //画节点
            var nodeArray = $(globalParam.xmlContent).find("node");
            for (var index = 0; index < nodeArray.length; index++) {
                var node = nodeArray[index];
                var selected = $(node).attr("selected");
                var nodeName = $(node).children("name").text();

                var nodeSettings = {};
                nodeSettings['type'] = $(node).children("type").text();
                nodeSettings['name'] = $(node).children("name").text();
                nodeSettings['label'] = $(node).children("properties").children("label").text();
                nodeSettings['x'] = parseInt($(node).attr("x"));
                nodeSettings['y'] = parseInt($(node).attr("y"));
                nodeSettings['image'] = $(node).attr("image");
                var node = new svgNode(nodeSettings);
                globalParam.svgNodeMap[nodeName] = node;
                node.click(function (_self, ev) {
                    _self.selected = true;
                    _self.content['rect'].attr({"stroke": "#0000FF"});
                });

                node.dblclick(function (_self, ev) {
                    _self.selected = false;
                    _self.content['rect'].attr({"stroke": "#444444"});
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
                hopSettings['from'] = globalParam.svgNodeMap[startNodeName];
                hopSettings['to'] = globalParam.svgNodeMap[endNodeName];
                hopSettings['label'] = "连线";
                hopSettings['startX'] = x1;
                hopSettings['startY'] = y1;
                hopSettings['endX'] = x2;
                hopSettings['endY'] = y2;
                hopSettings['status'] = "success";
                var hop = new svgHop(hopSettings);

                hop.click(function (_self, ev) {
                    if (_self.status == _self.statusEnum.ignore) {
                        _self.updateStatus(_self.statusEnum.success);
                    } else if (_self.status == _self.statusEnum.success) {
                        _self.updateStatus(_self.statusEnum.error);
                    } else if (_self.status == _self.statusEnum.error) {
                        _self.updateStatus(_self.statusEnum.ignore);
                    }
                });

                var svgStartNode = globalParam.svgNodeMap[startNodeName];
                svgStartNode.outHop[endNodeName] = hop;

                var svgEndNode = globalParam.svgNodeMap[endNodeName];
                svgEndNode.inHop[startNodeName] = hop;
            }
        }

        //绑定空白区域的右键菜单
        var bindBlankRightClickContextMenu = function () {
            globalParam.contextMenu = function (ev) {
                var p = getMousePosition(ev);
                var x = p.x;
                var y = p.y;
                //菜单组
                var contextMenuContent = initContextMenuContent(x, y);
                //菜单项1
                var testContextMenuItem = initContextMenuItem("测试的啊", function () {
                    console.log("测试菜单的点击事件")
                });
                contextMenuContent.addMenuItem(testContextMenuItem);

                //菜单项2
                var testContextMenuItem2 = initContextMenuItem("测试的啊2", function () {
                    console.log("测试菜单的点击事件2")
                });
                contextMenuContent.addMenuItem(testContextMenuItem2);

                //移除上一次菜单
                contextMenuContent.removeOld();
                $(container).append(contextMenuContent);
            }
        }

        //生成菜单父层
        var initContextMenuContent = function (x, y) {
            var menus = $('<div id="rightClickMenuDiv" style="position:absolute; background-color:white; width:140px; overflow-x: hidden; ' +
                'overflow-y:hidden;border:1px solid #919999; z-index: 20;filter:alpha(opacity=5);opacity: 0.95; -moz-border-radius: 5px; -webkit-border-radius: 5px;  ">' +
                '<ul style="list-style:none; margin-left:0px;margin-top: 0px; margin-bottom: 5px; padding-left:0px;padding-top:0px;" id="menuListUl"></ul></div>');
            //右键菜单坐标
            $(menus).css("margin-left", x + "px");
            $(menus).css("margin-top", y + "px");
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
        var initContextMenuItem = function (menuName, clickFunction) {
            var menuItem = $('<li style="list-style:none; height: 20px; margin-left: 0px; margin-top: 5px; padding-left:14px;font-size: 12px;line-height: 20px; font-weight: 500;color:#505555;">' + menuName + '</li>');
            $(menuItem).click(function () {
                if (Object.prototype.toString.call(clickFunction) === '[object Function]') {
                    eval(clickFunction)();
                }
            });
            $(menuItem).hover(function () {
                $(this).css('background-color', '#0084dd').css("color", "#FFFFFF").css("cursor", "pointer");
            }, function () {
                $(this).css("background-color", "").css("color", "#505555").css("cursor", "default");
            });

            return menuItem;
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

        var svgNode = function (nodeSettings) {
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
            _self.deltaX = 21;
            _self.deltaY = 21;
            _self.moving = false;
            var rect = this.nested.rect(_self.width, _self.height).attr({
                "fill": "#FFFFFF", /**/
                "stroke-width": 1,
                "stroke": "#444444",
                "rx": 2,
                "ry": 2
            });
            _self.content['rect'] = rect;
            if (_self.selected) {
                rect.attr({"stroke": "#0000FF"});
            } else {
                rect.attr({"stroke": "#444444"});
            }

            var image = _self.nested.image(_self.image, _self.width - _self.border * 2, _self.height - _self.border * 2).x(_self.border).y(_self.border);
            _self.content['image'] = image;

            //节点文字
            var text = _self.nested.text(_self.label).font({"size": 12});
            var textWidth = text.length();
            text.x(_self.width / 2 - (textWidth / 2)).y(_self.height + _self.border * 2 + 2);
            _self.content['text'] = text;


            _self.nested.mousedown(function (ev) {
                _self.moving = true;
                var position = getMousePosition(ev);
                _self.deltaX = position.x - _self.x;
                _self.deltaY = position.y - _self.y;
                _self.nested.attr({"cursor": "move"});
            });

            _self.nested.mouseup(function (ev) {
                _self.moving = false;
                _self.nested.attr({"cursor": "default"});
            });
            //绑定鼠标在节点上移动的事件
            _self.nested.mousemove(function (ev) {
                globalParam.contextMenu = function (ev) {
                    var p = getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    //菜单组
                    var contextMenuContent = initContextMenuContent(x, y);
                    //菜单项1
                    var deleteNodeContextMenuItem = initContextMenuItem("删除节点", function () {
                        for (var name in _self.inHop) {
                            var hop = _self.inHop[name];
                            hop.nested.remove();
                        }
                        for (var name in _self.outHop) {
                            var hop = _self.outHop[name];
                            hop.nested.remove();
                        }
                        _self.nested.remove();
                        delete globalParam.svgNodeMap[_self['name']];
                    });

                    contextMenuContent.addMenuItem(deleteNodeContextMenuItem);

                    //移除上一次菜单
                    contextMenuContent.removeOld();
                    $(container).append(contextMenuContent);
                };
                if (_self.moving == true){
                    var dx = _self.deltaX;
                    var dy = _self.deltaY;
                    var position = getMousePosition(ev);
                    var nodeX = position.x - dx;
                    var nodeY = position.y - dy;
                    _self.updatePosition(nodeX,nodeY);
                }
            });

            _self.updatePosition = function (nodeX, nodeY) {

                 _self.nested.x(nodeX).y(nodeY);
                 _self.x = nodeX || 0;
                 _self.y = nodeY || 0;

                //计算连线的起点终点
                for (var name in _self.inHop) {
                    //更新连线的结束点坐标
                    var r = 23;
                    var hop = _self.inHop[name];
                    var startNodeX = hop.from.x;
                    var startNodeY = hop.from.y;
                    var startNodeWidth = hop.from.width;
                    var startNodeHeight = hop.from.height;
                    var endNodeX = _self.x;
                    var endNodeY = _self.y;
                    var endNodeWidth = hop.to.width;
                    var endNodeHeight = hop.to.height;
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
                    var startNodeWidth = hop.from.width;
                    var startNodeHeight = hop.from.height;
                    var endNodeX = hop.to.x;
                    var endNodeY = hop.to.y;
                    var endNodeWidth = hop.to.width;
                    var endNodeHeight = hop.to.height;
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

            _self.dblclick = function (clickFunction) {
                _self.nested.dblclick(function (ev) {
                    clickFunction(_self, ev);
                });
            };

            //节点鼠标移入特效
            _self.nested.mouseover(function () {
                _self.content['rect'].attr({"stroke-width": 1.5});
            });

            //节点鼠标移出特效
            _self.nested.mouseout(function () {
                _self.content['rect'].attr({"stroke-width": 1});
            });


        };



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
                    var endX = endNodeX + startNodeWidth;
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
                var startNodeWidth = _self.from.width;
                var startNodeHeight = _self.from.height;

                var endNodeX = _self.to.x;
                var endNodeY = _self.to.y;
                var endNodeWidth = _self.to.width;
                var endNodeHeight = _self.to.height;
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
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00"
                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00"
                    });
                    _self.content['innerPath'] = innerPath;
                    var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                    _self.content['iconCircle'] = iconCircle;
                    var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                    _self.content['icon'] = icon;
                } else if (_self.status == _self.statusEnum.error) {
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    var outerPath = _self.nested.path(arrowPath).attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000"
                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000"
                    });
                    _self.content['innerPath'] = innerPath;
                    var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                    _self.content['iconCircle'] = iconCircle;
                    var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                    _self.content['icon'] = icon;
                } else if (_self.status == _self.statusEnum.ignore) {
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    var outerPath = _self.nested.path(arrowPath).attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444"
                    });
                    _self.content['outerPath'] = outerPath;
                    var innerPath = _self.nested.path(arrowPath).attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444"
                    });
                    _self.content['innerPath'] = innerPath;
                    var iconCircle = _self.nested.circle(13).cx(oneThirdX).cy(oneThirdY).attr({"fill": "#444444"});
                    _self.content['iconCircle'] = iconCircle;
                    var icon = _self.nested.path(iconPath).attr({"stroke": "#FFFFFF", "stroke-width": 1.5});
                    _self.content['icon'] = icon;
                }

                var label = _self.nested.text("连线").font({"size": 12}).x((_self.startX + _self.endX) / 2 + 3).y((_self.startY + _self.endY) / 2 + 3);
                _self.content['label'] = label;
            };

            _self.nested.mouseout(function () {
                _self.nested.attr({"cursor": "default"});
                _self.content['outerPath'].attr({"stroke-width": 1});
            });

            _self.nested.mouseover(function () {
                _self.nested.attr({"cursor": "pointer"});
                _self.content['outerPath'].attr({"stroke-width": 1.8});
            });

            _self.click = function (clickFunction) {
                _self.nested.click(function (ev) {
                    clickFunction(_self, ev);
                });
            };

            _self.nested.mousemove(function () {
                globalParam.contextMenu = function (ev) {
                    var p = getMousePosition(ev);
                    var x = p.x;
                    var y = p.y;
                    //菜单组
                    var contextMenuContent = initContextMenuContent(x, y);
                    //菜单项1
                    var deleteNodeContextMenuItem = initContextMenuItem("删除连线", function () {
                        _self.nested.remove()
                    });
                    contextMenuContent.addMenuItem(deleteNodeContextMenuItem);

                    //移除上一次菜单
                    contextMenuContent.removeOld();
                    $(container).append(contextMenuContent);
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
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                } else if (status == _self.statusEnum.error) {
                    _self.status = _self.statusEnum.error
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                } else if (status == _self.statusEnum.ignore) {
                    _self.status = _self.statusEnum.ignore
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#444444"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
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
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#00DD00",
                        "stroke-width": 1,
                        "fill": "#00DD00",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#00DD00"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                } else if (_self.status == _self.statusEnum.error) {
                    var iconPath = _self.errorIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#FF0000",
                        "stroke-width": 1,
                        "fill": "#FF0000",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#FF0000"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                } else if (_self.status == _self.statusEnum.ignore) {
                    var iconPath = _self.ignoreIconPath(oneThirdX, oneThirdY);
                    var arrowPath = _self.arrowPath(_self.startX, _self.startY, _self.endX, _self.endY, twoThirdX, twoThirdY);
                    _self.content['outerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['innerPath'].attr({
                        "stroke": "#444444",
                        "stroke-width": 1,
                        "fill": "#444444",
                        d: arrowPath
                    });
                    _self.content['iconCircle'].cx(oneThirdX).cy(oneThirdY).attr({"fill": "#444444"});
                    _self.content['icon'].attr({"stroke": "#FFFFFF", "stroke-width": 1.5, d: iconPath});
                }
                _self.content['label'].x((_self.startX + _self.endX) / 2 + 3).y((_self.startY + _self.endY) / 2 + 3);
            };

            _init();
        }

        // 启动插件
        _init();
        // 链式调用
        return this;
    };

})(jQuery, window);
