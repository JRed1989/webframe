package org.red.webframe.sys.service.impl;

import org.red.webframe.sys.dao.ISystemEnumDao;
import org.red.webframe.sys.entity.SystemEnum;
import org.red.webframe.sys.service.ISystemEnumService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;


@Service
@Transactional
public class SystemEnumServiceImpl implements ISystemEnumService {

    @Resource
    private ISystemEnumDao iSystemEnumDao;

    public List<SystemEnum> findSystemEnumByGroup(int group) {
        return iSystemEnumDao.findSystemEnumByGroup(group);
    }
}
