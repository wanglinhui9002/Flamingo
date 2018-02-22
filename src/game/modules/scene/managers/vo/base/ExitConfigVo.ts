module scene 
{
	/**
	 * 传送点数据
	 */
	export class ExitConfigVo extends ObjectVo
	{
		/** 所在场景id*/
		protected mMapTid : number;
		/** 名字*/
		protected mName : string;
		/** 目标场景id*/
		protected mTargetMapTid : number;
		/** 传送后，目标场景的初始坐标点x,像素点.*/
		protected mTargetX : number;
		/** 传送后，目标场景的初始坐标点y,像素点.*/
		protected mTargetY : number;
		/** 交互半径*/
		protected mRadiu : number;
		/** 资源id*/
		protected mResId : number;
		/** 是否跳跃传送点*/
		protected mIsJump : boolean;
		/** 是否可见*/
		protected mCanSee : boolean;
		/** 跳跃动作*/
		protected mJumpAction : number;
		/** 界面中的排序（从小到大）*/
		protected mSort : number;

		public constructor() 
		{
			super();
		}

		/** 解析配置*/
		public parseConfig(cusMapTid : number, cusId : number, cusData : any) : void
		{
			this.mMapTid = cusMapTid;
			this.mId =  cusId;
			this.mName = cusData.title;
			this.mPosX = cusData.posx;
			this.mPosY = cusData.posy;
			this.mTargetMapTid = cusData.sid;
			this.mTargetX = cusData.tx;
			this.mTargetY = cusData.ty;
			this.mRadiu = cusData.radius;
			this.mResId = cusData.cid;
			this.mIsJump = cusData.isjump == 1;
			this.mCanSee = cusData.is_see == 1;
			this.mJumpAction = cusData.jump_action;
			this.mSort = cusData.sort;
		}

		/** 所在地图id*/
		public get mapTid() : number { return this.mMapTid; }
		/** 传送点名称*/
		public get name() : string { return this.mName; }
		/** 目标场景id*/
		public get targetMapId() : number { return this.mTargetMapTid; }
		/** 传送后，目标场景的初始坐标点x,像素点.*/
		public get targetX() : number { return this.mTargetX; }
		/** 传送后，目标场景的初始坐标点y,像素点.*/
		public get targetY() : number { return this.mTargetY; }
		/** 交互半径*/
		public get radius() : number { return this.mRadiu; }
		/** 资源id*/
		public get resId() : number { return this.mResId; }
		/** 是否跳跃传送点*/
		public get isJump() : boolean { return this.mIsJump; }
		/** 是否可见*/
		public get canSee() : boolean { return this.mCanSee; }
		/** 跳跃动作*/
		public get jumpAction() : number { return this.mJumpAction; }
		/** 界面中的排序（从小到大）*/
		public get sort() : number { return this.mSort;}

	}
}