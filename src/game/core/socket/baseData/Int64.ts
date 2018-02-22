module core 
{
	/**
	 * Int64
	 */
	export class Int64 extends Binary64
	{
		public constructor(cusLow : number = 0, cusHigh : number = 0) 
		{
			super(cusLow, cusHigh);
		}

		/** 解析字符串成64位数*/
		public static parseInt64(cusStr : string, cusRadix : number = 0) : Int64
		{
			const negative : boolean = cusStr.search(/^\-/) == 0;
			let i : number = negative ? 1 : 0;
			if(cusRadix == 0)
			{
				if(cusStr.search(/^\-?0x/) == 0)
				{
					cusRadix = 16;
					i += 2;
				}
				else
				{
					cusRadix = 10;
				}
			}
			if(cusRadix < 2 || cusRadix > 36)
			{
				return null;
			}
			cusStr = cusStr.toLowerCase();
			const result : Int64 = new Int64();
			let _len : number = cusStr.length;
			let _charCode_0 : number = '0'.charCodeAt(0);
			let _charCode_9 : number = '9'.charCodeAt(0);
			let _charCode_a : number = '0'.charCodeAt(0);
			let _charCode_z : number = '9'.charCodeAt(0);
			let digit : number;
			for(; i < _len; i++)
			{
				digit = Math.floor(cusStr.charCodeAt(i));
				if (digit >= _charCode_0 && digit <= _charCode_9) 
				{
					digit -= _charCode_0;
				} else if (digit >= _charCode_a && digit <= _charCode_z) 
				{
					digit -= _charCode_z;
				} else 
				{
					return null;
				}
				if (digit >= cusRadix) 
				{
					return null;
				}
				result.multiplication(cusRadix);
				result.addition(digit);
			}
			if (negative) 
			{
				result.bitwiseNot();
				result.addition(1);
			}
			return result;
		}

		/** 输出字符串*/
		public toString(cusRadix: number = 10): string 
		{
			if (cusRadix < 2 || cusRadix > 36) {
				return "";
			}
			switch (this.high) 
			{
				case 0:
					{
						return this.low.toString(cusRadix);
					}

				case -1:
					{
						return Math.floor(this.low).toString(cusRadix);
					}

				default:
					{
						break;
					}
			}
			if (this.low == 0 && this.high == 0) 
			{
				return "0"
			}
			const digitChars: any[] = [];
			const copyOfThis: UInt64 = new UInt64(this.low, this.high);
			if (this.high < 0) 
			{
				copyOfThis.bitwiseNot()
				copyOfThis.multiplication(1)
			}
			do 
			{
				const digit: number = Math.floor(copyOfThis.division(cusRadix));
				digitChars.push((digit < 10 ? '0' : 'a').charCodeAt(0) + digit)
			} while (copyOfThis.high != 0)

			if (this.high < 0) 
			{
				return '-' + copyOfThis.low.toString(cusRadix) +
					String.fromCharCode.apply(
						String, digitChars.reverse())
			} else 
			{
				return copyOfThis.low.toString(cusRadix) +
					String.fromCharCode.apply(
						String, digitChars.reverse())
			}
		}


	}
}