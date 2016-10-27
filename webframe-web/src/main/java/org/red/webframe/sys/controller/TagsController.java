package org.red.webframe.sys.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.red.webframe.common.controller.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * TagsController
 * JRed(breavecatking@gmail.com)
 * 2016/6/22 14:18
 **/
@RequestMapping("/sys/tags/")
@Controller
public class TagsController extends BaseController {

    /**
     * 树结构选择标签（treeselect.tag）
     */
    @RequiresPermissions("user")
     @RequestMapping(value = "/tree_data")
     public String tree_data(HttpServletRequest request, Model model) {
        model.addAttribute("url", request.getParameter("url")); 	// 树结构数据URL
        model.addAttribute("extId", request.getParameter("extId")); // 排除的编号ID
        model.addAttribute("checked", request.getParameter("checked")); // 是否可复选
        model.addAttribute("selectIds", request.getParameter("selectIds")); // 指定默认选中的ID
        return "modules/sys/tags/tree_data";
    }



}
