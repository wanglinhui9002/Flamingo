module scene 
{
	/**
	 * 场景控制器
	 */
	export class SceneController extends core.Controller 
	{

		/** instance*/
		private static mInstance : SceneController;
		public static getInstance() : SceneController
		{
			if(SceneController.mInstance == null)
			{
				SceneController.mInstance = new SceneController();
			}
			return SceneController.mInstance;
		}

		/** 地图控制器*/
		private mMapController : MapController;
		/** 摄像机控制器*/
		private mCameraController : CameraController;

		/** 场景*/
		private mSceneView : SceneView;
		/** 地图url*/
		private mMapInfoUrl : string;
		
		public constructor() 
		{
			super();
		}

		/** 初始化*/
		public initialize() : void
		{
			super.initialize();
			this.mMapController = MapController.getInstance();
			this.mMapController.initialize();
			this.mCameraController = CameraController.getInstance()
			this.mCameraController.initialize();
		}

		/** 游戏开始回调*/
		public gameStartCallBack() : void
		{
			this.mSceneView = new SceneView();
			this.initToScene(101);
		}

		/** 添加模块间事件*/
		protected addNotification() : void 
		{
			this.mDispatcher.addEventListener(EventTypes.INIT_TILE_DATA_COMPLETE, this.onInitTileDataComHandler, this);
			this.mDispatcher.addEventListener(EventTypes.CAMERA_POSITION_CHANGE, this.onCameraPosChangeHandler, this);
		}

		/** 添加socket数据回调*/
		protected addSocketHandler() : void 
		{

		}

		/** 切换到目标场景*/
		private initToScene(cusMapTid : number) : void
		{
			let _currentMapTid : number = GlobalManagers.sceneManager.mapTid;
			let _currentMapVo : MapVo = GlobalManagers.sceneManager.getMapVoByTid(_currentMapTid);
			let _targetMapVo : MapVo = GlobalManagers.sceneManager.getMapVoByTid(cusMapTid);

			GlobalManagers.sceneManager.lastMapTid = _currentMapTid;
			GlobalManagers.sceneManager.mapTid = cusMapTid;

			if(_currentMapVo != null && _currentMapVo.mapResId == _targetMapVo.mapResId)
			{
				GlobalManagers.sceneManager.reset();
				this.mSceneView.reset(false);
				// this.initMapThings();
				// this.enterWorld();
			}
			else
			{
				GlobalManagers.sceneManager.reset();
				this.mSceneView.reset();
				if(this.mSceneView.parent != null)
				{
					this.mSceneView.parent.removeChild(this.mSceneView);
				}
				this.loadMapInfo(_targetMapVo.mapResId);
			}
		}

		/** 加载地图信息*/
		private loadMapInfo(cusMapResId : number) : void
		{
			let _mapInfo : MapInfoVo = GlobalUtils.mapInfoCache.getMapInfo(cusMapResId);
			if(_mapInfo != null)
			{
				this.buildScene(_mapInfo);
			}
			else
			{
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadMapInfoCompleteHandler, this);
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadMapInfoErrorHandler, this);
				this.mMapInfoUrl = GlobalManagers.urlManager.getMapInfoPath(cusMapResId);
				GlobalUtils.RESProxy.getResByUrl(this.mMapInfoUrl);
			}
			
		}

		/** 加载完成*/
		private onLoadMapInfoCompleteHandler(event : egret.Event) : void
		{
			let _url : string = event.data.url;	
			if(_url == this.mMapInfoUrl)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadMapInfoCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadMapInfoErrorHandler, this);

				let _bufferArray : ArrayBuffer = event.data.res;
				let _uint8Array : Uint8Array = new Uint8Array(_bufferArray);
				let _inflate : Zlib.Inflate = new Zlib.Inflate(_uint8Array);
				let _deplain : any = _inflate.decompress();
				let _configData : egret.ByteArray = new egret.ByteArray(_deplain);
				let _len : number = _configData.readInt();
				let _mapInfo : MapInfoVo = new MapInfoVo();
				_mapInfo.parseData(JSON.parse(_configData.readUTFBytes(_len)));
				GlobalUtils.mapInfoCache.putMapXXInfo(_mapInfo.mapId, _mapInfo);
				this.buildScene(_mapInfo);
			}
		}

		/** 加载报错*/
		private onLoadMapInfoErrorHandler(event : egret.Event) : void
		{
			let _url : string = event.data;	
			if(_url == this.mMapInfoUrl)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadMapInfoCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_ERROR, this.onLoadMapInfoErrorHandler, this);
				egret.log("加载" + _url  + "失败");
			}
		}

		/** 构建场景*/
		private buildScene(cusMapInfo : MapInfoVo) : void
		{
			GlobalManagers.sceneManager.build(cusMapInfo);
			this.mMapController.build(cusMapInfo, this.mSceneView.mapLayer);
			this.mSceneView.build(cusMapInfo);
			GlobalManagers.layerManager.sceneLayer.addChild(this.mSceneView);
		}

		/** 初始化title数据完成*/
		private onInitTileDataComHandler(event : egret.Event) : void
		{
			this.mMapController.load(new egret.Rectangle(-this.mSceneView.x, -this.mSceneView.y, GlobalUtils.StageProxy.width, GlobalUtils.StageProxy.height), null);
		}

		/** 摄像机位置改变*/
		private onCameraPosChangeHandler(event : egret.Event) : void
		{
			let _point : egret.Point = event.data;
			this.mSceneView.setFocusPosition(_point);
			let _centerPoint : egret.Point;
			if(GlobalManagers.cameraManager.targetPosition == null)
			{
			}
			this.mMapController.load(new egret.Rectangle(-this.mSceneView.x, -this.mSceneView.y, GlobalUtils.StageProxy.width, GlobalUtils.StageProxy.height), _centerPoint);
		}

	}
}