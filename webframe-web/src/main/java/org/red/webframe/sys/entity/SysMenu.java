package org.red.webframe.sys.entity;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 系统菜单实体类
 */
@Entity
@Table(name = "sys_menu")
public class SysMenu  implements Serializable{
    private int id;
    private Integer parentId;
    private String parentIds;
    private String menuName;
    private Integer sortNumber;
    private String href;
    private String target;
    private String menuIcon;
    private String isShow;
    private String permission;
    private int createUser;
    private Date createDate;
    private int modifyUser;
    private Date modifyDate;
    private String remark;
    private String isDelete = "0";


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
    @Column(name = "parent_id", nullable = true, insertable = true, updatable = true)
    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    @Basic
    @Column(name = "parent_ids", nullable = true, insertable = true, updatable = true, length = 300)
    public String getParentIds() {
        return parentIds;
    }
    public void setParentIds(String parentIds) {
        this.parentIds = parentIds;
    }

    @Basic
    @NotEmpty
    @Column(name = "menu_name", nullable = false, insertable = true, updatable = true, length = 300)
    public String getMenuName() {
        return menuName;
    }
    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    @Basic
    @Column(name = "sort_number", nullable = true, insertable = true, updatable = true)
    public Integer getSortNumber() {
        return sortNumber;
    }
    public void setSortNumber(Integer sortNumber) {
        this.sortNumber = sortNumber;
    }

    @Basic
    @Column(name = "href", nullable = true, insertable = true, updatable = true, length = 500)
    public String getHref() {
        return href;
    }
    public void setHref(String href) {
        this.href = href;
    }

    @Basic
    @Column(name = "target", nullable = true, insertable = true, updatable = true, length = 15)
    public String getTarget() {
        return target;
    }
    public void setTarget(String target) {
        this.target = target;
    }

    @Basic
    @Column(name = "menu_icon", nullable = true, insertable = true, updatable = true, length = 100)
    public String getMenuIcon() {
        return menuIcon;
    }
    public void setMenuIcon(String menuIcon) {
        this.menuIcon = menuIcon;
    }

    @Basic
    @Column(name = "is_show", nullable = false, insertable = true, updatable = true, length = 1)
    public String getIsShow() {
        return isShow;
    }
    public void setIsShow(String isShow) {
        this.isShow = isShow;
    }

    @Basic
    @Column(name = "permission", nullable = true, insertable = true, updatable = true, length = 200)
    public String getPermission() {
        return permission;
    }
    public void setPermission(String permission) {
        this.permission = permission;
    }

    @Basic
    @Column(name = "create_user", nullable = false, insertable = true, updatable = true)
    public int getCreateUser() {
        return createUser;
    }
    public void setCreateUser(int createUser) {
        this.createUser = createUser;
    }

    @Basic
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "create_date", nullable = false, insertable = true, updatable = true)
    public Date getCreateDate() {
        return createDate;
    }
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Basic
    @Column(name = "modify_user", nullable = false, insertable = true, updatable = true)
    public int getModifyUser() {
        return modifyUser;
    }
    public void setModifyUser(int modifyUser) {
        this.modifyUser = modifyUser;
    }

    @Basic
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "modify_date", nullable = false, insertable = true, updatable = true)
    public Date getModifyDate() {
        return modifyDate;
    }
    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
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
    @Column(name = "is_delete", nullable = false, insertable = true, updatable = true, length = 1)
    public String getIsDelete() {
        return isDelete;
    }
    public void setIsDelete(String isDelete) {
        this.isDelete = isDelete;
    }



    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SysMenu sysMenu = (SysMenu) o;

        if (id != sysMenu.id) return false;
        if (createUser != sysMenu.createUser) return false;
        if (modifyUser != sysMenu.modifyUser) return false;
        if (parentId != null ? !parentId.equals(sysMenu.parentId) : sysMenu.parentId != null) return false;
        if (parentIds != null ? !parentIds.equals(sysMenu.parentIds) : sysMenu.parentIds != null) return false;
        if (menuName != null ? !menuName.equals(sysMenu.menuName) : sysMenu.menuName != null) return false;
        if (sortNumber != null ? !sortNumber.equals(sysMenu.sortNumber) : sysMenu.sortNumber != null) return false;
        if (href != null ? !href.equals(sysMenu.href) : sysMenu.href != null) return false;
        if (target != null ? !target.equals(sysMenu.target) : sysMenu.target != null) return false;
        if (menuIcon != null ? !menuIcon.equals(sysMenu.menuIcon) : sysMenu.menuIcon != null) return false;
        if (isShow != null ? !isShow.equals(sysMenu.isShow) : sysMenu.isShow != null) return false;
        if (permission != null ? !permission.equals(sysMenu.permission) : sysMenu.permission != null) return false;
        if (createDate != null ? !createDate.equals(sysMenu.createDate) : sysMenu.createDate != null) return false;
        if (modifyDate != null ? !modifyDate.equals(sysMenu.modifyDate) : sysMenu.modifyDate != null) return false;
        if (remark != null ? !remark.equals(sysMenu.remark) : sysMenu.remark != null) return false;
        if (isDelete != null ? !isDelete.equals(sysMenu.isDelete) : sysMenu.isDelete != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (parentId != null ? parentId.hashCode() : 0);
        result = 31 * result + (parentIds != null ? parentIds.hashCode() : 0);
        result = 31 * result + (menuName != null ? menuName.hashCode() : 0);
        result = 31 * result + (sortNumber != null ? sortNumber.hashCode() : 0);
        result = 31 * result + (href != null ? href.hashCode() : 0);
        result = 31 * result + (target != null ? target.hashCode() : 0);
        result = 31 * result + (menuIcon != null ? menuIcon.hashCode() : 0);
        result = 31 * result + (isShow != null ? isShow.hashCode() : 0);
        result = 31 * result + (permission != null ? permission.hashCode() : 0);
        result = 31 * result + createUser;
        result = 31 * result + (createDate != null ? createDate.hashCode() : 0);
        result = 31 * result + modifyUser;
        result = 31 * result + (modifyDate != null ? modifyDate.hashCode() : 0);
        result = 31 * result + (remark != null ? remark.hashCode() : 0);
        result = 31 * result + (isDelete != null ? isDelete.hashCode() : 0);
        return result;
    }

    /**
     * 菜单列表排序
     * @param list 目的list
     * @param sourcelist 原始list
     * @param parentId 父ID
     * @param cascade 是否级联下级菜单
     */
    public static void sortList(List<SysMenu> list, List<SysMenu> sourcelist, int parentId, boolean cascade){
        for (int i=0; i<sourcelist.size(); i++){
            SysMenu e = sourcelist.get(i);
            if (e.getParentId()!=null
                    && e.getParentId().equals(parentId)){
                list.add(e);
                if (cascade){
                    // 判断是否还有子节点, 有则继续获取子节点
                    for (int j=0; j<sourcelist.size(); j++){
                        SysMenu child = sourcelist.get(j);
                        if (child.getParentId()!=null&&child.getParentId().equals(e.getId())){
                            sortList(list, sourcelist, e.getId(), true);
                            break;
                        }
                    }
                }
            }
        }
    }
}

