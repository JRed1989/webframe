package org.red.webframe.common.util;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.red.webframe.common.global.Global;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * UploadUtils
 * 
 * @author jamboree Team
 * 
 */
public class UploadUtils {
	public static final String IMAGE = "images";
	public static final String FILE = "files";
	public static final String FLASH = "flashs";
	public static final String VIDEO = "videos";

	public static final String THUMBNAIL = "_min";

	public static final String QUICK_UPLOAD = "public";
	
	public static Map<String, String> EXP_MAP = new HashMap<String, String>();
	
	static{
		EXP_MAP.put("images", "gif,jpg,jpeg,png,bmp");
		EXP_MAP.put("flashs", "swf,flv");
		EXP_MAP.put("videos", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
		EXP_MAP.put("files", "doc,docx,xls,xlsx,ppt,pptx,htm,html,txt,zip,rar,gz,bz2,apk,pdf,chm");
	}
	
	
	public static final DateFormat DEF_FORMAT = new SimpleDateFormat(
			"/yyyyMMdd/yyyyMMddHHmmss_");

	public static String getUrl(Integer siteId, String type, String extension) {
		StringBuilder name = new StringBuilder();
		name.append(Global.SYSTEM_CONFIG.get("FILE_UPLOAD_PATH"));
		name.append('/').append(siteId);
		name.append('/').append(type);
		name.append('/').append(QUICK_UPLOAD);
		name.append(randomName(extension));
		return name.toString();
	}

	public static String getThumbnailPath(String path) {
		if (StringUtils.isBlank(path)) {
			return path;
		}
		int index = path.lastIndexOf('.');
		if (index != -1) {
			return path.substring(0, index) + THUMBNAIL + path.substring(index);
		} else {
			return path;
		}
	}
	
	public static String randomName(String extension) {
		StringBuilder filename = new StringBuilder();
		filename.append(DEF_FORMAT.format(new Date()));
		filename.append(RandomStringUtils.random(6, '0', 'Z', true, true)
				.toLowerCase());
		if (StringUtils.isNotBlank(extension)) {
			filename.append(".").append(extension.toLowerCase());
		}
		return filename.toString();
	}
}
