package org.red.webframe.sys.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.red.webframe.common.jpa.DynamicSpecifications;
import org.red.webframe.common.jpa.SearchFilter;
import org.red.webframe.sys.dao.IMenuDao;
import org.red.webframe.sys.dao.IRoleDao;
import org.red.webframe.sys.dao.ISysRoleMenuRelationDao;
import org.red.webframe.sys.entity.SysMenu;
import org.red.webframe.sys.entity.SysRole;
import org.red.webframe.sys.entity.SysRoleMenuRelation;
import org.red.webframe.sys.service.IRoleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

/**
 * RoleServiceImpl
 * JRed(breavecatking@gmail.com)
 * 2016/6/23 15:42
 **/
@Transactional
@Service
public class RoleServiceImpl  implements IRoleService {
    @Resource
    private IRoleDao roleDao;
    @Resource
    private IMenuDao menuDao;
    @Resource
    private ISysRoleMenuRelationDao roleMenuDao;


    /**
     * 根据条件分页查询菜单数据
     * @param params
     * @param pageable
     * @return
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public Page<SysRole> findRolePageByParams(Map<String, Object> params, Pageable pageable) {
        Page<SysRole> rolePage = null;
        if(params == null){
            rolePage = roleDao.findAll(pageable);
        }else{
            Map<String,SearchFilter>  filters = SearchFilter.parse(params);
            Specification<SysRole> spec = DynamicSpecifications.bySearchFilter(filters.values());
            rolePage = roleDao.findAll(spec, pageable);
        }
        return rolePage;
    }

    /**
     * 根据id查询一个菜单信息
     *
     * @param id
     * @return
     */
    @Override
    public SysRole findOneRole(Integer id) {
        return roleDao.findOne(id);
    }

    /**
     * 保存一条菜单信息
     * @param role
     * @return
     */
    @Override
    public SysRole saveOrUpdateRole(SysRole role,String permIds) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if(role.getId()!=0){ //保存修改
            SysRole old = roleDao.findOne(role.getId());
            role.setModifyDate(now);
            role.setCreateDate(old.getCreateDate());
            roleDao.save(role);
            if(StringUtils.isBlank(permIds)){
                roleDao.delTRoleMenuRelationByRoleId(role.getId());
            }
        }else{
            role.setModifyDate(now);
            role.setCreateDate(now);
            roleDao.save(role);
        }
        //权限集合部分
        if(StringUtils.isNotBlank(permIds)){
            String[] ids = permIds.split(",");
            if(ids!=null&&ids.length>0){
                //先删除角色与权限菜单的映射关系
                roleDao.delTRoleMenuRelationByRoleId(role.getId());
                SysRoleMenuRelation rml = null;
                for(String id:ids){
                    if("0".equals(id))continue;
                    SysMenu menu = menuDao.findOne(Integer.valueOf(id));
                    rml = new SysRoleMenuRelation();
                    rml.setSysRoleByRoleId(role);
                    rml.setSysMenuByMenuId(menu);
                    roleMenuDao.save(rml);
                }
            }
        }
        return roleDao.save(role);
    }

    /**
     * 删除角色数据
     * @param roleId
     */
    @Override
    public void deleteRole(Integer roleId) {
       roleDao.delete(roleId);
    }

    /**
     * @param roleId
     * @return List<SysRoleMenuRelation>
     * @throws
     * @Title: getRoleMenuRelationsByRoleId
     * @Description: 根据角色ID获取角色与权限菜单的映射关系集合
     * @author JRed bravecatking@gmail.com
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<SysRoleMenuRelation> getRoleMenuRelationsByRoleId(Integer roleId) {
        return roleDao.getRoleMenuRelationsByRoleId(roleId);
    }

    /**
     * 批量删除角色
     * @param ids
     */
    @Override
    public void delRoleByIds(String[] ids) {
        if(ids!=null){
            for(String id:ids){
                SysRole role = roleDao.findOne(Integer.valueOf(id));
                role.setIsshow(1);
                roleDao.save(role);
            }
        }
    }

    /**
     * 根据条件获取角色
     * @param params
     * @return
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<SysRole> getRolesByParams( Map<String,Object>  params) {
        List<SysRole> roleList = null;
        Map<String,SearchFilter>  filters = SearchFilter.parse(params);
        Specification<SysRole> spec = DynamicSpecifications.bySearchFilter(filters.values());
        roleList = roleDao.findAll(spec);
        return roleList;
    }
}
