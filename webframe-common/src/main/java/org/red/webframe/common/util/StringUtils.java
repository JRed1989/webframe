package org.red.webframe.common.util;


import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.Map;


/**
 *@author Gene
 *@date 2011-1-10
 */
public class StringUtils {
	//过滤数组。
	private static int[][] ASIA_ARRAY;
	//亚洲字符范围。
	public static final String[] ASIA_CHARACTER_RAGE = {
			"0A",//换行 
			"0D",//回车
			"20-7F",//ASCII
			"2000-206F",//常用标点
			"3400-4DB5",//Unified Ideographs Extension A 3.0 
			"4E00-9FA5",//Unified Ideographs 1.1 
			"9FA6-9FBB",//Unified Ideographs 4.1 
			"F900-FA2D",//Compatibility Ideographs 1.1 
			"FA30-FA6A",//Compatibility Ideographs 3.2 
			"FA70-FAD9",//Compatibility Ideographs 4.1 
			"20000-2A6D6",//Unified Ideographs Extension B 3.1 
			"2F800-2FA1D",//Compatibility Supplement 3.1 
			"FF00-FFEF",//全角ASCII、全角中英文标点、半宽片假名、半宽平假名、半宽韩文字母
			"2E80-2EFF",//CJK部首补充
			"31C0-31EF",//CJK笔划
			"2F00-2FDF",//康熙部首
			"2FF0-2FFF",//汉字结构描述字符
			"3100-312F",//注音符号
			"31A0-31BF",//注音符号（闽南语、客家语扩展）
			"3040-309F",//日文平假名
			"30A0-30FF",//日文片假名
			"31F0-31FF",//日文片假名拼音扩展
			"AC00-D7AF",//韩文拼音
			"1100-11FF",//韩文字母
			"3130-318F",//韩文兼容字母
			"3200-32FF",//CJK字母及月份
			"3300-33FF",//CJK特殊符号（日期合并）
			"2600-26FF",//杂项符号（非CJK专用）
	};
	
