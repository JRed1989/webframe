package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SysMenu;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 系统菜单dao
 * Created by snow on 2016/6/21.
 */
@Repository
public interface IMenuDao extends JpaRepository<SysMenu,Integer> {

    /**
     * 查询一级菜单
     * @return
     */
    @Query(value = "from SysMenu t where t.isShow=0 and t.isDelete ='0' and t.parentId = 0 ")
    List<SysMenu> findTopMenuList();

    /**
     * 级联删除菜单及其子菜单
     * 只是标识位删除
     * @param menuId
     */
    @Query(value = "update from SysMenu set isDelete = '1' where id=?1 or parentId = ?2 ")
    @Modifying
    void deleteCascade(Integer menuId, Integer parentId);

}
