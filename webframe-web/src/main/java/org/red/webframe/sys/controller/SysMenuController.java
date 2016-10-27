package org.red.webframe.sys.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.red.webframe.common.controller.BaseController;
import org.red.webframe.sys.entity.SysMenu;
import org.red.webframe.sys.entity.SysUser;
import org.red.webframe.sys.service.IMenuService;
import org.red.webframe.sys.service.IUserService;
import org.red.webframe.sys.util.UserUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 系统菜单控制器
 * Created by snow on 2016/6/21.
 */
@Controller
@RequestMapping("/sys/menu/")
public class SysMenuController extends BaseController {

    @Resource
    private IMenuService menuService;
    @Resource
    private IUserService userService;
    /**
     * 系统菜单列表
     * @return
     */
    @RequiresPermissions(value = "sys:menu:list")
    @RequestMapping(value="menu_list")
    public String menuList(Model model){
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("EQ_isDelete",0);
        List<SysMenu> sourceList = menuService.findAllMenuByParams(params);
        List<SysMenu> dstList = Lists.newArrayList();
        SysMenu.sortList(dstList,sourceList,0,true);
        model.addAttribute("menuList",dstList);
        return "modules/sys/menu/menu_list";
    }

    @RequestMapping(value = "ajax_menu_tree")
    @ResponseBody
    public List ajaxMenuTree(@RequestParam(required=false) String extId,@RequestParam(required=false) String isShowHide, HttpServletResponse response) {
        List<Object> mapList = Lists.newArrayList();
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("EQ_isDelete",0);
        List<SysMenu> list = menuService.findAllMenuByParams(params);
        for (int i=0; i<list.size(); i++){
            SysMenu m = list.get(i);
            if (org.apache.commons.lang3.StringUtils.isBlank(extId) || (extId!=null && !extId.equals(m.getId()))){
                if(isShowHide != null && isShowHide.equals("0") && "0".equals(m.getIsShow())){
                    continue;
                }
                Map<String, Object> map = Maps.newHashMap();
                map.put("id", m.getId());
                map.put("pId", m.getParentId());
                map.put("name",m.getMenuName());
                mapList.add(map);
            }
        }
       return mapList ;
    }

    /**
     * 菜单添加和修改页面
     * @return
     */
    @RequiresPermissions(value = "sys:menu:add")
    @RequestMapping(value="menu_add")
    public String menuAdd(Model model,@RequestParam(required=false) String parentId){
        if(StringUtils.isNoneBlank(parentId)){
            model.addAttribute("parentMenu", menuService.findOneSysMenu(Integer.valueOf(parentId)));
        }
        return "modules/sys/menu/menu_add";
    }

    /**
     *
     * @Title: menuAdd
     * @Description: 菜单编辑页面
     * @author JRed bravecatking@gmail.com
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions(value="sys:menu:edit")
    @RequestMapping(value="menu_edit")
    public String menuEdit(@RequestParam(required=true) String id,Model model){
        SysMenu menu  = menuService.findOneSysMenu(Integer.valueOf(id));
        model.addAttribute("menu", menu);
        //父级菜单
        if(menu.getParentId()!=null&&menu.getParentId()!=0){
            model.addAttribute("parentMenu",menuService.findOneSysMenu(menu.getParentId()));
        }
        return "modules/sys/menu/menu_add";
    }

    /**
     * 保存菜单信息
     * @param menu
     * @param model
     * @param redirectAttributes
     * @return
     */
    @RequiresPermissions(value="sys:menu:save")
    @RequestMapping("menu_save")
    public String menuSave(SysMenu menu,Model model,RedirectAttributes redirectAttributes){
        int menuPkId = menu.getId();
        if (!beanValidator(model, menu)){
            model.addAttribute("message", "必填项不可为空！");
            if(menuPkId  == 0){
                if(null != menu.getParentId()){
                    return menuAdd(model, menu.getParentId()+"");
                }else{
                    return menuAdd(model, null);
                }
            }else {
                return menuEdit(menuPkId+"",model);
            }
        }

        if(menu.getParentId()==null){
            menu.setParentId(0);
        }
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if(menu.getId()==0){
            //创建时间
            menu.setCreateDate(now);
        }else{
            SysMenu oldMenu = menuService.findOneSysMenu( menu.getId());
            menu.setCreateDate(oldMenu.getCreateDate());
        }
        //修改时间
        menu.setModifyDate(now);
        menuService.saveOrUpdateSysmenu(menu);
        addMessage(redirectAttributes, "保存菜单'" + menu.getMenuName() + "'成功");
        return "redirect:./menu_list";
    }

