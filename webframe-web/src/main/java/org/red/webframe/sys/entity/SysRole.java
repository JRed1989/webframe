package org.red.webframe.sys.entity;

import com.alibaba.fastjson.annotation.JSONField;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


/**
 * 系统角色实体类
 */
@Entity
@Table(name = "sys_role")
public class SysRole implements Serializable {
    private int id;
    private String roleName;
    private String remark;
    private Integer isshow;
    private Date createDate;
    private Date modifyDate;
    private Set<SysRoleMenuRelation> TRoleMenus = new HashSet<SysRoleMenuRelation>(0);

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, insertable = true, updatable = true)
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @NotEmpty
    @Column(name = "role_name", nullable = false, insertable = true, updatable = true, length = 200)
    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @Basic
    @Column(name = "remark", nullable = true, insertable = true, updatable = true, length = 300)
    public String getRemark() {
        return remark;
    }
    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Basic
    @NotNull
    @Column(name = "isshow", nullable = false, insertable = true, updatable = true)
    public Integer getIsshow() {
        return isshow;
    }
    public void setIsshow(Integer isshow) {
        this.isshow = isshow;
    }

    @Basic
    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "create_date", nullable = true, insertable = true, updatable = true)
    public Date getCreateDate() {  return createDate; }
    public void setCreateDate(Date createDate) { this.createDate = createDate; }


    @Basic
    @Temporal(value = TemporalType.TIMESTAMP)
    @Column(name = "modify_date", nullable = true, insertable = true, updatable = true)
    public Date getModifyDate() { return modifyDate; }
    public void setModifyDate(Date modifyDate) { this.modifyDate = modifyDate;  }


    @JSONField(serialize = false)
    @OneToMany(fetch=FetchType.EAGER,mappedBy = "sysRoleByRoleId")
    public Set<SysRoleMenuRelation> getTRoleMenus() {
        return this.TRoleMenus;
    }
    public void setTRoleMenus(Set<SysRoleMenuRelation> TRoleMenus) {
        this.TRoleMenus = TRoleMenus;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SysRole sysRole = (SysRole) o;

        if (id != sysRole.id) return false;
        if (roleName != null ? !roleName.equals(sysRole.roleName) : sysRole.roleName != null) return false;
        if (remark != null ? !remark.equals(sysRole.remark) : sysRole.remark != null) return false;
        if (isshow != null ? !isshow.equals(sysRole.isshow) : sysRole.isshow != null) return false;
        if (createDate != null ? !createDate.equals(sysRole.createDate) : sysRole.createDate != null) return false;
        if (modifyDate != null ? !modifyDate.equals(sysRole.modifyDate) : sysRole.modifyDate != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (roleName != null ? roleName.hashCode() : 0);
        result = 31 * result + (remark != null ? remark.hashCode() : 0);
        result = 31 * result + (isshow != null ? isshow.hashCode() : 0);
        result = 31 * result + (createDate != null ? createDate.hashCode() : 0);
        result = 31 * result + (modifyDate != null ? modifyDate.hashCode() : 0);
        return result;
    }

    public SysRole() {
    }

    public SysRole(int id, String roleName, String remark, Integer isshow, Date createDate, Date modifyDate, Set<SysRoleMenuRelation> TRoleMenus) {
        this.id = id;
        this.roleName = roleName;
        this.remark = remark;
        this.isshow = isshow;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.TRoleMenus = TRoleMenus;
    }
}
