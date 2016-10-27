package org.red.webframe.common.util.web;


import org.red.webframe.common.util.ValidateUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;


/**
 * 针对web开发中，常用的消息处理，状态保存提供支持。
 */
public class ActionMessageHelper {
	/**
	 * 消息的key，以及在页面上的变量名称。
	 */
	public static final String SESSION_MSG_KEY = "action_msg";
	/**
	 * 页面提交的动作关键字名称。
	 */
	public static final String REQUEST_ACTION_KEY = "action";

	/**
	 * 消息类型，peek 代表拾取消息，keep代表保存消息，clear代表清空消息
	 * 
	 * @author Gene.zhang
	 * @date 2012-6-14
	 */
	static enum ACTION {
		peek, keep, clear
	}

	/**
	 * 保持请求的所有参数包括POST和GET提交的参数.参数被保存在session中,key为页面的URI.
	 * 
	 * @date 2012-6-14
	 * @param request
	 */
	private static void keepRequestParams(HttpServletRequest request) {
		String key = request.getRequestURI();
		Map<String,String> requestParams = HttpUtils.copyRequestParamsToMap(request);
		request.getSession().setAttribute(key, requestParams);
	}

	/**
	 * 从session中拾取持久的参数,key为当前页面的URI
	 * 
	 * @date 2012-6-14
	 * @param request
	 */
	private static void peekRequestParams(HttpServletRequest request) {
		Map<String,String> requestParams = getKeepedParams(request);
		if (requestParams != null) {
			HttpUtils.copyParamsToRequest(request, requestParams);
		}
	}
	/**
	 * 取request中持久存放的参数。key为当前页面的URI
	 * @date 2012-7-9
	 * @param request
	 * @return 如果没有存放参数，返回null
	 */
	public static Map<String,String> getKeepedParams(HttpServletRequest request){
		String key = request.getRequestURI();
		return (Map<String,String> ) request.getSession().getAttribute(key);
	}
	/**
	 * 清除参数
	 * 
	 * @date 2012-6-14
	 * @param request
	 */
	private static void clearRequestParams(HttpServletRequest request) {
		String key = request.getRequestURI();
		request.getSession().removeAttribute(key);
	}

	/**
	 * 将session里面的保存的消息参数，拷贝到request的attribute中去，并且从session中删除。
	 * 拾取并删除上一个action设置的消息。
	 * @date 2012-2-18
	 * @user gene.zhang
	 * @param request
	 */
	public static void peekActionMessage(HttpServletRequest request) {
		Map<String, String> msgs = (Map<String, String>) request.getSession().getAttribute(SESSION_MSG_KEY);
		if (msgs != null) {
			HttpUtils.copyParamsToRequest(request, msgs);
			request.getSession().removeAttribute(SESSION_MSG_KEY);
		}
	}

	/**
	 * 添加action消息。
	 * @date 2012-2-18
	 * @user gene.zhang
	 * @param request
	 *            待处理的Request
	 * @param value
	 *            message以map形式定义
	 */
	public static void setActionMessage(HttpServletRequest request,
			Map<String, Object> value) {
		if (value != null) {
			request.getSession().setAttribute(SESSION_MSG_KEY, value);
		}
	}

	/**
	 * 状态保持。依据request.getParameter("action")设置的命令，实现相应的操作<br/>
	 * action=<b>keep</b>:保存request提交的所有参数到session中<br/>
	 * action=<b>peek</b>:将session中存放的参数，拷贝到request的attribute中去<br/>
	 * action=<b>clear</b>:清空session中保持的参数<br/>
	 * 
	 * @date 2012-6-14
	 * @param request
	 */
	public static void processRequestParameters(HttpServletRequest request) {
		String action = request.getParameter(REQUEST_ACTION_KEY);
		if (!ValidateUtils.isEmpty(action)) {
			action = action.trim().toLowerCase();
			
			if(action.equals(ACTION.keep.toString())){
				
				keepRequestParams(request);
				
			}else if(action.equals(ACTION.peek.toString())){
				
				peekRequestParams(request);
				
			}else if(action.equals(ACTION.clear.toString())){
				
				clearRequestParams(request);
			}
			
		}

	}

}
