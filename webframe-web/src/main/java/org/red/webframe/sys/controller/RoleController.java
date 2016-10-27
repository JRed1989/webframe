package org.red.webframe.sys.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.red.webframe.common.controller.BaseController;
import org.red.webframe.sys.entity.SysRole;
import org.red.webframe.sys.entity.SysRoleMenuRelation;
import org.red.webframe.sys.service.IRoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * RoleController 系统角色控制器
 * JRed(breavecatking@gmail.com)
 * 2016/6/23 15:25
 **/
@Controller
@RequestMapping("/sys/role/")
public class RoleController   extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(RoleController.class);

    @Resource
    private IRoleService roleService;

    /**
     *
     * @Title: roleList
     * @Description:角色列表
     * @author JRed bravecatking@gmail.com
     * @param @param request
     * @param @param model
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions("sys:role:list")
    @RequestMapping(value="role_list")
    public String  roleList(HttpServletRequest request,Model model){
        return "modules/sys/role/role_list";
    }

    /**
     * 异步获取角色数据
     //* @param request
     * @param rows
     * @param page
     * @return
     */
    @RequiresPermissions("sys:role:list")
    @RequestMapping(value="ajax_role_data")
    @ResponseBody
    public Map ajaxRoleData(HttpServletRequest request,Integer rows,Integer page){
        Integer pageSize = rows==null?10:rows;
        Integer curPage = page==null?0:page-1;
        Pageable pageable = new PageRequest(curPage, pageSize);
        Map<String,Object> searchParams = new HashMap<String, Object>();
        String roleName = request.getParameter("roleName");
        if(StringUtils.isNotEmpty(roleName)){
            searchParams.put("LIKE_roleName",roleName);
        }
        Page<SysRole> rolePage = roleService.findRolePageByParams(searchParams,pageable);
        Map data = new HashMap();
        data.put("total",rolePage.getTotalElements());
        data.put("rows",rolePage.getContent());
        return  data;
    }


    /**
     *
     * @Title: roleAdd
     * @Description: 角色添加页面
     * @author JRed bravecatking@gmail.com
     * @param @param id
     * @param @param model
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions("sys:role:add")
    @RequestMapping(value="role_add")
    public String roleAdd(@RequestParam(required=false) String id,Model model){
        if(StringUtils.isNotEmpty(id)){
            SysRole role = roleService.findOneRole(Integer.valueOf(id));
            model.addAttribute("role", role);
            String[] sels = getSelectedPermIds(roleService.getRoleMenuRelationsByRoleId(role.getId()));
            model.addAttribute("selPermIds", sels[0]);
            model.addAttribute("selPermNames", sels[1]);
        }
        return "modules/sys/role/role_add";
    }

    private String[] getSelectedPermIds(List<SysRoleMenuRelation> list){
        String ids = "";
        String names = "";
        if(list!=null&&list.size()>0){
            for(int i=0;i<list.size();i++){
                if(i<list.size()-1){
                    ids += list.get(i).getSysMenuByMenuId().getId()+",";
                    names += list.get(i).getSysMenuByMenuId().getMenuName()+",";
                }else{
                    ids += list.get(i).getSysMenuByMenuId().getId();
                    names += list.get(i).getSysMenuByMenuId().getMenuName();
                }
            }
        }
        return new String[]{ids,names};
    }


    @RequiresPermissions("sys:role:save")
    @RequestMapping(value="role_save")
    public String roleSave(SysRole role,Model model,RedirectAttributes redirectAttr,String permIds,String isBack){
        int rolePkId = role.getId();
        if (!beanValidator(model,role)){
            model.addAttribute("message", "必填项不可为空！");
            if(rolePkId == 0){
               return roleAdd(null,model) ;
            }else {
                return roleAdd(role.getId()+"", model);
            }
        }
        try{
            roleService.saveOrUpdateRole(role,permIds);
            redirectAttr.addFlashAttribute("message", "保存角色["+role.getRoleName()+"]成功!");
        }catch(Exception e){
            redirectAttr.addFlashAttribute("message", "保存角色["+role.getRoleName()+"]失败!");
        }
        return "redirect:role_add";
    }


    @RequiresPermissions("sys:role:delete")
    @RequestMapping(value="role_delete")
    @ResponseBody
    public Integer roleDel(@RequestParam String idStr){
        Integer result = 0;
        try{
            String[] ids = idStr.split(",");
            roleService.delRoleByIds(ids);
        }catch(Exception e){
            logger.error("删除角色失败",e);
            result = 1;
        }
        return result;
    }



    /**
     *
     * @Title: ajaxChannelPermTree
     * @Description: 异步获取角色树
     * @author JRed bravecatking@gmail.com
     * @param @param extId
     * @param @param isShowHide
     * @param @param response
     * @param @param request
     * @return List
     * @throws
     */
    @RequestMapping(value = "ajax_roles_tree")
    @ResponseBody
    public List ajaxRolesTree(@RequestParam(required=false) String extId,@RequestParam(required=false) String isShowHide, HttpServletResponse response,HttpServletRequest request) {
        List<Object> mapList = Lists.newArrayList();
        Map params = new HashMap();
        params.put("EQ_isshow", 0);
        List<SysRole> list =  roleService.getRolesByParams(params);
        Map<String, Object> root = Maps.newHashMap();
        root.put("id",0);
        root.put("pId",0);
        root.put("name","所有权限");
        mapList.add(root);
        for (int i=0; i<list.size(); i++){
            SysRole m = list.get(i);
            Map<String, Object> map = Maps.newHashMap();
            map.put("id", m.getId());
            map.put("pId",0);
            map.put("name",m.getRoleName());
            mapList.add(map);
        }
       return mapList;
    }




}
