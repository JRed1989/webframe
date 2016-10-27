package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SysUserRoleRelation;
import org.springframework.stereotype.Repository;

/**
 * 用户与角色关系表dao层
 * Created by snow on 2016/6/20.
 */
@Repository
public interface IUserRoleRelatonDao extends JpaRepository<SysUserRoleRelation,Integer> {

}
