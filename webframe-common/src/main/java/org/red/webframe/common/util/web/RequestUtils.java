package org.red.webframe.common.util.web;

import org.apache.commons.lang3.StringUtils;
import org.red.webframe.common.global.Global;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 
* @Description:请求工具类 
* @author JRed bravecatking@gmail.com 
* @date 2015年8月30日 下午2:26:49
 */
public class RequestUtils {
	
	// 静态文件后缀
	private final static String[] staticFiles = StringUtils.split(Global.SYSTEM_CONFIG.get("WEB.STATICS"), ",");
	
	/**
	 * 获取当前请求对象
	 * @return
	 */
	public static HttpServletRequest getRequest(){
		try{
			return ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		}catch(Exception e){
			return null;
		}
	}

	/**
     * 判断访问URI是否是静态文件请求
	 * @throws Exception 
     */
    public static boolean isStaticFile(String uri){
		if (staticFiles == null){
			try {
				throw new Exception("检测到“config.properties”中没有配置“WEB.STATICS”属性。配置示例：\n#静态文件后缀\n"
					+"web.staticFile=.css,.js,.png,.jpg,.gif,.jpeg,.bmp,.ico,.swf,.psd,.htc,.crx,.xpi,.exe,.ipa,.apk");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (StringUtils.endsWithAny(uri, staticFiles)
				&& !StringUtils.endsWithAny(uri, ".jsp") && !StringUtils.endsWithAny(uri, ".java")){
			return true;
		}
		return false;
    }

}
