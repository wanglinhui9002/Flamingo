module scene 
{
	/**
	 * 帧数据
	 */
	export class SingleFrameData 
	{
		/** SingleFrameData对象池*/
		private static mDataPool : SingleFrameData[] = [];
		/** 图片集*/
		private mSpriteSheet : egret.SpriteSheet;
		/** 纹理数据*/
		private mFrameTexture : egret.Texture;
		/** 帧名*/
		private mName : string;
		/** 绘制x起始坐标*/
		private mPosX : number;
		/** 绘制y起始坐标*/
		private mPosY : number;
		/** 宽*/
		private mWidth : number;
		/** 高*/
		private mHeight : number;
		/** x便宜量*/
		private mOffsetX : number;
		/** y便宜量*/
		private mOffsetY : number;
		/** 上次使用时间*/
		private mLastUseTime : number;
		/** 是否绘制过*/
		private mHasDraw : boolean = false;

		public constructor()
		{
		}

		/** 设置数据*/
		public setData(cusSpriteSheet : egret.SpriteSheet, cusName : string, cusPosX : number, cusPosY : number, cusWidth : number, cusHeight : number, cusOffsetX : number, cusOffsetY : number) : void
		{
			this.mSpriteSheet = cusSpriteSheet;
			this.mName = cusName;
			this.mPosX = cusPosX;
			this.mPosY = cusPosY;
			this.mWidth = cusWidth;
			this.mHeight = cusHeight;
			this.mOffsetX = cusOffsetX;
			this.mOffsetY = cusOffsetY;
		}

		/**
		 * 创建纹理数据
		 */
		public create() : void
		{
			if(this.mFrameTexture == null && this.mSpriteSheet != null)
			{
				this.mSpriteSheet.createTexture(this.mName, this.mPosX, this.mPosY, this.mWidth, this.mHeight)
				this.mFrameTexture = this.mSpriteSheet.getTexture(this.mName);
				this.mHasDraw = true;
			}
		}

		/**
		 * 获取纹理
		 */
		public get texture() : egret.Texture
		{
			return this.mFrameTexture;
		}

		/**
		 * 释放
		 */
		public reset() : void
		{
			this.mSpriteSheet = null;
			this.mName = null;
			this.mPosX = 0;
			this.mPosY = 0;
			this.mWidth = 0;
			this.mHeight = 0;
			this.mOffsetX = 0;
			this.mOffsetY = 0;
			this.mHasDraw = false;
			if(this.mFrameTexture != null)
			{
				this.mFrameTexture.dispose();
				this.mFrameTexture = null;
			}
			SingleFrameData.mDataPool.push(this);
		}

		/** 获取宽*/
		public get width() : number { return this.mWidth; }
		/** 设置宽*/
		public set width(cusWidth : number) { this.mWidth = cusWidth; }

		/** 获取高*/
		public get height() : number { return this.mHeight; }
		/** 设置高*/
		public set height(cusHeight : number) { this.mHeight = cusHeight; }

		/** 获取x偏移量*/
		public get offsetX() : number { return this.mOffsetX; }
		/** 设置x偏移量*/
		public set offsetX(cusPosX : number) { this.mOffsetX = cusPosX; }

		/** 获取y偏移量*/
		public get offsetY() : number { return this.mOffsetY; }
		/** 设置Y偏移量*/
		public set offsetY(cusPosY : number) { this.mOffsetY = cusPosY; }

		/** 获取最后使用时间*/
		public get lastUseTime() : number { return this.mLastUseTime; }
		/** 设置随后使用事件*/
		public set lastUseTime(cusTime : number) { this.mLastUseTime = cusTime; }

		/** 获取是否已创建*/
		public get hasDraw() : boolean { return this.mHasDraw; }

		/** 获取空数据*/
		public static getEmptyData() : SingleFrameData
		{
			let _data : SingleFrameData = SingleFrameData.mDataPool.pop();
			if(_data == null)
			{
				_data = new SingleFrameData();
			}
			return _data;
		}
	}
}