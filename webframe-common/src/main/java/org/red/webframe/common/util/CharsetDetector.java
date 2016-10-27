package org.red.webframe.common.util;

import java.io.InputStream;


/**
 * 通用编码探测器，可对流或字节数组进行编码探测。
 */
public class CharsetDetector extends BytesEncodingDetect {
	/**
	 * 对输入流进行编码侦测,如果探测失败返回null。请注意，此inputStream 最好是bufferedInputStream.
	 * @param is 待侦测的输入流。请注意，此inputStream 最好是bufferedInputStream。自动探测之后可以恢复读取指针。
	 * @param length 需要侦测的字节长度，越长越精确。
	 * @return 编码字符串如 UTF-8。
	 * @throws Exception 输入流错误，或侦测错误。
	 */
	public String detect(InputStream is, int length) throws Exception {
		if (is == null)
			throw new Exception("输入流不能为空！");
		if (!is.markSupported())
			throw new Exception("输入流不支持mark操作！");
		if (length < 200)
			length = 200;
		is.mark(length);
		byte[] bytes = new byte[length];
		is.read(bytes);
		String charset = this.detect(bytes);
		is.reset();
		return charset;
	}

	/**
	 * 对输入的字节数组进行编码探测
	 * @param bytes
	 *            待侦测的字节数组。
	 * @return 编码字符串如 UTF-8。
	 * @throws Exception
	 */
	public String detect(byte[] bytes) throws Exception {
		if (bytes == null)
			throw new Exception("输入字节不能为空！");
		int result = this.detectEncoding(bytes);
		String charset = Encoding.nicename[result];
		if (charset.equals("OTHER")) {
			charset = null;
		}
		return charset;
	}

	/**
	 * <p>
	 *  <b>本类仅探测 GBK、UTF-8编码。</b><br>
	 * 对输入流进行中文编码探测，如果探测结果为空，或ASCII 则返回null。<br>
	 *  如果返回为ASCII，很可能是探测的内容为数字或字母，不具代表性， 请设置默认字符集。<br>
	 *  </p>
	 * @param is 输入流。
	 * @param length  探测长度，请设置200个字节以上
	 * @return  编码名称，如UTF-8。

	 * @throws Exception
	 */
	public String detectForChinese(InputStream is, int length) throws Exception {
		if (is == null)
			throw new Exception("输入流不能为空！");
		if (!is.markSupported())
			throw new Exception("输入流不支持mark操作,强制执行会造成内容丢失！");
		if (length < 200)
			length = 200;
		is.mark(length);
		byte[] bytes = new byte[length];
		is.read(bytes);
		String charset = this.detectForChinese(bytes);
		is.reset();
		return charset;
	}

	/**
	 * <p>
	 *  <b>本类仅探测 GBK、UTF-8编码。</b><br>
	 * 对输入字节数组进行中文编码探测，如果探测结果为空，或ASCII 则返回null。<br>
	 *  如果返回为ASCII，很可能是探测的内容为数字或字母，不具代表性， 请设置默认字符集。<br>
	 *  </p>
	 * @param length 探测长度，请设置200个字节以上
	 * @return  编码名称，如UTF-8。
	 */
	public String detectForChinese(byte[] rawtext) {
		if (rawtext == null) return null;
		int[] scores;
		int index, maxscore = 0;
		int encoding_guess = OTHER;
		scores = new int[TOTALTYPES];
		// Assign Scores
		scores[GB2312] =0;
		scores[GBK] = gbk_probability(rawtext);
		scores[GB18030] = 0;
		scores[HZ] = 0;
		scores[BIG5] = 0;
		scores[CNS11643] = 0;
		scores[ISO2022CN] = 0;
		scores[UTF8] = utf8_probability(rawtext);
		scores[UNICODE] = 0;
		scores[EUC_KR] = 0;
		scores[CP949] = 0;
		scores[JOHAB] = 0;
		scores[ISO2022KR] = 0;
		scores[ASCII] = ascii_probability(rawtext);
		scores[SJIS] = 0;
		scores[EUC_JP] = 0;
		scores[ISO2022JP] = 0;
		scores[UNICODET] = 0;
		scores[UNICODES] = 0;
		scores[ISO2022CN_GB] = 0;
		scores[ISO2022CN_CNS] = 0;
		scores[OTHER] = 0;
		// Tabulate Scores
		for (index = 0; index < TOTALTYPES; index++) {
			if (debug)
				System.err.println("Encoding " + nicename[index] + " score "
						+ scores[index]);
			if (scores[index] > maxscore) {
				encoding_guess = index;
				maxscore = scores[index];
			}
		}
		// Return OTHER if nothing scored above 50
		if (maxscore <= 50) {
			encoding_guess = OTHER;
		}
		String charset = Encoding.nicename[encoding_guess];
		if (charset.equals("OTHER") || charset.equals("ASCII")) {
			charset = null;
		}
		return charset;
	}
	public static void main(String[] args) throws Exception {
		byte[] b="GB18030 是最新的汉字编码字符集国家标准, 向下兼容 GBK 和 GB2312 标准。 GB18030 编码是一二四字节变长编码。"
			.getBytes("utf-8");
		CharsetDetector cd = new CharsetDetector();
		String charset= cd.detectForChinese(b);
		charset=charset==null?"gbk":charset;
		System.out.println(charset+ "," + new String(b,charset));
	}
}
