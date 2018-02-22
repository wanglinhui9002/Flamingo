module scene 
{
	/**
	 * 场景配置数据
	 */
	export class MapVo 
	{
		/** 场景模版id*/
		private mMapTid : number;
		/** 资源id*/
		private mMapResId : number;
		/** 场景名称*/
		private mMapName : string;
		/** 地图类型*/
		private mMapType : number;
		/** 是否允许PK*/
		private mAllowPK : boolean = false;
		/** 传送类型*/
		private mTeleportFlag : number;
		/** 进入最小等级*/
		private mEnterMinLvl : number;
		/** 进入最大等级*/
		private mEnterMaxLvl : number;
		/** 场景诗*/
		private mMapIntroduceId : number;
		/** 是否允许打坐*/
		private mAllowSit : boolean = false;
		/** 刷挂掉列表*/
		private mSpawnPointMap : {[key : number] : SpawnPointVo};
		/** 传送点*/
		private mExitPointMap : {[key : number] : ExitPointVo};
		/** 跳跃踏点列表*/
		private mJumpPointMap : {[key : number] : ExitPointVo};
		/** 非连通区域寻路关键点列表*/
		private mKeyPointMap : {[key : number] : FindPathKeyPointVo};
		/** 非连通区域寻路关键点列表(已按区域分类)*/
		private mKeyPointMapOrderByGroup : {[key : number]:egret.Point};

		/** 底层地图资源*/
		private mMapBackground : number;
		/** 进入的坐标点*/
		private mEnterPoint : egret.Point;
		/** 地图资源版本号*/
		private mVersion : number;

		public constructor() 
		{
		}

		/** 解析数据*/
		public parseConfig(cusTid : number, cusData : any) : void
		{
			this.mMapTid = cusTid;
			this.mMapResId = cusData.resid;
			this.mMapName = cusData.name;
			this.mMapType = cusData.maptype;
			this.mMapBackground = cusData.mapbg;
		}

		/** 获取场景模版id*/
		public get mapTid() : number { return this.mMapTid; }
		/** 获取资源id*/
		public get mapResId() : number { return this.mMapResId; }
		/** 获取地图名字*/
		public get mapName() : string { return this.mMapName; }
		/** 地图类型*/
		public get mapType() : number { return this.mapType; }
		/** 获取底图*/
		public get background() : number { return this.mMapBackground; }

	}
}