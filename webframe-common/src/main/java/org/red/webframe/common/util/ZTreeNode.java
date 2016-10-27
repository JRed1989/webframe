package org.red.webframe.common.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.*;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * 对zTreeJS控件数据对象封装。
 */
public class ZTreeNode {
	private Integer id;
	private Integer pkId;
	private String name;
	private String target;
	private String url;
	private String ico;
	private boolean isParent=false;
	private boolean open=false;
	private boolean nocheck=false;
	private String value;
	private int level=0;

	private ZTreeNode parentNode;

	public int getLevel() {
		return level;
	}


	public ZTreeNode getParentNode() {
		return parentNode;
	}

	public void setParentNode(ZTreeNode parentNode) {
		this.parentNode = parentNode;
	}
	private Map<String,Object> userAttributes= new HashMap<String,Object>();
	private List<ZTreeNode> children=new ArrayList<ZTreeNode>();
	/**
	 * 构造一个ZTreeNode,配合zTree JS插件使用。
	 * @param name 节点名称
	 * @param isParent 是否是父节点。
	 */

	public ZTreeNode(String name, boolean isParent) {
		super();
		this.name = name;
		this.isParent = isParent;
	}
	
	public ZTreeNode(){}
	public Integer getId() {
		return id;
	}
	/**
	 * 设置id,可选。
	 * @date 2012-4-24
	 * @param id
	 */
	public void setId(Integer id) {
		this.id=id;
	}

	public Integer getPkId() {
		return pkId;
	}
	public void setPkId(Integer pkId) {
		this.pkId=pkId;
	}





	public String getName() {
		return name;
	}
	/**
	 * 设置显示标题
	 * @date 2012-4-24
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}
	public String getTarget() {
		return target;
	}
	/**
	 * 设置打开的目标框架
	 * @date 2012-4-24
	 * @param target
	 */
	public void setTarget(String target) {
		this.target = target;
	}
	/**
	 * 获取节点是否是父节点
	 * @date 2012-4-24
	 * @return 
	 */
	public boolean isParent() {
		return isParent;
	}
	/**
	 * 设置节点是否是父节点
	 * @date 2012-4-24
	 * @param isParent
	 */
	public void setParent(boolean isParent) {
		this.isParent = isParent;
	}
	/**
	 * 取得节点是否展开
	 * @date 2012-4-24
	 * @return
	 */
	public boolean isOpen() {
		return open;
	}
	/**
	 * 设置节点是否展开，默认为关闭
	 * @date 2012-4-24
	 * @param open true 展开， false关闭。
	 */
	public void setOpen(boolean open) {
		this.isParent=true;
		this.open = open;
	}
	/**
	 * 取节点的图标
	 * @date 2012-4-24
	 * @return
	 */
	public String getIco() {
		return ico;
	}
	/**
	 * 设置图标
	 * @date 2012-4-24
	 * @param ico
	 */
	public void setIco(String ico) {
		this.ico = ico;
	}
	/**
	 * 取得所有用户自定义属性。
	 * @date 2012-4-24
	 * @return
	 */
	public Map<String, Object> getAttributes() {
		return userAttributes;
	}
	/**
	 * 取得用户自定义属性。
	 * @date 2012-4-24
	 * @return 如果没有相应的key返回null.
	 */
	public Object getAttribute(String key) {
		if(key==null) return null;
		return userAttributes.get(key);
	}

	/**
	 * 获取所有的子节点
	 * @date 2012-4-24
	 * @return
	 */
	public List<ZTreeNode> getChildren() {
		return children;
	}
	/**
	 * 添加一个子节点,子节点的level为父节点level +1
	 * @date 2012-4-24
	 * @param node
	 */
	public void addChildren(ZTreeNode node){
		if(node!=null){
			node.level=this.level+1;
			this.children.add(node);
		}
	}
	/**
	 * 一次添加多个子节点,子节点的level为父节点level +1
	 * @param nodes 多个子节点
	 */
	public void addChilds(Collection<ZTreeNode> nodes){
		if(nodes!=null){
			for(ZTreeNode node:nodes){
				this.addChildren(node);
			}
		}
	}
	/**
	 * 取得节点的链接地址
	 * @date 2012-4-24
	 * @return
	 */
	public String getUrl() {
		return url;
	}
	/**
	 * 设置节点的点击链接地址
	 * @date 2012-4-24
	 * @param url
	 */
	public void setUrl(String url) {
		this.url = url;
	}
	/**
	 * 添加用户自定义属性。
	 * @date 2012-4-24
	 * @param key 属性的键
	 * @param value 属性值
	 */
	public void setAttr(String key,Object value){
		this.userAttributes.put(key, value);
	}
	
