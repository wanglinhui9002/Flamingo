module scene 
{
	/**
	 * 场景数据管理器
	 */
	export class SceneManager extends egret.EventDispatcher implements core.IManager
	{
		/** instance*/
		private static mInstance : SceneManager;
		public static getInstance() : SceneManager
		{
			if(null == SceneManager.mInstance)
			{
				SceneManager.mInstance = new SceneManager();
			}
			return SceneManager.mInstance;
		}

		/** 地图配置*/
		private mMapConfigDataMap : {[key : number] : MapVo};
		/** 当前所在的地图tid*/
		private mMapTid : number = -1;
		/** 上一个地图的tid*/
		private mLastMapTid : number = -1;
		/** 地图信息*/
		private mMapInfoVo : MapInfoVo;

		public constructor(cusTarget ?: egret.IEventDispatcher) 
		{
			super(cusTarget)
		}

		/** 解析数据*/
		public parseConfigData(cusData : any) : void
		{
			this.mMapConfigDataMap = {};
			let _mapVo : MapVo;
			for(let _tid  in cusData)
			{
				_mapVo = new MapVo();
				_mapVo.parseConfig(Number(_tid), cusData[_tid]);
				this.mMapConfigDataMap[_mapVo.mapTid] = _mapVo;
			}
		}

		/** 构建场景*/
		public build(cusMapInfoVo : MapInfoVo) : void
		{
			this.mMapInfoVo = cusMapInfoVo;
		}

		/** 通过地图tid获取地图数据*/
		public getMapVoByTid(cusTid : number) : MapVo
		{
			let _mapVo : MapVo = this.mMapConfigDataMap[cusTid];
			return _mapVo;
		}

		/** 获取当前地图数据*/
		public getCurrentMapVoByTid() : MapVo
		{
			let _mapVo : MapVo = this.getMapVoByTid(this.mapTid);
			return _mapVo;
		}

		/** 地图资源的版本号*/
		public get mapResVersion() : string
		{
			return this.mMapInfoVo.version;
		}

		/** 获取当前mapxx信息*/
		public get mapInfoVo() : MapInfoVo { return this.mMapInfoVo; }

		/** 获取当前坐在地图tid*/
		public get mapTid() : number { return this.mMapTid; }
		/** 设置当前地图tid*/
		public set mapTid(cusTid : number) { this.mMapTid = cusTid; }


		/** 获取上个场景tid*/
		public get lastMapTid() : number { return this.mLastMapTid; }
		/** 设置上个场景tid*/
		public set lastMapTid(cusTid : number) { this.mLastMapTid = cusTid; }

		/** 重置*/
		public reset() : void
		{

		}

	}
}