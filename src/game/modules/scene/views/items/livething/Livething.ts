module scene 
{
	/**
	 * 场景上带“生命”的物件
	 */
	export class Livething extends egret.Sprite implements IElements, IFightElement, IMoveElement, IScaleItem
	{
		/** 影子层*/
		private mShadowLayer : egret.Sprite;
		/** 选中*/
		private mSelectLayer : egret.Sprite;
		/** 角色层(除了阴影，全在里面)*/
		private mSelefLayer : egret.Sprite;
		/** 底层特效*/
		private mDownEffectLayer : egret.Sprite;
		/** 身体层*/
		private mBodyLayer : egret.Sprite;
		/** 上层特效*/
		private mUpEffectLayer : egret.Sprite;
		/** 飘字层*/
		private mFlyTextLayer : egret.Sprite;
		/** 称号层*/
		private mTitleLayer : egret.Sprite;
		/** 血条层*/
		private mHpLayer : egret.Sprite;
		/** 名字外层*/
		private mNameOutLayer : egret.Sprite;
		/** 名字层*/
		private mNameLayer : egret.Sprite;
		/** 伴侣名字层*/
		private mSpouseNameLayer : egret.Sprite;
		/** 帮会名字层*/
		private mGuilNameLayer : egret.Sprite;
		/** 头上自定义元素容器*/
		private mTopCustomItemLayer : egret.Sprite;
		/** 名称前面图标自定义元素容器*/
		private mNameCustomIconLayer : egret.Sprite;


		/** 名称*/
		private mLabelName : core.Label;
		/** 帮会名称*/
		private mLabelGuildName : core.Label;
		/** 血条*/
		private mHpBar : core.ProgressBar;

		public constructor() 
		{
			super();
			this.initialize();
		}

		/** 初始化*/
		private initialize() : void
		{
			this.initializeLayer();
			this.initializeItem();

			this.touchEnabled = false;
			this.touchChildren = false;
		}

		/** 初始化视图*/
		private initializeLayer() : void
		{
			this.mShadowLayer = new egret.Sprite();
			this.addChild(this.mShadowLayer);
			this.mSelectLayer = new egret.Sprite();
			this.addChild(this.mSelectLayer);

			this.mSelefLayer = new egret.Sprite();
			this.addChild(this.mSelefLayer);

			this.mDownEffectLayer = new egret.Sprite();
			this.mBodyLayer = new egret.Sprite();
			this.mUpEffectLayer = new egret.Sprite();
			this.mFlyTextLayer = new egret.Sprite();
			this.mTitleLayer  = new egret.Sprite();
			this.mHpLayer = new egret.Sprite();
			this.mNameOutLayer = new egret.Sprite();
			this.mNameLayer = new egret.Sprite();
			this.mNameOutLayer.addChild(this.mNameLayer);
			this.mSpouseNameLayer = new egret.Sprite();
			this.mGuilNameLayer = new egret.Sprite();
			this.mTopCustomItemLayer = new egret.Sprite();
			this.mNameCustomIconLayer = new egret.Sprite();

			this.mSelefLayer.addChild(this.mDownEffectLayer);
			this.mSelefLayer.addChild(this.mBodyLayer);
			this.mSelefLayer.addChild(this.mHpLayer);
			this.mSelefLayer.addChild(this.mNameOutLayer);
			this.mSelefLayer.addChild(this.mSpouseNameLayer);
			this.mSelefLayer.addChild(this.mGuilNameLayer);
			this.mSelefLayer.addChild(this.mTopCustomItemLayer);
			this.mSelefLayer.addChild(this.mNameCustomIconLayer);
			this.mSelefLayer.addChild(this.mTitleLayer);
			this.mSelefLayer.addChild(this.mUpEffectLayer);
			this.mSelefLayer.addChild(this.mFlyTextLayer);
		}

		/** 初始化显示物件*/
		private initializeItem() : void
		{

		}

		/******************************IElements***************************************/
		/** 场景物件id*/
		public getId() : string
		{
			return "";
		}

		/** 是否被点中*/
		public isHit() : boolean
		{
			return false;
		}

		/** 设定glow状态*/
		public setGlow(cusGlowAble : boolean, cusGlowId ?: number) : void
		{

		}

		/** 物件类型*/
		public getType() : number
		{
			return 0;
		}

		/** 设定选中状态*/
		public setSelect() : void
		{

		}

		/** 获取是否可以交易*/
		public isInteractive() : boolean
		{
			return false;
		}

		/** 是否是角色*/
		public isRole() : boolean
		{
			return false;
		}

		/**********************************IFightElement************************************/
		/** 获取位置*/
		public getPixPosition() : egret.Point
		{
			return new egret.Point();
		}

		/** 转向*/
		public directToPoint(cusPoint : egret.Point, cusNow ?: boolean) : void
		{

		}

		/** 播放攻击动作*/
		public playAttack(cusActionList : Array<any>, cusPlayTimeList : Array<number>, cusPoint : egret.Point, cusTargetPoint : egret.Point, cusMoveType ?: number, cusMoveSpeed ?: number) : void
		{

		}

		/********************************IMoveElement******************************************/
		/** 停止移动*/
		public stopMove(cusPoint : egret.Point, cusStopAutoPath ?: boolean, cusCheck ?: boolean, cusStandAction ?: boolean) : void
		{	
		}

		/** 按照路径移动*/
		public move(cusPath : Array<any>, cusMoveType : number, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusNeedShadow ?: boolean, cusMoveStartPoint ?: egret.Point) : void
		{

		}

		/** 跳跃*/
		public jump(cusPath : Array<any>, cusMoveType : number, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusActionType ?: number, cusNeedShadow ?: boolean) : void
		{

		}

		/** 飞*/
		public fly(cusPath : Array<any>, cusIsFlying ?: Boolean, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusNeedShadow ?: boolean) : void
		{

		}

		/** 击退*/
		public playHitBack(cusPoint : egret.Point) : void
		{

		}

		/******************************IScaleItem**********************************/
		/** 获取缩放系数*/
        public getScale() : number
		{
			return 0;
		}
        /** 设置缩放系数*/
        public setScale(cusScale : number)
		{

		}
	}
}