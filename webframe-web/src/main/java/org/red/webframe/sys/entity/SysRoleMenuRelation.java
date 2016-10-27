package org.red.webframe.sys.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 系统角色和菜单关系表实体类
 */
@Entity
@Table(name = "sys_role_menu_relation")
public class SysRoleMenuRelation  implements Serializable{

    private int id;
    private SysMenu sysMenuByMenuId;
    private SysRole sysRoleByRoleId;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, insertable = true, updatable = true)
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    @ManyToOne
    @JoinColumn(name = "menu_id", referencedColumnName = "id", nullable = false)
    public SysMenu getSysMenuByMenuId() {
        return sysMenuByMenuId;
    }
    public void setSysMenuByMenuId(SysMenu sysMenuByMenuId) {
        this.sysMenuByMenuId = sysMenuByMenuId;
    }

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    public SysRole getSysRoleByRoleId() {
        return sysRoleByRoleId;
    }
    public void setSysRoleByRoleId(SysRole sysRoleByRoleId) {
        this.sysRoleByRoleId = sysRoleByRoleId;
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SysRoleMenuRelation that = (SysRoleMenuRelation) o;

        if (id != that.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id;
    }
}
