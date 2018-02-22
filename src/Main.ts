class Main extends eui.UILayer
{
	public constructor()
	{
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddtoStageHandler, this);
	}

	/** 添加到舞台*/
	private onAddtoStageHandler(event : egret.Event) : void
	{
		this.initialize();
	}

	/** 初始化游戏*/
	private initialize() : void
	{
		GlobalManagers.setup(this.stage);
		GlobalUtils.setup(this.stage);

		let _main : MainController = MainController.getInstance();
		_main.setup();
	}

}