	static{
		ASIA_ARRAY=new int[ASIA_CHARACTER_RAGE.length][];
		for(int x=0;x<ASIA_CHARACTER_RAGE.length;x++){
			String[] rg = ASIA_CHARACTER_RAGE[x].split("-");
			int[] tmparr = {Integer.parseInt(rg[0],16),-1};
			if(rg.length>1){
				tmparr[1]=Integer.parseInt(rg[1],16);
			}
			ASIA_ARRAY[x]=tmparr;
		}
	}
	/**
	 *  获取网页的内容，编码为自动探测的编码。
	 * @date 2011-11-7 
	 * @param url 待获取内容的URL
	 * @return 网页源代码
	 */
	public static String toString(URL url) {
		String pageString = null;
		try {
			URLConnection  conn = url.openConnection();
			conn.setReadTimeout(5000);
			conn.setReadTimeout(5000);
			conn.connect();
			InputStream in =conn.getInputStream();
			pageString =toString(in);
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pageString;
	}
	/**
	 *  获取网页的内容，编码为自动探测的编码。
	 * @date 2011-11-7 
	 * @param url 待获取内容的URL
	 * @return 网页源代码
	 */
	public static String toString(URL url,String charset) {
		String pageString = null;
		try {
			URLConnection  conn = url.openConnection();
			conn.setReadTimeout(5000);
			conn.setReadTimeout(5000);
			conn.connect();
			InputStream in =conn.getInputStream();
			pageString =toString(in,charset);
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pageString;
	}
	/**
	 * 获取文件内容。
	 * @date 2011-11-7 
	 * @param f 输入文件，编码为自动探测。
	 * @return 文件内容。
	 */
	public static String toString(File f){
		String pageString = null;
		try {
			InputStream in = new FileInputStream(f);
			pageString =toString(in);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pageString;
	}
	/**
	 * 将字CLOB转成STRING类型
	 * @date 2011-10-19 
	 * @param clob
	 * @return
	 * @throws SQLException
	 * @throws IOException
	 */
	public static String toString(Clob clob) {
		if(clob==null) return null;
		String ret=null;
		Reader is = null;
		try {
			is = clob.getCharacterStream();
			ret = toString(is);
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return  ret;
	}
	/**
	 * 获取文件内容。
	 * @date 2011-11-7 
	 * @param f 输入文件，编码为自动探测。
	 * @param charset 文件编码
	 * @return 文件内容。
	 */
	public static String toString(File f,String charset){
		String pageString = null;
		try {
			InputStream in = new FileInputStream(f);
			pageString =toString(in,charset);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pageString;
	}
	/**
	 *  获取InputStream的内容，编码为自动探测。
	 * @date 2011-11-7 
	 * @param is
	 * @return InputStream的字符串内容
	 */
	public static String toString(InputStream is){
		BufferedInputStream bis = new BufferedInputStream(is);
		String det=null;
		try {
			det = (new CharsetDetector()).detect(bis,500);
		} catch (Exception e) {
			e.printStackTrace();
		};
		if(det==null) det = "utf-8";
		return toString(bis,det);
	}
	/**
	 * 获取输入流的内容。
	 * @date 2011-11-7 
	 * @param is 字符流
	 * @param charset 输入流的字符编码，如果不明确charset请使用{@link #getContent}
	 * @return InputStream 的字符串内容
	 */
	public static String toString(InputStream is,String charset){
		String pageString = null;
		InputStreamReader isr= null;
		BufferedReader br = null;
		try {
			isr = new InputStreamReader(is,charset);
		     br = new BufferedReader(isr);
			StringBuffer sb = new StringBuffer();
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line + "\n");
			}
			pageString = sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
				try {
					if (is!=null) is.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
				if(isr!=null){
					try {
						isr.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				if(br!=null){
					try {
						br.close();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
		}
		return pageString;
	}
	/**
	 * 将一个reader 中的字符流读出来，注意读取完成之后并不会关闭此reader.
	 * @param reader 
	 * @return
	 */
	public static String toString(Reader reader){
		StringBuilder sb = new StringBuilder();
		char[] chars = new char[1024];
		int readed = -1;
		try {
			while ((readed = reader.read(chars)) != -1) {
				sb.append(chars, 0, readed);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}
	/**
	 * 输出map中的内容，一般用于debug。
	 * @date 2012-9-29
	 * @param map 要输出内容的map
	 * @return map 的字符串内容。如:{a:1,b:2},如果输入为null,输出为null
	 */
	public static <K,V> String toString(Map<K,V> map){
		String ret = null;
		if(map!=null){
			StringBuilder sb = new StringBuilder("{\n");
			int count = 0;
			for(Object key : map.keySet()){
				sb.append("\t"+key+":"+map.get(key));
				if(++count<map.size()){
					sb.append(",");
				}
				sb.append("\n");
			}
			sb.append("}");
			ret=sb.toString();
		}
		return ret;
	}
	/**
	 * 过滤unicode编码中所有不可识别字符包括空格，换行，制表符，欧洲字符。
	 * @author Gene
	 * @date 2011-11-2 
	 * @param tmpStr 待过滤的文字。
	 * @return 保留所有ASCII字符，所有中文字符，以及日韩字符。
	 */
	public static String asiaCharacterFilter(String tmpStr){
		if(tmpStr==null) return null;
		StringBuffer sb = new StringBuffer();
		Reader reader= new StringReader(tmpStr);
		int c=0 ;
		try {
			while((c=reader.read())!=-1){
				for(int[] x:ASIA_ARRAY){
					if(x[1]==-1){
						if(c==x[0]){
							sb.append((char)c);
							break;
						}
					}else{
						if(c>=x[0] && c<=x[1]){
							sb.append((char)c);
							break;
						}
					}
				}
			}
			reader.close();
		}catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}
	/**
	 * Ant 风格的目录模糊匹配，支持**，*。<br>**代表任意级目录<br>*代表某一级目录。
	 * @param pattern 表达式。如 1.html
	 * @param target 待匹配的字符串路径。如/abc/s/eee/1.html
	 * @return
	 */
	public static boolean fuzzyPathMatch(String pattern,String target){
		
		if(target!=null){
			String[] patternPart = pattern.split("/");
			String[] targetPart = target.split("/");
			int curTarget =0;
			for(int i=0;i<patternPart.length;i++){
				if(curTarget>targetPart.length-1) return false;		// 如果目标字符串搜索的当前位置大于其长度，则匹配失败。
				if(patternPart[i].equals("*")){		// 匹配任意一级目录。
					
				}else if(patternPart[i].equals("**")){		// 匹配多级目录。
					String nextPath = "";
					for(int j=i;j<patternPart.length-1;j++){		// 如果表达式位是*，则找到最后一次*号的位置，避免**的情况。
						nextPath = patternPart[j+1];
						if(!nextPath.equals("**")) break;
						curTarget++;
					}
					boolean isContain= false;
					for(int j=curTarget;j<targetPart.length;j++){ // 计算目标字符串的匹配位置。
						if(fuzzyMatch(nextPath, targetPart[j])){
							curTarget =j;
							isContain =true;
							break;
						}
					}
					if(!isContain){		// 如果在*号后面的字符，没有在目标字符串中找到，则返回false。
						return false;
					}else{
						continue;
					}
				}else{
					if(!fuzzyMatch(patternPart[i],targetPart[curTarget])){		// 中途常规比较，如果遇到字符不一致，则立即返回。
						return false;
					}
				}
				curTarget ++;
			}
			if(curTarget<targetPart.length){		// 如果表达式已经搜索完成，但是目标字符串搜索未完成，则失败，类似这样的情况: a*c,aacde。
				return false;
			}else{
				return true;
			}
			
		}
		return false;
	}
	/**
	 * 模糊匹配，可使用*?，*代表0个或多个字符，?代表一个字符。
	 * @param pattern 搜索表达式。如a*bds
	 * @param target 目标字符串。如absd
	 * @return 如果匹配则返回true,否则返回false;
	 */
	public static boolean fuzzyMatch(String pattern,String target){
		int pLen = pattern.length();
		int tLen = target.length();
		int curPPos = 0;		// 当前表达式搜索位置
		int posTPos = 0;		// 当前目标字符串搜索位置
		if(pattern.equals("*")) return true;
		for (; curPPos < pLen;curPPos++) {
			if(posTPos>tLen-1) return false;		// 如果目标字符串搜索的当前位置大于其长度，则匹配失败。
			char curPChar = pattern.charAt(curPPos);		// 当前表达式字符。
			char curTChar = target.charAt(posTPos);			// 当前目标字符串字符。
			if(curPChar=='?'){		//如果是?号忽略本次比较，即?号可取任意值。
				
			}else if (curPChar == '*') {
				if(curPPos==pLen-1){		// 如果表达式的最后一位是* ,返回真，类似 abc*。
					return true;
				}
				char nextChar=0;
				for(int j=curPPos;j<pLen-1;j++){		// 如果表达式位是*，则找到最后一次*号的位置，避免**的情况。
					nextChar = pattern.charAt(j+1);
					if(nextChar!='*') break;
					curPPos++;
				}
				posTPos = target.indexOf(nextChar,posTPos);		// 计算目标字符串的匹配位置。
				if(posTPos==-1){		// 如果在*号后面的字符，没有在目标字符串中找到，则返回false。
					return false;
				}else{
					continue;
				}
			}else{
				if(curPChar!=curTChar){		// 中途常规比较，如果遇到字符不一致，则立即返回。
					return false;
				}
			}
			posTPos++;		//目标字符串当前搜索位置前进一位
		}
		if(posTPos<tLen){		// 如果表达式已经搜索完成，但是目标字符串搜索未完成，则失败，类似这样的情况: a*c,aacde。
			return false;
		}else{
			return true;
		}
	}
	
	public static void main2(String[] args){
		char[] s=new char[1];
		s[0]=(char) 1;//乱码字符
		String t = new String(s);
		System.out.println(t);
//		t="？ 天翼快讯(上海版) ？• ";
//		System.out.println("原始：["+t+"]");
		t=asiaCharacterFilter(t);
//		t=t.replaceAll("？", "");
		System.out.println("过滤后：["+t+"]");
	}
	public static void main(String[] args) throws Exception{
		String r ="http://localhost:8080/jsp/include.jsp";
		URL url = new URL(r);
		System.out.println(toString(url));
	}
	
}
