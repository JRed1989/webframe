package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SysRole;
import org.red.webframe.sys.entity.SysRoleMenuRelation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 角色dao层
 * Created by snow on 2016/6/20.
 */
@Repository
public interface IRoleDao extends JpaRepository<SysRole,Integer> {

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
    @Query("from SysRoleMenuRelation t where t.sysRoleByRoleId.id = ?1")
    List<SysRoleMenuRelation> getRoleMenuRelationsByRoleId(Integer roleId);

    /**
     *
     * @Title: delTRoleMenuRelationByRoleId
     * @Description: 根据角色ID删除角色与权限菜单的映射关系
     * @author JRed bravecatking@gmail.com
     * @param @param roleId
     * @return void
     * @throws
     */
    @Query("delete from SysRoleMenuRelation t where t.sysRoleByRoleId.id = ?1")
    @Modifying
    void delTRoleMenuRelationByRoleId(Integer roleId);



}
