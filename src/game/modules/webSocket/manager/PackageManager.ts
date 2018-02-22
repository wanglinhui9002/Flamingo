module webSocket 
{
	/**
	 * 消息包管理器
	 */
	export class PackageManager 
	{

		/** 实例*/
		private static mInstance : PackageManager;
		public static getInstance() : PackageManager
		{
			if(null == PackageManager.mInstance)
			{
				PackageManager.mInstance = new PackageManager();
			}
			return PackageManager.mInstance;
		}

		/** 接收到协议类列表*/
		private mPackageInClsMap : {[id : number] : any} = {};
		/** 接受数据缓存*/
		private mPackageInMap : {[id : number] : Array<core.IPackageIn>} = {};
		/** 发送数据包缓存*/
		private mPackageOutMap : {[id : number] : Array<core.IPackageOut>} = {};

		public constructor() 
		{
		}

		/** 注册消息类*/
		public registerPackageInCls(cusCls : any) : void
		{
			this.mPackageInClsMap[cusCls.PROTOCOL_TYPE] = cusCls;
		}

		/** 获取消息包实例*/
		public getPackageIn(cusId : number) : core.IPackageIn
		{
			let _packageIn : core.IPackageIn = this.mPackageInMap[cusId].pop();
			if(_packageIn == null)
			{
				let _cls : any = this.mPackageInClsMap[cusId];
				_packageIn = new _cls();
			}
			return _packageIn;
		}

		/** 缓存*/
		public cachePackageIn(cusId : number, cusPackage : core.IPackageIn) : void
		{
			if(this.mPackageInMap[cusId] == null)
			{
				this.mPackageInMap[cusId] = [];
			}
			this.mPackageInMap[cusId].push(cusPackage);
		}

		/** 获取协议实例*/
		public getPackageOut(cusCls : any) : core.IPackageOut
		{
			let _packageOut : core.IPackageOut = this.mPackageOutMap[cusCls.PROTOCOL_TYPE].pop();
			if(_packageOut == null)
			{
				_packageOut = new cusCls();
			}
			return _packageOut;
		}

		/** 缓存*/
		public cachePackageOut(cusId : number, cusPackage : core.IPackageOut) : void
		{
			if(this.mPackageOutMap[cusId] == null)
			{
				this.mPackageOutMap[cusId] = [];
			}
			cusPackage.reset();
			this.mPackageOutMap[cusId].push(cusPackage);
		}


	}
}