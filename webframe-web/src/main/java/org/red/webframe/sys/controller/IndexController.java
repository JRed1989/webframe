package org.red.webframe.sys.controller;

import com.google.common.collect.Lists;
import org.red.webframe.common.controller.BaseController;
import org.red.webframe.sys.entity.SysMenu;
import org.red.webframe.sys.service.IMenuService;
import org.red.webframe.sys.service.IUserService;
import org.red.webframe.sys.util.UserUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 首页控制器
 * Created by snow on 2016/6/14.
 */
@Controller
@RequestMapping("/sys/")
public class IndexController  extends BaseController {



    @Resource
    private IMenuService iMenuService;

    @Resource
    private IUserService iUserService;


    @RequestMapping({"","index"})
    public String index(Model model){
        List menuList = Lists.newArrayList();
        List<SysMenu> sourceList = null;
        //id为1的用户是超级管理员，用户所有的权限
        if(UserUtils.getCurrentUser().getId() == 1){
            Map<String,Object> params = new HashMap<String, Object>();
            params.put("EQ_isDelete",0);
            params.put("EQ_isShow",0);
            sourceList = iMenuService.findAllMenuByParams(params);
        }else{
            sourceList = Lists.newArrayList();
            //查询当前用户的所有菜单
            List<SysMenu> menus = iUserService.getUserSysmenusByUserId(UserUtils.getCurrentUser().getId());
            if(menus!=null&&menus.size()>0){
                for(SysMenu menu:menus){
                    if("0".equals(menu.getIsShow()) && "0".equals(menu.getIsDelete())){
                        sourceList.add(menu);
                    }
                }
            }
        }
        SysMenu.sortList(menuList,sourceList,0,true);
        model.addAttribute("menuList", menuList);
        model.addAttribute("loginUser", UserUtils.getCurrentUser());
        return "modules/sys/index";
    }


}
