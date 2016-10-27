package org.red.webframe.sys.service;


import org.red.webframe.sys.entity.SysMenu;

import java.util.List;
import java.util.Map;

/**
 * IMenuService 系统菜单service
 * JRed(breavecatking@gmail.com)
 * 2016/6/21 13:00
 **/
public interface IMenuService {

    /**
     * 根据条件查询所有菜单
     * @param params
     * @return
     */
    List<SysMenu> findAllMenuByParams(Map<String, Object> params);

    /**
     * 根据id查询一个菜单信息
     * @param id
     * @return
     */
    SysMenu findOneSysMenu(Integer id);

    /***
     * 保存一条菜单信息
     * @param menu
     * @return
     */
    SysMenu saveOrUpdateSysmenu(SysMenu menu);

    /**
     * 级联删除菜单及其子菜单
     * 只是标识位删除
     * @param menuId
     */
    void deleteCascade(Integer menuId, Integer parentId);


}
