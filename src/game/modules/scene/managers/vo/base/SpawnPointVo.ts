module scene 
{
	/**
	 * 地图刷怪点配置数据
	 */
	export class SpawnPointVo extends ObjectVo
	{

		/** 地图id*/
		private mMapTid : number;
		/** 怪物模版id*/
		private mMonsterTid : number;
		/** 是否允许挂机*/
		private mAllowHangUp : boolean;
		/** 是否可见*/
		private mCanShow : boolean;
		/** 排序*/
		private mSort : number;

		public constructor() 
		{
			super();
		}

		/** 解析配置*/
		public parseConfig(cusMapTid : number, cusId : number, cusData : any) : void
		{
			this.mMapTid = cusMapTid;
			this.mId = cusId;
			this.mMonsterTid = cusData.rawid;
			this.mPosX = cusData.posx;
			this.mPosY = cusData.posy;
			this.mAllowHangUp = cusData.is_hangup == 1;
			this.mCanShow = cusData.is_see == 1;
			this.mSort = cusData.sort;
		}


		/** 所在地图id*/
		public get mapTid() : number { return this.mMapTid; }
		/** 怪物模版id*/
		public get monsterTid() : number { return this.mMonsterTid; }
		/** 是否运行挂机*/
		public get allowHangUp() : boolean { return this.mAllowHangUp; }
		/** 是否可见*/
		public get canSee() : boolean { return this.mCanShow; }
		/** 排序号*/
		public get sort() : number { return this.mSort; }
	}
}