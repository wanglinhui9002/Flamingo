/**
 * 语言包工具
 */
class Language
{
	/** 语言包数据*/
	private static mData : any;

	public constructor() 
	{
	}

	/** 解析数据*/
	public static parseConfigData(cusData : any) : void
	{
		this.mData = cusData;
	}

	/** 获取配置描述*/
	public static getLanguage(cusId : number, ...args) : string
	{
		if(this.mData == null || this.mData[cusId] == undefined)
		{
			return "";
		}
		let _str : string = this.mData[cusId].word;
		if(_str != "")
		{
			if(args != null && args.length > 0)
			{
				_str = StringUtil.substituteArr(_str, args);
			}
			return _str;
		}
		return "";
	}

}