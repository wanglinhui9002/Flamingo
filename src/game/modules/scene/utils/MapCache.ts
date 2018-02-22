module scene 
{
	/**
	 * 地图信息缓存器
	 */
	export class MapCache 
	{
		/** instance*/
		private static mInstance : MapCache;
		public static getInstance() : MapCache
		{
			if(null == MapCache.mInstance)
			{
				MapCache.mInstance = new MapCache();
			}
			return MapCache.mInstance;
		}

		/** 模糊图*/
		private mSmallMapList : {[key : string] : egret.Texture};
		/** map.xx数据*/
		private mMapXXList : {[key : string] : MapInfoVo};

		public constructor() 
		{
			this.mSmallMapList = {};
			this.mMapXXList = {};
		}

		/** 存储已经下载的缩略图*/
		public putSmallMap(cusResId : number, cusTexture : egret.Texture) : void
		{
			let _key : string = cusResId.toString();
			this.mSmallMapList[_key] = cusTexture;
		}

		/** 存储地图信息*/
		public putMapXXInfo(cusResId : number, cusMapInfoVo : MapInfoVo) : void
		{
			let _key : string = cusResId.toString();
			this.mMapXXList[_key] = cusMapInfoVo;
		}

		/** 获取模糊图*/
		public getSmallMap(cusResId : number) : egret.Texture
		{
			let _key : string = cusResId.toString();
			let _texture : egret.Texture = this.mSmallMapList[_key];
			return _texture;
		}

		/** 获取地图信息*/
		public getMapInfo(cusResId : number) : MapInfoVo
		{
			let _key : string = cusResId.toString();
			let _mapInfo : MapInfoVo = this.mMapXXList[_key];
			return _mapInfo;
		}


	}
}