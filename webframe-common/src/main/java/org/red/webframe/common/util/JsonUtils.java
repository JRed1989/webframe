package org.red.webframe.common.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.hibernate.collection.internal.PersistentSet;
import org.hibernate.proxy.HibernateProxy;
import org.hibernate.proxy.LazyInitializer;

import java.beans.PropertyEditorSupport;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.sql.Clob;
import java.sql.Timestamp;
import java.util.*;


/**
 * Json 字符串格式化。
 * 
 * @author Gene.zhang
 * @date 2012-9-29
 */
public class JsonUtils {
	private static Map<Class, PropertyEditorSupport> PROPERTY_EDITORS = new HashMap<Class, PropertyEditorSupport>();









	/**
	 * json字符串格式化，将无格式的Json字符串整理成有格式的字符串，便于阅读
	 * 
	 * @param json
	 *            json字符串
	 * @return 整理好的json字符串，如果输入是null,输出也是null
	 */
	public static String formatJson(String json) {
		return formatJson(json, "	");
	}

	/**
	 * json字符串格式化
	 * 
	 * @param json
	 *            json字符串
	 * @param fillStringUnit
	 *            自定义填充，格式整理字符如tab，或空格。
	 * @return 整理好的json字符串，如果输入是null,输出也是null
	 */
	public static String formatJson(String json, String fillStringUnit) {
		if (json == null || json.trim().length() == 0) {
			return null;
		}

		int fixedLenth = 0;
		ArrayList<String> tokenList = new ArrayList<String>();
		{
			String jsonTemp = json;
			// 预读取
			while (jsonTemp.length() > 0) {
				String token = getToken(jsonTemp);
				jsonTemp = jsonTemp.substring(token.length());
				token = token.trim();
				tokenList.add(token);
			}
		}

		for (int i = 0; i < tokenList.size(); i++) {
			String token = tokenList.get(i);
			int length = token.getBytes().length;
			if (length > fixedLenth && i < tokenList.size() - 1 && tokenList.get(i + 1).equals(":")) {
				fixedLenth = length;
			}
		}

		StringBuilder buf = new StringBuilder();
		int count = 0;
		for (int i = 0; i < tokenList.size(); i++) {

			String token = tokenList.get(i);

			if (token.equals(",")) {
				buf.append(token);
				doFill(buf, count, fillStringUnit);
				continue;
			}
			if (token.equals(":")) {
				buf.append(" ").append(token).append(" ");
				continue;
			}
			if (token.equals("{")) {
				String nextToken = tokenList.get(i + 1);
				if (nextToken.equals("}")) {
					i++;
					buf.append("{ }");
				} else {
					count++;
					buf.append(token);
					doFill(buf, count, fillStringUnit);
				}
				continue;
			}
			if (token.equals("}")) {
				count--;
				doFill(buf, count, fillStringUnit);
				buf.append(token);
				continue;
			}
			if (token.equals("[")) {
				String nextToken = tokenList.get(i + 1);
				if (nextToken.equals("]")) {
					i++;
					buf.append("[ ]");
				} else {
					count++;
					buf.append(token);
					doFill(buf, count, fillStringUnit);
				}
				continue;
			}
			if (token.equals("]")) {
				count--;
				doFill(buf, count, fillStringUnit);
				buf.append(token);
				continue;
			}

			buf.append(token);
			// 左对齐
			if (i < tokenList.size() - 1 && tokenList.get(i + 1).equals(":")) {
				int fillLength = fixedLenth - token.getBytes().length;
				if (fillLength > 0) {
					for (int j = 0; j < fillLength; j++) {
						buf.append(" ");
					}
				}
			}
		}
		return buf.toString();
	}

	private static String getToken(String json) {
		StringBuilder buf = new StringBuilder();
		boolean isInYinHao = false;
		while (json.length() > 0) {
			String token = json.substring(0, 1);
			json = json.substring(1);

			if (!isInYinHao && (token.equals(":") || token.equals("{") || token.equals("}") || token.equals("[") || token.equals("]") || token.equals(","))) {
				if (buf.toString().trim().length() == 0) {
					buf.append(token);
				}

				break;
			}

			if (token.equals("\\")) {
				buf.append(token);
				buf.append(json.substring(0, 1));
				json = json.substring(1);
				continue;
			}
			if (token.equals("\"")) {
				buf.append(token);
				if (isInYinHao) {
					break;
				} else {
					isInYinHao = true;
					continue;
				}
			}
			buf.append(token);
		}
		return buf.toString();
	}

