package org.red.webframe.common.jpa;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.io.Serializable;
import java.util.List;

/**
 * Email: xingsen@join-cn.com
 * User: 邢森
 */
public interface JpaRepository<T, ID extends Serializable> extends PagingAndSortingRepository<T, ID>, JpaSpecificationExecutor<T> {

    int deleteInId(List<ID> ids);

    List<T> findAllById(List<ID> ids);
}
