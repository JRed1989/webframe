package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SysUser;
import org.red.webframe.sys.entity.SysUserRoleRelation;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 *
 * @Description:用户Dao接口
 * @author JRed bravecatking@gmail.com
 */
@Repository
public interface IUserDao extends JpaRepository<SysUser,Integer> {

	/**
	 * 
	* @Title: getByUsername 
	* @Description: 根据用户工号获取用户实体
	* @author JRed bravecatking@gmail.com   
	* @param @return
	* @return SysUser
	* @throws
	 */
	@Query(value = "from SysUser t where t.username = ?1")
	SysUser getByUsername(String username);
	/**
	 * 
	* @Title: getUserRoleRelationByUserId 
	* @Description: 根据用户ID获取用户与角色关系的集合
	* @author JRed bravecatking@gmail.com   
	* @param @param userId
	* @param @return
	* @return List<SysUserRoleRelation>
	* @throws
	 */
	@Query(value = "from SysUserRoleRelation t where t.sysUserByUserId.id=?1")
	List<SysUserRoleRelation> getUserRoleRelationByUserId(Integer userId);
	/**
	 * 
	* @Title: delUserRoleRelationByUserId 
	* @Description: 根据用户
	* @author JRed bravecatking@gmail.com   
	* @param @param userId
	* @return void
	* @throws
	 */
	@Query(value="delete from SysUserRoleRelation t where t.sysUserByUserId.id=?1")
	@Modifying
	void delUserRoleRelationByUserId(Integer userId);


}
