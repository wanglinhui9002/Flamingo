module scene 
{
	/**
	 * 传送点数据对象
	 */
	export class ExitVo extends ObjectVo
	{
		/** 跳跃点名称*/
		public name : string;
		/** 目标场景*/
		public targetMapTid : number;
		/** 传送后，目标场景的初始坐标点x,像素点.*/
		public targetX : number;
		/** 传送后，目标场景的初始坐标点y,像素点.*/
		public targetY : number;
		/** 交互半径*/
		public radiu : number;
		/** 出口模型资源id*/
		public sourceId : number;
		/** 是否是跳跃踏点*/
		public isJumpExit : boolean;
		/** 踏点类型(0：普通踏点，1：跳点，2：假踏点<仅客户端存在>)*/
		protected mType : number;
		/** 是否可以看见*/
		public canSee : boolean;
		/** 跳跃动作*/
		public jumpAction : number;

		public constructor() 
		{
			super();
		}

		/** 踏点类型(0：普通踏点，1：跳点，2：假踏点<仅客户端存在>)*/
		public get type() : number 
		{ 
			return this.mType;
		}

		/** 踏点类型(0：普通踏点，1：跳点，2：假踏点<仅客户端存在>)*/
		public set type(cusType : number)
		{
			this.mType = cusType;
		}
	}
}