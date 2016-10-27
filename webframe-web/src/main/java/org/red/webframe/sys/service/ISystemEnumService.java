package org.red.webframe.sys.service;


import org.red.webframe.sys.entity.SystemEnum;

import java.util.List;

/**
 * Created by chengwei on 2016/6/24.
 */
public interface ISystemEnumService {

    /**
     * 根据group获取系统字典数据
     * @param group
     * @return
     */
    List<SystemEnum> findSystemEnumByGroup(int group);
}
