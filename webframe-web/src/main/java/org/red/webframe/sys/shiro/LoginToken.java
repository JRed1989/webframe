package org.red.webframe.sys.shiro;

import org.apache.shiro.authc.UsernamePasswordToken;

/**
 * 
* @Description: 登陆token 
* @author JRed bravecatking@gmail.com 
* @date 2015年8月26日 下午4:27:48
 */
public class LoginToken extends UsernamePasswordToken {
    /** 
	* @Fields serialVersionUID : TODO
	*/ 
	private static final long serialVersionUID = 5378632991448068956L;
	//验证码字符串      
	private String captcha;

	public LoginToken (String username, char[] password,  
            boolean rememberMe, String host, String captcha){
		super(username, password, rememberMe, host);
		this.captcha=captcha;
	}

	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
	}


}
