module scene 
{
	/**
	 * 场景视图
	 */
	export class SceneView extends egret.Sprite
	{
		/** 地图*/
		private mMapLayer : egret.Sprite;
		/** 下层特效层*/
		private mDownEffectLayer : egret.Sprite;
		/** 不参与深度排序的物件层*/
		private mFaceLayer : egret.Sprite;
		/** 物件层,可交换深度*/
		private mElementLayer : egret.Sprite;
		/** 上层特效层*/
		private mUpEffectLayer : egret.Sprite;
		/** 飘字层*/
		private mFlyTextLayer : egret.Sprite;
		/** 天空层*/
		private mSkyLayer : egret.Sprite;

		/** 设置焦点坐标*/
		private mFocusPosition : egret.Point;

		public constructor() 
		{
			super();
			this.configChildren();
		}

		/** 初始化场景*/
		private configChildren() : void
		{
			this.mMapLayer = new egret.Sprite();
			this.mMapLayer.touchChildren = false;
			this.mMapLayer.touchEnabled = false;
			this.addChild(this.mMapLayer);

			this.mDownEffectLayer = new egret.Sprite();
			this.mDownEffectLayer.touchEnabled = false;
			this.mDownEffectLayer.touchEnabled = false;
			this.addChild(this.mDownEffectLayer);

			this.mFaceLayer = new egret.Sprite();
			this.mFaceLayer.touchEnabled = false;
			this.mFaceLayer.touchChildren = false;
			this.addChild(this.mFaceLayer);

			this.mElementLayer = new egret.Sprite();
			this.mElementLayer.touchEnabled = false;
			this.mElementLayer.touchChildren = false;
			this.addChild(this.mElementLayer);

			this.mUpEffectLayer = new egret.Sprite();
			this.mUpEffectLayer.touchEnabled = false;
			this.mUpEffectLayer.touchChildren = false;
			this.addChild(this.mUpEffectLayer);

			this.touchEnabled = true;

		}

		/** 构建场景*/
		public build(cusMapInfo : MapInfoVo) : void
		{
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this)
		}		
		private onTouchBeginHandler(e:egret.TouchEvent):void
		{
			CameraController.getInstance().test(new egret.Point(e.stageX - this.x, e.stageY - this.y));
		}


		/** 设置位置*/
		public setFocusPosition(cusPoint : egret.Point) : void
		{
			this.mFocusPosition = cusPoint.clone();
			this.moveToPosition();
		}

		/** 移动到指定位置*/
		private moveToPosition() : void
		{
			if(this.mFocusPosition != null)
			{
				let _targetX : number = -this.mFocusPosition.x;
				let _targetY : number = -this.mFocusPosition.y;
				if(this.x != _targetX || this.y != _targetY)
				{
					let _dis : number = egret.Point.distance(new egret.Point(_targetX, _targetY), new egret.Point(this.x, this.y));
					let _speed : number = GlobalManagers.cameraManager.moveSpeed / GlobalUtils.StageProxy.frameRate;
					if(_dis > _speed && _speed > 0)
					{
						let _angle : number = Math.atan2((_targetY - this.y), (_targetX - this.x));
						let _offsetX : number = Math.ceil(_speed * Math.cos(_angle));
						let _offsetY : number = Math.ceil(_speed * Math.sin(_angle));
						this.x += _offsetX;
						this.y += _offsetY;
					}
					else
					{
						this.x = _targetX;
						this.y = _targetY;
						if(GlobalManagers.cameraManager.targetPosition == null && _speed > 0)
						{
							GlobalManagers.cameraManager.moveSpeed = 0;
						}
					}
				}
			}
		}

		/** 获取地图层*/
		public get mapLayer() : egret.Sprite { return this.mMapLayer; }

		/** 重置场景*/
		public reset(cusDisposeMap : boolean = true, cusStopStep : boolean = true) : void
		{

		}


	}
}