    /**
     *
     * @Title: delete
     * @Description: 非物理删除，只是将字段del_flag设置1
     * @author JRed bravecatking@gmail.com
     * @param @param id
     * @param @param redirectAttributes
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions(value="sys:menu:delete")
    @RequestMapping("/menu_delete")
    public String menuDelete(@RequestParam(required=true) String id,RedirectAttributes redirectAttributes ){
        menuService.deleteCascade(Integer.valueOf(id),Integer.valueOf(id));
        addMessage(redirectAttributes, "删除菜单成功");
        return "redirect:./menu_list";
    }


    /**
     *
     * @Title: updateSort
     * @Description: 批量修改菜单排序
     * @author JRed bravecatking@gmail.com
     * @param @param ids
     * @param @param sorts
     * @param @param redirectAttributes
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions("sys:menu:batchsort")
    @RequestMapping(value = "batch_update_sort")
    public String updateSort(String[] ids, Integer[] sorts, RedirectAttributes redirectAttributes) {
        if(ids!=null&&sorts!=null){
            for(int i=0;i<ids.length;i++){
                SysMenu menu = menuService.findOneSysMenu(Integer.valueOf(ids[i]));
                menu.setSortNumber(sorts[i]);
                menuService.saveOrUpdateSysmenu(menu);
            }
            addMessage(redirectAttributes, "保存菜单排序成功!");
        }else{
            addMessage(redirectAttributes, "请传入必须参数!");
        }
        return "redirect:./menu_list";
    }


    /**
     *
     * @Title: ajaxPowerMenuTree
     * @Description: 异步获取所有可用的权限菜单
     * @author JRed bravecatking@gmail.com
     * @param @param extId
     * @param @param response
     * @return void
     * @throws
     */
    @ResponseBody
    @RequestMapping(value = "ajax_power_menutree")
    public List ajaxPowerMenuTree(HttpServletResponse response) {
        List<Object> mapList = Lists.newArrayList();
        List<SysMenu> list = new ArrayList();
        SysUser user = UserUtils.getCurrentUser();
        //如果是超级管理员
        if(user.getId()==1){
            //获取所有可用的权限菜单
            Map<String,Object> params = new HashMap<String, Object>();
            params.put("EQ_isDelete",0);
            list = menuService.findAllMenuByParams(params);
        }else{
            //获取当前登录用户可配置的权限
            List<SysMenu> menus = userService.getUserSysmenusByUserId(user.getId());
            if(menus!=null&&menus.size()>0){
                for(SysMenu menu:menus){
                    if("0".equals(menu.getIsDelete())){
                        list.add(menu);
                    }
                }
            }
        }

        Map<String, Object> root = Maps.newHashMap();
        root.put("id", 0);
        root.put("pId", 0);
        root.put("name", "权限菜单");
        mapList.add(root);
        for (int i=0; i<list.size(); i++){
            SysMenu m = list.get(i);
            Map<String, Object> map = Maps.newHashMap();
            map.put("id", m.getId());
            map.put("pId", m.getParentId());
            map.put("name",m.getMenuName());
            mapList.add(map);
        }
      return mapList;
    }


}
