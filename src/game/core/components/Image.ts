module core 
{
	/**
	 * 位图
	 */
	export class Image extends eui.Image
	{
		/** 资源失效时间（毫秒）*/
		private static readonly FAILURE_TIME : number = 60 * 1000;
		/** 图片资源使用情况字典*/
		private static mImageMap : {[key : string] : ImageVo} = {};
		/** 是否启动gc计时器*/
		private static mHasStartTimer : boolean = false;

		/** 资源是否已经准备完毕*/
		private mHasRes : boolean = false;
		/** 资源名称或者资源URL路径*/
		private mName : string;
		/** 子图名称*/
		private mSubName: string;
		/** 是否是通过url加载资源*/
		private mLoadByUrl : boolean = false;
		/** 是否自动GC*/
		private mCanGC : boolean = true;

		public constructor() 
		{
			super();
			if(Image.mHasStartTimer == false)
			{
				Image.startGCTimer();
			}
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
		}

		/** 添加到舞台*/
		private onAddToStageHandler(event : egret.Event) : void
		{
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
			this.tryToDraw();
		}

		/** 从舞台移除*/
		private onRemoveFromStageHandler(event : egret.Event) : void
		{
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
			this.reset(false);
		}

		/** 重置*/
		public reset(cusResetGCMask : boolean = true) : void
		{
			if(this.mHasRes)
			{
				if(this.mName != null)
				{
					let _vo : ImageVo = Image.mImageMap[this.mName];
					if(_vo != null)
					{
						_vo.useTime--;
						if(cusResetGCMask)
						{
							_vo.removeNoGCMask(this);
						}
						if(this.mSubName != null && _vo.subImage[this.mSubName] != null)
						{
							_vo.subImage[this.mSubName].useTime--;
						}
					}
				}
			}
			GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadByUrlCompleteHandler, this);
			GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadByUrlErrorHandler, this);

			GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadAsyncCompleteHandler, this);
			GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadAsyncErrorHandler, this);

			this.texture = null;
			this.mHasRes = false;
			if(cusResetGCMask)
			{
				this.mName = null;
				this.mSubName = null;
			}
		}

		/** 尝试绘制*/
		private tryToDraw() : void
		{
			if(this.mName != null && this.mHasRes == false && this.stage != null)
			{
				let _res : any;
				if(this.mLoadByUrl == false)
				{
					_res = GlobalUtils.RESProxy.getRes(this.mName);
				}
				if(_res != null)
				{
					this.drawTexture();
				}
				else
				{
					if(this.mLoadByUrl)
					{
						GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadByUrlCompleteHandler, this);
						GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadByUrlErrorHandler, this);
						GlobalUtils.RESProxy.getResByUrl(this.mName);
					}
					else
					{
						GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadAsyncCompleteHandler, this);
						GlobalUtils.RESProxy.addEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadAsyncErrorHandler, this);
						GlobalUtils.RESProxy.getResAsync(this.mName);
					}
				}
			}
		}

		/** 绘制纹理*/
		private drawTexture(cusRes ?: any) : void
		{
			let _vo : ImageVo = Image.mImageMap[this.mName];
			if(_vo == null)
			{
				_vo = new ImageVo();
				Image.mImageMap[this.mName] = _vo;
				if(this.mLoadByUrl)
				{
					_vo.sourse = cusRes;
				}
				else
				{
					_vo.sourse = GlobalUtils.RESProxy.getRes(this.mName);
				}
				_vo.useTime++;
				if(this.mCanGC)
				{
					_vo.addNoGCMark(this);
				}
				if(this.mSubName != null)
				{
					let _subVo : ImageVo = _vo.subImage[this.mSubName];
					if(_subVo == null)
					{
						_subVo = new ImageVo(true);
						_subVo.sourse = (<egret.SpriteSheet>_vo.sourse).getTexture(this.mSubName);
						_vo.subImage[this.mSubName] = _subVo;
					}
					_subVo.useTime++;
					this.texture = <egret.Texture>_subVo.sourse;
				}
				else
				{
					this.texture = <egret.Texture>_vo.sourse;
				}
				this.mHasRes = true;
				this.dispatchEventWith(EventTypes.IMAGE_RES_READY);
			}
		}

		/** 加载完毕*/
		private onLoadByUrlCompleteHandler(event : egret.Event) : void
		{
			let _url : string = event.data.url;
			if(_url == this.mName)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadByUrlCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadByUrlErrorHandler, this);
				this.drawTexture(event.data.res);
			}
		}

		/** 加载失败*/
		private onLoadByUrlErrorHandler(event : egret.Event) : void
		{
			let _url : string = event.data;
			if(_url == this.mName)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_COMPLETE, this.onLoadByUrlCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadByUrlErrorHandler, this);
				this.dispatchEventWith(EventTypes.IMAGE_RES_ERROR, false, this.mName);
			}
		}

		/** 异步加载资源完成*/
		private onLoadAsyncCompleteHandler(event : egret.Event) : void
		{
			let _url : string = event.data;
			if(_url == this.mName)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadAsyncCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadAsyncErrorHandler, this);
				this.drawTexture();
			}
		}

		/** 异步加载资源失败*/
		private onLoadAsyncErrorHandler(event : egret.Event) : void
		{
			let _url : string = event.data;
			if(_url == this.mName)
			{
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_ASYNC_COMPLETE, this.onLoadAsyncCompleteHandler, this);
				GlobalUtils.RESProxy.removeEventListener(EventTypes.GET_RES_BY_URL_ERROR, this.onLoadAsyncErrorHandler, this);
				this.dispatchEventWith(EventTypes.IMAGE_RES_ERROR, false, this.mName);
			}
		}

		/** 获取是否可以自动GC*/
		public get canGC() : boolean { return this.mCanGC; }
		/** 设置是否可以自动GC*/
		public set canGC(cusValue : boolean)
		{
			this.mCanGC = cusValue;
			let _vo : ImageVo = Image.mImageMap[this.mName];
			if(_vo != null)
			{
				if(this.mCanGC)
				{
					_vo.addNoGCMark(this);
				}
				else
				{
					_vo.removeNoGCMask(this);
				}
			}
		}

		/** 加载（通过配置表的key去加载）*/
		public load(cusName : string, cusSubName ?: string) : void
		{
			this.reset();
			this.mLoadByUrl = false;
			this.mName = cusName;
			this.mSubName = cusSubName;
			this.tryToDraw();
		}

		/** 通过url加载*/
		public loadByURL(cusUrl : string) : void
		{
			this.reset();
			this.mLoadByUrl = true;
			this.mName = cusUrl;
			this.tryToDraw();
		}

		/** 设置数据源，覆写该方法主要给eui用*/
		public set sourse(cusSource : string|egret.Texture)
		{
			this.reset();
			this.mLoadByUrl = false;
			if(egret.is(cusSource, "egret.Texture"))
			{
				this.texture = <egret.Texture>cusSource;
			}
			else
			{
				let _nameList : Array<string> = (<string>cusSource).split(".");
				this.mName = _nameList[0];
				if(_nameList.length > 1)
				{
					this.mSubName = _nameList[1];
				}
				this.tryToDraw();
			}
		}

		/** 获取资源名称*/
		public get resName() : string { return this.mName; }
		/** 获取资源子元素名称*/
		public get resSubName() : string { return this.mSubName; }
		/** 资源是否已加载完毕*/
		public get hasRes() : boolean { return this.mHasRes; }

		/** 销毁*/
		public dispose() : void
		{
			this.reset();
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStageHandler, this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStageHandler, this);
		}

		/** 开启GC检测timer*/
		private static startGCTimer() : void
		{
			Image.mHasStartTimer = true;
			GlobalUtils.TickUtil.addTickListener(core.TickUtil.TIMER_TYPE, 10, 0, Image, Image.checkGC);
		}

		/** 检测GC*/
		private static checkGC() : void
		{
			let _now : number = egret.getTimer();
			let _imageVo : ImageVo;
			let _subImageVo : ImageVo;
			let _mustResList : Array<string> = GlobalUtils.RESProxy.getGroupByName("must");
			for(let _name in Image.mImageMap)
			{
				_imageVo = Image.mImageMap[_name];
				for(let subName in _imageVo.subImage)
				{
					_subImageVo = _imageVo.subImage[subName];
					if(_subImageVo.useTime == 0 && _now - _subImageVo.lastUseTime >= Image.FAILURE_TIME)
					{
						_subImageVo.dispose();
						delete _imageVo.subImage[subName];
					}
				}

				if(_imageVo.useTime == 0 && _imageVo.canGC && _now - _imageVo.lastUseTime >= Image.FAILURE_TIME)
				{
					_imageVo.dispose();
					delete Image.mImageMap[_name];
					let _index : number = _mustResList.indexOf(name)
					if(_index == -1)
					{
						GlobalUtils.RESProxy.destoryRes(name);
					}
				}
			}
		}

	}



	class ImageVo
	{
		/** 数据源*/
		public sourse : egret.SpriteSheet|egret.Texture;
		/** 子图片集合（用于数据源是SpriteSheet）*/
		public subImage : {[key : string] : ImageVo}


		/** 本vo释放时是否需要释放数据源*/
		private mNeedDisposeRes : boolean;
		/** 防止自动回收的引用标记*/
		private mNoGCMask : Image[] = [];
		/** 使用次数*/
		private mUseTime : number;
		/** 最后使用的时间戳*/
		private mLastUseTime : number;

		public constructor(cusNeedDisposeRes : boolean = false)
		{
			this.mNeedDisposeRes = cusNeedDisposeRes;
		}

		/** 添加防GC标记引用*/
		public addNoGCMark(cusImage : Image) : void
		{
			if(this.mNoGCMask.indexOf(cusImage) == -1)
			{
				this.mNoGCMask.push(cusImage);
			}
		}

		/** 移除防GC标记引用*/
		public removeNoGCMask(cusImage : Image) : void
		{
			let _index : number = this.mNoGCMask.indexOf(cusImage);
			if(_index >= 0)
			{
				this.mNoGCMask.splice(_index, 1);
			}
		}

		/** 是否自动回收*/
		public get canGC() : boolean
		{
			return this.mNoGCMask.length == 0;
		}

		/** 获取引用次数*/
		public get useTime() : number { return this.mUseTime; }
		/** 设置引用次数*/
		public set useTime(cusTime : number) 
		{
			if(this.mUseTime != cusTime)
			{
				this.mUseTime = cusTime;
				this.mLastUseTime = egret.getTimer();
			}
		}
		/** 最后使用时间戳（毫秒）*/
		public get lastUseTime() : number { return this.mLastUseTime; }

		/** 释放*/
		public dispose() : void
		{
			if(this.mNeedDisposeRes && egret.is(this.sourse, "egret.Texture"))
			{
				this.sourse.dispose();
			}
			this.sourse = null;
			this.subImage = null;
			this.mUseTime = 0;
			this.mLastUseTime = 0;
		}


	}
}