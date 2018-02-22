module scene 
{
	/**
	 * 非连通区域寻路关键点数据vo
	 */
	export class FindPathKeyPointVo 
	{

		/** 自己所在坐标x*/		
		private mPosX : number;
		/** 自己所在坐标y*/	
		private mPoxY : number;
		/** 前往坐标x*/	
		private mTargetX : number;
		/** 前往坐标y*/	
		private mTargetY : number;

		public constructor() 
		{
		}


		public get x() : number { return this.mPosX; }
		public set x(cusPosX : number) { this.mPosX = cusPosX; }

		public get y() : number { return this.mPoxY; }
		public set y(cusPosY : number) { this.mPoxY = cusPosY; }

		public get targetX() : number { return this.mTargetX; }
		public set targetX(cusTargetX : number) { this.mTargetX = cusTargetX; }

		public get targetY() : number { return this.mTargetY; }
		public set targetY(cusTargetY : number) { this.mTargetY = cusTargetY; }

	}
}