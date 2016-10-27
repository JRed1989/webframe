package org.red.webframe.sys.dao;

import org.red.webframe.common.jpa.JpaRepository;
import org.red.webframe.sys.entity.SystemEnum;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *系统字典信息dao层
 */
@Repository
public interface ISystemEnumDao  extends JpaRepository<SystemEnum,Integer> {
    /**
     * 根据group获取数据
     * */
    @Query(value = "select * from bdsp_system_enum se where  se.groups=?1 ", nativeQuery = true)
    public List<SystemEnum> findSystemEnumByGroup(int group);

}
