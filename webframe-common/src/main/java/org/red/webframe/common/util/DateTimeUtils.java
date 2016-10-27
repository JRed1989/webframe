package org.red.webframe.common.util;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 日期时间工具类，提供日期的运算，转换等函数
 * @author Gene.zhang
 * @date 2012-9-29
 */
final public class DateTimeUtils extends DateUtils{

	public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	final static public SimpleDateFormat DateFormater = new SimpleDateFormat(
			"yyyy-MM-dd");

	final static public SimpleDateFormat TimeFormater = new SimpleDateFormat(
			"HH:mm:ss");

	final static public SimpleDateFormat DateTimeFormater = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");

	final static private Hashtable<String, SimpleDateFormat> CustomFormats = new Hashtable<String, SimpleDateFormat>();

	final static private String[] DaysOfWeek = new String[] { "星期一", "星期二",
			"星期三", "星期四", "星期五", "星期六", "星期天" };

	final static private ThreadLocal<Long> threadTimes = new ThreadLocal<Long>();
	/**
	 * 时间单位定义。依次为毫秒，秒，分钟，小时，天，月，年，世纪
	 */
	final static private String[] TIME_UNIT ={"ms","ss","mm","hh","dd","MM","yy","cc"};
	
	
	private static String[] parsePatterns = {
			"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "yyyy-MM", 
			"yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm", "yyyy/MM",
			"yyyy.MM.dd", "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm", "yyyy.MM"};

		/**
		 * 得到当前日期字符串 格式（yyyy-MM-dd）
		 */
		public static String getDate() {
			return getDate("yyyy-MM-dd");
		}
		
		/**
		 * 得到当前日期字符串 格式（yyyy-MM-dd） pattern可以为："yyyy-MM-dd" "HH:mm:ss" "E"
		 */
		public static String getDate(String pattern) {
			return DateFormatUtils.format(new Date(), pattern);
		}
		
		/**
		 * 得到日期字符串 默认格式（yyyy-MM-dd） pattern可以为："yyyy-MM-dd" "HH:mm:ss" "E"
		 */
		public static String formatDate(Date date, Object... pattern) {
			String formatDate = null;
			if (pattern != null && pattern.length > 0) {
				formatDate = DateFormatUtils.format(date, pattern[0].toString());
			} else {
				formatDate = DateFormatUtils.format(date, "yyyy-MM-dd");
			}
			return formatDate;
		}
		
		/**
		 * 得到日期时间字符串，转换格式（yyyy-MM-dd HH:mm:ss）
		 */
		public static String formatDateTime(Date date) {
			return formatDate(date, "yyyy-MM-dd HH:mm:ss");
		}

		/**
		 * 得到当前时间字符串 格式（HH:mm:ss）
		 */
		public static String getTime() {
			return formatDate(new Date(), "HH:mm:ss");
		}

		/**
		 * 得到当前日期和时间字符串 格式（yyyy-MM-dd HH:mm:ss）
		 */
		public static String getDateTime() {
			return formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
		}

		/**
		 * 得到当前年份字符串 格式（yyyy）
		 */
		public static String getYear() {
			return formatDate(new Date(), "yyyy");
		}

		/**
		 * 得到当前月份字符串 格式（MM）
		 */
		public static String getMonth() {
			return formatDate(new Date(), "MM");
		}

		/**
		 * 得到当天字符串 格式（dd）
		 */
		public static String getDay() {
			return formatDate(new Date(), "dd");
		}

		/**
		 * 得到当前星期字符串 格式（E）星期几
		 */
		public static String getWeek() {
			return formatDate(new Date(), "E");
		}
		
		/**
		 * 日期型字符串转化为日期 格式
		 * { "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", 
		 *   "yyyy/MM/dd", "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm",
		 *   "yyyy.MM.dd", "yyyy.MM.dd HH:mm:ss", "yyyy.MM.dd HH:mm" }
		 */
		public static Date parseDate(Object str) {
			if (str == null){
				return null;
			}
			try {
				return parseDate(str.toString(), parsePatterns);
			} catch (ParseException e) {
				return null;
			}
		}

		/**
		 * 获取过去的天数
		 * @param date
		 * @return
		 */
		public static long pastDays(Date date) {
			long t = new Date().getTime()-date.getTime();
			return t/(24*60*60*1000);
		}