	private static void doFill(StringBuilder buf, int count, String fillStringUnit) {
		buf.append("\n");
		for (int i = 0; i < count; i++) {
			buf.append(fillStringUnit);
		}
	}

	/**
	 * 处理自定义对象.
	 * @param obj 待转换的对象
	 * @param fieldFilter 过滤器，只选择过滤器中存在的对象 。
	 * @return JSONObject
	 */
	public static JSONObject buildJSONObject(Object obj, Set<Object> fieldFilter, int level, int maxLevel) {
		JSONObject ret = new JSONObject();
		
		if (obj instanceof Map) {
			Map mapObj = (Map) obj;
			for(Object x: mapObj.keySet()){
				if (fieldFilter != null && !fieldFilter.contains(x)) { // 只build指定的字段。
					continue;
				}
				Object val = convertJsonValue(mapObj.get(x), level + 1, maxLevel);
				ret.put(x.toString(), val);
			}
		} else {
			Field[] fields = obj.getClass().getDeclaredFields();
			for (Field f : fields) {
				String fName = f.getName();
				if (fieldFilter != null && !fieldFilter.contains(fName)) { // 只build指定的字段。
					continue;
				}
				try {
					Object val = ClassUtils.invokeGetter(obj, fName);
					val = convertJsonValue(val, level + 1, maxLevel);
					ret.put(fName, val);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return ret;
	}

	/**
	 * 处理数组。
	 * 
	 * @param objList
	 * @param fieldFilter
	 * @param level
	 * @param maxLevel
	 * @return
	 */
	public static JSONArray buildJSONArray(Object objList, Set<String> fieldFilter, int level, int maxLevel) {
		JSONArray ret = new JSONArray();
		if (objList.getClass().isArray()) {
			for (int i = 0; i < Array.getLength(objList); i++) {
				Object obj = Array.get(objList, i);
				Object val = convertJsonValue(obj, level + 1, maxLevel);
				ret.add(val);
			}
		} else {
			for (Object obj : (Collection) objList) {
				Object val = convertJsonValue(obj, level + 1, maxLevel);
				ret.add(val);
			}
		}
		return ret;
	}

	/**
	 * 检查所有的list,map,array
	 *
	 * @param obj
	 * @param level
	 * @param maxLevel
	 * @return
	 */
	public static Object convertJsonValue(Object obj, int level, int maxLevel) {
		Object value = "";
		if (obj != null) {
			boolean isProxyObject = false;
			String clsName = obj.getClass().getName();
			if (obj instanceof HibernateProxy) { // 如果是hibernate代理类变成实体类。
				LazyInitializer lazyInitializer = ((HibernateProxy) obj).getHibernateLazyInitializer();
				if (lazyInitializer.isUninitialized()) {
					obj = lazyInitializer.getImplementation();
				}
				isProxyObject = true;
			}
			PropertyEditorSupport pe = PROPERTY_EDITORS.get(obj.getClass());
			if (pe != null) { // 使用自定义的类处理器。
				value = pe.getValue();
			}else if(clsName.indexOf("java.lang")>-1){		// java 基本数据类型
				value = obj;
			} else if (obj instanceof PersistentSet) { 			// 如果是持久集合，放弃。
				value = obj.getClass().getName();
			} else if (obj instanceof Timestamp) {		// 时间截
				value = DateTimeUtils.customDateTime((Timestamp) obj);
			} else if (obj instanceof Date) {			// 日期
				value = DateTimeUtils.customDateTime((Date) obj);
			} else if (obj instanceof Clob) {					// clob
				value = StringUtils.toString((Clob) obj);
			} else if (obj.getClass().isArray() || obj instanceof Collection) {		// 数组和集合
				value = buildJSONArray(obj, null, level, maxLevel);
			} else if (isProxyObject && level > maxLevel) {		//超出指定深度的对象返回字符串名称，避免死hibernate循环
				value = obj.getClass().getName();
			} else {		// 其它对象。
				value = buildJSONObject(obj, null, level, maxLevel);
			}
		}
		
		return value;
	}

}
