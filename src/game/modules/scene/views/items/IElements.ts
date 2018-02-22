module scene 
{
	/**
	 * 可以被添加到显示列表的物件
	 */
	export interface IElements 
	{
		/** 场景物件id*/
		getId() : string;
		/** 是否被点中*/
		isHit() : boolean;
		/** 设定glow状态*/
		setGlow(cusGlowAble : boolean, cusGlowId ?: number) : void;
		/** 物件类型*/
		getType() : number;
		/** 设定选中状态*/
		setSelect() : void;
		/** 获取是否可以交易*/
		isInteractive() : boolean;
		/** 是否是角色*/
		isRole() : boolean
	}
}