package org.red.webframe.sys.shiro;


import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;
import org.red.webframe.common.security.CredentialsDigest;
import org.red.webframe.sys.entity.SysUser;
import org.red.webframe.sys.shiro.session.SessionDAO;
import org.red.webframe.sys.util.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class SysAuthenticationFilter extends FormAuthenticationFilter{
	private Logger logger = LoggerFactory
			.getLogger(SysAuthenticationFilter.class);
	public static final String DEFAULT_BACK_SUCCESS_URL = "/admin/sys/index";
	/**
	 * 验证码名称
	 */
	public static final String CAPTCHA_PARAM = "captcha";
	/**
	 * 消息
	 */
	public static final String 	MESSAGE_PARAM = "message";
	
	/**
	 * 后台路径
	 */
	private String backSuccessUrl = DEFAULT_BACK_SUCCESS_URL;
	
	/**
	 * 返回URL
	 */
	public static final String FALLBACK_URL_PARAM = "fallbackUrl";
	
	/**
	 * 后台域
	 */
	private String backUrl = "/admin";
	

	protected SessionDAO sessionDao;

	protected CredentialsDigest credentialsDigest;
	/**
	 * 自定义sesession key
	 * key的格式:用户名ID_用户名
	 */
	public static String CUSTOM_SESSION_KEY = "custom_session_key";


	@Override
	protected LoginToken createToken(ServletRequest request, ServletResponse response) {
		    String username = getUsername(request);  
	        String password = getPassword(request);  
	        String captcha =  WebUtils.getCleanParam(request,CAPTCHA_PARAM);  
	        boolean rememberMe = isRememberMe(request);  
	        String host = getHost(request);  
		return new LoginToken(username, password.toCharArray(), rememberMe, host, captcha);
	}

	@Override
	protected boolean executeLogin(ServletRequest request,
			ServletResponse response) throws Exception {
		LoginToken token = createToken(request, response);
		if (token == null) {
			String msg = "createToken method implementation returned null. A valid non-null AuthenticationToken "
					+ "must be created in order to execute a login attempt.";
			throw new IllegalStateException(msg);
		}
		String username = (String) token.getPrincipal();
		HttpServletRequest hsr = (HttpServletRequest) request;
		HttpServletResponse hsp = (HttpServletResponse) response;
		try {
			doCaptchaValidate(hsr, token);
			Subject subject = getSubject(request, response);
			subject.login(token);
			return onLoginSuccess(token, subject, request, response);
		} catch (AuthenticationException e) {
			return onLoginFailure(token, e, request, response);
		}
	}
	
	 /**
	  * 
	 * @Title: doCaptchaValidate 
	 * @Description: 校验验证码
	 * @author JRed bravecatking@gmail.com   
	 * @param @param request
	 * @param @param token
	 * @return void
	 * @throws
	  */
    protected void doCaptchaValidate(HttpServletRequest request,  
            LoginToken token) {  
         //session中的图形码字符串  
    	Subject subject = SecurityUtils.getSubject();
         String captcha = (String) subject.getSession().getAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
        //比对  
        if (captcha != null && !captcha.equalsIgnoreCase(token.getCaptcha())) {  
        	logger.error("验证错误!");
            throw new IncorrectCaptchaException("msg:验证码错误！");  
        }  
    }  
    

	@Override
	public boolean onPreHandle(ServletRequest request,
			ServletResponse response, Object mappedValue) throws Exception {
		  HttpServletRequest req = (HttpServletRequest) request;  
	      HttpServletResponse resp = (HttpServletResponse) response;  
		  String requestUri = req.getRequestURI();
	
        if(isLoginRequest(req,resp)) {  
            if("post".equalsIgnoreCase(req.getMethod())) {//form表单提交  
            	return  executeLogin(request, response);
            }
        }
		if(SecurityUtils.getSubject().isAuthenticated()){
			return true;
		}

        return true;
	}

	@Override
	protected boolean onLoginSuccess(AuthenticationToken token,
			Subject subject, ServletRequest req, ServletResponse resp)
			throws Exception {
		//登陆成功后，自定义session的key，存储到session中
		SysUser user = UserUtils.getCurrentUser();
		Session session = SecurityUtils.getSubject().getSession();
		String sessionValue = user.getId()+"_"+user.getUsername();
		session.setAttribute(CUSTOM_SESSION_KEY,sessionValue);
		logger.info("用户["+sessionValue+"]登陆成功!");
		
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;
		String successUrl = request.getParameter(FALLBACK_URL_PARAM);
		if (StringUtils.isBlank(successUrl)) {
			if (request.getRequestURI().startsWith(
					request.getContextPath() + backUrl)) {
				successUrl = getBackSuccessUrl();
			} else {
				successUrl = getSuccessUrl();
			}
		}
		WebUtils.issueRedirect(request, response, successUrl);
		return false;
	}


    @Override  
    protected void setFailureAttribute(ServletRequest request,  
            AuthenticationException ae) {  
        request.setAttribute(getFailureKeyAttribute(), ae);  
    }  
    /**
	 * 登录失败调用事件
	 */
	@Override
	protected boolean onLoginFailure(AuthenticationToken token,
			AuthenticationException e, ServletRequest request, ServletResponse response) {
		String className = e.getClass().getName(), message = "";
		if (IncorrectCredentialsException.class.getName().equals(className)
				|| UnknownAccountException.class.getName().equals(className)){
			message = "用户或密码错误, 请重试.";
		}
		else if (e.getMessage() != null && StringUtils.startsWith(e.getMessage(), "msg:")){
			message = StringUtils.replace(e.getMessage(), "msg:", "");
		}else if(e.getMessage() != null && StringUtils.startsWith(e.getMessage(), "authMsg:")){
			message = StringUtils.replace(e.getMessage(), "authMsg:", "");
		}else if(e.getMessage() != null && StringUtils.startsWith(e.getMessage(), "orgMsg:")){
			message = StringUtils.replace(e.getMessage(), "orgMsg:", "");
		}else{
			message = "系统出现点问题，请稍后再试！";
			logger.error(message,e);// 输出到控制台
		}
        request.setAttribute(getFailureKeyAttribute(), className);
        request.setAttribute(MESSAGE_PARAM, message);
        return true;
	}



	public String getBackSuccessUrl() {
		return backSuccessUrl;
	}

	public void setBackSuccessUrl(String backSuccessUrl) {
		this.backSuccessUrl = backSuccessUrl;
	}
    





	
	

}
