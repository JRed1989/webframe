package org.red.webframe.common.util;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

/**
 * 
* @Description: Ehcache缓存工具类
* @author JRed bravecatking@gmail.com 
* @date 2015年11月20日 上午9:52:39
 */
public class EhcacheUtils {
	
	
	/**
	 * 
	* @Title: get 
	* @Description: 取值的方法
	* @author JRed bravecatking@gmail.com   
	* @param @param cache
	* @param @param key
	* @param @return
	* @return Object
	* @throws
	 */
	public static Object get(Cache cache,Object key){
		if(cache!=null){
			Element e = cache.get(key);
			if(e!=null){
				return e.getObjectValue();
			}
		}
		return null;
	}
	
	/**
	 * 
	* @Title: put 
	* @Description: 存储方法
	* @author JRed bravecatking@gmail.com   
	* @param @param cache
	* @param @param key
	* @param @param value
	* @return void
	* @throws
	 */
	public static void put(Cache cache,Object key,Object value){
		if(cache!=null){
			cache.put(new Element(key, value));
		}
	}
	
	/**
	 * 
	* @Title: update 
	* @Description: 更新缓存
	* @author JRed bravecatking@gmail.com   
	* @param @param cache
	* @param @param key
	* @param @param value
	* @return void
	* @throws
	 */
	public static void update(Cache cache,Object key,Object value){
		if(cache!=null){
			remove(cache, key);
			put(cache, key, value);
		}
	}
	
	
	/**
	 * 
	* @Title: remove 
	* @Description: 删除指定key的缓存的方法
	* @author JRed bravecatking@gmail.com   
	* @param @param cache
	* @param @param key
	* @param @return
	* @return boolean
	* @throws
	 */
	public static boolean  remove(Cache cache,Object key){
		if(cache!=null){
			return cache.remove(key);
		}
		return false;
	}

	/**
	 * 
	* @Title: removeAll 
	* @Description: 删除所有缓存
	* @author JRed bravecatking@gmail.com   
	* @param @param cache
	* @return void
	* @throws
	 */
	public static void removeAll(Cache cache){
		if(cache!=null){
			cache.removeAll();
		}
	}
	
}
