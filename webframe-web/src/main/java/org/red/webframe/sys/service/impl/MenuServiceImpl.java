package org.red.webframe.sys.service.impl;

import org.red.webframe.common.jpa.DynamicSpecifications;
import org.red.webframe.common.jpa.SearchFilter;
import org.red.webframe.sys.dao.IMenuDao;
import org.red.webframe.sys.entity.SysMenu;
import org.red.webframe.sys.service.IMenuService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * MenuServiceImpl
 * JRed(breavecatking@gmail.com)
 * 2016/6/21 13:03
 **/
@Transactional
@Service
public class MenuServiceImpl  implements IMenuService {

    @Resource
    private IMenuDao menudao;
    /**
     * 根据条件查询所有菜单
     *
     * @param params
     * @return
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<SysMenu> findAllMenuByParams(Map<String, Object> params) {
        List<SysMenu> menuList = null;
        Map<String,SearchFilter>  filters = SearchFilter.parse(params);
        Specification<SysMenu> spec = DynamicSpecifications.bySearchFilter(filters.values());
        menuList = menudao.findAll(spec);
        return menuList;
    }

    /**
     * 根据id查询一个菜单信息
     *
     * @param id
     * @return
     */
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public SysMenu findOneSysMenu(Integer id) {
        return menudao.findOne(id);
    }

    /**
     * 保存一条菜单信息
     *
     * @param menu@return
     */
    @Override
    public SysMenu saveOrUpdateSysmenu(SysMenu menu) {
        return menudao.save(menu);
    }

    /**
     * 级联删除菜单及其子菜单
     * 只是标识位删除
     *
     * @param menuId
     * @param parentId
     */
    @Override
    public void deleteCascade(Integer menuId, Integer parentId) {
        menudao.deleteCascade(menuId,parentId);
    }


}
