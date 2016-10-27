package org.red.webframe.common.web;

import org.red.webframe.common.util.BeanProvider;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;


public class SpringInitListener implements ServletContextListener{

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(sce.getServletContext());
		BeanProvider.init(applicationContext);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}
	
	

}
