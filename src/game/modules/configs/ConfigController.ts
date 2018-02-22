module config 
{
	/**
	 * 游戏配置解析控制器
	 */
	export class ConfigController extends core.Controller
	{

		/** instance*/
		private static mInstance : ConfigController;
		public static getInstance() : ConfigController
		{
			if(null == ConfigController.mInstance)
			{
				ConfigController.mInstance = new ConfigController();
			}
			return ConfigController.mInstance;
		}


		public constructor()
		{
			super();
		}

		/** 添加模块间事件监听*/
		protected addNotification() : void
		{
			
		}


	}
}