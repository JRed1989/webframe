package org.red.webframe.sys.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 用户角色关系表实体类
 */
@Entity
@Table(name = "sys_user_role_relation")
public class SysUserRoleRelation  implements Serializable{

    private int id;
    private SysRole sysRoleByRoleId;
    private SysUser sysUserByUserId;


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO )
    @Column(name = "id", nullable = false, insertable = true, updatable = true)
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }


    @ManyToOne
//    @NotNull
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    public SysRole getSysRoleByRoleId() {
        return sysRoleByRoleId;
    }
    public void setSysRoleByRoleId(SysRole sysRoleByRoleId) {
        this.sysRoleByRoleId = sysRoleByRoleId;
    }

    @ManyToOne
//    @NotNull
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    public SysUser getSysUserByUserId() {
        return sysUserByUserId;
    }
    public void setSysUserByUserId(SysUser sysUserByUserId) {
        this.sysUserByUserId = sysUserByUserId;
    }



    @Override
    public int hashCode() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SysUserRoleRelation that = (SysUserRoleRelation) o;

        if (id != that.id) return false;

        return true;
    }


}
