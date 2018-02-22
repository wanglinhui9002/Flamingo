module core 
{
	/**
	 * Int8
	 */
	export class Int8 extends BaseInt
	{
		public constructor(cusValue : number) 
		{
			super(cusValue);
			this.size = 8;
		}
	}
}