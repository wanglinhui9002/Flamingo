module scene 
{
	/**
	 * 地图绘制器
	 */
	export class MapDrawer extends egret.Sprite
	{
		/** 底层地图*/
		private mMapBackground : egret.Bitmap;
		/** 底层地图容器*/
		private mBackgroundLayer : egret.Sprite;

		/** 图块层*/
		private mMapLayer : egret.Sprite;

		/** 上层光照*/
		private mUpLight : egret.Bitmap;
		private mUpLightLayer : egret.Sprite;

		/** 下层光照*/
		private mDownLight : egret.Bitmap;
		private mDownLightLayer : egret.Sprite;

		/** 正在渲染的图块*/
		private mRenderBmpList : {[key:string]:MapTile} = {};

		public constructor() 
		{
			super();
			this.mBackgroundLayer = new egret.Sprite();
			this.mMapLayer = new egret.Sprite();
			this.mDownLightLayer = new egret.Sprite();
			this.mUpLightLayer = new egret.Sprite();

			this.addChild(this.mBackgroundLayer);
			this.addChild(this.mMapLayer);
			this.addChild(this.mDownLightLayer);
			this.addChild(this.mUpLightLayer);
		}

		/** 添加图块*/
		public addTile(cusMapTile : MapTile) : void
		{
			cusMapTile.x = cusMapTile.column * cusMapTile.width;
			cusMapTile.y = cusMapTile.row * cusMapTile.height;
			if(this.mMapLayer.contains(cusMapTile) == false)
			{
				this.mMapLayer.addChild(cusMapTile);
			}
		}

		/** 移除图块*/
		public removeTile(cusMapTile : MapTile) : void
		{
			if(this.mMapLayer.contains(cusMapTile) == true)
			{
				this.mMapLayer.removeChild(cusMapTile);
			}
		}

		/** 是否包涵某图块*/
		public containsTile(cusMapTile : MapTile) : boolean
		{
			return this.mMapLayer.contains(cusMapTile);
		}

		/** 添加底图*/
		public addBackground(cusTexture : egret.Texture, cusLayerType : number = 0) : void
		{
			if(this.mMapBackground == null)
			{
				this.mMapBackground = new egret.Bitmap();
			}
			this.mMapBackground.texture = cusTexture;
			this.mBackgroundLayer.addChild(this.mMapBackground);
		}

		/** 移除底图*/
		public removeBackground() : void
		{
			if(this.mMapBackground && this.mBackgroundLayer.parent)
			{
				this.mBackgroundLayer.parent.removeChild(this.mBackgroundLayer);
				this.mMapBackground.texture = null;
			}
		}

		/** 添加上层光照*/
		public addUpLight(cusTexture : egret.Texture) : void
		{
			if(this.mUpLight == null)
			{
				this.mUpLight = new egret.Bitmap();
			}
			this.mUpLight.texture = cusTexture;
			this.mUpLightLayer.addChild(this.mUpLight);
		}

		/** 移除上层光照*/
		public removeUpLight() : void
		{
			if(this.mUpLight && this.mUpLight.parent)
			{
				this.mUpLight.parent.removeChild(this.mUpLight);
				this.mUpLight.texture = null;
			}
		}

		/** 添加下层光照*/
		public addDownLight(cusTexture : egret.Texture) : void
		{
			if(this.mDownLight == null)
			{
				this.mDownLight = new egret.Bitmap();
			}
			this.mDownLight.texture = cusTexture;
			this.mDownLightLayer.addChild(this.mDownLight);
		}

		/** 移除下层光照*/
		public removeDownLight() : void
		{
			if(this.mDownLight && this.mDownLight.parent)
			{
				this.mDownLightLayer.removeChild(this.mDownLight);
				this.mDownLight.texture = null;
			}
		}

		/** 清理绘制结构*/
		public clear() : void
		{
			let _i : number = this.mMapLayer.numChildren - 1;
			let _mapTile : MapTile;
			for (_i; _i >= 0; _i--)
			{
				_mapTile = <MapTile>this.mMapLayer.getChildAt(_i);
				this.mMapLayer.removeChild(_mapTile);
			}
			this.removeUpLight();
			this.removeDownLight();
			this.removeBackground();
		}


	}

}