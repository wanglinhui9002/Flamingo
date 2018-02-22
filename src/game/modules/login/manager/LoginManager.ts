module login 
{
	/**
	 * 登入数据管理器
	 */
	export class LoginManager extends egret.EventDispatcher
	{
		/** instance*/
		private static mInstance : LoginManager;
		public static getInstance() : LoginManager
		{
			if(null == LoginManager.mInstance)
			{
				LoginManager.mInstance = new LoginManager();
			}
			return LoginManager.mInstance;
		}


		public constructor() 
		{
			super();
		}
	}
}