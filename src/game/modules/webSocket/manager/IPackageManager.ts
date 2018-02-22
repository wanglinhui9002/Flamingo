module webSocket 
{
	/**
	 * 数据包控制器
	 */
	interface IPackageManager 
	{
        /** 注册协议包*/
        registerPackage(cusType : number, cusPackageClass : any) : void;
        /** 获取协议包*/
        getPackage(cusType : number);
        /** 缓存收到的协议数据*/
        cachePackageIn(cusType : number, cusPackage : core.IPackageIn) : void;
        /** 缓存抛出的协议格式*/
        cachePackageOut(cusType : number, cusPackage : core.IPackageOut) : void;
	}
}