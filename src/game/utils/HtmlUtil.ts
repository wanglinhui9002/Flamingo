class HtmlUtil 
{
	/** 给一段字符串添加Html颜色控制*/
	public static color(cusString : string, cusColror : string) : string
	{
		return "<font color=\'" + cusColror + "\'>" + cusString + "</font>";
	}

	/** 添加图片html标签.*/
	public static image(cusUrl : string, cusHSpace : number = 0, cusVSpace : number = 0, cusAlign : string = "right", cusWidth : number = 65, cusHeight : number = 65) : string
	{
		return "<img src = '" + cusUrl + "' hspace = '" + cusHSpace + "' vspace = '" + cusVSpace + "' align = '" + cusAlign + "' width = '" + cusWidth + "' height = '" + cusHeight + "'>";
	}

	/** 设定文字大小以及颜色*/
	public static sizeColor(cusStr : string, cusColor : string = null, cusSize : number = 0) : string
	{
		let _result : string = "<font ";
		if(cusSize != 0)
		{
			_result = _result + "size=\'" + cusSize + "\' ";
		}
		if(cusColor != null)
		{
			_result = _result + "color=\'" + cusColor + "\' ";
		}
		_result = _result + ">" + cusStr + "</font>";
		return _result;
	}

	/** 加粗*/
	public static bold(cusStr : string) : string
	{
		return "<b>" + cusStr + "</b>";
	}

	/** 下划线*/
	public static u(cusStr : string) : string 
	{
		return "<u>" + cusStr + "</u>";
	}

	/** 设置垂直间距*/
	public static leading(cusValue: number, cusStr: string) : string 
	{
		return "<textformat leading='" + cusValue.toString() + "'>" + cusStr + "</textformat>";
	}

	/** 设置字与字的间距*/
	public static letterspacing(cusValue : number, cusStr : string) : string 
	{
		return "<font LETTERSPACING='" + cusValue.toString() + "'>" + cusStr + "</font>";
	}

	/** 换行*/
	public static br(cusStr : string) : string 
	{
		return cusStr + "\n";
	}

	/** 移除html标签*/
	public static removeHtml(cusStr : string) : string 
	{
		let _result: string = cusStr.replace(/\<\/?[^\<\>]+\>""\<\/?[^\<\>]+\>/gmi, "");
		_result = _result.replace(/[\r\n ]+""[\r\n ]+/g, "");
		return _result;
	}

	/** 添加超链接*/
	public static href(cusStr : string, cusEvent : string, cusColor: string = "#FF0000") : string
	{
		return "<a href=\"event:" + cusEvent + "\"><font color=\'" + cusColor + "\'>" + cusStr + "</font></a>";
	}

	/** 超链接（没超文本颜色）*/
	public static hrefNoColor(cusStr: string, cusEvent: string) : string
	{
		return "<a href=\"event:" + cusEvent + "\">" + cusStr + "</a>";
	}

	/** 有下划线的超链接（没超文本颜色）*/
	public static hrefAndUWithOutColor(cusStr : string, cusEvent : string) : string
	{
		return "<u><a href=\"event:" + cusEvent + "\">" + cusStr + "</a></u>";
	}

	/** 超链接和下划线*/
	public static hrefAndU(cusStr : string, cusEvent : string, cusColor : string = "#FF0000") : string
	{
		return "<u>" + this.href(cusStr, cusEvent, cusColor) + "</u>";
	}

	/** 超链接和下划线同时加粗*/
	public static hrefAndUWithBold(cusStr : string, cusEvent : string, cusColor : string = "#FF0000") : string 
	{
		return "<u>" + this.href("<b>" + cusStr + "</b>", cusEvent, cusColor) + "</u></b>";
	}

	/** 设定间隔*/
	public static makeLeading(cusStr : string, cusLeading : number = 5) : string 
	{
		return "<textformat leading=\'" + cusLeading + "\'>" + cusStr + "</textformat>";
	}

	/** 段落，字符串*/
	public static pStr(cusStr : string, cusAlign : string = "left") : string 
	{
		return "<p align=\'" + cusAlign + "\'>" + cusStr + "</p>";
	}

	/** 解析富本文格式*/
	public static parser(cusStr : string) : egret.ITextElement[]
	{
		return (new egret.HtmlTextParser()).parser(cusStr);
	}

	/** 字体*/
	public static getFontFamily():string
	{
		return "SimHei";
	}


}