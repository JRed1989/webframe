package org.red.webframe.common.jpa;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.util.Assert;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.data.jpa.repository.query.QueryUtils.DELETE_ALL_QUERY_STRING;
import static org.springframework.data.jpa.repository.query.QueryUtils.getQueryString;

/**
 * Email: xingsen@join-cn.com
 * User: 邢森
 */
public class JpaRepositoryImpl<T, ID extends Serializable> extends SimpleJpaRepository<T, ID>
        implements JpaRepository<T, ID> {
    private  JpaEntityInformation<T, ?> entityInformation = null;
    private  EntityManager em = null;
    protected Logger logger = LoggerFactory.getLogger(JpaRepositoryImpl.class);
    public static final String READ_ALL_QUERY = "select x from %s x";

    public JpaRepositoryImpl(JpaEntityInformation<T, ?> entityInformation, EntityManager entityManager) {
        super(entityInformation, entityManager);

        this.entityInformation = entityInformation;
        this.em = entityManager;
    }

    public JpaRepositoryImpl(Class<T> domainClass, EntityManager em) {
        this(JpaEntityInformationSupport.getEntityInformation(domainClass,em), em);

    }

    public int deleteInId(List<ID> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        String ql = getQueryString(DELETE_ALL_QUERY_STRING, entityInformation.getEntityName());
        logger.debug(ql);
        return applyAndBind(ql, ids, em).executeUpdate();
    }

    public List<T> findAllById(List<ID> ids) {
        if (ids == null || ids.isEmpty()) {
            return new ArrayList<T>();
        }
        String ql = getQueryString(READ_ALL_QUERY, entityInformation.getEntityName());
        logger.debug(ql);
        return applyAndBind(ql, ids, em).getResultList();
    }

    public Query applyAndBind(String queryString, List<ID> ids, EntityManager entityManager) {
        Assert.notNull(queryString);
        Assert.notNull(ids);
        Assert.notNull(entityManager);

        String alias = QueryUtils.detectAlias(queryString);
        StringBuilder builder = new StringBuilder(queryString);
        builder.append(" where ");
        builder.append(String.format(" %s.id IN(?1)", alias));

        Query query = entityManager.createQuery(builder.toString());
        query.setParameter(1, ids);
        return query;
    }
}
