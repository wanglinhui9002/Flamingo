module core 
{
	/**
	 * 资源加载器代理
	 */
	export class RESProxy extends egret.EventDispatcher
	{
		/** 最大并行加载数量*/
		private static readonly MAX_LOADING_THREAD : number = 3;

		/** instance*/
		private static mInstance : RESProxy;
		public static getInstance() : RESProxy
		{
			if(RESProxy.mInstance == null)
			{
				RESProxy.mInstance = new RESProxy()
			}
			return RESProxy.mInstance;
		}

		/** 正在加载的线程数*/
		private mLoadingCount : number = 0;
		/** 等待加载列表*/
		private mWaitLoadList : LoadRequestVo[];
		/** 是否已经监听过事件*/
		private mHasAddEvent : boolean = false;

		public constructor() 
		{
			super()
			RES.setMaxRetryTimes(RESProxy.MAX_LOADING_THREAD);
			this.mWaitLoadList = [];
		}

		/** 加载配置文件*/
		public loadConfig(cusConfigUrl : string, cusRoot : string) : void
		{
			RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandler, this);
			RES.loadConfig(cusConfigUrl, cusRoot);
		}

		/** 是否有资源*/
		public hasRes(cusKey : string) : boolean
		{
			return RES.hasRes(cusKey);
		}

		/** 同步获取资源 这种方式只能获取已经缓存过的资源*/
		public getRes(cusKey : string) : any
		{
			return RES.getRes(cusKey);
		}

		/** 异步获取资源，这种方式可以获取配置中含有的所有资源项*/
		public getResAsync(cusName : string) : void
		{
			this.load(cusName, LoadType.ASYNC_RES);
		}

		/** 通过url获取不在配置中的资源*/
		public getResByUrl(cusName : string) : void
		{
			this.load(cusName, LoadType.URL_RES);
		}

		/** 
		 * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。 
		 * 可以监听 ResourceEvent.CONFIG_COMPLETE 事件来确认配置加载完成
		 */
		public createGroup(cusName : string, cusKeys : string[], cusOverride ?: boolean) : boolean
		{
			return RES.createGroup(cusName, cusKeys, cusOverride);
		}

		/**
		 * 根据组名获取组加载项列表
		 */
		public getGroupByName(cusName : string) : string[]
		{
			let _list : RES.ResourceItem[] = RES.getGroupByName(cusName);
			let _group : string[] = [];
			for(let _item of _list)
			{
				_group.push(_item.name);
			}
			return _group;
		}

		/** 加载组*/
		public loadGroup(cusName : string) : void
		{
			this.load(cusName, LoadType.GROUP_RES);
		}

		/** 检查某个资源组是否已经加载完成。*/
		public isGroupLoaded(cusName : string) : boolean
		{
			return RES.isGroupLoaded(cusName);
		}

		/** 加载数据*/
		private load(cusName : string, cusLoadType : LoadType) : void
		{
			if(cusName == null || cusName == "")
			{
				return;
			}
			let _vo : LoadRequestVo = LoadRequestVo.popVo();
			_vo.loadName = cusName;
			_vo.loadType = cusLoadType;
			this.mWaitLoadList.push(_vo);
			this.doLoad();
		}

		/** 加载*/
		private doLoad() : void
		{
			if(this.mLoadingCount < RESProxy.MAX_LOADING_THREAD)
			{
				let _vo = this.getWaitLoadVo();
				if(_vo != null)
				{
					switch(_vo.loadType)
					{
						case LoadType.ASYNC_RES:
							this.mLoadingCount ++;
							RES.getResAsync(_vo.loadName, this.onGetResAsyncCompHandler, this);
							break;
						case LoadType.URL_RES:
							this.mLoadingCount ++;
							RES.getResByUrl(_vo.loadName, this.onGetResByUrlCompHandler, this);
							break;
						case LoadType.GROUP_RES:
							this.mLoadingCount += RES.getGroupByName(_vo.loadName).length;
							if(this.mHasAddEvent == false)
							{
								RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoadGroupCompHandler, this);
								RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onLoadGroupProgressHandler, this);
								RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onLoadGroupErrorHandler, this);
								RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadErrorHandler, this);
								this.mHasAddEvent = true;
							}
							RES.loadGroup(_vo.loadName);
							break;
					}
					_vo.dispose();
				}
			}
		}

		/** 获取等待加载的vo*/
		private getWaitLoadVo() : LoadRequestVo
		{
			let _requestVo : LoadRequestVo = this.mWaitLoadList.shift();
			return _requestVo;
		}

		/** 异步加载资源回调*/
		private onGetResAsyncCompHandler(cusRes : any, cusName : string) : void
		{
			this.mLoadingCount --;
			let _event : egret.Event;
			if(cusRes == null || cusRes == undefined)
			{
				_event = new egret.Event(EventTypes.GET_RES_ASYNC_ERROR, false, false, cusName);
				this.dispatchEvent(_event);
			}
			else
			{
				_event = new egret.Event(EventTypes.GET_RES_ASYNC_COMPLETE, false, false, cusName);
				this.dispatchEvent(_event);
			}
			this.doLoad();
		}

		/** 异步加载url资源回调*/
		private onGetResByUrlCompHandler(cusRes : any, cusName : string) : void
		{
			this.mLoadingCount --;
			let _event : egret.Event;
			if(cusRes == null || cusRes == undefined)
			{
				_event = new egret.Event(EventTypes.GET_RES_BY_URL_ERROR, false, false, cusName);
				this.dispatchEvent(_event);
			}
			else
			{
				_event = new egret.Event(EventTypes.GET_RES_BY_URL_COMPLETE, false, false, {url : cusName, res : cusRes});
				this.dispatchEvent(_event);
			}
			this.doLoad();
		}

		/** 配置文件加载完成*/
		private onConfigCompleteHandler(event: RES.ResourceEvent): void 
		{
			RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandler, this);
			this.dispatchEvent(event);
		}

		/** 加载组完成*/
		private onLoadGroupCompHandler(event : RES.ResourceEvent) : void
		{
			this.mLoadingCount -= RES.getGroupByName(event.groupName).length;
			let _event : egret.Event = new egret.Event(EventTypes.LOAD_GROUP_COMPLETE, false, false, event.groupName);
			this.dispatchEvent(_event);
			this.doLoad();
		}

		/** 加载组进度*/
		private onLoadGroupProgressHandler(event : RES.ResourceEvent) : void
		{
			let _event : RES.ResourceEvent = new RES.ResourceEvent(EventTypes.LOAD_GROUP_ERROR, false, false);
			_event.groupName = event.groupName;
			_event.itemsLoaded = event.itemsLoaded;
			_event.itemsTotal = event.itemsTotal;
			_event.resItem = event.resItem;
			this.dispatchEvent(_event);
		}

		/** 加载组错误*/
		private onLoadGroupErrorHandler(event : RES.ResourceEvent) : void
		{
			this.mLoadingCount -= RES.getGroupByName(event.groupName).length;
			let _event : egret.Event = new egret.Event(EventTypes.LOAD_GROUP_ERROR, false, false, event.groupName);
			this.dispatchEvent(_event);
			this.doLoad();
		}

		/** 加载项失败*/
		private onItemLoadErrorHandler(event : RES.ResourceEvent) : void { }

		/** 回收资源*/
		public destoryRes(cusName : string, cusForce ?: boolean) : boolean
		{
			return RES.destroyRes(cusName, cusForce);
		}

		/** 获取资源文件实际的URL地址*/
		public setGetVirtualUrlFunction(cusCallBack : any) : void
		{
			RES.web.Html5VersionController.prototype.getVirtualUrl = cusCallBack;
		}
		

	}

	/*加载类型*/
	export enum LoadType 
	{
		ASYNC_RES,		//异步加载资源
		URL_RES,		//异步加载外部URL资源
		GROUP_RES		//加载组资源
	}

}