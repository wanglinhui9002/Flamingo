module core 
{
	/**
	 * 文本框
	 */
	export class Label extends eui.Label
	{	
		/** 缓存池*/
		private static CACHE_POOL : Array<Label> = [];
		public static create() : Label
		{
			let _label : Label = Label.CACHE_POOL.pop();
			if(_label == null)
			{
				_label = new Label();
			}
			return _label;
		}


		public constructor(cusText ?: string) 
		{
			super(cusText);
			this.fontFamily = "SimHei";
		}

		/** 这是html文本*/
		public set htmlText(cusText : string)
		{
			let _textFlow : egret.ITextElement[] = HtmlUtil.parser(cusText);
			this.textFlow = _textFlow;
		}

		/** 摧毁并放入缓存池*/
		public dispose() : void
		{
			this.textColor = 0xffffff;
			this.text = "";
			this.htmlText = "";
			this.x = 0;
			this.y = 0;
			this.scaleX = this.scaleY = 1;
			Label.CACHE_POOL.push(this);
			this.textAlign = "left";
		}


	}
}