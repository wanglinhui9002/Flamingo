module scene 
{
	/**
	 * 动画数据
	 */
	export class MovieClipData 
	{
		/** 动画名称*/
		private mName : string;
		/** 使用的次数*/
		private mUseTime : number;
		/** 最近使用时间*/
		private mLastUseTime : number;
		/** 是否已经初始化*/
		private mHasInit : boolean = false;
		/** 帧数据列表*/
		private mFrameList : {[key : string] : MultiFrameData} = {};

		public constructor()
		{
		}

		/**
		 * 设置数据
		 */
		public setAssetInfo(cusName : string) : void
		{
			this.mName = cusName;
			this.parse(GlobalUtils.RESProxy.getRes(cusName + ".json"), GlobalUtils.RESProxy.getRes(cusName + ".png"));
		}

		/**
		 * 解析数据
		 */
		private parse(cusConfig : Object, cusSpriteSheet : egret.SpriteSheet) : boolean
		{
			if(cusConfig && cusSpriteSheet)
			{
				let _config : any = cusConfig["mc"];
				let _multiFrameData : MultiFrameData;
				let _resInfos : any = cusConfig["res"];
				let _frameData : SingleFrameData;
				let _datas : any;
				let _resInfo : any;
				for(let _action in _config)
				{
					_multiFrameData = MultiFrameData.getEmptyData();
					_multiFrameData.frameFlag = _action;
					_multiFrameData.delayTime = _config[_action].frameRate;
					_datas = _config[_action].frames;
					for(let _data of _datas)
					{
						_resInfo = _resInfos[_data.res];
						_frameData = SingleFrameData.getEmptyData();
						_frameData.setData(cusSpriteSheet, _data.res, _resInfo.x, _resInfo.y, _resInfo.w, _resInfo.h, _data.x, _data.y);
						_multiFrameData.addFrameData(_frameData);
					}
					this.mFrameList[_multiFrameData.frameFlag] = _multiFrameData;
				}
				this.mHasInit = true;
			}
			return this.mHasInit;
		}

		/** 获取是否已经初始化*/
		public get hasInit() : boolean { return this.mHasInit; }

		/** 获取帧数据*/
		public getFrameDataByName(cusName : string) : MultiFrameData
		{
			return this.mFrameList[cusName];
		}


		/** 获取使用次数*/
		public get useTime() : number { return this.mUseTime; }
		/** 设置使用次数*/
		public set useTime(cusTimes : number)
		{
			if(this.mUseTime != cusTimes)
			{
				this.mUseTime = cusTimes;
				this.mLastUseTime = egret.getTimer();
			}
		}

		/** 获取最近使用时间*/
		public get lastUseTime() : number { return this.mLastUseTime; }

		/** 释放*/
		public reset() : void
		{
			let _frameData : MultiFrameData;
			for(let _key in this.mFrameList)
			{
				_frameData = this.mFrameList[_key];
				_frameData.reset();
			}
			this.mFrameList = {};
			this.mName = null;
		}
	}
}