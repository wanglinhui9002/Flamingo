/**
 * 事件中心
 * @author wanglinhui
 * @version 1.0.0
 */
module core 
{
	export class GameEventDispatcher
	{
		private static mInstance : GameEventDispatcher;
		public static getInstance() : GameEventDispatcher
		{
			if(null == GameEventDispatcher.mInstance)
			{
				GameEventDispatcher.mInstance = new GameEventDispatcher();
			}
			return GameEventDispatcher.mInstance;
		}
		/**
		 * egret.EventDispatcher实例
		 */
		private mEventdispatcher : egret.EventDispatcher;

		public constructor(tEventDispatcher ?: egret.IEventDispatcher)
		{
			this.mEventdispatcher = new egret.EventDispatcher();
		}

		/**
		 * 抛出事件
		 */
		public dispatchEvent(tEventType : string, tBubbles : boolean = false, tCancelable : boolean = false, tParams ?: any) : boolean
		{
			let _event : egret.Event = new egret.Event(tEventType, tBubbles, tCancelable, tParams);
			return this.mEventdispatcher.dispatchEventWith(tEventType, tBubbles, tParams, tCancelable);
		}

		/**
		 * 是否已经添加了事件
		 */
		public hasEventListener(tEventType : string) : boolean
		{
			return this.mEventdispatcher.hasEventListener(tEventType);
		}

		/**
		 * 是否事件发送有注册回调
		 */
		public willTrigger(tEventType : string) : boolean
		{
			return this.mEventdispatcher.willTrigger(tEventType);
		}

		/**
		 * 添加事件监听
		 */
		public addEventListener(tEventType : string, tListener : Function, tContext : any, tUseCapture : boolean = false, tPriority : number = 0) : void
		{
			this.mEventdispatcher.addEventListener(tEventType, tListener, tContext, tUseCapture, tPriority);
		}

		/**
		 * 移除事件监听
		 */
		public removeEventListener(tType : string, tListener : Function, tContext : any, tUseCapture ?: boolean) : void
		{
			this.mEventdispatcher.removeEventListener(tType, tListener, tContext, tUseCapture);
		}
	}
}