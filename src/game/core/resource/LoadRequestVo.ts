module core 
{
	export class LoadRequestVo 
	{
		/** 请求vo*/
		private static mPool : LoadRequestVo[] = [];

		/** 资源名称、组名名称或url路径*/
		private mLoadName : string;
		/** 记载资源类型*/
		private mLoadType : LoadType;

		public constructor() 
		{
		}

		/**
		 * 获取LoadRequestVo实例
		 */
		public static popVo() : LoadRequestVo
		{
			let _vo : LoadRequestVo = LoadRequestVo.mPool.pop();
			if(_vo == null)
			{
				_vo = new LoadRequestVo();
			}
			return _vo;
		}

		/** 获取资源名称、组名名称或url路径*/
		public get loadName() : string { return this.mLoadName; }
		/** 设置资源名称、组名名称或url路径*/
		public set loadName(cusName : string) { this.mLoadName = cusName; }

		/** 获取加载类型*/
		public get loadType() : LoadType { return this.mLoadType; }
		/** 设置加载类型*/
		public set loadType(cusType : LoadType) { this.mLoadType = cusType; }

		/**
		 * 释放
		 */
		public dispose() : void
		{
			this.mLoadName = null;
			this.mLoadType = null;
			LoadRequestVo.mPool.push(this);
		}
		

	}
}