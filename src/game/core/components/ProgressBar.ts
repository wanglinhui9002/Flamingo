module core 
{
	/**
	 * 进度调
	 */
	export class ProgressBar extends egret.Sprite 
	{
		/** 文本进度值*/
		private mLabel : Label;
		/** 进度条宽度*/
		private mBarWidth : number;
		/** 进度条高度*/
		private mBarHeight : number;
		/** 进度条背景样式编号*/
		private mBgStyle : number;
		/** 进度条样式编号*/
		private mBarStyle : number;
		/** 是否缓动变化进度*/
		private mShowTween : boolean;
		/** 进度条的X*/
		private mBarX : number;
		/** 进度条的Y*/
		private mBarY : number;
		/** 进度条背景宽度*/
		private mBgWidth : number;


		/** 进度条背景*/
		private mBgSkin : egret.Bitmap;
		/** 进度条*/
		private mBarSkin : egret.Bitmap;


		public constructor(cusBgStyle : number, cusBarStyle : number, cusMaxBgWidth : number, cusMaxBarWidth : number, cusShowTween : boolean = true, cusBarPos : egret.Point = null) 
		{
			super();
			this.mBgStyle = cusBgStyle;
			this.mBarStyle = cusBarStyle;
			this.mShowTween = cusShowTween;
			this.mBgWidth = cusMaxBgWidth;
			this.mBarWidth = cusMaxBarWidth;
			this.mBarX = cusBarPos ? cusBarPos.x : 0;
			this.mBarX = cusBarPos ? cusBarPos.y : 0;
			
			this.configChildren();
		}

		/** 初始化界面*/
		private configChildren() : void
		{
			this.mBgSkin = GlobalUtils.RESProxy.getRes("common_json" + this.mBgStyle);
		}

	}
}