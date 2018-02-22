module scene 
{
	/**
	 * 场景对象数据基类。这个类中只有场景对象的三个基本属性：
	 * x坐标
	 * y坐标
	 * 对象唯一di
	 */
	export class ObjectVo 
	{
		/** x坐标*/
		protected mPosX : number;
		/** y坐标*/
		protected mPosY : number;
		/** 物品id*/
		protected mId : number

		public constructor() 
		{
		}

		/** 获取x坐标*/
		public get x() : number { return this.mPosX; }
		/** 设置x坐标*/
		public set x(cusX : number) { this.mPosX = cusX; }

		/** 获取y坐标*/
		public get y() : number { return this.mPosY; }
		/** 这是Y坐标*/
		public set y(cusY : number) { this.mPosY = cusY; }

		/** 获取场景物品唯一id*/
		public get id() : number { return this.mId; }
		/** 设置场景物品唯一id*/
		public set id(cusId : number) { this.mId = cusId; }

	}
}