	public boolean isNocheck() {
		return nocheck;
	}

	public void setNocheck(boolean nocheck) {
		this.nocheck = nocheck;
	}
	
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}


//	public String getType() {
//		return type;
//	}
//
//	public void setType(String type) {
//		this.type = type;
//	}

	/**
	 * 将ZTreeNode转换为JsonObject对象。此方法会递归寻找所有包含的子node
	 * @date 2012-5-2
	 * @return JSONObject
	 */
	public JSONObject toJSONObject(){
		JSONObject object = new JSONObject();
		if(this.id!=null) object.put("id",this.id);
		if(this.pkId!=null) object.put("pkId",this.pkId);
		if(this.name!=null) object.put("name",this.name);
		if(this.target!=null) object.put("target",this.target);
		if(this.url!=null) object.put("url",this.url);
		if(this.ico!=null) object.put("icon",this.ico);
		if(this.value!=null) object.put("value",this.value);
		object.put("open",this.open);
		object.put("isParent",this.isParent);
		object.put("nocheck",this.nocheck);
		
		if(this.userAttributes.size()>0){
			object.putAll(this.userAttributes);
		}
		if(this.children.size()>0){
			JSONArray array = new JSONArray();
			for(ZTreeNode node: this.children){
				array.add(node.toJSONObject());
			}
			object.put("children", array);
		}
		
		return object;
	}
	
	/**
	 * 将zTreeNode节点转换为JSON字符串,此方法会递归寻找所有包含的子node
	 * @date 2012-4-24
	 * @return json字符串。
	 */
	public  String toJsonString(){
		JSONObject obj = this.toJSONObject();
		String ret = obj.toString();
		return ret;
	}
	/**
	 * 将一个集合转换成JSON字符串
	 * @date 2012-9-5
	 * @param treeNodes 树节点集合
	 * @return 节点数据的JSON字符串
	 */
	public static String toJsonString(Collection<ZTreeNode> treeNodes){
		JSONArray jsonArray = new JSONArray();
		if(treeNodes!=null){
			for(ZTreeNode node: treeNodes){
				jsonArray.add(node.toJSONObject());
			}
		}
		return jsonArray.toString();
	}
	/**
	 * 将一个节点转换成JSON字符串
	 * @date 2012-9-5
	 * @param treeNode 树节点
	 * @return 节点数据的JSON字符串,如果 treeNode=null,返回null
	 */
	public static String toJsonString(ZTreeNode treeNode){
		if(treeNode!=null){
			return treeNode.toJsonString();
		}
		return null;
	}
	public String toString() {
		return this.toJsonString();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((value == null) ? 0 : value.hashCode());
		return result;
	}
	/**
	 * 取某一层次的节点。	
	 * @date 2013-3-17
	 * @param level 层次节点，以0开始。
	 * @return 指定层次的节点，如果没有，返回空list
	 */
	public List<ZTreeNode> getNodesByLevel(int level){
		List<ZTreeNode> nodeList = new ArrayList<ZTreeNode>();
		if(this.level>level || this.children.size()==0){		//  当指定的级别比本级别大,返回空node.
			return nodeList;
		}
		
		Queue<ZTreeNode> nodeQue = new LinkedBlockingQueue<ZTreeNode>();		// 建立检查队列。
		nodeQue.addAll(this.children);
		ZTreeNode currNode;
		while((currNode=nodeQue.poll())!=null){
			if(currNode.level>level){
				break;
			}else if(currNode.level==level){
				nodeList.add(currNode);
			}else{
				nodeQue.addAll(currNode.children);	//  将小于指定level的节点加入检查队列。
			}
		}
		return nodeList;
	}
	/**
	 * 取某一层次的节点。	
	 * @date 2013-3-17
	 * @param treeNodes node节点集合
	 * @param level 层次节点，以0开始。
	 * @return 指定层次的节点，如果没有，返回空list
	 */
	public static List<ZTreeNode> getNodesByLevel(Collection<ZTreeNode> treeNodes,int level){
		List<ZTreeNode> nodes=new ArrayList<ZTreeNode>();
		if(treeNodes!=null){
			for(ZTreeNode node: treeNodes){
				nodes.addAll(node.getNodesByLevel(level));
			}
		}
		return nodes;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ZTreeNode other = (ZTreeNode) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (value == null) {
			if (other.value != null)
				return false;
		} else if (!value.equals(other.value))
			return false;
		return true;
	}
	
}
