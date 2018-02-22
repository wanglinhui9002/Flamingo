module core 
{
	/**
	 * 舞台代理
	 */
	export class StageProxy 
	{
		/** instance*/
		private static mInstance : StageProxy;
		public static getInstance() : StageProxy
		{
			if(null == StageProxy.mInstance)
			{
				StageProxy.mInstance = new StageProxy();
			}
			return StageProxy.mInstance;
		}

		/** 游戏舞台*/
		private mStage : egret.Stage;

		public constructor() 
		{
		}

		/** 启动*/
		public setup(cusStage : egret.Stage) : void
		{
			this.mStage = cusStage;
		}

		/** 获取舞台引用*/
		public get stage() : egret.Stage { return this.mStage; }
		/** 舞台宽*/
		public get width() : number { return this.mStage.stageWidth; }
		/** 舞台高*/
		public get height() : number{ return this.mStage.stageHeight; }
		/** 帧频*/
		public get frameRate() : number { return 30; }

	}
}