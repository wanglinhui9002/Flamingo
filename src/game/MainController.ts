/**
 * 游戏启动逻辑
 */
class MainController
{
	/** instance*/
	private static mInstance : MainController;
	public static getInstance() : MainController
	{
		if(null == MainController.mInstance)
		{
			MainController.mInstance = new MainController();
		}
		return MainController.mInstance;
	}

	public constructor() 
	{ 
		StartController.getInstance().initialize();
		let _params : any = (<any>window).parameters;
		if(null == _params)
		{
			GlobalUtils.isDebug = true;
			_params = 
			{
				"userid" : 1000,
				"accname" : "weisili",
				"timestamp" : 1321946166,
				"ticket" : "92d68ee00c6a8d52ec16b3bb9df3bd8e",
				"site" : "cy",
				"serverid" : 90301004,
				// "ip" : 
			}
		}
		GlobalManagers.webParamsManager.decodeParams(_params);
	}

	/** 启动*/
	public setup() : void
	{
		this.loadDefaultConfig();
	}

	/** 加载默认配置*/
	private loadDefaultConfig() : void
	{
		GlobalUtils.RESProxy.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onDefaultConfigHandler, this);
		GlobalUtils.RESProxy.loadConfig("resource/default.res.json", "resource/");
	}

	/** 加载默认配置完成*/
	private onDefaultConfigHandler(event : RES.ResourceEvent) : void
	{
		GlobalUtils.RESProxy.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onDefaultConfigHandler, this);
		// this.loadPreLoadRes();
		this.loadMustRes();
	}

	/** 预加载资源*/
	private loadPreLoadRes() : void
	{
		GlobalUtils.RESProxy.addEventListener(EventTypes.LOAD_GROUP_COMPLETE, this.onPreLoadCompleteHandler, this);
		GlobalUtils.RESProxy.addEventListener(EventTypes.LOAD_GROUP_PROGRESS, this.onPreLoadProgressHandler, this);
		GlobalUtils.RESProxy.loadGroup("preload");
	}

	/** 预加载资源完成*/
	private onPreLoadCompleteHandler(event : egret.Event) : void
	{
		let _groupName : string = event.data;
		if(_groupName == "preload")
		{
			GlobalUtils.RESProxy.removeEventListener(EventTypes.LOAD_GROUP_COMPLETE, this.onPreLoadCompleteHandler, this);
			GlobalUtils.RESProxy.removeEventListener(EventTypes.LOAD_GROUP_PROGRESS, this.onPreLoadProgressHandler, this);
			this.initEui();
		}
	}

	/** 预加载资源进度*/
	private onPreLoadProgressHandler(event : egret.Event) : void
	{
	}

	/** 初始化eui*/
	private initEui() : void
	{
		//注入自定义的素材解析器
		egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

		let _theme : eui.Theme = new eui.Theme("resource/default.thm.json", GlobalUtils.StageProxy.stage);
		_theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadCompleteHandler, this);
	}

	/** ui主题加载完成*/
	private onThemeLoadCompleteHandler(event : eui.UIEvent) : void
	{
		egret.log("eui theme init complete!");
	}

	/** 加载必须资源*/
	private loadMustRes() : void
	{
		GlobalUtils.RESProxy.addEventListener(EventTypes.LOAD_GROUP_COMPLETE, this.onMustLoadCompleteHandler, this);
		GlobalUtils.RESProxy.addEventListener(EventTypes.LOAD_GROUP_PROGRESS, this.onMustLoadProgressHandler, this);
		GlobalUtils.RESProxy.loadGroup("must");
	}

	/** 进入游戏必须资源加载完毕*/
	private onMustLoadCompleteHandler(event : egret.Event) : void
	{
		let _groupName = event.data;
		if(_groupName == "must")
		{
			GlobalUtils.RESProxy.removeEventListener(EventTypes.LOAD_GROUP_COMPLETE, this.onMustLoadCompleteHandler, this);
			GlobalUtils.RESProxy.removeEventListener(EventTypes.LOAD_GROUP_PROGRESS, this.onMustLoadProgressHandler, this);

			GlobalManagers.parseConfig();

			GlobalUtils.EventDispatcher.dispatchEvent(EventTypes.GAME_START);
		}
	}

	/** 进入游戏必须资源加载进度*/
	private onMustLoadProgressHandler(event : egret.Event) : void
	{
	}



}