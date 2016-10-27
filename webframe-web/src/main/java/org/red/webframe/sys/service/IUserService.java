package org.red.webframe.sys.service;

import org.red.webframe.sys.entity.SysMenu;
import org.red.webframe.sys.entity.SysUser;
import org.red.webframe.sys.entity.SysUserRoleRelation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;


/**
 * 
* @Description:用户Service层
* @author JRed bravecatking@gmail.com 
 */
public interface IUserService {
	/**
	 *
	 * @Title: getById
	 * @Description:根据ID获取用户实体
	 * @author JRed bravecatking@gmail.com
	 * @param @return
	 * @return SysUser
	 * @throws
	 */
	SysUser getById(Integer id);
	/**
	 *
	 * @Title: getByUsername
	 * @Description: 根据用户工号获取用户实体
	 * @author JRed bravecatking@gmail.com
	 * @param @return
	 * @return SysUser
	 * @throws
	 */
	SysUser getByUsername(String username);
	/**
	 *
	 * @Title: saveUser
	 * @Description: 保存用户信息
	 * @author JRed bravecatking@gmail.com
	 * @param @param user
	 * @param @param params
	 * @return void
	 * @throws
	 */
	void saveUser(SysUser user, Map params);
	/**
	 *
	 * @Title: userDel
	 * @Description: 批量删除用户(非物理删除，只是禁用改用户)
	 * @author JRed bravecatking@gmail.com
	 * @param @param ids
	 * @return void
	 * @throws
	 */
	void delUserByIds(String[] ids);
	/**
	 *
	 * @Title: getUserRoleRelationByUserId
	 * @Description: 根据用户ID获取用户与角色关系的集合
	 * @author JRed bravecatking@gmail.com
	 * @param @param userId
	 * @param @return
	 * @return List<TUserRoleRelation>
	 * @throws
	 */
	List<SysUserRoleRelation> getUserRoleRelationByUserId(Integer userId);
	/**
	 *
	 * @Title: getUserSysmenusByUserId
	 * @Description:
	 * @author JRed bravecatking@gmail.com
	 * @param @param userId
	 * @param @return
	 * @return List<TSysMenu>
	 * @throws
	 */
	List<SysMenu> getUserSysmenusByUserId(Integer userId);
	/**
	 * 根据条件分页查询用户数据
	 * @param params
	 * @param pageable
	 * @return Page<SysUser>
	 */
	public Page<SysUser> findUserPageByParams(Map<String, Object> params, Pageable pageable);


}
