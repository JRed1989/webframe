/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Version : 50631
 Source Host           : localhost
 Source Database       : webframe

 Target Server Version : 50631
 File Encoding         : utf-8

 Date: 10/28/2016 00:16:40 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `sys_department`
-- ----------------------------
DROP TABLE IF EXISTS `sys_department`;
CREATE TABLE `sys_department` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `parent_id` int(11) DEFAULT NULL COMMENT '父ID',
  `name` varchar(200) NOT NULL COMMENT '名称',
  `fullname` varchar(300) DEFAULT NULL COMMENT '全称',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `numbers` varchar(100) DEFAULT NULL COMMENT '编码',
  `phone` varchar(50) DEFAULT NULL COMMENT '联系电话',
  `address` varchar(300) DEFAULT NULL COMMENT '地址',
  `levels` int(11) NOT NULL COMMENT '树级别',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_date` datetime DEFAULT NULL COMMENT '修改时间',
  `create_user` int(11) DEFAULT NULL COMMENT '创建人',
  `modify_user` int(11) DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门';

-- ----------------------------
--  Table structure for `sys_menu`
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `parent_id` int(11) DEFAULT NULL COMMENT '父级编号',
  `parent_ids` varchar(300) DEFAULT NULL COMMENT '所有父级编号',
  `menu_name` varchar(300) NOT NULL COMMENT '名称',
  `sort_number` int(11) DEFAULT NULL COMMENT '排序号',
  `href` varchar(500) DEFAULT NULL COMMENT '跳转链接',
  `target` varchar(15) DEFAULT NULL COMMENT '链接打开方式',
  `menu_icon` varchar(100) DEFAULT NULL COMMENT '图标',
  `is_show` char(1) CHARACTER SET utf16 NOT NULL COMMENT '是否显示',
  `permission` varchar(200) DEFAULT NULL COMMENT '权限标识',
  `create_user` int(11) NOT NULL COMMENT '创建者',
  `create_date` datetime NOT NULL COMMENT '创建日期',
  `modify_user` int(11) NOT NULL COMMENT '最近更新者',
  `modify_date` datetime NOT NULL COMMENT '最近更新日期',
  `remark` varchar(300) DEFAULT NULL COMMENT '备注信息',
  `is_delete` char(1) NOT NULL DEFAULT '0' COMMENT '删除标识',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8 COMMENT='系统菜单表';

-- ----------------------------
--  Records of `sys_menu`
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` VALUES ('1', '0', null, '系统设置', '1', '', null, 'fa-cogs', '0', '', '0', '2016-06-21 14:34:07', '0', '2016-07-28 10:08:26', '', '0'), ('2', '1', null, '菜单管理', '2', '/admin/sys/menu/menu_list', null, 'fa-book', '0', 'sys:menu:list', '0', '2016-06-21 14:44:34', '0', '2016-07-28 10:10:07', '', '0'), ('3', '1', null, '角色管理', '3', '', null, '', '0', '', '0', '2016-06-23 10:53:33', '0', '2016-06-23 10:53:33', '', '1'), ('4', '1', null, '用户管理', '4', '', null, '', '0', '', '0', '2016-06-23 10:55:27', '0', '2016-06-23 10:55:27', '', '1'), ('10', '1', null, '角色管理', '8', '/admin/sys/role/role_list', null, 'fa-group', '0', 'sys:role:list', '0', '2016-06-23 16:10:15', '0', '2016-07-28 10:11:28', '', '0'), ('11', '1', null, '用户管理', '12', '/admin/sys/user/user_list', null, 'fa-user', '0', 'sys:user:list', '0', '2016-06-23 23:01:31', '0', '2016-07-28 10:13:50', '', '0'), ('12', '2', null, '添加', '12', '/admin/sys/menu/menu_add', null, '', '1', 'sys:menu:add', '0', '2016-06-24 10:31:18', '0', '2016-06-24 12:43:07', '', '0'), ('13', '2', null, '修改', '13', '/admin/sys/menu/menu_edit', null, '', '1', 'sys:menu:edit', '0', '2016-06-24 12:43:48', '0', '2016-06-24 12:48:44', '', '0'), ('14', '2', null, '删除', '14', '/admin/sys/menu/menu_delete', null, '', '1', 'sys:menu:delete', '0', '2016-06-24 12:44:46', '0', '2016-06-24 12:44:46', '', '0'), ('15', '2', null, '保存', '16', '/admin/sys/menu/menu_save', null, '', '1', 'sys:menu:save', '0', '2016-06-24 12:45:29', '0', '2016-06-24 12:45:29', '', '0'), ('16', '2', null, '批量排序', '17', '/admin/sys/menu/batch_update_sort', null, '', '1', 'sys:menu:batchsort', '0', '2016-06-24 12:46:17', '0', '2016-06-24 12:46:17', '', '0'), ('17', '10', null, '添加', '18', '/admin/sys/role/role_add', null, '', '1', 'sys:role:add', '0', '2016-06-24 12:48:29', '0', '2016-06-24 13:21:41', '', '0'), ('18', '10', null, '保存', '19', '/admin/sys/role/role_save', null, '', '1', 'sys:role:save', '0', '2016-06-24 13:18:21', '0', '2016-06-24 13:18:21', '', '0'), ('19', '10', null, '删除', '20', '/admin/sys/role/role_delete', null, '', '1', 'sys:role:delete', '0', '2016-06-24 13:19:03', '0', '2016-06-24 13:19:03', '', '0'), ('20', '11', null, '添加', '22', '/admin/sys/user/user_add', null, '', '1', 'sys:user:add', '0', '2016-06-24 13:20:04', '0', '2016-06-24 13:20:04', '', '0'), ('21', '11', null, '保存', '23', '/admin/sys/user/user_save', null, '', '1', 'sys:user:save', '0', '2016-06-24 13:20:52', '0', '2016-06-24 13:20:52', '', '0'), ('22', '11', null, '删除', '24', '/admin/sys/user/user_delete', null, '', '1', 'sys:user:delete', '0', '2016-06-24 13:21:28', '0', '2016-06-24 13:21:28', '', '0');
COMMIT;

