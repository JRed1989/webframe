package org.red.webframe.sys.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.red.webframe.common.jpa.DynamicSpecifications;
import org.red.webframe.common.jpa.SearchFilter;
import org.red.webframe.common.security.CredentialsDigest;
import org.red.webframe.common.security.Digests;
import org.red.webframe.common.util.EndecodeUtils;
import org.red.webframe.sys.dao.IRoleDao;
import org.red.webframe.sys.dao.IUserDao;
import org.red.webframe.sys.dao.IUserRoleRelatonDao;
import org.red.webframe.sys.entity.*;
import org.red.webframe.sys.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.*;


@Service("userServiceImpl")
@Transactional
public class UserServiceImpl implements IUserService {
	@Resource
	private IUserDao userDao;
	@Resource
	private IUserRoleRelatonDao userRoleRLDao;
	@Resource
	private IRoleDao roleDao;
	
	@Autowired
	private CredentialsDigest credentialsDigest;

	@Override
	public SysUser getById(Integer id) {
		return userDao.findOne(id);
	}

	@Override
	public SysUser getByUsername(String username) {
		return userDao.getByUsername(username);
	}


	@Override
	public void saveUser(SysUser user, Map params) {
		Timestamp now = new Timestamp(System.currentTimeMillis());
		//用户密码处理
		if(StringUtils.isNoneBlank(user.getPassword())){
			//如果密码不为空，则进行密码加密处理
			encryptPassword(user);
		}
		
		if(user.getId()!=0){ //保存修改
			SysUser old = userDao.findOne(user.getId());
			user.setModifyDate(now);
			user.setCreateDate(old.getCreateDate());
			if(StringUtils.isBlank(user.getPassword())){
				user.setPassword(old.getPassword());
				user.setConfoundCose(old.getConfoundCose());
			}
			userDao.save(user);
		}else{
			user.setModifyDate(now);
			user.setCreateDate(now);
			userDao.save(user);
		}
		if(params!=null){
				 //角色集合部分
				if(params.get("roleIds")!=null){
					String[] ids = (String[])params.get("roleIds");
					if(ids!=null&&ids.length>0){
						//先删除用户与角色的映射关系
						userDao.delUserRoleRelationByUserId(user.getId());
						SysUserRoleRelation ur = null;
						for(String id:ids){
							if("0".equals(id))continue;
							SysRole role = roleDao.findOne(Integer.valueOf(id));
							ur = new SysUserRoleRelation();
							ur.setSysRoleByRoleId(role);
							ur.setSysUserByUserId(user);
							userRoleRLDao.save(ur);
						}
					}
				}
		}
	}

	//加密密码
	private void encryptPassword(SysUser user){
		byte[] saltBytes = Digests.generateSalt(8);
		String salt = EndecodeUtils.encodeHex(saltBytes);
		user.setConfoundCose(salt);
		String oriPwd = user.getPassword();
		user.setPassword(credentialsDigest.digest(oriPwd, saltBytes));
	}
	
	
	@Override
	public void delUserByIds(String[] ids) {
		if(ids!=null&&ids.length>0){
			for(String id:ids){
				SysUser user = userDao.findOne(Integer.valueOf(id));
				user.setStatus(2);
				userDao.save(user);
			}
		}		
	}

	@Override
	public List<SysUserRoleRelation> getUserRoleRelationByUserId(Integer userId) {
		return userDao.getUserRoleRelationByUserId(userId);
	}

	@Override
	public List<SysMenu> getUserSysmenusByUserId(Integer userId) {
		List<SysMenu> menus = null;
		//获取当前用户的后台角色
		List<SysUserRoleRelation> urrl = userDao.getUserRoleRelationByUserId(userId);
		if(urrl!=null&&urrl.size()>0){
			SysUserRoleRelation ur = null;
			SysRoleMenuRelation rm = null;
			//使用set集合来去重
			Set<SysMenu> sets = new HashSet<SysMenu>();
			for(int i=0;i<urrl.size();i++){
				ur = urrl.get(i);
				//获取权限点
				Set<SysRoleMenuRelation> rmrl = ur.getSysRoleByRoleId().getTRoleMenus();
				Iterator<SysRoleMenuRelation> its = rmrl.iterator();
				while(its.hasNext()){
					SysRoleMenuRelation rr = its.next();
					sets.add(rr.getSysMenuByMenuId());
				}
			}
			menus = new ArrayList<SysMenu>(sets);
			Collections.sort(menus,new Comparator<SysMenu>() {
				public int compare(SysMenu o1, SysMenu o2) {
					//按ID升序排序
					return o1.getId()-o2.getId();
				};
			});
		}
		return menus;
	}

	/**
	 * 根据条件分页查询用户数据
	 * @param params
	 * @param pageable
	 * @return Page<SysUser>
	 */
	@Override
	public Page<SysUser> findUserPageByParams(Map<String, Object> params, Pageable pageable) {
		Page<SysUser> userPage = null;
		if(params == null){
			userPage = userDao.findAll(pageable);
		}else{
			Map<String,SearchFilter>  filters = SearchFilter.parse(params);
			Specification<SysUser> spec = DynamicSpecifications.bySearchFilter(filters.values());
			userPage = userDao.findAll(spec, pageable);
		}
		return userPage;
	}


}
