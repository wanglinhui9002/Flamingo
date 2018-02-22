module core 
{
	/**
	 * 资源路径
	 */
	export class URLManager 
	{
		/** 根路径*/
		public static readonly ROOT: string = "resource/assets/";

		/** instance*/
		private static mInstance : URLManager;
		public static getInstance() : URLManager
		{
			if(null == URLManager.mInstance)
			{
				URLManager.mInstance = new URLManager();
			}
			return URLManager.mInstance;
		}
		
		public constructor() 
		{
		}

		/** 获取map.xx路径*/
		public getMapInfoPath(cusMapTid : number) : string
		{
			return URLManager.ROOT + "map/" + cusMapTid + "/map.xx";// + "?v=" + GlobalManagers.webParamsManager.mainVersion;
		}

		/** 获取模糊图路径*/
		public getBlurryMapPath(cusResId : number) : string
		{
			return URLManager.ROOT + "map/" + cusResId + "/blurry.jpg";
		}

		/** 地图资源id*/
		public getMapBackgroundUrl(cusResId : number) : string
		{
			return URLManager.ROOT + "map/down/" + cusResId + ".jpg";
		}

		/** 获取小地图图块*/
		public getMapPicPath(cusResId : number, cusCol : number, cusRow : number) : string
		{
			return URLManager.ROOT + "map/" + cusResId + "/front/pic" + cusCol + "_" + cusRow + ".png";
		}


	}
}