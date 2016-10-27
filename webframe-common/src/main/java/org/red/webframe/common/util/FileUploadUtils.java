/**
 * copyright (c) by hengheng 2013
 */
package org.red.webframe.common.util;

import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;


/**
 * 文件上传操作类
 */
public class FileUploadUtils {

	/**
	 * 文件上传
	 *
	 * @param template
	 * @param templateContentType
	 * @param templateFileName
	 * @param tarFileRootPath
	 * @return
	 * @throws IOException
	 */
	public  boolean fileUpload(MultipartFile template,
									String templateContentType,
									String templateFileName,
									String tarFileRootPath) throws IOException {
        boolean flag = copy(template, templateFileName, tarFileRootPath);
		return flag;
	}

	private  boolean copy(MultipartFile file, String fName, String tarFileRootPath) {

        boolean tag = false;
       /**
		 * 存储路径
		 */
		StringBuilder path = new StringBuilder();

		path.append(tarFileRootPath);
		path.append("/");

		makeDirByPath(path.toString());

		/**
		 * 文件存储路径
		 */
		StringBuilder fileStorePath = new StringBuilder();
		fileStorePath.append(path);
		String filePath = fileStorePath.toString();
		filePath = filePath.replace("\\", "/");
		try {
            FileUtils.writeByteArrayToFile(new File(filePath, fName), file.getBytes());
            tag = true;
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		return tag;
	}


	/**
	 * 根据文件路径创建文件夹，可以是多级目录
	 * @param filePath
	 */
	public  void makeDirByPath(String filePath) {
		File file = new File(filePath);
		if (!file.exists()) {
			file.mkdirs();
		}
	}

	public String getFileSize(long fileSize){
		/**
		 * 格式化计算结果，保留两位小数位
		 */
		DecimalFormat format=(DecimalFormat)NumberFormat.getInstance();
		format.applyPattern("0.00");

		/**
		 * 获取文件的KB
		 */
		double kb = fileSize / 1024;
		if (fileSize > 0 && fileSize < 1024) {
			return format.format(kb) + " 字节";
		} else if (kb > 0 && kb < 1024) {
			return format.format(kb) + " KB";
		} else {
			return format.format(kb / 1024) + " KB";
		}
	}


}
