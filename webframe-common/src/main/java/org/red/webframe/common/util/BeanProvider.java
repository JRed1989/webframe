package org.red.webframe.common.util;

import org.springframework.context.ApplicationContext;

public class BeanProvider {
	
	private static ApplicationContext applicationContext;
	
	public static void  init(ApplicationContext applicationContext){
		BeanProvider.applicationContext = applicationContext;
		
	}
	public static <T> T getBean(Class<T> clazz){
		if(applicationContext == null){
			return null;
		}
		return applicationContext.getBean(clazz);
	}
	
	public static <T> T getBean(String beanId){
		if(applicationContext == null){
			return null;
		}
		return (T)applicationContext.getBean(beanId);
	}


}
