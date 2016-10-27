package org.red.webframe.common.util.web;

import org.red.webframe.common.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.Timestamp;
import java.util.*;


/**
 * http请求基础功能封装
 * @author JRed
 */
public class HttpUtils {
	public static Logger log =LoggerFactory.getLogger(HttpUtils.class);
	/**
	 * 消息类型
	 */
	public static enum ACTION_MSG_TYPE {
		INFO, ERROR, SUCCESS, WARNING, ALERT
	};

	/**
	 * 此方法已经过期，使用{@link HttpUtils#convert2Chinese}代替<br/>
	 * 获取GET或Post方式提交的中文字符串，字符串编码必须是ISO-8859-1。
	 * @param wd
	 *            用request.getParameter得到的GET或POST方式提交的中文字符串。
	 *            请注意，此字符串必须是ISO-8859
	 *            -1编码的字符串,通过设置tomcat的urlencoding来保证URL是ISO-8859-1编码.
	 * @return 自动识别的正确字符串。如果输入为null
	 *         返回null,如果字符是正常的中文，则返回原始中文，如果是乱码，则按照ISO-8859-1解码，然后探测编码并转换为正确的编码。
	 */
	@Deprecated
	public static String getQueryString(String wd) {
		if (wd == null)
			return null;
		// 如果是可识别中文，则返回原字符串。
		if (containsChinese(wd))
			return wd;
		// if(wd.matches(".*[\u4e00-\u9fa5].*")) return wd;

		try {
			byte[] bytes = wd.getBytes("ISO-8859-1");
			String encoding = new CharsetDetector().detectForChinese(bytes);
			encoding = encoding == null ? "GBK" : encoding;
			wd = getQueryString(wd, encoding);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return wd;
	}

	/**
	 * 此方法已经过期，使用{@link HttpUtils#convert2Chinese}代替<br/>
	 * 获取GET方式提交的中文字符串，字符串编码必须是ISO-8859-1。
	 *
	 * @param wd
	 *            用request.getParameter得到的GET方式提交的中文字符串。
	 *            请注意，此字符串必须是ISO-8859-1编码的字符串
	 *            ,通过设置tomcat的urlencoding来保证URL是ISO-8859-1编码.
	 * @param encoding
	 *            用指定charset编码字符串。
	 * @return 如果乱码则 用指定charset编码字符串。如果输入为null 返回null，如果不乱码，则返回原字符串
	 */
	@Deprecated
	public static String getQueryString(String wd, String encoding) {
		if (wd != null && !wd.trim().equals("")) {
			// 如果是可识别中文，则返回原字符串。
			if (containsChinese(wd))
				return wd;
			try {
				byte[] bytes = wd.getBytes("ISO-8859-1");
				log.debug("auto detect for string:" + wd + ",hex:" + HexUtils.bytes2Hex(bytes));
				wd = new String(bytes, encoding);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return wd;
	}

	/**
	 * 将iso-8859-1编码的乱码字符串转换为正确的中文字符。
	 * @param wd
	 *            以iso-8859-1编码的乱码字符串
	 * @return
	 */
	public static String convert2Chinese(String wd) {
		if (wd == null)
			return null;
		// 如果是可识别中文，则返回原字符串。
		if (containsChinese(wd))
			return wd;
		// if(wd.matches(".*[\u4e00-\u9fa5].*")) return wd;

		try {
			byte[] bytes = wd.getBytes("ISO-8859-1");
			String encoding = new CharsetDetector().detectForChinese(bytes);
			encoding = encoding == null ? "GBK" : encoding;
			wd = getQueryString(wd, encoding);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return wd;
	}

	/**
	 * 将iso-8859-1编码的乱码字符串转换为正确的中文字符。
	 *
	 * @param wd
	 *            以iso-8859-1编码的乱码字符串
	 * @param encoding
	 *            指定编码 。
	 * @return
	 */
	public static String convert2Chinese(String wd, String encoding) {
		if (wd != null && !wd.trim().equals("")) {
			// 如果是可识别中文，则返回原字符串。
			if (containsChinese(wd))
				return wd;
			try {
				byte[] bytes = wd.getBytes("ISO-8859-1");
				log.debug("auto detect for string:" + wd + ",hex:" + HexUtils.bytes2Hex(bytes));
				wd = new String(bytes, encoding);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return wd;
	}

	/**
	 * 获取GET方式提交的中文字符串，字符串编码必须是ISO-8859-1。
	 *
	 * @param request
	 *            request 对象
	 * @param key
	 *            查询键名称。
	 *            请注意，此字符串必须是ISO-8859-1编码的字符串,通过设置tomcat的urlencoding来保证URL是ISO
	 *            -8859-1编码.
	 * @return 自动识别的正确字符串。如果输入为null
	 *         返回null,如果字符是正常的中文，则返回原始中文，如果是乱码，则按照ISO-8859-1解码，然后探测编码并转换为正确的编码。
	 */
	public static String getParameter(HttpServletRequest request, String key) {
		if (request == null || key == null)
			return null;
		String val = request.getParameter(key);
		if ("GET".equals(request.getMethod()) && !ValidateUtils.isEmpty(val)) {
			return convert2Chinese(val);
		}
		return val;
	}

	/**
	 * 获取GET方式提交的中文字符串，字符串编码必须是ISO-8859-1。
	 *
	 * @param request
	 *            request 对象
	 * @param key
	 *            查询键名称。
	 *            请注意，此字符串必须是ISO-8859-1编码的字符串,通过设置tomcat的urlencoding来保证URL是ISO
	 *            -8859-1编码.
	 * @return 自动识别的正确字符串。如果输入为null
	 *         返回null,如果字符是正常的中文，则返回原始中文，如果是乱码，则按照ISO-8859-1解码，然后探测编码并转换为正确的编码。
	 */
	public static String[] getParameterValues(HttpServletRequest request, String key) {
		if (request == null || key == null)
			return null;
		String[] vals = request.getParameterValues(key);
		if ("GET".equals(request.getMethod()) && vals != null) {
			for (int i = 0; i < vals.length; i++) {
				vals[i] = convert2Chinese(vals[i]);
			}
		}
		return vals;
	}

	/**
	 * 把表单提交的所有数据拷贝到request attribute中,相同键的多个值如
	 * ?name=1&name=2，将被转换为逗号分隔的值，如?name=1,2。用于数据筛选。
	 * @param request
	 * 
	 */
	public static void copyRequestParamsToPage(HttpServletRequest request) {
		Enumeration<String> it = request.getParameterNames();
		while (it.hasMoreElements()) {
			String key = it.nextElement();
			String[] values = request.getParameterValues(key);
			Object value = null;
			if (values.length <= 1) {
				value = getParameter(request, (String) key);
			} else {
				value = CollectionUtils.join(getParameterValues(request, key)); // 多个值转换为以逗号分隔的字符串。
			}
			request.setAttribute(key, value);
			log.debug("CopyProperties:" + key + "-" + value + " type:" + value.getClass().getName());
		}
	}

	/**
	 * 取得request对象中的所有参数，支持GET方式提交的中文参数，前提是WEB容器URL编码必须是ISO-8859-1编码。
	 * @param request
	 * @return map(String,String)，键是请求的参数名，相同键的多个值如
	 *         ?name=1&name=2，将被转换为逗号分隔的值，如?name=1,2。如果没有参数，返回空map；
	 */
	public static Map<String, String> copyRequestParamsToMap(HttpServletRequest request) {
		Map<String, String> params = new HashMap<String, String>();
		Enumeration<String> it = request.getParameterNames();
		while (it.hasMoreElements()) { // 遍历所有的参数，并放入map中。
			String key = it.nextElement();
			String[] values = request.getParameterValues(key);
			String value = null;
			if (values.length <= 1) {
				value = getParameter(request, (String) key);
			} else {
				value = CollectionUtils.join(getParameterValues(request, key)); // 多个值转换为以逗号分隔的字符串。
			}
			params.put(key, value);
		}
		return params;
	}

	/**
	 * 将Map中的元素拷贝到Request的attribute中
	 * @param request
	 * @param params
	 */
	public static void copyParamsToRequest(HttpServletRequest request, Map params) {
		if (params != null) {
			Iterator<String> it = params.keySet().iterator();
			while (it.hasNext()) {
				String key = it.next();
				Object value = params.get(key);
				request.setAttribute(key, value);
				log.debug("CopyMapProperties:" + key + "-" + value);
			}
		}
	}


	/**
	 * 向客户端写入字符
	 * @param response
	 * @param msg
	 *            字符串,默认为utf-8编码
	 */
	public static void write2Client(HttpServletResponse response, String msg) {
		write2Client(response, msg,"utf-8");
	}

	/**
	 * 向客户端写入字符
	 * @param response
	 * @param msg 字符串
	 * @param charsetName
	 *            字符编码可选 gbk,utf-8等
	 */
	public static void write2Client(HttpServletResponse response, String msg, String charsetName) {
		charsetName = ValidateUtils.isEmpty(charsetName) ? "utf-8" : charsetName;
		response.setCharacterEncoding(charsetName);
		response.setContentType("text/html;charset=" + charsetName);
		PrintWriter localPrintWriter = null;
		try {
			localPrintWriter = response.getWriter();
			localPrintWriter.write(msg);
		} catch (IOException localIOException) {
			localIOException.printStackTrace();
		} finally {
			if (localPrintWriter != null) {
				localPrintWriter.flush();
				localPrintWriter.close();
			}
		}
	}

	/**
	 * 向客户端输出2进制流，一般用来向客户端输出图像等信息。
	 * @param response
	 *            response对象
	 * @param bytes
	 *            2进制流。
	 */
	public static void write2Client(HttpServletResponse response, byte[] bytes) {
		if (bytes != null & bytes.length > 0) {
			try {
				OutputStream os = response.getOutputStream();
				os.write(bytes);
				os.flush();
				os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	/**
	 * 使用向客户端输出json对象.只解析到2层
	 * @param response response对象
	 * @param obj 具体对象
	 */
	public static void writeJSON(HttpServletResponse response, Object obj) {
		writeJSON(response,obj,null);
	}
	/**
	 * 使用向客户端输出json对象.只解析到2层
	 * @param response response对象
	 * @param obj 具体对象
	 * @param cols 要输出的对象表头。
	 */
	public static void writeJSON(HttpServletResponse response, Object obj,String[] cols) {
		writeJSON(response, obj, cols, 2);
	}
	/**
	 * 将hibernate 对象转换为JSON,并输出到客户端。
	 * @param response response对象
	 * @param obj 具体对象
	 * @param cols 要输出的对象表头。
	 * @param maxLevel 解析对象最大深度。
	 */
	public static void writeJSON(HttpServletResponse response, Object obj,String[] cols,int maxLevel) {
		String ret ="";
		String clsName = obj.getClass().getName();
		Set filter = cols==null?null:new HashSet(Arrays.asList(cols));
		
		if(obj instanceof List || obj.getClass().isArray()){		// 数组和集合
			ret = JsonUtils.buildJSONArray(obj, null, 1, maxLevel).toString();
		}else if(clsName.indexOf("java.lang")>-1){		// java 基本数据类型
			ret = obj.toString();
		}else{		// 自定义对象。
			ret = JsonUtils.buildJSONObject(obj, filter, 1, maxLevel).toString();
		}
		write2Client(response, ret);
	}
	/**
	 * 将request 中的所有参数输出，用于debug
	 * @param request
	 * @return
	 */
	public static String debugRequestParams(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("url:"+request.getRequestURL()+request.getQueryString()==null?"":"?"+request.getQueryString()+" Method:"+request.getMethod()+" Params:\n");
		Enumeration<String> it = request.getParameterNames();
		while (it.hasMoreElements()) {
			String key = it.nextElement();
			String value = HttpUtils.getParameter(request, key);
			sb.append( key + "==>" + value + "\n");
		}
		String ret = sb.toString();
		System.out.println(ret);
		return ret;
	}

	/**
	 * 判断字符中中是否包含中文。
	 * @param wd
	 *            要探测的字符串
	 * @return 包含中文返回true,否则false,wd是空返回false.
	 */
	public static boolean containsChinese(String wd) {
		if (ValidateUtils.isEmpty(wd))
			return false;

		boolean ret = false;
		for (int i = 0; i < wd.length(); i++) {
			char c = wd.charAt(i);
			int code = (int) c;
			ret = code > 0x4e00 && code < 0x9fa5;
			if (ret) {
				return true;
			}
		}
		return false;
	}
	 /**
     *
     * 将html标签转码，如将<转换为&lt; 用于输出页面源码。
     *
     * <p>
     *
     * @param input
     * @return String
     */
    public static String replaceHtmlTag(String input) {
    	if(input==null) return null;
        StringBuffer filtered = new StringBuffer(input.length());
        char c;
        for (int i = 0; i <= input.length() - 1; i++) {
            c = input.charAt(i);
            switch (c) {
            case '<':
                filtered.append("&lt;");
                break;
            case '>':
                filtered.append("&gt;");
                break;
            case '"':
                filtered.append("&quot;");
                break;
            case '&':
                filtered.append("&amp;");
                break;
            default:
                filtered.append(c);
            }

        }
        return (filtered.toString());
    }

    /**
     *
     * 基本功能：判断标记是否存在
     * <p>
     *
     * @param input
     * @return boolean
     */
    public static boolean hasSpecialChars(String input) {
        boolean flag = false;
        if ((input != null) && (input.length() > 0)) {
            char c;
            for (int i = 0; i <= input.length() - 1; i++) {
                c = input.charAt(i);
                switch (c) {
                case '>':
                    flag = true;
                    break;
                case '<':
                    flag = true;
                    break;
                case '"':
                    flag = true;
                    break;
                case '&':
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 使用reqeust对象中的参数构造bean.
     * @param request
     * @param c bean的class
     * @return bean.
     * @throws Exception
     */
    public static <T> T requestParms2bean(HttpServletRequest request, Class<T> c) throws Exception {
		Field[] fields = c.getDeclaredFields();
		T obj = null;
		try {
			obj = c.newInstance();
			for (Field f : fields) {
				String key = f.getName();
				String firstChar = key.substring(0, 1);
				String keyUpper = key.replaceFirst(firstChar, firstChar.toUpperCase());
				Method setMethod;
				try {
					setMethod = obj.getClass().getDeclaredMethod("set" + keyUpper, f.getType());// 根据
					// field得到对应的get方法
					Object val = convertParam(request, f.getType(), key);
					setMethod.invoke(obj, val);
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
				} catch (SecurityException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (IllegalArgumentException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				}
			}
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private static Object convertParam(HttpServletRequest request, Class type, String key) throws Exception {
		// TODO Auto-generated method stub
		try {
			String val = request.getParameter(key);
			if (ValidateUtils.isEmpty(val))
				return null;
			if (String.class.isAssignableFrom(type)) {
				return val;
			} else if (Number.class.isAssignableFrom(type) && ValidateUtils.isNumeric(val)) {
				if (type.equals(Integer.class)) {
					return (int) Float.parseFloat(val);
				} else if (type.equals(Float.class)) {
					return Float.parseFloat(val);
				} else if (type.equals(Double.class)) {
					return Double.parseDouble(val);
				} else if (type.equals(Long.class)) {
					return Long.parseLong(val);
				}
			} else if (Timestamp.class.isAssignableFrom(type)) {
				if (val.length() > 10) {
					return new Timestamp(DateTimeUtils.parserDateTime(val, "yyyy-MM-dd HH:mm:ss").getTime());
				} else {
					return new Timestamp(DateTimeUtils.parserDateTime(val, "yyyy-MM-dd").getTime());
				}
			} else if (Date.class.isAssignableFrom(type)) {
				return DateTimeUtils.parserDateTime(val, "yyyy-MM-dd");
			}
		} catch (Exception e) {
			throw e;
		}
		return null;
	}

	public static void main(String[] args) throws Exception {
//		char[] value = { (char) 66, (char) 444444 };
//		String wd = ",2001-3000元";
//		System.out.println(StringUtils.asiaCharacterFilter(wd));
//		System.out.println(containsChinese(wd));
//		System.out.println(getQueryString(wd));
		Map map = new HashMap();
		map.put("a", 111);
		map.put("b", "33333");
		writeJSON(null,new Integer[]{1,2,3,4},new String[]{"a"});
	}
}
