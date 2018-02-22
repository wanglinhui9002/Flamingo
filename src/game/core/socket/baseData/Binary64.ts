module core 
{
	/**
	 * 64位数操作
	 */
	export class Binary64 
	{
		public low : number;
		public high : number;

		public constructor(cusLow : number = 0, cusHigh : number = 0)
		{
			this.low = Math.floor(cusLow);
			this.high = Math.floor(cusHigh);
		}

		/** 除法*/
		public division(cusValue : number) : number
		{
			const modHigh: number = Math.floor(this.high % cusValue);
			const mod: number = Math.floor((this.low % cusValue + modHigh * 6) % cusValue);
			this.high = Math.floor(this.high / cusValue);
			const newLow: number = (modHigh * Number(0x100000000) + this.low) / cusValue;
			this.high += Math.floor(newLow / 0x100000000);
			this.low = Math.floor(newLow % 0x100000000);
			return Math.floor(mod);
		}

		/** 乘法*/
		public multiplication(cusValue : number) : void
		{
			const newLow: number = this.low * cusValue;
			this.high = Math.floor((newLow / 0x100000000) + (this.high) * cusValue);
			this.low = Math.floor(newLow % 0x100000000);
		}

		/** 加法*/
		public addition(cusValue : number) : void
		{
			const newLow: number = (this.low) + cusValue;
			this.high = Math.floor((newLow / 0x100000000) + this.high);
			this.low = Math.floor(newLow % 0x100000000);
		}

		/** 安位取反*/
		public bitwiseNot() : void
		{
			this.low = ~this.low;
			this.high = ~this.high;
		}

	}
}