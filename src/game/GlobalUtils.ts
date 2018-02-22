/**
 * 全局工具接口
 * @author wanglinhui
 * @version 1.0.0
 */
class GlobalUtils 
{

	public static isDebug : boolean = false;

	/** 计时器管理器*/
	public static TickUtil : core.TickUtil;
	/** 游戏事件中心*/
	public static EventDispatcher : core.GameEventDispatcher;
	/** RES代理*/
	public static RESProxy : core.RESProxy;
	/** webSocket*/
	public static WebSocket : core.WebSocket;
	/** 舞台引用*/
	public static StageProxy : core.StageProxy;
	/** 地图信息缓存*/
	public static mapInfoCache : scene.MapCache;

	public constructor() 
	{
	}

	/**
 	 * 启动
 	 */
 	public static setup(tStage : egret.Stage) : void
 	{
		GlobalUtils.TickUtil 			= core.TickUtil.getInstance();
		GlobalUtils.EventDispatcher 	= core.GameEventDispatcher.getInstance();
		GlobalUtils.RESProxy 			= core.RESProxy.getInstance();
		GlobalUtils.WebSocket 			= core.WebSocket.getInstance();
		GlobalUtils.StageProxy			= core.StageProxy.getInstance();
		GlobalUtils.StageProxy.setup(tStage);
		GlobalUtils.mapInfoCache		= scene.MapCache.getInstance();
	}
}