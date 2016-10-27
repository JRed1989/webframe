package org.red.webframe.sys.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.red.webframe.common.controller.BaseController;
import org.red.webframe.sys.entity.SysUser;
import org.red.webframe.sys.entity.SysUserRoleRelation;
import org.red.webframe.sys.service.IUserService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * UserController 系统用户模块控制器
 * JRed(breavecatking@gmail.com)
 * 2016/6/23 15:23
 **/
@Controller
@RequestMapping("/sys/user/")
public class UserController  extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(UserController.class);

    @Resource
    private IUserService userService;


    /**
     *
     * @Title: userList
     * @Description:用户列表
     * @author JRed bravecatking@gmail.com
     * @param @param request
     * @param @param model
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions("sys:user:list")
    @RequestMapping(value="user_list")
    public String  userList(HttpServletRequest request,Model model){
        return "modules/sys/user/user_list";
    }

    /**
     * 异步获取用户数据
     * @param request
     * @param rows
     * @param page
     * @return
     */
    @RequiresPermissions("sys:user:list")
    @RequestMapping(value="ajax_user_data")
    @ResponseBody
    public Map ajaxUserData(HttpServletRequest request,Integer rows,Integer page){
        Integer pageSize = rows==null?10:rows;
        Integer curPage = page==null?0:page-1;
        Map<String,Object> searchParams = new HashMap<String, Object>();
        String username = request.getParameter("username");
        if(StringUtils.isNotBlank(username)){
            searchParams.put("LIKE_username",username);
        }
        Pageable pageable = new PageRequest(curPage, pageSize);
        Page<SysUser> userPage = userService.findUserPageByParams(searchParams,pageable);
        Map data = new HashMap();
        data.put("total",userPage.getTotalElements());
        data.put("rows",userPage.getContent());
        return  data;
    }


    private String[] getSelectedRoleIds(List<SysUserRoleRelation> list){
        String ids = "";
        String names = "";
        if(list!=null&&list.size()>0){
            for(int i=0;i<list.size();i++){
                if(i<list.size()-1){
                    ids += list.get(i).getSysRoleByRoleId().getId()+",";
                    names += list.get(i).getSysRoleByRoleId().getRoleName()+",";
                }else{
                    ids += list.get(i).getSysRoleByRoleId().getId();
                    names += list.get(i).getSysRoleByRoleId().getRoleName();
                }
            }
        }
        return new String[]{ids,names};
    }


    /**
     *
     * @Title: roleAdd
     * @Description: 用户添加页面
     * @author JRed bravecatking@gmail.com
     * @param @param id
     * @param @param model
     * @param @return
     * @return String
     * @throws
     */
    @RequiresPermissions("sys:user:add")
    @RequestMapping(value="user_add")
    public String userAdd(@RequestParam(required=false) String id,Model model){
        if(StringUtils.isNotEmpty(id)){
            SysUser user = userService.getById(Integer.valueOf(id));
            model.addAttribute("user", user);

            String[] sels = getSelectedRoleIds(userService.getUserRoleRelationByUserId(user.getId()));
            model.addAttribute("selRoleIds", sels[0]);
            model.addAttribute("selRoleNames", sels[1]);
        }
        return "modules/sys/user/user_add";
    }

    @RequiresPermissions("sys:user:save")
    @RequestMapping(value="user_save")
    public String userSave(SysUser user,Model model,RedirectAttributes redirectAttr,String roleIds,String isBack){
        int userPkId = user.getId();
        if (!beanValidator(model,user)){
            model.addAttribute("message", "必填项不可为空！");
            if(user.getId() == 0 ) {
                return userAdd(null, model);
            }else{
                return userAdd(userPkId+"", model);
            }
        }
        try{
            Map params = new HashMap();
            if(StringUtils.isNotBlank(roleIds)){
                params.put("roleIds", roleIds.split(","));
            }
            userService.saveUser(user,params);
            redirectAttr.addFlashAttribute("message", "保存用户["+user.getUsername()+"]成功!");
        }catch(Exception e){
            redirectAttr.addFlashAttribute("message", "保存用户["+user.getUsername()+"]失败!");
        }
        return "redirect:user_add";
    }


    @RequiresPermissions("sys:user:delete")
    @RequestMapping(value="user_delete")
    @ResponseBody
    public Integer userDel(@RequestParam String idStr,RedirectAttributes redirectAttr){
        Integer result = 0;
        try{
            String[] ids = idStr.split(",");
            userService.delUserByIds(ids);
        }catch(Exception e){
            logger.error("删除用户失败",e);
            result = 1;
        }
        return result;
    }



}
