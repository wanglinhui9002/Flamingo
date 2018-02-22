module core 
{
	export class UInt64 extends Binary64
	{
		public constructor(low: number = 0, high: number = 0) 
		{
			super(low, high);
		}

		public toString(radix: number = 10): string {
			if (radix < 2 || radix > 36) {
				return "";
			}
			if (this.high == 0) {
				return this.low.toString(radix)
			}
			const digitChars: any[] = [];
			const copyOfThis: UInt64 = new UInt64(this.low, this.high);
			do {
				const digit: number = Math.floor(copyOfThis.division(radix));
				digitChars.push((digit < 10 ? '0' : 'a').charCodeAt(0) + digit)
			} while (copyOfThis.high != 0)
			return copyOfThis.low.toString(radix) +
				String.fromCharCode.apply(
					String, digitChars.reverse())
		}
		
		public static parseUInt64(str: string, radix: number = 0): UInt64 
		{
			let i: number = 0
			if (radix == 0) {
				if (str.search(/^0x/) == 0) {
					radix = 16
					i = 2
				} else {
					radix = 10
				}
			}
			if (radix < 2 || radix > 36) {
				return null;
			}
			str = str.toLowerCase()
			const result: UInt64 = new UInt64
			for (; i < str.length; i++) {
				let digit: number = str.charCodeAt(i)
				if (digit >= '0'.charCodeAt(0) && digit <= '9'.charCodeAt(0)) {
					digit -= '0'.charCodeAt(0)
				} else if (digit >= 'a'.charCodeAt(0) && digit <= 'z'.charCodeAt(0)) {
					digit -= 'a'.charCodeAt(0)
				} else {
					return null;
				}
				if (digit >= radix) {
					return null;
				}
				result.multiplication(radix)
				result.addition(digit)
			}
			return result
		}
	}
}