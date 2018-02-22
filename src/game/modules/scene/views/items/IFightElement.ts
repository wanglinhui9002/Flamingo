module scene 
{
	/**
	 * 可战斗元素接口
	 */
	export interface IFightElement 
	{
		/** 获取位置*/
		getPixPosition() : egret.Point;
		/** 转向*/
		directToPoint(cusPoint : egret.Point, cusNow ?: boolean) : void;
		/** 播放攻击动作*/
		playAttack(cusActionList : Array<any>, cusPlayTimeList : Array<number>, cusPoint : egret.Point, cusTargetPoint : egret.Point, cusMoveType ?: number, cusMoveSpeed ?: number) : void;
	}
}