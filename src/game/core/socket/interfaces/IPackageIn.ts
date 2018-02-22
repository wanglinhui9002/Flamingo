module core 
{
	/**
	 * 接收到的数据接口
	 */
	export interface IPackageIn 
	{
		/** 反序列化*/
		deserialization(cusByteArray : core.ByteArray) : void;
		/** 重置,记得加上此协议是否需要缓存的逻辑*/
		reset() : void;
	}
}