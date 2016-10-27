package org.red.webframe.common.global;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 
* @Description: 全局系统变量
* @author JRed bravecatking@gmail.com 
* @date 2015年8月30日 下午2:12:31
 */
public class Global implements ServletContextAware,ApplicationContextAware,Runnable,ApplicationListener<ApplicationEvent>,InitializingBean{
	
	private Map<String,Long> configFileModifyDate = new HashMap<String, Long>();
	
	
	private static Logger log = LoggerFactory.getLogger("Global");
	/**
	 * 系统配置文件，包含系统classpath目录下config*.properties中的内容，5秒钟检查一次，如果有变化自动重新加载。
	 */
	public static Map<String,String> SYSTEM_CONFIG = new ConcurrentHashMap<String,String>();
	
	/**
	 * 站点的ServletContext对象
	 */
	public static ServletContext SERVLET_CONTEXT;
	/**
	 * spring 的 ApplicationContext bean容器
	 */
	public static ApplicationContext APPLICATION_CONTEXT;
	/**
	 * 系统默认编码
	 */
	public static String DEFAULT_CHARSET="UTF-8";
	
	
	/**sesson 网站管理员key**/
	public static final String SESSION_ADMIN_USERNAME="admin_user";					
	
	/**sesson 管理员权限树 key**/
	public static final String SESSION_ADMIN_POWERTREE="admin_power_tree";	
	/**sesson 管理员权限非树性结构 key**/
	public static final String SESSION_ADMIN_POWERLIST="admin_power_list";	
	/**
	 * session 顶部菜单
	 */
	public static final String SESSION_TOP_MENU = "top_menu";
	
	/**
	 * 网站前台用户key
	 */
	public static  String SESSION_FRONT_USERNAME="front_user";

	
	/**
	 * 网站根目录。
	 */
	public static File WEB_ROOT;
	
	/**
	 * 备份表后缀
	 */
	public static final String BACKUP_TABLE_NAME="_backup";
	/**
	 * 插件目录。
	 */
	public static final String PLUGINS_DIR="/WEB-INF/plugins";
	/**
	 * 站点上下文路径
	 */
	public static String SERVLET_CONTEXT_PATH;
	/**
	 * 前台用户坐标点集合
	 */
	public  static   String FRONT_USER_COORDINATE_LIST="front_user_coordinate_list";
	/**
	 * 前台用户轴ID集合
	 */
	public  static   String FRONT_USER_AXIS_LIST="front_user_axis_list";
	/**
	 * 前台用户组权限是否更新
	 */
	public static boolean IS_UPDATEING_OF_FRONT_GROUP = false;
	/**
	 * 前台有权限访问的知识点ID的集合
	 */
	public static String FRONT_USER_POWER_KN_IDS = "front_user_power_kn_ids";
	/**
	 * 存放前台用户组ID
	 */
	public static String FRONT_USER_GROUPID="front_user_groupId";
	/**
	 * 前台用户搜索的权限ID
	 * 
	 */
	public static String SEARCH_POWERID="powerId";
	/**
	 * 存储登陆用户是否是第一次登陆
	 */
	public static Map<String, Integer>  loginFirst = new HashMap<String, Integer>();
	
	//前台用户的部门信息
	public static String FRONT_USER_DEPT = "front_user_dept";
	
	
	
	

	public static File getWebRoot() {
		String path = SERVLET_CONTEXT.getRealPath("/");
		return new File(path);
	}
	
	public static File getWebResource(String filePath){
		String path = SERVLET_CONTEXT.getRealPath(filePath);
		return new File(path);
	}

	public static Object getSpringBean(String beanName){
		if(!StringUtils.isEmpty(beanName)){
			try{
				return APPLICATION_CONTEXT.getBean(beanName);
			}catch(Exception e){
				log.error("获取bean失败：bean id = "+beanName);
			}
		}
		return null;
	}
	@Override
	public void setServletContext(ServletContext servletContext) {
		Global.SERVLET_CONTEXT=servletContext;
		Global.SERVLET_CONTEXT_PATH=servletContext.getContextPath().equals("/")?"":servletContext.getContextPath();
		Global.WEB_ROOT=Global.getWebRoot();
	}
	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		Global.APPLICATION_CONTEXT=applicationContext;
	}
	@Override
	public void run() {
		int checkDely= 5*1000 ;		// 配置文件自动检查间隔；
		int beginDely = 60*1000;	// 1分钟后运行配置文件自动检查功能。
		try {
			Thread.sleep(beginDely);		
			log.info("启动 配置文件检查 线程，当前检测频率："+checkDely);
		} catch (InterruptedException e1) {
			e1.printStackTrace();
		}
		while(true){
			try {
				this.loadAllConfigFiles();
			} catch (Exception e) {
				e.printStackTrace();
			}
			
			try {
				Thread.currentThread().sleep(checkDely);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
	}

	private void loadAllConfigFiles(){
		File rootDir = getWebResource("/WEB-INF/classes/conf");
		rootDir.listFiles(new FileFilter() {
			@Override
			public boolean accept(File file) {
				String name = file.getName();
				String fullPath = file.getAbsolutePath();
				if(name.matches("^config.*\\.properties$")){
					Long value = configFileModifyDate.get(fullPath);
					if(value==null || value.longValue()!=file.lastModified()){
						log.info("加载配置文件："+file);
						loadPropertieFile(file);
						configFileModifyDate.put(fullPath,file.lastModified());
					}
				}
				return false;
			}
		});
		//FILE_UPLOADImg_PATH = this.getProperty("FILE_UPLOADImg_PATH");
	}
	private void loadPropertieFile(File configFile) {
		try {
			Properties properties = PropertiesLoaderUtils.loadProperties(new FileSystemResource(configFile));
			for(String key:properties.stringPropertyNames()){
				String value=properties.getProperty(key);
				if(Global.WEB_ROOT!=null){
					value= value.replace("${webRoot}", Global.WEB_ROOT.getPath());
				}
				Global.SYSTEM_CONFIG.put(key,value);
				log.info("load property:"+ key+"->"+value);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 从系统配置文件(config.properties)里面根据键取得一个值。
	 * @date 2013-4-3
	 * @param key 键
	 * @return 该键对应的值，如果不存在，返回null.
	 */
	public static String getProperty(String key){
		if(StringUtils.isNotBlank(key)){
			return SYSTEM_CONFIG.get(key);
		}else{
			return null;
		}
	}
	private void init(){
		log.info("启动系统配置文件监听线程...");
		new Thread(this,"system config check thread").start();
	}
	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		if(event instanceof ContextRefreshedEvent){		//容器启动之后的初始化动作。
			ContextRefreshedEvent refreshedEvent= (ContextRefreshedEvent) event;
			if(refreshedEvent.getApplicationContext().getParent()==null){		// 只有根容器启动时才执行。
				log.info("\n\n============================== INIT GlobalParams ======================================\n\n");
				this.init();
			}
			
		}
	}
	@Override
	public void afterPropertiesSet() throws Exception {
		log.info("正在设置全局变量...");
		this.loadAllConfigFiles();		
	}
}
