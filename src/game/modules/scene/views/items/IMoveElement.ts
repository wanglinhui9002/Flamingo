module scene 
{
	/**
	 * 可以移动的物件
	 */
	export interface IMoveElement 
	{
		/** 获取位置*/
		getPixPosition() : egret.Point;
		/** 停止移动*/
		stopMove(cusPoint : egret.Point, cusStopAutoPath ?: boolean, cusCheck ?: boolean, cusStandAction ?: boolean) : void;
		/** 按照路径移动*/
		move(cusPath : Array<any>, cusMoveType : number, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusNeedShadow ?: boolean, cusMoveStartPoint ?: egret.Point) : void;
		/** 跳跃*/
		jump(cusPath : Array<any>, cusMoveType : number, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusActionType ?: number, cusNeedShadow ?: boolean) : void;
		/** 飞*/
		fly(cusPath : Array<any>, cusIsFlying ?: Boolean, cusCallBack ?: Function, cusForceCallBack ?: boolean, cusParams ?: Array<any>, cusNeedShadow ?: boolean) : void;
		/** 击退*/
		playHitBack(cusPoint : egret.Point) : void
	}
}