		/**
		 * 获取过去的小时
		 * @param date
		 * @return
		 */
		public static long pastHour(Date date) {
			long t = new Date().getTime()-date.getTime();
			return t/(60*60*1000);
		}
		
		/**
		 * 获取过去的分钟
		 * @param date
		 * @return
		 */
		public static long pastMinutes(Date date) {
			long t = new Date().getTime()-date.getTime();
			return t/(60*1000);
		}
		
		/**
		 * 转换为时间（天,时:分:秒.毫秒）
		 * @param timeMillis
		 * @return
		 */
	    public static String formatDateTime(long timeMillis){
			long day = timeMillis/(24*60*60*1000);
			long hour = (timeMillis/(60*60*1000)-day*24);
			long min = ((timeMillis/(60*1000))-day*24*60-hour*60);
			long s = (timeMillis/1000-day*24*60*60-hour*60*60-min*60);
			long sss = (timeMillis-day*24*60*60*1000-hour*60*60*1000-min*60*1000-s*1000);
			return (day>0?day+",":"")+hour+":"+min+":"+s+"."+sss;
	    }
		
		/**
		 * 获取两个日期之间的天数
		 * 
		 * @param before
		 * @param after
		 * @return
		 */
		public static double getDistanceOfTwoDate(Date before, Date after) {
			long beforeTime = before.getTime();
			long afterTime = after.getTime();
			return (afterTime - beforeTime) / (1000 * 60 * 60 * 24);
		}
	/**
	 * @desc 返回当前日期，如2011-6-12
	 * @return 返回当前日期
	 */
	static public String currentDate() {
		return DateFormater.format(new Date());
	}

	/**
	 *  返回当前时间，如 12:01:23
	 * @return 返回当前时间字符串。
	 */
	static public String currentTime() {
		return TimeFormater.format(new Date());
	}

	/**
	 * 如 2011-6-12 12:01:23
	 * @return 返回当前日期时间
	 */
	static public String currentDateTime() {
		return DateTimeFormater.format(new Date());
	}

	/**
	 *  依据给定的格式，返回当前日期时间
	 * @param format
	 * @return
	 */
	static public String currentDateTime(String format) {
		try {
			synchronized (CustomFormats) {
				if (!CustomFormats.containsKey(format)) {
					CustomFormats.put(format, new SimpleDateFormat(format));
				}
			}

			SimpleDateFormat formater = CustomFormats.get(format);

			return formater.format(new Date());
		} catch (Exception ex) {
			throw new RuntimeException("no exsits formater: " + format, ex);
		}
	}

	/**
	 *  返回当前日期是一周的哪一天
	 * @return
	 */
	static public String weekOfDay() {
		return weekOfDay(Calendar.getInstance());
	}

	/**
	 * 返回给定日期是一周的哪一天
	 * @param date
	 * @return 返回周一，周二...
	 */
	static public String weekOfDay(Calendar date) {
		return DaysOfWeek[date.get(Calendar.DAY_OF_WEEK) - 1];
	}

	/**
	 * 格式化给定日期。
	 * @param date
	 * @return 返回 YYYY-MM-DD HH:mm:ss
	 */
	static public String customDateTime(Date date) {
		if(date!=null)
			return DateTimeFormater.format(date);
		else
			return null;
	}

	/**
	 * 用指定的日期格式格式化指定的日期
	 * @param time
	 *            给定的日期
	 * @param format
	 *            给定的格式
	 * @return 日期字符串
	 */
	static public String customDateTime(Date time, String format) {
		try {
			synchronized (CustomFormats) {
				if (!CustomFormats.containsKey(format)) {
					CustomFormats.put(format, new SimpleDateFormat(format));
				}
			}

			SimpleDateFormat formater = CustomFormats.get(format);

			return formater.format(time);
		} catch (Exception ex) {
			throw new RuntimeException("no exsits formater: " + format, ex);
		}
	}
	/**
	 * 用指定的日历格式格式化指定的日期
	 * @param time 日历
	 * @param format 日期格式
	 * @return 日期字符串
	 */
	static public String customDateTime(Calendar time, String format) {
		try {
			synchronized (CustomFormats) {
				if (!CustomFormats.containsKey(format)) {
					CustomFormats.put(format, new SimpleDateFormat(format));
				}
			}

			SimpleDateFormat formater = CustomFormats.get(format);

			return formater.format(time);
		} catch (Exception ex) {
			throw new RuntimeException("no exsits formater: " + format, ex);
		}
	}

