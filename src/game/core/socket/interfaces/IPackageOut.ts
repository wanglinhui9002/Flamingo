module core 
{
	/**
	 * 接收到的数据接口
	 */
	export interface IPackageOut 
	{
        /** 序列化*/
        serialization(cusByteArray : core.ByteArray) : void;
        /** 重置,记得加上此协议是否需要缓存的逻辑*/
        reset() : void;
	}
}