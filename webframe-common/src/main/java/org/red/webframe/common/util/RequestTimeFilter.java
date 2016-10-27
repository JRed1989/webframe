package org.red.webframe.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.NumberFormat;

/**
 * 
* @Description: 记录请求执行的时间  
* @author JRed bravecatking@gmail.com 
* @date 2015年11月12日 下午9:31:35
 */
public class RequestTimeFilter implements Filter{
	
	private final static Logger logger = LoggerFactory.getLogger(RequestTimeFilter.class);

	public static final NumberFormat FORMAT = new DecimalFormat("0.000");

	
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
	      long start = System.currentTimeMillis();
	      chain.doFilter(request, response);
	      long end = System.currentTimeMillis();
	      BigDecimal usetime = new BigDecimal(end - start)
					.divide(new BigDecimal(1000));
	      String requestUrl = ((HttpServletRequest)request).getRequestURI();
	      logger.debug("处理请求[{}],耗时{}秒",requestUrl,FORMAT.format(usetime));
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

}
