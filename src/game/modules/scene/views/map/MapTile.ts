module scene 
{
	/**
	 * 地图块
	 */
	export class MapTile extends egret.Bitmap
	{
		/** 列*/
		private mColumn : number;
		/** 行*/
		private mRow : number;
		/** 图块的url*/
		private mUrl : string;
		/** 宽*/
		private mWidth : number;
		/** 高*/
		private mHeight : number;
		/** 图块的绘制范围*/
		private mDrawRect : egret.Rectangle;
		/** 地图块当前状态标示0-未加载.1-缩略图.2-地图块*/
		private mStatus : TileStatus = TileStatus.NORMAL;

		/** 加载的优先级*/
		private mPriority : number = 0;
		/** 地图加载延迟计时器编号*/
		private mTimerIndex : number = -1;
		/** 是否已经被添加到舞台*/
		private mAddedToStage : boolean = false;
		/** 是否在加载中*/
		private mIsLoading : boolean = false;
		/** 模糊图缩放大小*/
		private mScale : number = 1;
		/** 帮助纹理*/
		private mHelpTexture : egret.RenderTexture;
		/** 是否是纯透明区域*/
		private mIsTransparent : boolean = false;

		public constructor()
		{
			super();
			this.mStatus = TileStatus.NORMAL;
			this.mHelpTexture = new egret.RenderTexture();
			this.mWidth = MapConsts.TILE_WIDTH;
			this.mHeight = MapConsts.TILE_HEIGHT;
		}

		/** 开始加载纹理*/
		public load(cusDelay : boolean = true, cusBlurryMap : egret.Bitmap) : void
		{
			let _delay : boolean = cusDelay;
			if(this.mStatus == TileStatus.NORMAL)
			{
				this.mHelpTexture.dispose();
				this.mHelpTexture.drawToTexture(cusBlurryMap, this.mDrawRect, this.mScale);
				this.texture = this.mHelpTexture;
				this.visible = true;
				this.mStatus = TileStatus.BLURRY;
			}
			if(this.mStatus == TileStatus.BLURRY)
			{
				if(cusDelay == false)
				{
					this.doLoad();
				}
				else
				{
					egret.clearTimeout(this.mTimerIndex);
					this.mTimerIndex = egret.setTimeout(this.doLoad, this, 34 * this.mPriority);
				}
			}
			
		}

		/** 实际加载函数*/
		private doLoad() : void
		{
			egret.clearTimeout(this.mTimerIndex);

			if(this.mIsLoading == false)
			{
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadCompleteHandler, this);
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadErrorHandler, this);
			}
			this.mIsLoading = true;
			let _loadUrl : string = this.mUrl;// + "?v=" + GlobalManagers.sceneManager.mapResVersion;
			GlobalUtils.RESProxy.getResByUrl(_loadUrl);
		}

		/** 加载完成*/
		private onLoadCompleteHandler(event : egret.Event) : void
		{
			let _resUrl : string = event.data.url;
			let _loadUrl : string = this.mUrl;// + "?v=" + GlobalManagers.sceneManager.mapResVersion;
			if(_resUrl == _loadUrl)
			{
				this.texture = null;
				this.visible = true;
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_ERROR, this.onLoadErrorHandler, this);
				egret.log(<egret.Texture>event.data.res);
				this.texture = <egret.Texture>event.data.res;
				this.mStatus = TileStatus.CLEAR;				
				this.mIsLoading = false;
				this.mHelpTexture.dispose();
			}
		}

		/** 加载失败*/
		private onLoadErrorHandler(event : egret.Event) : void
		{
			let _resUrl : string = event.data;
			let _loadUrl : string = this.mUrl;// + "?v=" + GlobalManagers.sceneManager.mapResVersion;
			if(_resUrl == _loadUrl)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_ERROR, this.onLoadErrorHandler, this);
				this.mIsLoading = false;
				this.texture = null;
				this.mHelpTexture.dispose();
			}
		}

		/** 超出视野范围的时候调用此方法来卸载图块*/
		public unLoad() : void
		{
			if(this.mStatus == TileStatus.NORMAL)
			{
				return;
			}
			egret.clearTimeout(this.mTimerIndex);
			this.mHelpTexture.dispose();
			this.texture = null;
			this.mStatus = TileStatus.NORMAL;
			if(this.mIsLoading == true)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_ERROR, this.onLoadErrorHandler, this);
				this.mIsLoading = false;
			}
		}


		/** 获取列*/
		public get column() : number { return this.mColumn; }
		/** 设置列*/
		public set column(cusValue : number) { this.mColumn = cusValue; }

		public get row() : number { return this.mRow; }
		public set row(cusValue : number) { this.mRow = cusValue; }

		public set url(cusUrl : string) { this.mUrl = cusUrl; }

		public get width() : number { return this.mWidth; }
		public set width(cusWidth : number) { this.mWidth = cusWidth; }

		public get height() : number { return this.mHeight; }
		public set height(cusHeight : number) { this.mHeight = cusHeight; }

		/** 绘制矩形*/
		public get drawRect() : egret.Rectangle { return this.mDrawRect; }
		public set drawRect(cusRect : egret.Rectangle) { this.mDrawRect = cusRect; }

		/** 获取数据状态*/
		public get status() : TileStatus { return this.mStatus; }
		
		/** 加载优先级*/
		public set priority(cusPriority : number) { this.mPriority = cusPriority; }

		/** 是否添加到舞台*/
		public get addedToStage() : boolean { return this.mAddedToStage; }
		public set addedToStage(cusValue : boolean) { this.mAddedToStage = cusValue; }

		/** 模糊图缩放大小*/
		public get scale() : number { return this.mScale; }
		public set scale(cusScale : number) { this.mScale = cusScale; }

		/** 是否是纯透明的图块*/
		public get isTransparent() : boolean { return this.mIsTransparent; }
		public set isTransparent(cusValue : boolean) { this.mIsTransparent = cusValue; }

		/** 释放*/
		public dispose() : void
		{
			this.mAddedToStage = false;
			this.mPriority = 0;
			this.mTimerIndex = -1;
			this.mStatus = TileStatus.NORMAL;
			this.mDrawRect = null;
			this.mWidth = 0;
			this.mHeight = 0;
			this.mColumn = 0;
			this.mRow = 0;
			this.mUrl = null;
			this.mIsLoading = false;
			this.mIsTransparent = false;
			this.mScale = 1;
			if(this.texture)
			{
				this.texture.dispose();
			}
			this.texture = null;
			this.mHelpTexture.dispose();
		}

	}


	export enum TileStatus
	{
		/** 普通状态*/
		NORMAL,
		/** 模糊状态*/
		BLURRY,
		/** 清晰状态*/
		CLEAR,
	}

}