	/**
	 *  将yyyy-MM-dd HH:mm:ss格式的日期字符串转换为日期
	 * @param datetime 输入的日期字符串
	 * @return 返回日期
	 */
	static public Date parserDateTime(String datetime) {
		try {
			return DateTimeFormater.parse(datetime);
		} catch (ParseException ex) {
			throw new RuntimeException("给定的日期时间字符串不正确，正确格式为：yyyy-MM-dd HH:mm:ss", ex);
		}
	}
	

	/**
	 * 将指定格式的日期字符串转换为日期
	 * @param datetime
	 *            输入的日期字符串
	 * @param format
	 *            输入的日期格式
	 * @return 返回日期
	 */
	static public Date parserDateTime(String datetime, String format) {
		try {
			synchronized (CustomFormats) {
				if (!CustomFormats.containsKey(format)) {
					CustomFormats.put(format, new SimpleDateFormat(format));
				}
			}

			SimpleDateFormat formater = CustomFormats.get(format);

			return formater.parse(datetime);
		} catch (Exception ex) {
			throw new RuntimeException("format failed: " + format+" dateStr:"+datetime);
		}
	}
	/**
	 * 将日期字符串用指定的格式转换成另一个日期字符串。
	 * @param time 将yyyy-MM-dd HH:mm:ss格式的日期字符串转换为日期
	 * @param format 指定的输出日期格式。
	 * @return 转换后的字符串
	 */
	static public String convert(String time, String format) {
		return customDateTime(parserDateTime(time), format);
	}
	/**
	 * 将指定格式的日期字符串转换成另一个指定格式的日期字符串。
	 * @param time 输入的日期字符串
	 * @param oformat 输入的日期字符串格式 如yyyy-MM-dd HH:mm:ss
	 * @param nformat 待转换的日期格式 如yyyy-MM-dd
	 * @return  转换后的字符串
	 */
	static public String convert(String time, String oformat, String nformat) {
		return customDateTime(parserDateTime(time, oformat), nformat);
	}
	/**
	 * 计算指定日期和当前日期之间的时间差，单位为毫秒
	 * @param time 指定的日期
	 * @return 指定日期和当前日期之间的时间差，单位为毫秒
	 */
	static public long timeDiff(String time) {
		return parserDateTime(time).getTime() - new Date().getTime();
	}
	/**
	 * 计算指定日期和当前日期之间的时间差，单位为毫秒
	 * @param time 指定的日期
	 * @param format 指定日期的格式
	 * @return 指定日期和当前日期之间的时间差，单位为毫秒
	 */
	static public long timeDiff(String time, String format) {
		return parserDateTime(time, format).getTime() - new Date().getTime();
	}
	/**
	 * 计算两个日期之间的时间差，计算方式为a-b
	 * @param atime 第一个日期
	 * @param btime 第二个日期
	 * @param format 日期格式
	 * @return 时间差，单位为毫秒
	 */
	static public long timeDiff(String atime, String btime, String format) {
		return parserDateTime(atime, format).getTime()
				- parserDateTime(btime, format).getTime();
	}
	/**
	 * 计算两个日期之间的时间差，计算方式为a-b
	 * @param atime 第一个日期
	 * @param aformat 第一个日期格式
	 * @param btime 第二个日期
	 * @param bformat 第二个日期格式
	 * @return 时间差，单位为毫秒
	 */
	static public long timeDiff(String atime, String aformat, String btime,
			String bformat) {
		return parserDateTime(atime, aformat).getTime()
				- parserDateTime(btime, bformat).getTime();
	}

