module core 
{
	/**
	 * int数据基类
	 */
	export class BaseInt 
	{
		/** 位数*/
		private mSize : number;
		/** 值*/
		private mValue : number

		public constructor(cusValue : number)
		{
			this.mValue = Math.floor(cusValue);
		}

		/** 获取位数*/
		public get size() : number { return this.mSize; }
		/** 设置int位*/
		public set size(cusValue : number) { this.mSize = cusValue; }

		/** 获取值*/
		public get value() : number { return this.mValue; }
		/** 设置int值*/
		public set value(cusValue : number) { this.mValue = cusValue; }

	}
}