-- ----------------------------
--  Table structure for `sys_role`
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_name` varchar(200) NOT NULL COMMENT '角色名称',
  `remark` varchar(300) DEFAULT NULL COMMENT '备注',
  `isshow` int(11) DEFAULT NULL COMMENT '是否可用',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_date` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
--  Records of `sys_role`
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` VALUES ('1', '系统管理员', '系统管理员，拥有所有的后台权限', '0', '2016-06-23 17:42:21', '2016-10-28 00:15:36');
COMMIT;

-- ----------------------------
--  Table structure for `sys_role_menu_relation`
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu_relation`;
CREATE TABLE `sys_role_menu_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`id`),
  KEY `FK_FK_role_menu_menuId` (`menu_id`),
  KEY `FK_FK_role_menu_roldId` (`role_id`),
  CONSTRAINT `sys_role_menu_relation_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`),
  CONSTRAINT `sys_role_menu_relation_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8 COMMENT='角色和系统菜单的关系表';

-- ----------------------------
--  Records of `sys_role_menu_relation`
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu_relation` VALUES ('16', '1', '1'), ('17', '1', '2'), ('18', '1', '12'), ('19', '1', '13'), ('20', '1', '14'), ('21', '1', '15'), ('22', '1', '16'), ('23', '1', '10'), ('24', '1', '17'), ('25', '1', '18'), ('26', '1', '19'), ('27', '1', '11'), ('28', '1', '20'), ('29', '1', '21'), ('30', '1', '22');
COMMIT;

-- ----------------------------
--  Table structure for `sys_user`
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(100) NOT NULL COMMENT '用户名',
  `password` varchar(200) NOT NULL COMMENT '密码',
  `confound_cose` varchar(50) DEFAULT NULL COMMENT '混淆码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `mobile` varchar(20) DEFAULT NULL COMMENT '手机号',
  `realname` varchar(100) DEFAULT NULL COMMENT '真实姓名',
  `gender` char(1) DEFAULT NULL COMMENT '性别',
  `birthday` datetime DEFAULT NULL COMMENT '生日',
  `validate_type` varchar(50) DEFAULT NULL COMMENT '验证类型(用户激活,重置密码,邮箱激活)',
  `validate_key` varchar(100) DEFAULT NULL COMMENT '验证KEY',
  `rank` int(11) DEFAULT NULL COMMENT '等级',
  `user_type` int(11) NOT NULL DEFAULT '0' COMMENT '类型(0:会员,1:管理员)',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态(0:正常,1:锁定,2:待验证)',
  `province_id` int(11) DEFAULT NULL COMMENT '省份ID',
  `IDcard` varchar(50) DEFAULT NULL COMMENT '身份证号码',
  `dept_id` int(11) DEFAULT NULL COMMENT '部门ID',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_date` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  KEY `FK_FK_user_deptId` (`dept_id`),
  CONSTRAINT `sys_user_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `sys_department` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
--  Records of `sys_user`
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` VALUES ('1', 'admin', 'ff3d907ad68798860b15ae77328ad11fd4ff4f19', '056a0b37e2549271', null, '', '管理员', '2', null, null, null, null, '1', '0', null, null, null, '2016-06-17 14:03:33', '2016-06-24 13:37:22');
COMMIT;

-- ----------------------------
--  Table structure for `sys_user_role_relation`
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role_relation`;
CREATE TABLE `sys_user_role_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`id`),
  KEY `FK_FK_user_role_roleId` (`role_id`),
  KEY `FK_FK_user_role_userId` (`user_id`),
  CONSTRAINT `sys_user_role_relation_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`),
  CONSTRAINT `sys_user_role_relation_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户与角色关系表';

SET FOREIGN_KEY_CHECKS = 1;