	/**
	 *  将毫秒数换算成x天x时x分x秒x毫秒
	 * @param ms 毫秒
	 * @return x天x时x分x秒x毫秒
	 */
	public static String formatDHMS(long ms) {
		int ss = 1000;
		int mi = ss * 60;
		int hh = mi * 60;
		int dd = hh * 24;

		long day = ms / dd;
		long hour = (ms - day * dd) / hh;
		long minute = (ms - day * dd - hour * hh) / mi;
		long second = (ms - day * dd - hour * hh - minute * mi) / ss;
		long milliSecond = ms - day * dd - hour * hh - minute * mi - second
				* ss;

		String strDay = day < 10 ? "" + day : "" + day;
		String strHour = hour < 10 ? "0" + hour : "" + hour;
		String strMinute = minute < 10 ? "0" + minute : "" + minute;
		String strSecond = second < 10 ? "0" + second : "" + second;
		String strMilliSecond = milliSecond < 10 ? "0" + milliSecond : ""
				+ milliSecond;
		strMilliSecond = milliSecond < 100 ? "0" + strMilliSecond : ""
				+ strMilliSecond;
		return strDay + "天," + strHour + "小时" + strMinute + "分" + strSecond +"秒"+strMilliSecond+"毫秒";
	}
	/**
	 * 用毫秒数计算出{"毫秒","秒","分钟","小时","天","月","年","世纪"}，使用指定的模板格式化成字符串。
	 * 模板取值变量名是下列之一{"ms","ss","mm","hh","dd","MM","yy","cc"}。
	 * @param time 毫秒
	 * @param format 格式化字符串，如 “用时：{cc}世纪、{yy}年、{MM}月、 {dd}天、{hh}小时、{mm}分钟、{ss}秒、{ms}毫秒”。
	 * @param maxUnit 计算的最大单位。例如设置最大单位为yy,即计算最大年的单位以及年以下的单位 ，所有大于年之后的单位将不会被转换。
	 * @return 格式化之后的字符串。
	 */
	public static String formatDHMS(String time,String maxUnit,String format){
		if(ValidateUtils.isNumeric(time)){
			long t = Long.parseLong(time);
			return formatDHMS(t,maxUnit, format);
		}else{
			return null;
		}
	}
	/**
	 * 用毫秒数计算出{"毫秒","秒","分钟","小时","天","月","年","世纪"}，使用指定的模板格式化成字符串。
	 * 模板取值变量名是下列之一{"ms","ss","mm","hh","dd","MM","yy","cc"}。
	 * @param time 待转换的毫秒数
	 * @param format 格式化字符串，如 “用时：{cc}世纪、{yy}年、{MM}月、 {dd}天、{hh}小时、{mm}分钟、{ss}秒、{ms}毫秒”。
	 * @param maxUnit 计算的最大单位。例如设置最大单位为yy,即计算最大年的单位以及年以下的单位 ，所有大于年之后的单位将不会被转换。
	 * @return 格式化之后的字符串。
	 */
	public static String formatDHMS(long time,String maxUnit,String format) {
		long[] outArray= getDHMS(time,maxUnit);
		String tmp = format;
		if(!ValidateUtils.isEmpty(format)){
			Matcher matcher = Pattern.compile("\\{(.*?)\\}").matcher(format);
			while(matcher.find()){
				String key = matcher.group(0);	// {秒}
				String mKey= matcher.group(1);	// 秒
				for(int i=0;i<outArray.length;i++){
					if(TIME_UNIT[i].equals(mKey)){
						tmp = tmp.replace(key, outArray[i]+"");
						break;
					}
				}
			}
		}else{
			return null;
		}
		
		return tmp;
	}
	/**
	 * 取毫秒转换成多少秒，多少分，多少小时，多少月等。
	 * @param time 待转换的毫秒
	 * @param maxUnit 最大的转换单位
	 * @return "ms","ss","mm","hh","dd","MM","yy","cc" 的数组。
	 */
	public static long[] getDHMS(long time,String maxUnit) {
		/*
		 * 设定进制 "ms","ss","mm","hh","dd","MM","yy","cc"
		 * 每个单位的进制，比如 毫秒进到秒是1000，秒进到分钟是60，依此类推。
		 * 注意如果计算月的进制就比较麻烦，每个月的天数是不固定的。如果要输出月数，一般取30，做近似月数。
		 * 比如，这个时间长度差不多两个月，每个月用30天表示。
		 * 更改进制数组f的长度，即可以控制计算输出的长度。
		 */
		int max =CollectionUtils.search(TIME_UNIT, maxUnit);		// 最大输出位置
		int[] f={1000,60,60,24,30,24,100};		//{"毫秒","秒","分钟","小时","天","月","年","世纪"}的进制;
		long[] outArray= new long[max+1];		// 输出数组。
		long lev = time;
		for(int i=0;i<max;i++){
			outArray[i] = lev % f[i];	// 取每一单位的余数。
			lev = lev / f[i]; 	// 取商。
			if(lev==0) break;
		}
		outArray[max]=lev;
		return outArray;
	}
	/**
	 * 取第一个时间和第二个时间的时间间隔.以两时间的最大单位表示.
	 * @param date1 起始日期
	 * @param date2 结束日期
	 * @param timeUnits 时间单位,以逗号隔开,如 "毫秒,秒,分钟,小时,天,月,年,世纪" 或者 "毫秒前,秒前,分钟前,小时前,天前,月前,年前,世纪前"
	 * @return 最大的时间单位 ,如 2小时.
	 */
	public static String getPassedDate(Date date1,Date date2,String timeUnits){
		String ret ="";
		long time = date2.getTime()-date1.getTime();
		String[] timeUnit=timeUnits.split("\\,");
		long[] times = DateTimeUtils.getDHMS(time, "yy");
		for(int i=times.length-1;i>=0;i--){
			if(times[i]>0){
				ret = times[i]+timeUnit[i];
				break;
			}
		}
		return ret ;
	}
	/**
	 * 取第一个时间和第二个时间的时间间隔.两时间的最大单位表示.
	 * @param date1 起始日期
	 * @param date2 结束日期
	 * @param timeUnits 时间单位,以逗号隔开,如 "毫秒,秒,分钟,小时,天,月,年,世纪" 或者 "毫秒前,秒前,分钟前,小时前,天前,月前,年前,世纪前"
	 * @return 最大的时间单位 ,如 2小时.
	 */
	public static String getPassedDate(String date1,String date2,String timeUnits){
		Date d1 = parserDateTime(date1);
		Date d2 = parserDateTime(date2);
		return getPassedDate(d1, d2, timeUnits);
	}

