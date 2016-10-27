package org.red.webframe.sys.shiro;

import org.apache.shiro.web.filter.authc.UserFilter;
import org.apache.shiro.web.util.WebUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SysUserFilter extends UserFilter {
	public static final String DEFAULT_BACK_LOGIN_URL = "/admin/login";

	private String backUrl = "/admin/";
	private String backLoginUrl = DEFAULT_BACK_LOGIN_URL;

	@Override
	protected void redirectToLogin(ServletRequest req, ServletResponse resp)
			throws IOException {
		HttpServletRequest request = (HttpServletRequest) req;
		HttpServletResponse response = (HttpServletResponse) resp;
		String toLoginUrl;
		if (request.getRequestURI().startsWith(
				request.getContextPath() + getBackUrl())) {
			toLoginUrl = getBackLoginUrl();
		} else {
			toLoginUrl = getLoginUrl();
		}
		WebUtils.issueRedirect(request, response, toLoginUrl);
	}

	public String getBackUrl() {
		return backUrl;
	}

	public void setBackUrl(String backUrl) {
		this.backUrl = backUrl;
	}

	public String getBackLoginUrl() {
		return backLoginUrl;
	}

	public void setBackLoginUrl(String backLoginUrl) {
		this.backLoginUrl = backLoginUrl;
	}

}
