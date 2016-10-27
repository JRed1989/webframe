package org.red.webframe.common.util;

import java.util.*;

/**
 * 容器类工具，用来转换成指定的字符串。
 */
public class CollectionUtils {
	/**
	 * 将集合元素转换为String。已过时的方法，推荐使用{@link #join(Collection, String)}代替
	 * @param collection 集合
	 * @param separator 分隔符。
	 * @return 集合里面的元素组成的字符串。
	 */
	@Deprecated
	public static String toString(Collection collection,String separator){
		return join(collection,separator);
	}
	/**
	 * 将集合元素转换为String。已过时的方法，推荐使用{@link #join(Object[], String)}代替
	 * @param objs 元素数组
	 * @param separator 分隔符。
	 * @return 集合里面的元素组成的字符串。
	 */
	@Deprecated
	public static String toString(Object[] objs,String separator){
		return join(objs,separator);
	}
	/**
	 * 统计集合中每个元素出现的次数，
	 * @param <T> 元素的类型
	 * @param data 要统计的数据
	 * @return 统计结果，如果data=null,返回空map.
	 */
	public static <T> Map<T,Integer> groupCount(Collection<T> data){
		Map<T,Integer> group = new HashMap<T, Integer>();
		if(data!=null){
			for(T x: data){
				int value = group.get(x)==null?1:group.get(x)+1;
				group.put(x, value);
			}
		}
		return group;
	}
	/**
	 * 将一个集合中的数据用指定分隔符连接成字符串。
	 * @param col 集合，如list,set,vector等
	 * @param separator 分隔符，如,或|
	 * @return 数组中各个元素的连接字符串，如1,2,3,4,5,如果输入为null,输出为空字符串。
	 */
	public static <T> String join(Collection<T> col,String separator){
		String ret ="";
		if(col!=null&&col.size()>0){
			for(Object x:col){
				if(x instanceof String){
					ret += separator+(String)x;
				}else{
					ret += separator+x.toString();
				}
			}
		}
		return ret.replaceFirst(separator, "");
		
	}
	/**
	 * 将一个数组中的数据用指定分隔符连接成字符串。
	 * @param objs 数组
	 * @param separator 分隔符，如,或|
	 * @return 数组中各个元素的连接字符串，如1,2,3,4,5,如果输入为null,输出为空字符串。
	 */
	public static <T> String join(T[] objs,String separator){
		if(objs!=null){
			return join(Arrays.asList(objs), separator);
		}else{
			return "";
		}
	}
	/**
	 * 将集合中的数据连接成以逗号分隔的字符串。
	 * @param col 集合，如list,set,vector等
	 * @return 集合中各个元素的连接字符串，如1,2,3,4,5,如果输入为null,输出为空字符串。
	 */
	public static <T> String join(Collection<T> col){
		return join(col, ",");
	}
	/**
	 * 将数组中的数据连接成以逗号分隔的字符串。
	 * @param col 集合，如list,set,vector等
	 * @return 数组中各个元素的连接字符串，如1,2,3,4,5,如果输入为null,输出为空字符串。
	 */
	public static <T> String join(T[] col){
		return join(col, ",");
	}
	/**
	 * 测试对象数组中是否包含对象，测试使用object.equals
	 * @param array 待测试 的数组
	 * @param t 待测试的对象
	 * @return
	 */
	public static boolean contains(Object[] array,Object t){
		return search(array,t)>-1;
	}
	/**
	 * 测试数组中是否包含一个数字。
	 * @param array 待测试 的数组
	 * @param t 待测试的对象
	 * @return
	 */
	public static boolean contains(int[] array,int t){
		return search(array,t)>-1;
	}
	/**
	 * 搜索key在array中的下标，下标以0开始
	 * @param array  待搜寻的数组
	 * @param t 待搜寻的键
	 * @return 如果没有 返回-1
	 */
	public static int search(int[] array,int t){
		int ret = -1;
		if(array!=null){
			for(int i=0;i<array.length;i++){
				if(array[i]==t){
					return i;
				}
			}
		}
		return ret;
	}
	/**
	 * 搜索key在array中的下标，下标以0开始
	 * @param array  待搜寻的对象数组
	 * @param t 待搜寻的键
	 * @return 如果没有 返回-1
	 */
	public static int search(Object[] array,Object t){
		int ret = -1;
		if(array!=null){
			for(int i=0;i<array.length;i++){
				if(array[i]!=null && array[i].equals(t)){
					return i;
				}
			}
		}
		return ret;
	}
	
	public static void main(String[] args) {
		List<Integer> arrList = new ArrayList<Integer>();
		arrList.add(1);
		arrList.add(1);
		arrList.add(2);
		arrList.add(3);
		arrList.add(4);
		System.out.println(join(arrList));
		Map<Integer,Integer> group = groupCount(arrList);
		String ret = StringUtils.toString(group);
		//System.out.println(ret);
		System.out.println(contains(arrList.toArray(), 2));
		int t =search(arrList.toArray(), new Integer(3));
		System.out.println(t);
	}
	
}
