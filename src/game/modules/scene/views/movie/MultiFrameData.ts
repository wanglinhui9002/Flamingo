module scene 
{
	/**
	 * 多帧数据
	 */
	export class MultiFrameData 
	{
		/** MultiFrameData对象池*/
		private static mDataPool : MultiFrameData[] = [];
		/** 帧标签*/
		private mFrameFlag : string;
		/** 帧频*/
		private mDelayTime : number;
		/** 帧数据*/
		private mFrameList : SingleFrameData[];
		/** 总帧数*/
		private mTotalFrame : number = 0;

		public constructor() 
		{
			
		}

		/**
		 * 添加帧数据
		 */
		public addFrameData(cusFrameData : SingleFrameData) : void
		{
			if(this.mFrameList == null)
			{
				this.mFrameList = [];
			}
			if(this.mFrameList.indexOf(cusFrameData) < 0)
			{
				this.mFrameList.push(cusFrameData);
				this.mTotalFrame ++;
			}
		}

		/** 通过帧标签获取帧*/
		public getFrameByFlag(cusFlag : number) : SingleFrameData
		{
			return this.mFrameList[cusFlag - 1];
		}

		/** 获取帧标签名*/
		public get frameFlag() : string { return this.mFrameFlag; }
		/** 设置帧标签名*/
		public set frameFlag(cusFlag : string) { this.mFrameFlag = cusFlag; }

		/** 获取帧延迟时间*/
		public get delayTime() : number { return this.mDelayTime; }
		/** 设置帧延迟时间*/
		public set delayTime(cusFrameRate : number) 
		{ 
			let _delayTime : number = 1000 / cusFrameRate;
			this.mDelayTime = _delayTime; 
		}

		/** 获取帧列表*/
		// public get frameList() : SingleFrameData[] { return this.mFrameList; }

		/** 获取总帧数*/
		public get totalFrame() : number { return this.mTotalFrame - 1; }

		/**
		 * 释放
		 */
		public reset() : void
		{
			this.mFrameFlag = null;
			this.mDelayTime = 0;
			if(this.mFrameList != null)
			{
				for( let _frameData of this.mFrameList)
				{
					_frameData.reset();
				}
				this.mFrameList = null;
			}
			this.mTotalFrame = 0;
			MultiFrameData.mDataPool.push(this);
		}

		/** 获取空数据*/
		public static getEmptyData() : MultiFrameData
		{
			let _data : MultiFrameData = MultiFrameData.mDataPool.pop();
			if(_data == null)
			{
				_data = new MultiFrameData();
			}
			return _data;
		}


	}
}