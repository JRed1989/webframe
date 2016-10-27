package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SysRoleMenuRelation;
import org.springframework.stereotype.Repository;

/**
 * ISysRoleMenuRelationDao 系统角色和菜单关系表
 * JRed(breavecatking@gmail.com)
 * 2016/6/23 18:33
 **/
@Repository
public interface ISysRoleMenuRelationDao extends JpaRepository<SysRoleMenuRelation,Integer> {
}
