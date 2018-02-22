/**
 * 游戏启动控制器
 */
class StartController extends core.Controller 
{

	/** instance*/
	private static mInstance : StartController;
	public static getInstance() : StartController
	{
		if(this.mInstance == null)
		{
			this.mInstance = new StartController();
		}
		return this.mInstance;
	}

	/** 回调列表*/
	private mCallBackList : Array<core.Controller> = [];
	/** 回调列表长度*/
	private mCallBackLength : number = 0;

	public constructor() 
	{
		super();
	}

	/** 初始化*/
	public initialize() : void
	{
		this.registerStartController();
		this.addNotification();
	}

	/** 添加模块间事件*/
	protected addNotification() : void
	{
		this.mDispatcher.addEventListener(EventTypes.GAME_START, this.onGameStartHandler, this);
	}

	/** 游戏启动事件*/
	private onGameStartHandler(event : egret.Event) : void
	{
		this.mDispatcher.removeEventListener(EventTypes.GAME_START, this.onGameStartHandler, this);
		GlobalUtils.TickUtil.addTickListener(core.TickUtil.TIMER_TYPE, 1, 0, this, this.onTimerHandler);
		this.onTimerHandler();
	}

	/** 注册控制器*/
	private registerStartController() : void
	{
		this.initController(login.LoginController.getInstance());
		this.initController(scene.SceneController.getInstance(), true);
	} 

	/** 初始化列表*/
	private initController(cusController : core.Controller, cusStartCallBack : boolean = false) : void
	{
		cusController.initialize();
		if(cusStartCallBack)
		{
			this.mCallBackList.push(cusController);
			this.mCallBackLength ++;
		}
	}

	/** 计时器*/
	private onTimerHandler() : void
	{
		if(this.mCallBackLength > 0)
		{
			let _controller : core.Controller = this.mCallBackList.shift() as core.Controller;
			if(_controller)
			{
				_controller.gameStartCallBack();
			}
			this.mCallBackLength --;
		}
		if(this.mCallBackLength <= 0)
		{
			GlobalUtils.TickUtil.removeTickListener(core.TickUtil.TIMER_TYPE, this, this.onTimerHandler);
			this.mCallBackList = null;
		}
	}


}