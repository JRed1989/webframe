package org.red.webframe.sys.service;

import org.red.webframe.sys.entity.SysRole;
import org.red.webframe.sys.entity.SysRoleMenuRelation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * IRoleService 系统橘色service层
 * JRed(breavecatking@gmail.com)
 * 2016/6/23 15:34
 **/
public interface IRoleService {

    /**
     * 根据条件分页查询菜单数据
     * @param params
     * @return
     */
    public Page<SysRole> findRolePageByParams(Map<String, Object> params, Pageable pageable);

    /**
     * 根据id查询一个菜单信息
     * @param id
     * @return
     */
    public SysRole findOneRole(Integer id);

    /**
     * 保存一条菜单信息
     * @param role
     * @return
     */
    public  SysRole saveOrUpdateRole(SysRole role, String permIds);

    /**
     * 删除角色数据
     * @param roleId
     */
    void deleteRole(Integer roleId);

    /**
     *
     * @Title: getRoleMenuRelationsByRoleId
     * @Description: 根据角色ID获取角色与权限菜单的映射关系集合
     * @author JRed bravecatking@gmail.com
     * @param @param roleId
     * @param @return
     * @return List<SysRoleMenuRelation>
     * @throws
     */
    List<SysRoleMenuRelation> getRoleMenuRelationsByRoleId(Integer roleId);

    /**
     * 批量删除角色(标识删除，非物理删除)
     * @param ids
     */
    void delRoleByIds(String[] ids);

    /**
     * 根据条件获取角色
     * @param params
     * @return
     */
    public List<SysRole> getRolesByParams(Map<String, Object> params) ;

}
