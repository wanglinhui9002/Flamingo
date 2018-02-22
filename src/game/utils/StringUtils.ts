class StringUtil {
	/**
	 * 使用传入的各个参数替换指定的字符串内的“{n}”标记
	 * @param  {string} cusStr	要在其中进行替换的字符串。该字符串可包含 {n} 形式的特殊标记，其中 n 为从零开始的索引，它将被该索引处的其他参数（如果指定）替换
	 * @param  {} ...args	可在 str 参数中的每个 {n} 位置被替换的其他参数，其中 n 是一个对指定值数组的整数索引值（从 0 开始）。如果第一个参数是一个数组，则该数组将用作参数列表。如此可允许在其他想要使用... rest 签名的方法中重复使用此例程
	 * @returns string
	 */
	public static substitute(cusStr: string, ...args): string {
		for (let _i = 0; _i < args.length; _i++) {
			let _regExp:RegExp = new RegExp("\\{" + _i + "\\}","g");
			cusStr = cusStr.replace(_regExp, args[_i]);
		}
		return cusStr;
	}

	public static substituteArr(cusStr: string,args:Array<any>): string 
	{
		if (args.length > 0) 
        {    
            if(args instanceof Array) 
            {
                for (let i:number = 0; i < args.length; i++) 
                {
                    if (args[i] != undefined) 
                    {
						let _regExp:RegExp = new RegExp("\\{" + i + "\\}","g");
						cusStr = cusStr.replace(_regExp, args[i]);
					}
				}
			}
		}
		return cusStr;
	}
}