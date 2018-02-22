module scene 
{
	/**
	 * 动画数据管理器
	 */
	export class MovieClipDataManager extends egret.EventDispatcher
	{
		/** 资源准备完成*/
		public static MOVIECLIP_DATA_READY: string = "movieclip_data_ready";

		/** instance*/
		private static mInstance : MovieClipDataManager;
		public static getInstance() : MovieClipDataManager
		{
			if(null == MovieClipDataManager.mInstance)
			{
				MovieClipDataManager.mInstance = new MovieClipDataManager();
			}
			return MovieClipDataManager.mInstance;
		}

		/** MovieClipData存放字典*/
		private mMovieClipDataMap : {[key : string] : MovieClipData};
		/** MovieClipData对象池*/
		private mMovieClipDataPool : MovieClipData[] = [];
		/** 回收时间4分钟*/
		private static readonly FAILURE_TIME : number = 240000;

		public constructor() 
		{
			super();
			this.init();
		}

		/***************************public*****************************/
		/** 是否有资源*/
		public hasMovieClipData(cusName : string) : boolean
		{
			return this.mMovieClipDataMap[cusName] != null && this.mMovieClipDataMap[cusName].hasInit == true;
		}

		/** 加载动画资源*/
		public loadMovieClipData(cusName : string) : void
		{
			if(this.hasMovieClipData[cusName] == true)
			{
				this.dispatchAssetsReadyEvent(cusName);
			}
			else
			{
				GlobalUtils.RESProxy.loadGroup(cusName);
			}
		}

		/** 获取动画数据*/
		public getMovieClipData(cusName : string) : MovieClipData
		{
			return this.mMovieClipDataMap[cusName];
		}

		/****************************************private**********************/
		/** 初始化*/
		private init() : void
		{
			this.mMovieClipDataMap = {};
			GlobalUtils.RESProxy.addEventListener(EventTypes.LOAD_GROUP_COMPLETE, this.onLoadCompleteHandler, this);
			GlobalUtils.TickUtil.addTickListener(core.TickUtil.TIMER_TYPE, 30, 0, this, this.checkFailureData);
		}

		/** 加载组完成*/
		private onLoadCompleteHandler(event : egret.Event) : void
		{
			let _movieClipData : MovieClipData = this.getEmptyMovieClipData();
			_movieClipData.setAssetInfo(event.data);
			this.mMovieClipDataMap[event.data] = _movieClipData;
		}

		/** 检查是否有资源可以回收*/
		private checkFailureData() : void
		{
			let _now : number = egret.getTimer();
			let _data : MovieClipData;
			for(let _name in this.mMovieClipDataMap)
			{
				_data = this.mMovieClipDataMap[_name];
				if(_data.hasInit == true && _data.useTime == 0 && _now - _data.lastUseTime > MovieClipDataManager.FAILURE_TIME)
				{
					_data.reset();
					this.mMovieClipDataPool.push(_data)
					GlobalUtils.RESProxy.destoryRes(_name + ".json");
					GlobalUtils.RESProxy.destoryRes(_name + ".png");
					delete this.mMovieClipDataMap[_name];
				}
			}
		}

		/** 获取空的MovieClipData*/
		private getEmptyMovieClipData() : MovieClipData
		{
			var _data : MovieClipData = this.mMovieClipDataPool.pop();
			if(_data == null)
			{
				_data = new MovieClipData();
			}
			return _data;
		}

		/** 资源加载完成事件*/
		private dispatchAssetsReadyEvent(cusName : string) : void
		{
			this.dispatchEvent(new egret.Event(MovieClipDataManager.MOVIECLIP_DATA_READY, false, false, cusName))
		}

	}
}