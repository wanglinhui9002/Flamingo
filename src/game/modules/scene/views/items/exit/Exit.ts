module scene 
{
	/**
	 * 创送点场景模型
	 */
	export class Exit extends egret.Sprite
	{
		public constructor() 
		{
			super();
			this.initialize();
		}

		/** 初始化*/
		private initialize() : void
		{
			this.touchEnabled = false;
			this.touchChildren = false;
		}

	}
}