package org.red.webframe.common.util;


/**
 * 验证工具类，支持常用的字符验证
 * @author Gene.zhang
 * @date 2012-9-29
 */
public class ValidateUtils {
	public static enum VALIDATE_TYPE{
		/**
		 * 与 判断，如果多个条件中有一个不通过，则整体不通过。
		 */
		and,
		/**
		 * 或判断，如果多个条件中有一个通过，则整体通过。
		 */
		or
	}
	/**
	 * 验证指定的字符串是否与正则表达式匹配。
	 * @date 2012-2-28
	 * @user gene.zhang
	 * @param str 字符串
	 * @param regx 正则表达式
	 * @return
	 */
	public static boolean isPass(String str,String regx){
		if(str==null) return false;
		return str.matches(regx);
	}
	/**
	 * 验证指定的字符串是否与一组正则表达式匹配。
	 * @date 2012-2-28
	 * @user gene.zhang
	 * @param str
	 * @param regx
	 * @param and 是否是与判定，如果模式为与，则任何一个不通过则返回 false;相反则任何一个通过则返回true
	 * @return
	 */
	public static boolean isPass(String str,String[] regx,VALIDATE_TYPE type){
		if(regx==null) return false;
		boolean ret = true;
		if(type.equals(VALIDATE_TYPE.and)){
			for(String x: regx){
				ret = ret && isPass(str,x);
				if(!ret) return false;
			}
		}else if(type.equals(VALIDATE_TYPE.or)){
			ret = false;
			for(String x: regx){
				ret = ret || isPass(str,x);
				if(ret) return true;
			}
		}
		return ret;
	}
	/**
	 * 判断字符串是否是数字,支持浮点型
	 * @date 2012-2-29
	 * @user gene.zhang
	 * @param str
	 */
	public static boolean isNumeric(String str){
		if(isEmpty(str)) return false;
		String regx="^[0-9\\.]+$";
		return isPass(str,regx);
	}
	/**
	 * 判断字符串是否是空值，如果字符串是空或者null则返回true
	 * @date 2012-2-29
	 * @user gene.zhang
	 * @param str
	 */
	public static boolean isEmpty(String str){
		return str==null||str.equals("")?true:false;
	}
	/**
	 * 判断是否是日期格式，支持 yyyy-MM-dd 格式。
	 * @date 2012-7-17
	 * @param value 日期字符串。
	 * @return
	 */
	public static boolean isDate(String value){
		if(isEmpty(value)) return false;
		try{
			DateTimeUtils.parserDateTime(value, "yyyy-MM-dd");
		}catch(Exception e){
			return false;
		}
		return true;
	}
	/**
	 * 判断是否是日期格式，支持 yyy-MM-dd ,yyy-MM-dd hh:mm:ss两种格式。
	 * @date 2012-7-17
	 * @param value 日期字符串。
	 * @return
	 */
	public static boolean isDateTime(String value){
		if(isEmpty(value)) return false;
		try{
			DateTimeUtils.parserDateTime(value, "yyyy-MM-dd");
		}catch(Exception e){
			try{
				DateTimeUtils.parserDateTime(value, "yyyy-MM-dd hh:mm:ss");
			}catch(Exception e2){
				return false;
			}
		}
		return true;
	}
	public static void main(String[] args) {
	//		String url = "http://localhost:8080/kp/admin/login.jspx";
	//		String[] EXCLUDE_LOGIN_PAGES ={".*admin/$",".*login\\..*",".*login_do\\..*"};//忽略验证是否登录的url正则表达式
	//		System.out.println(isPass(url,EXCLUDE_LOGIN_PAGES,VALIDATE_TYPE.or));
	//		System.out.println(isEmpty(null));
			
			String t ="2012-07-24";
			System.out.println(isDate(t));
		}
	
	
}
