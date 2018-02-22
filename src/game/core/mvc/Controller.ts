module core 
{
	/** 控制器基类*/
	export class Controller 
	{
		/** 事件中心*/
		protected mDispatcher : core.GameEventDispatcher;
		/** WebSocket*/
		protected mSocket : core.WebSocket;

		public constructor() 
		{
			this.mSocket = GlobalUtils.WebSocket;
			this.mDispatcher = GlobalUtils.EventDispatcher;
		}

		/** 初始化*/
		public initialize() : void
		{
			this.addNotification();
			this.addSocketHandler();
		}

		/** 游戏开始回调*/
		public gameStartCallBack() : void
		{
		}

		/** 添加模块间事件*/
		protected addNotification() : void {}
		/** 添加socket数据回调*/
		protected addSocketHandler() : void {}

	}
}