	/**
	 * 将时间字符串按照默认格式DATE_TIME_FORMAT ="yyyy-MM-dd HH:mm:ss",转换为Date
	 * @param dateStr
	 * @return
	 */
	public static Date parseStringToDate(String dateStr) {
		Date resDate = DateTimeFormater.parse(dateStr, new ParsePosition(0));
		return resDate;
	}

	/***
	 * 将date,按照默认格式"yyyy-MM-dd HH:mm:ss",转换为字符串
	 * @param date
	 * @return
	 */
	public static String formatDate(Date date) {
		return DateTimeFormater.format(date);
	}


	/***
	 * 获取给定日期的前一天日期
	 * @param date
	 * @return 返回日期格式(yyyy-MM-dd HH:mm:ss)
	 */
	public static String getBeforeDate(Date date){
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DAY_OF_MONTH, -1);
		date = calendar.getTime();
		return DateTimeUtils.formatDateTime(date);
	}

	/***
	 * 依据系统当前时间，获取之前24小时的日期数组
	 * @param lenHours
	 * @return 返回日期格式(yyyy-MM-dd HH:00:00)
	 */
	public static  String[] getBefore24Dates(int lenHours){
		String[] strDate =new String[lenHours];
//		Integer[] hours=new Integer[24];
		for (int i = 0; i < lenHours; i++) {
			Calendar calendar=Calendar.getInstance();
			//HOUR_OF_DAY 就是指定get（）获取当前时间24小时制
			calendar.add(Calendar.HOUR_OF_DAY, -i);
			//hours[i]=calendar.get(Calendar.HOUR_OF_DAY);
			strDate[i] =
						calendar.get(Calendar.YEAR)+"-"
								+(calendar.get(Calendar.MONTH)+1)+"-"
								+calendar.get(Calendar.DATE)+" "
								+calendar.get(Calendar.HOUR_OF_DAY)+":00"+":00";
			Date date = parseStringToDate(strDate[i]);
			strDate[i] = formatDate(date);
		}

		List<String> list = new ArrayList<String>();
		for (int i = 0; i < strDate.length; i++) {
			list.add(i, strDate[i]);
		}
		Collections.reverse(list);
		for (int i = 0; i < list.size(); i++) {
			strDate[i] = list.get(i);
		}
		return strDate;
	}




	public static void main(String[] args) {
		String[] strDate = getBefore24Dates(12);
		for (int i = 0; i < strDate.length; i++) {
            System.out.println(strDate[i] + ",");
        }
		System.out.println(formatDHMS(9000015L));
		System.out.println(formatDHMS(9000015L,"mm","用时：{cc}世纪、{yy}年、{MM}月、 {dd}天、{hh}小时、{mm}分钟、{ss}秒、{ms}毫秒"));
		String timeUnits="毫秒前,秒前,分钟前,小时前,天前,月前,年前,世纪前";
		Date date1= new Date();
		Date date2 =new Date(date1.getTime()+9000015L);
		System.out.println(getPassedDate(date1, date2, timeUnits));
	}
}
