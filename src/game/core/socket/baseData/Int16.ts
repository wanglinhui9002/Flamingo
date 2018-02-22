module core 
{
	/**
	 * Int16数据类型
	 */
	export class Int16 extends BaseInt 
	{
		public constructor(cusValue : number)
		{
			super(cusValue);
			this.size = 16;
		}
	}
}