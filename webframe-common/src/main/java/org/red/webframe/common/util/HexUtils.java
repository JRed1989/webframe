package org.red.webframe.common.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * 二进制分析辅助类

 */
public class HexUtils {

	/*
	 * 16进制数字字符集
	 */
	private static String hexString = "0123456789ABCDEF";
	/**
	 *  输出字符串的十六进制UNICODE编码,每字符按2位数字编码。

	 * @param s 输入字符串
	 * @return 输出字符串的十六进制UNICODE编码,每字符按2位数字编码。
	 */
	public static String string2Hex(String s) {
		if(s!=null){
			String str = "";
			for (int i = 0; i < s.length(); i++) {
				int ch = (int) s.charAt(i);
				String s4 = Integer.toHexString(ch);
				str = str + s4;
			}
			return str.toUpperCase();
		}else{
			return null;
		}
	}
	/**
	 * 将字符用指定字符编码，输出十六进制形态。

	 * @param s 输入字符
	 * @param charset 指定编码
	 * @return 将字符用指定字符编码，输出十六进制形态。
	 */ 
	public static String string2Hex(String s,String charset){
		if(s!=null && charset!=null){
			try {
				return bytes2Hex(s.getBytes(charset));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return null;
	}
	/**
	 * 将字符串转换为HttpGet传输的字符串,功能与{@link URLEncoder}功能一致<br/>
	 * 如 中国－>%E4%B8%AD%E5%9B%BD
	 * @param s 要转换的字符串
	 * @param charset 字符编码
	 * @return 编码后的字符串，如果输入为null,输出为null. 
	 */
	public static String urlEncode(String s,String charset){
		
		String hex= string2Hex(s,charset);
		if(hex==null) return null;
		String tmp ="";
		int pos=0;
		int len=hex.length();
		while(pos<len){
			tmp+="%"+hex.substring(pos, (pos+=2));
		}
		return tmp;
	}
	/**
	 * 输出字节流为十六进制大写形态，每个字节转换为2位十六进制数字如d2,如果输入为null,输出也为null.
	 * @user Gene
	 * @param bytes 待转换的进制数组。
	 * @return 输出字节流为十六进制大写形态，每个字节转换为2位十六进制数字如d2,如果输入为null,输出也为null.
	 */
	public static String bytes2Hex(byte[] bytes){
		if(bytes!=null){
			String re = "";
			for(int i=0;i<bytes.length;i++){
				re += Integer.toHexString(0xff&bytes[i]);
			}
			return re.toUpperCase();
		}
		return null;
	}
	/**
	 * 按照每两位十六进制字符转换为一个字节。输出该十六进制字符串代表的字节流。
	 * @user Gene
	 * @param hex 十六进制字符串如b9f3
	 * @return 按照每两位十六进制字符转换为一个字节。输出该十六进制字符串代表的字节流。
	 */
	public static byte[] hex2Bytes(String hex) throws IllegalArgumentException{
		if(hex!=null && hex.length()%2==0){
			hex=hex.toUpperCase();
			ByteArrayOutputStream baos = new ByteArrayOutputStream(hex.length() / 2);
			// 将每2位16进制整数组装成一个字节
			for (int i = 0; i < hex.length(); i += 2)
				baos.write((hexString.indexOf(hex.charAt(i)) << 4 | hexString.indexOf(hex.charAt(i + 1))));
			return baos.toByteArray();
		}else{
			throw new IllegalArgumentException("传二进制字符串不正确。请参数以下格式b9fea3,每两个字符代表一个字节");
		}
	}
	/**
	 * 将输入流拷贝到字节流中。
	 * <b>拷贝完成之后关闭输入流。</b>
	 * @param in 输入流
	 * @return 字节数组，如果输入为null,则返回null
	 */
	public byte[] copyInputStreamToBytesArray(InputStream in){
		if(in==null) return null;
		ByteArrayOutputStream outStream = new ByteArrayOutputStream();
		byte[] buff = new byte[10240]; //buff用于存放循环读取的临时数据
		int rc = 0;
		try{
			while ((rc = in.read(buff, 0, buff.length)) > 0) {
				outStream.write(buff, 0, rc);
			}
		}catch(IOException e){
			e.printStackTrace();
		}
		try {
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return outStream.toByteArray();
	}
public static void main(String[] args) throws UnsupportedEncodingException {
	String httpParam = "中国";
	System.out.println(urlEncode(httpParam, "utf-8"));
	System.out.println(URLEncoder.encode(httpParam,"GBK"));
}
}
