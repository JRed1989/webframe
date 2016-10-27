package org.red.webframe.sys.entity;

import javax.persistence.*;
import java.io.Serializable;


/**
 * 系统信息字典实体类
 *
 */
@Entity
@Table(name="bdsp_system_enum")
public class SystemEnum implements Serializable {

    private String id;
    private String value;//值
    private String describes;//描述
    private String groups;//groups
    private String code;//group

    @Id
    @Column(name="id",nullable=false)
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    @Basic
    @Column(name="value",nullable=true)
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }

    @Basic
    @Column(name="describes",nullable=true)
    public String getDescribes() {
        return describes;
    }
    public void setDescribes(String describes) {
        this.describes = describes;
    }

    @Basic
    @Column(name="groups",nullable=true)
    public String getGroups() {
        return groups;
    }
    public void setGroups(String groups) {
        this.groups = groups;
    }

    @Basic
    @Column(name="code",nullable=true)
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }



    public SystemEnum() {
    }

    public SystemEnum(String id, String value, String describes, String groups, String code) {
        this.id = id;
        this.value = value;
        this.describes = describes;
        this.groups = groups;
        this.code = code;
    }
}

