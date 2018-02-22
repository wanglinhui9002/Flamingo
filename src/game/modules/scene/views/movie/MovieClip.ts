module scene 
{
	/**
	 * 序列帧动画
	 */
	export class MovieClip extends egret.Sprite
	{
		/** 播放完成*/
		public static readonly PLAY_END : string = "play_end";

		/** 动画数据*/
		private mMovieClipData : MovieClipData;
		/** 具体动作序列帧数据*/
		private mMultiFrameData : MultiFrameData;
		/** 是否在播放中*/
		private mIsPlaying : boolean = false;
		/** 是否循环*/
		private mIsLoop : boolean = false;
		/** 当前帧*/
		private mCurrentFrame : number;
		/** 起始帧*/
		private mStartFrame : number;
		/** 结束帧*/
		private mEndFrame : number;
		/** 上次渲染时间*/
		private mLastTime : number;
		/** 位图显示对象*/
		private mBitmap : egret.Bitmap;
		/** X缩放系数*/
		private mScaleX : number = 1;
		/** Y缩放系数*/
		private mScaleY : number = 1;

		public constructor() 
		{
			super();
		}

		/** 播放*/
		public play() : void
		{
			if(this.mMovieClipData == null)
			{
				return;
			}
			if(this.mIsPlaying == false)
			{
				GlobalUtils.TickUtil.addTickListener(core.TickUtil.FRAME_TYPE, 1, 0, this, this.step);
				this.mIsPlaying = true;
			}
		}

		/** 停止*/
		public stop() : void
		{
			if(this.mIsPlaying == true)
			{
				GlobalUtils.TickUtil.removeTickListener(core.TickUtil.FRAME_TYPE, this, this.step);
				this.mIsPlaying = false;
			}
		}

		/** 从第几帧开始播放*/
		public gotoAndPlay(cusFrameFlag : number, cusIsLoop : boolean = true, cusStartFrame : number = 1, cusEndFrame : number = -1) : void
		{
			if(this.mMovieClipData == null || this.mMultiFrameData == null)
			{
				return;
			}
			this.mIsLoop = cusIsLoop;
			this.mCurrentFrame = cusFrameFlag;
			this.mStartFrame = cusStartFrame;
			if(cusEndFrame == -1)
			{
				this.mEndFrame = this.mMultiFrameData.totalFrame;
			}
			else
			{
				this.mEndFrame = cusEndFrame;
			}
			this.play();
		}

		/** 播放到第几帧并且停止*/
		public gotoAndStop(cusFrameFlag : number) : void
		{
			if(this.mMovieClipData == null || this.mMultiFrameData == null)
			{
				return;
			}
			this.mCurrentFrame = cusFrameFlag > this.mMultiFrameData.totalFrame ?  this.mMultiFrameData.totalFrame : cusFrameFlag;
			this.stop();
		}

		/** 设置动画数据*/
		public setMovieClipData(cusData : MovieClipData, cusActionName : string) : void
		{
			if(cusData == null|| cusData == this.mMovieClipData)
			{
				return;
			}

			if(this.mMovieClipData != null)
			{
				this.mMovieClipData.useTime--;
				this.mMovieClipData.useTime = egret.getTimer();
				this.mMovieClipData = null;
				
			}
			if(this.mBitmap != null)
			{
				this.mBitmap.texture = null;
			}
			this.mMultiFrameData = null;

			this.mMovieClipData = cusData;
			this.mMultiFrameData = this.mMovieClipData.getFrameDataByName(cusActionName);
			if(this.mIsPlaying == true)
			{
				this.render();
			}
			else
			{
				this.mStartFrame = 1;
				this.mEndFrame = this.mMultiFrameData.totalFrame;
				this.gotoAndStop(this.mStartFrame);
			}
			this.mMovieClipData.useTime ++;
		}

		/** 渲染循环逻辑*/
		private step() : void
		{
			if(this.mCurrentFrame >= this.mMultiFrameData.totalFrame)
			{
				if(this.mIsLoop == false)
				{
					this.stop();
					this.dispatchEvent(new egret.Event(MovieClip.PLAY_END));
					return;
				}
				this.mCurrentFrame = this.mStartFrame;
			}
			else
			{
				let _passFrame : number = (egret.getTimer() - this.mLastTime) / this.mMultiFrameData.delayTime + 0.5;//基于时间的渲染方式.
				if(_passFrame <= 1)
				{
					return;
				}
				this.mCurrentFrame += _passFrame;
			}
			this.render();
		}

		/** 渲染到舞台*/
		private render() : void
		{
			if(this.stage == null || (this.mMultiFrameData == null || this.mMultiFrameData.totalFrame == 0))
			{
				return;
			}
			let _renderFrame : number = this.mCurrentFrame;
			if(_renderFrame > this.mMultiFrameData.totalFrame)
			{
				_renderFrame = this.mMultiFrameData.totalFrame;
			}

			if(this.mBitmap == null)
			{
				this.mBitmap = new egret.Bitmap();
				this.addChild(this.mBitmap);
			}

			let _frameData : SingleFrameData = this.mMultiFrameData.getFrameByFlag(_renderFrame);
			if(_frameData.hasDraw == false)
			{
				if(_frameData.width == 0 || _frameData.height == 0)
				{
					this.mBitmap.texture = null;
					return;
				}
				_frameData.create();
			}

			if(this.mBitmap.texture != _frameData.texture)
			{
				this.mBitmap.texture = _frameData.texture;
			}
			this.mBitmap.scaleX = this.mScaleX;
			this.mBitmap.scaleY = this.mScaleY;
			this.mBitmap.x = -(190 - _frameData.offsetX) * this.mScaleX;
			this.mBitmap.y = -(190 - _frameData.offsetY) * this.mScaleY;
		}

		/** 获取X缩放比例*/
		public get scaleX() : number { return this.mScaleX; }
		/** 设置X缩放比例*/
		public set scaleX(cusScaleY : number) { this.mScaleY = cusScaleY; }

		/** 获取Y缩放比例*/
		public get scaleY() : number { return this.mScaleY; }
		/** 设置Y缩放比例*/
		public set scaleY(cusScaleY : number) { this.mScaleY = cusScaleY; }

		/** 获取动画数据*/
		public get movieClipData() : MovieClipData { return this.mMovieClipData; }

		/** 释放*/
		public destroy() : void
		{
			this.stop();
			if(this.mMovieClipData != null)
			{
				this.mMovieClipData.useTime--;
				this.mMovieClipData.useTime = egret.getTimer();
				this.mMovieClipData = null;
			}
			this.mMultiFrameData = null;
			this.mScaleX = 1;
			this.mScaleY = 1;
			this.mIsLoop = false;
			if(this.mBitmap != null)
			{
				this.mBitmap.texture = null;
				this.mBitmap.scaleX = 1;
				this.mBitmap.scaleY = 1;
			}
		}

	}
}