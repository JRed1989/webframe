package org.red.webframe.sys.entity;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * 系统用户实体类
 */
@Entity
@Table(name = "sys_user")
public class SysUser implements Serializable{
    private int id;
    private String username;
    private String password;
    private String confoundCose;
    private String email;
    private String mobile;
    private String realname;
    private String gender;
    private Date birthday;
    private String validateType;
    private String validateKey;
    private Integer rank;
    private int userType;
    private int status;
    private Integer provinceId;
    private String iDcard;
    private Date createDate;
    private Date modifyDate;
    private SysDepartment sysDepartmentByDeptId;



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
    @Column(name = "username", nullable = false, insertable = true, updatable = true, length = 100)
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @NotEmpty
    @Column(name = "password", nullable = false, insertable = true, updatable = true, length = 200)
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    @Basic
    @Column(name = "confound_cose", nullable = true, insertable = true, updatable = true, length = 50)
    public String getConfoundCose() {
        return confoundCose;
    }
    public void setConfoundCose(String confoundCose) {
        this.confoundCose = confoundCose;
    }

    @Basic
    @Column(name = "email", nullable = true, insertable = true, updatable = true, length = 100)
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "mobile", nullable = true, insertable = true, updatable = true, length = 20)
    public String getMobile() {
        return mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @Basic
    @NotEmpty
    @Column(name = "realname", nullable = true, insertable = true, updatable = true, length = 100)
    public String getRealname() {
        return realname;
    }
    public void setRealname(String realname) { this.realname = realname;  }

    @Basic
    @Column(name = "gender", nullable = true, insertable = true, updatable = true, length = 1)
    public String getGender() { return gender; }
    public void setGender(String gender) {
        this.gender = gender;
    }

    @Basic
    @Column(name = "birthday", nullable = true, insertable = true, updatable = true)
    public Date getBirthday() {
        return birthday;
    }
    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    @Basic
    @Column(name = "validate_type", nullable = true, insertable = true, updatable = true, length = 50)
    public String getValidateType() {
        return validateType;
    }
    public void setValidateType(String validateType) {
        this.validateType = validateType;
    }

    @Basic
    @Column(name = "validate_key", nullable = true, insertable = true, updatable = true, length = 100)
    public String getValidateKey() {
        return validateKey;
    }
    public void setValidateKey(String validateKey) {
        this.validateKey = validateKey;
    }

    @Basic
    @Column(name = "rank", nullable = true, insertable = true, updatable = true)
    public Integer getRank() {
        return rank;
    }
    public void setRank(Integer rank) {
        this.rank = rank;
    }

    @Basic
    @Column(name = "user_type", nullable = false, insertable = true, updatable = true)
    public int getUserType() {
        return userType;
    }
    public void setUserType(int userType) {
        this.userType = userType;
    }

    @Basic
    @Column(name = "status", nullable = false, insertable = true, updatable = true)
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    @Basic
    @Column(name = "province_id", nullable = true, insertable = true, updatable = true)
    public Integer getProvinceId() {
        return provinceId;
    }
    public void setProvinceId(Integer provinceId) {
        this.provinceId = provinceId;
    }

    @Basic
    @Column(name = "IDcard", nullable = true, insertable = true, updatable = true, length = 50)
    public String getiDcard() {
        return iDcard;
    }
    public void setiDcard(String iDcard) {
        this.iDcard = iDcard;
    }

    @Basic
    @Temporal(value= TemporalType.TIMESTAMP)
    @Column(name = "create_date", nullable = true, insertable = true, updatable = true)
    public Date getCreateDate() {
        return createDate;
    }
    public void setCreateDate(Date createDate) { this.createDate = createDate; }

    @Basic
    @Temporal(value=TemporalType.TIMESTAMP)
    @Column(name = "modify_date", nullable = true, insertable = true, updatable = true)
    public Date getModifyDate() {
        return modifyDate;
    }
    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }


    @ManyToOne
    @JoinColumn(name = "dept_id", referencedColumnName = "id")
    public SysDepartment getSysDepartmentByDeptId() {
        return sysDepartmentByDeptId;
    }
    public void setSysDepartmentByDeptId(SysDepartment sysDepartmentByDeptId) {
        this.sysDepartmentByDeptId = sysDepartmentByDeptId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SysUser sysUser = (SysUser) o;

        if (id != sysUser.id) return false;
        if (userType != sysUser.userType) return false;
        if (status != sysUser.status) return false;
        if (username != null ? !username.equals(sysUser.username) : sysUser.username != null) return false;
        if (password != null ? !password.equals(sysUser.password) : sysUser.password != null) return false;
        if (confoundCose != null ? !confoundCose.equals(sysUser.confoundCose) : sysUser.confoundCose != null)
            return false;
        if (email != null ? !email.equals(sysUser.email) : sysUser.email != null) return false;
        if (mobile != null ? !mobile.equals(sysUser.mobile) : sysUser.mobile != null) return false;
        if (realname != null ? !realname.equals(sysUser.realname) : sysUser.realname != null) return false;
        if (gender != null ? !gender.equals(sysUser.gender) : sysUser.gender != null) return false;
        if (birthday != null ? !birthday.equals(sysUser.birthday) : sysUser.birthday != null) return false;
        if (validateType != null ? !validateType.equals(sysUser.validateType) : sysUser.validateType != null)
            return false;
        if (validateKey != null ? !validateKey.equals(sysUser.validateKey) : sysUser.validateKey != null) return false;
        if (rank != null ? !rank.equals(sysUser.rank) : sysUser.rank != null) return false;
        if (provinceId != null ? !provinceId.equals(sysUser.provinceId) : sysUser.provinceId != null) return false;
        if (iDcard != null ? !iDcard.equals(sysUser.iDcard) : sysUser.iDcard != null) return false;
        if (createDate != null ? !createDate.equals(sysUser.createDate) : sysUser.createDate != null) return false;
        if (modifyDate != null ? !modifyDate.equals(sysUser.modifyDate) : sysUser.modifyDate != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (confoundCose != null ? confoundCose.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (mobile != null ? mobile.hashCode() : 0);
        result = 31 * result + (realname != null ? realname.hashCode() : 0);
        result = 31 * result + (gender != null ? gender.hashCode() : 0);
        result = 31 * result + (birthday != null ? birthday.hashCode() : 0);
        result = 31 * result + (validateType != null ? validateType.hashCode() : 0);
        result = 31 * result + (validateKey != null ? validateKey.hashCode() : 0);
        result = 31 * result + (rank != null ? rank.hashCode() : 0);
        result = 31 * result + userType;
        result = 31 * result + status;
        result = 31 * result + (provinceId != null ? provinceId.hashCode() : 0);
        result = 31 * result + (iDcard != null ? iDcard.hashCode() : 0);
        result = 31 * result + (createDate != null ? createDate.hashCode() : 0);
        result = 31 * result + (modifyDate != null ? modifyDate.hashCode() : 0);
        return result;
    }


}
