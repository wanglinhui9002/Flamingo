module scene 
{
	/**
	 * 地图逻辑控制器
	 */
	export class MapController extends core.Controller 
	{

		/** instance*/
		private static mInstance : MapController;
		public static getInstance() : MapController
		{
			if(null == MapController.mInstance)
			{
				MapController.mInstance = new MapController();
			}
			return MapController.mInstance;
		}

		/** 地图绘制器*/
		private mMapDrawer : MapDrawer;
		/** 地图信息*/
		private mMapInfoVo : MapInfoVo;
		/** 临时检查矩形*/
		private mTempCheckRect : egret.Rectangle;
		/** 上次检测的矩形*/
		private mLastCheckRect : egret.Rectangle;
		/** 上次视野*/
		private mLastRect : egret.Rectangle;
		/** 当前视野*/
		private mCurRect : egret.Rectangle;
		/** 模糊图*/
		private mBlurryBmp : egret.Bitmap;

		/** 图块数据对象池*/
		private static mMapTilePool : Array<MapTile> = [];
		/** 当前地图正在使用的图块数据*/
		private mTileList : {[key : string] : MapTile};
		/** 需要加载字典*/
		private mNeedAddTileList : Array<MapTile>;
		/** 需要预加载列表*/
		private mNeedPreLoadList : Array<MapTile>;

		/** 背景图加载地址*/
		private mBackgroundUrl : string;
		/** 地图层*/
		private mBackgroundBmp : egret.Bitmap;

		public constructor() 
		{
			super();
			this.mTempCheckRect = new egret.Rectangle();
			this.mLastCheckRect = new egret.Rectangle();
			this.mLastRect = new egret.Rectangle();
			this.mCurRect = new egret.Rectangle();
			this.mBlurryBmp = new egret.Bitmap();

			this.mBackgroundBmp = new egret.Bitmap();
		}

		/** 添加模块间事件*/
		protected addNotification() : void 
		{
			this.mDispatcher.addEventListener(EventTypes.MAP_FOCUS_CHANGE, this.onFocusChangeHandler, this);
		}

		/** 构建场景前景、背景，*/
		public build(cusMapInfo : MapInfoVo, cusPrarent : egret.Sprite) : void
		{
			if(null == this.mMapDrawer)
			{
				this.mMapDrawer = new MapDrawer();
				cusPrarent.addChild(this.mMapDrawer);
			}
			this.mMapInfoVo = cusMapInfo;
			this.mTileList = {};
			this.mNeedAddTileList = [];

			this.loadBlurryMap();
			this.loadMapBackground();
			// this.loadRoleLight();
		}

		/** 加载模糊图*/
		private loadBlurryMap() : void
		{
			let _texture : egret.Texture = GlobalUtils.mapInfoCache.getSmallMap(this.mMapInfoVo.mapId);
			if(_texture != null)
			{
				this.mBlurryBmp.texture = _texture;
				this.initTileDatas();
			}
			else
			{
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBlurryMapComHandler, this);
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBlurryMapErrorHandler, this);
				let _url : string = GlobalManagers.urlManager.getBlurryMapPath(this.mMapInfoVo.mapId);
				GlobalUtils.RESProxy.getResByUrl(_url);
			}
			
		}

		/** 加载模糊图完成*/
		private onBlurryMapComHandler(event : egret.Event) : void
		{
			let _url : string = GlobalManagers.urlManager.getBlurryMapPath(this.mMapInfoVo.mapId);
			if(_url == event.data.url)
			{
				let _texture : egret.Texture = event.data.res;
				this.mBlurryBmp.texture = _texture;
				GlobalUtils.mapInfoCache.putSmallMap(this.mMapInfoVo.mapId, _texture);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBlurryMapComHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBlurryMapErrorHandler, this);
				this.initTileDatas();
			}
		}

		/** 加载模糊图失败*/
		private onBlurryMapErrorHandler(event : egret.Event) : void
		{
			let _url : string = GlobalManagers.urlManager.getBlurryMapPath(this.mMapInfoVo.mapId);
			if(_url == event.data)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBlurryMapComHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBlurryMapErrorHandler, this);
			}
		}

		/** 初始化图块*/
		private initTileDatas() : void
		{
			let _column : number = Math.ceil(this.mMapInfoVo.mapWidth / MapConsts.TILE_WIDTH);
			let _row : number = Math.ceil(this.mMapInfoVo.mapHeight / MapConsts.TILE_HEIGHT);
			let _scale : number = this.mMapInfoVo.mapWidth / this.mBlurryBmp.width;
			let _reciprocalScaleX : number = this.mBlurryBmp.width / this.mMapInfoVo.mapWidth;
            let _reciprocalScaleY : number = this.mBlurryBmp.height / this.mMapInfoVo.mapHeight;
			let _stepX : number = MapConsts.TILE_WIDTH * _reciprocalScaleX;
            let _stepY : number = MapConsts.TILE_HEIGHT * _reciprocalScaleY;
			let _columnIndex : number = 0;
			let _rowIndex : number = 0;
			let _nameIndex : string;
			let _tile : MapTile;
			let _rectX : number;
			let _rectY : number;

			while(_columnIndex < _column)
			{
				_rowIndex = 0;
				while(_rowIndex < _row)
				{
					_nameIndex = _columnIndex + "_" + _rowIndex;
					_tile = this.getTile();
					_tile.column = _columnIndex;
					_tile.row = _rowIndex;
					_tile.url = GlobalManagers.urlManager.getMapPicPath(this.mMapInfoVo.mapId, _tile.column, _tile.row);
					_rectX = _columnIndex *  MapConsts.TILE_WIDTH * _reciprocalScaleX;
					_rectY = _rowIndex * MapConsts.TILE_HEIGHT * _reciprocalScaleY;
					_tile.drawRect = new egret.Rectangle(_rectX, _rectY, _stepX, _stepY);
					_tile.priority = 0;
					_tile.scale = _scale;
					this.mTileList[_nameIndex] = _tile;
					_rowIndex++;
				}
				_columnIndex++;
			}
			GlobalUtils.EventDispatcher.dispatchEvent(EventTypes.INIT_TILE_DATA_COMPLETE);
		}

		/** 获取图块数据*/
		private getTile() : MapTile
		{
			let _tileData : MapTile = MapController.mMapTilePool.pop();
			if(_tileData == null)
			{
				_tileData = new MapTile();
			}
			return _tileData;
		}

		/** 加载地图*/
		private loadMapBackground() : void
		{
			let _mapVo : MapVo = GlobalManagers.sceneManager.getCurrentMapVoByTid();
			if(_mapVo.background != 0)
			{
				this.mBackgroundUrl = GlobalManagers.urlManager.getMapBackgroundUrl(_mapVo.background);
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBackgroundComHandler, this);
				GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBackgroundErrorHandler, this);
				GlobalUtils.RESProxy.getResByUrl(this.mBackgroundUrl);
			}
			else
			{
				if(this.mBackgroundBmp.texture != null)
				{
					this.mBackgroundBmp.texture.dispose();
				}
				if(this.mBackgroundBmp.parent)
				{
					this.mBackgroundBmp.parent.removeChild(this.mBackgroundBmp);
				}
			}
		}

		/** 背景图加载完成*/
		private onBackgroundComHandler(event : egret.Event) : void
		{
			if(this.mBackgroundUrl == event.data.url)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBackgroundComHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBackgroundErrorHandler, this);
				this.mBackgroundBmp.texture = event.data.res;
				GlobalManagers.layerManager.sceneLayer.addChildAt(this.mBackgroundBmp, 0)
			}
		}

		/** 背景图加载失败*/
		private onBackgroundErrorHandler(event : egret.Event) : void
		{
			if(this.mBackgroundUrl == event.data)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onBackgroundComHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onBackgroundErrorHandler, this);
			}
		}

		/** 加载视野*/
		public load(cusRect : egret.Rectangle, cusCenterPos : egret.Point, cusLoadMore : boolean = true, cusNeedPreLoad : boolean = false) : void
		{
			this.mCurRect = cusRect;
			let _preNum : number = 2;
			if(cusLoadMore == true)
			{
				_preNum = 2;
			}
			if(cusNeedPreLoad == true)
			{
				_preNum = 0;
			}
			MapConsts.LOAD_RECT_WIDTH = Math.ceil(((GlobalUtils.StageProxy.width / MapConsts.TILE_WIDTH) + _preNum) * MapConsts.TILE_WIDTH);
			MapConsts.LOAD_RECT_HEIGHT = Math.ceil(((GlobalUtils.StageProxy.height / MapConsts.TILE_HEIGHT) + _preNum) * MapConsts.TILE_HEIGHT);

			let _centerX : number = cusRect.x + (cusRect.width >> 1);
			let _centerY : number = cusRect.y + (cusRect.height >> 1);

			let _startX : number = Math.floor((_centerX - (MapConsts.LOAD_RECT_WIDTH >> 1)) / MapConsts.TILE_WIDTH);
			let _startY : number = Math.floor((_centerY - (MapConsts.LOAD_RECT_HEIGHT >> 1)) / MapConsts.TILE_HEIGHT);
			let _startMaxX : number = Math.ceil((this.mMapInfoVo.mapWidth - MapConsts.LOAD_RECT_WIDTH) / MapConsts.TILE_WIDTH);
			let _startMaxY : number = Math.ceil((this.mMapInfoVo.mapHeight - MapConsts.LOAD_RECT_HEIGHT) / MapConsts.TILE_HEIGHT);

			if(_startX < 0)
			{
				_startX = 0;
			}
			if(_startY < 0)
			{
				_startY = 0;
			}
			if(_startX > _startMaxX)
			{
				_startX = _startMaxX;
			}
			if(_startX > _startMaxY)
			{
				_startX = _startMaxY;
			}

			let _loadXNum : number = Math.ceil(MapConsts.LOAD_RECT_WIDTH / MapConsts.TILE_WIDTH);
			let _loadYNum : number = Math.ceil(MapConsts.LOAD_RECT_HEIGHT / MapConsts.TILE_HEIGHT);

			let _viewProtStartX : number = Math.floor(cusRect.x / MapConsts.TILE_WIDTH);
			let _viewProtStartY : number = Math.floor(cusRect.y / MapConsts.TILE_HEIGHT);
			let _viewProtXNum : number = Math.ceil(cusRect.width / MapConsts.TILE_WIDTH);
			let _viewProtYNum : number = Math.ceil(cusRect.height / MapConsts.TILE_HEIGHT);

			if(cusNeedPreLoad == true)
			{
				this.mNeedPreLoadList = [];
				GlobalUtils.TickUtil.addTickListener(core.TickUtil.FRAME_TYPE, 1, 0, this, this.checkPreLoad);
			}

			let _viewProt : egret.Rectangle = new egret.Rectangle(_viewProtStartX, _viewProtStartY, _viewProtXNum, _viewProtYNum);

			this.mTempCheckRect.setTo(_startX, _startY, _loadXNum, _loadYNum);
			if(this.mTempCheckRect.equals(this.mLastCheckRect))
			{
				return;
			}
			else
			{
				this.mLastRect = cusRect;
			}
			if(this.mLastCheckRect.intersects(this.mTempCheckRect))
			{
				this.mTempCheckRect = this.mTempCheckRect.union(this.mLastCheckRect);
			}
			else
			{
				//先检测原来脏矩形,不相交，切换场景或者瞬移等等，卸载老范围.
				this.unLoadRect(this.mLastCheckRect);
			}
			this.mLastCheckRect.setTo(_startX, _startY, _loadXNum, _loadYNum);
			let _centerTile : egret.Point;
			if(cusCenterPos != null)
			{
				_centerTile = new egret.Point(cusCenterPos.x / MapConsts.TILE_WIDTH, cusCenterPos.y / MapConsts.TILE_HEIGHT);
			}
			//加载显示区域
			this.loadRect(this.mTempCheckRect, this.mLastCheckRect, _viewProt, _centerTile, cusNeedPreLoad);
		}

		/** 检测脏区*/
		private loadRect(cusRect : egret.Rectangle, cusLoadRect : egret.Rectangle, cusViewPort : egret.Rectangle, cusCenterPos : egret.Point, cusNeedPreLoad : boolean) : void
		{
			let _centerPoint : egret.Point;
			if(cusCenterPos == null || cusRect.containsPoint(cusCenterPos) == false)
			{
				_centerPoint = new egret.Point((cusRect.x + (cusRect.width >> 1)), (cusRect.y + (cusRect.height >> 1)));
			}
			else
			{
				_centerPoint = cusCenterPos;
			}

			let _columnIndex : number = cusRect.x;
			let _rowIndex : number = cusRect.y;
			let _mapTile : MapTile;
			let _nameIndex : string;
			let _inTileList : Array<MapTile> = [];
			let _outTileList : Array<MapTile> = [];
			//整个脏区域检测.
			for(let _column : number = 0; _column < cusRect.width; _column++)
			{
				_rowIndex = cusRect.y;
				for(let _row : number = 0; _row < cusRect.height; _row++)
				{
					_nameIndex = _columnIndex + "_" + _rowIndex;
					_mapTile = this.mTileList[_nameIndex];
					if(_mapTile != null)
					{
						if(_columnIndex < cusViewPort.x || _columnIndex > cusViewPort.right || _rowIndex < cusViewPort.y || _rowIndex > cusViewPort.bottom)
						{
							_outTileList.push(_mapTile);
						}
						else
						{
							_inTileList.push(_mapTile);
						}
					}
					_rowIndex++;
				}
				_columnIndex ++;
			}


			let _i : number;
			let _len : number = _inTileList.length;
			let _loadDelayIndex : number = 0;
			for(_i = 0; _i < _len; _i++)
			{
				_mapTile = _inTileList[_i];
				if(_mapTile.status == TileStatus.NORMAL)
				{
					_loadDelayIndex ++;
				}
				_mapTile.priority = _loadDelayIndex;
				this.loadTitle(_mapTile, cusLoadRect, cusNeedPreLoad, true);
			}

			_len = _outTileList.length;
			for(_i = 0; _i < _len; _i++)
			{
				_mapTile = _outTileList[_i];
				if(_columnIndex < cusLoadRect.x || _columnIndex > cusLoadRect.right || _rowIndex < cusLoadRect.y || _rowIndex > cusLoadRect.bottom)
				{
					if(_mapTile.status == TileStatus.NORMAL)
					{
						_loadDelayIndex ++;
					}
					_mapTile.priority = _loadDelayIndex;
					this.loadTitle(_mapTile, cusLoadRect, cusNeedPreLoad, false);
				}
				this.unLoadTile(_mapTile);
			}
		}

		/** 卸载区域*/
		private unLoadRect(cusRect : egret.Rectangle) : void
		{
			if(cusRect.isEmpty())
			{
				return;
			}
			let _mapTile : MapTile;
			let _nameIndex : string;
			let _columnIndex : number = cusRect.x;
			let _rowIndex : number = cusRect.y;
			for(let _column : number = 0; _column < cusRect.width; _column++)
			{
				_rowIndex = cusRect.y;
				for(let _row : number = 0; _row < cusRect.height; _row++)
				{
					_nameIndex = _columnIndex + "_" + _rowIndex;
					_mapTile = this.mTileList[_nameIndex];
					this.unLoadTile(_mapTile);
					_rowIndex++;
				}
				_columnIndex++;
			}
		}

		/** 加载图块*/
		private loadTitle(cusMapTile : MapTile, cusRect : egret.Rectangle, cusNeedPreLoad : boolean, cusInStage : boolean) : void
		{
			if(cusMapTile == null || cusRect.isEmpty())
			{
				return;
			}
			if(cusMapTile.column < cusRect.x || cusMapTile.column > cusRect.right || cusMapTile.row < cusRect.y || cusMapTile.row > cusRect.bottom)
			{
				this.unLoadTile(cusMapTile);
			}
			else
			{
				if(this.mMapDrawer.containsTile(cusMapTile) == false)
				{
					if(cusMapTile.isTransparent == true)
					{
						this.mMapDrawer.removeTile(cusMapTile);
						return;
					}
					if(cusMapTile.status == TileStatus.NORMAL)
					{
						cusMapTile.load(false, this.mBlurryBmp);
					}
					if(cusMapTile.status == TileStatus.CLEAR || cusInStage)
					{
						this.removeMapTileFromDelayList(cusMapTile);
						this.mMapDrawer.addTile(cusMapTile);
					}
					else
					{
						let _index : number = this.mNeedAddTileList.indexOf(cusMapTile);
						if(_index < 0)
						{
							this.addMapTileToDelayList(cusMapTile);
						}
					}

					if(cusNeedPreLoad)
					{
						this.mNeedPreLoadList.push(cusMapTile);
					}
				}
			}
		}

		/** 卸载图块*/
		private unLoadTile(cusMapTile : MapTile) : void
		{
			// egret.log("卸载图块");
			if(cusMapTile == null)
			{
				return;
			}
			this.removeMapTileFromDelayList(cusMapTile);
			this.mMapDrawer.removeTile(cusMapTile);
			cusMapTile.unLoad();
		}

		/** 添加一个地图块到添加等待队列，主要为了分帧解压.*/
		private addMapTileToDelayList(cusMapTile : MapTile) : void
		{
			if(this.mNeedAddTileList.length == 0)
			{
				GlobalUtils.TickUtil.addTickListener(core.TickUtil.TIMER_TYPE, 1, 0, this, this.checkDelayAddItem)
			}
			this.mNeedAddTileList.push(cusMapTile);
		}

		/** 从等待添加列表中移除一个图块*/
		private removeMapTileFromDelayList(cusMapTile : MapTile) : void
		{
			let _index : number = this.mNeedAddTileList.indexOf(cusMapTile);
			if(_index >= 0)
			{
				this.mNeedAddTileList.splice(_index, 1);
			}
		}

		/** 60毫秒一个delayAdditemCheck*/
		private checkDelayAddItem() : void
		{
			let _mapTile : MapTile;
			let _itemRect : egret.Rectangle = new egret.Rectangle();
			let _focusPoint : egret.Point = GlobalManagers.cameraManager.cameraPosition;
			let _stageRect : egret.Rectangle = new egret.Rectangle(_focusPoint.x, _focusPoint.y, GlobalUtils.StageProxy.width, GlobalUtils.StageProxy.height);
			let _len : number = this.mNeedAddTileList.length;
			for(let _i : number = _len - 1; _i >= 0; _i--)
			{
				_mapTile = this.mNeedAddTileList[_i];
				_itemRect.setTo(_mapTile.column * MapConsts.TILE_WIDTH, _mapTile.row * MapConsts.TILE_HEIGHT, MapConsts.TILE_WIDTH, MapConsts.TILE_HEIGHT);
				if(_stageRect.intersects(_itemRect))
				{
					this.mNeedAddTileList.splice(_i, 1);
					this.mMapDrawer.addTile(_mapTile);
					break;
				}
				else if(_mapTile.column < this.mLastCheckRect.x || _mapTile.column > this.mLastCheckRect.right || _mapTile.row < this.mLastCheckRect.y || _mapTile.row > this.mLastCheckRect.bottom)
				{
					this.mNeedAddTileList.splice(_i, 1);
					this.mMapDrawer.removeTile(_mapTile);
					_mapTile.unLoad();
				}
			}
			if(this.mNeedAddTileList.length == 0)
			{
				GlobalUtils.TickUtil.removeTickListener(core.TickUtil.TIMER_TYPE, this, this.checkDelayAddItem)
			}
		}

		/** 焦点发生改变*/
		private onFocusChangeHandler(event : egret.Event) : void
		{
			let _rect : egret.Rectangle = event.data.rect;
			let _centerPoint : egret.Point = event.data.point;
			if(_rect.isEmpty())
			{
				return;
			}
			this.load(_rect, _centerPoint);
		}

		/** 检查预加载*/
		private checkPreLoad() : void
		{
			let _mapTile : MapTile;
			if(this.mNeedPreLoadList != null)
			{
				let _len : number = this.mNeedPreLoadList.length;
				for(let _i : number = 0; _i < _len; _i++)
				{
					_mapTile = this.mNeedPreLoadList[_i];
					if(_mapTile && _mapTile.status == TileStatus.CLEAR)
					{
						this.mNeedPreLoadList.splice(_i, 1);
					}
				}
				_len = this.mNeedPreLoadList.length;
				if(_len <= 1)
				{
					this.mNeedPreLoadList.length = 0;
					this.mNeedPreLoadList = null;
					GlobalUtils.TickUtil.removeTickListener(core.TickUtil.FRAME_TYPE, this, this.checkPreLoad);
				}
			}
		}


	}
}