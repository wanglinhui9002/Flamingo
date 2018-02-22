module login 
{
	/**
	 * 登入控制器
	 */
	export class LoginController extends core.Controller 
	{
		/** instance*/
		private static mInstance : LoginController;
		public static getInstance() : LoginController
		{
			if(null == LoginController.mInstance)
			{
				LoginController.mInstance = new LoginController();
			}
			return LoginController.mInstance;
		}

		public constructor() 
		{
			super();
		}

		/** 添加模块间事件*/
		protected addNotification() : void 
		{
			this.mDispatcher.addEventListener(EventTypes.REQUEST_USER_DATA, this.onRequestUserDataHandler, this);
			
		}

		/** 添加socket数据回调*/
		protected addSocketHandler() : void 
		{

		}

		/** 请求用户信息*/
		private onRequestUserDataHandler(event : egret.Event) : void
		{
			egret.log("request_user_data");
		}


	}
}