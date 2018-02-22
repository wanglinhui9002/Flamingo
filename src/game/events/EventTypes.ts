/**
 * 事件常量
 * @author wanglinhui
 * @version 1.0.0
 */
class EventTypes 
{

    /****************************资源加载相关************************************/

	/** 异步加载资源完成*/
	public static GET_RES_ASYNC_COMPLETE: string = "GET_RES_ASYNC_COMPLETE";
	/** 异步加载资源错误*/
	public static GET_RES_ASYNC_ERROR: string = "GET_RES_ASYNC_ERROR";


	/** 异步加载URL资源完成*/
	public static GET_RES_BY_URL_COMPLETE: string = "GET_RES_BY_URL_COMPLETE";
	/** 异步加载URL资源错误*/
	public static GET_RES_BY_URL_ERROR: string = "GET_RES_BY_URL_ERROR";


	/** 加载组完成*/
	public static LOAD_GROUP_COMPLETE: string = "LOAD_GROUP_COMPLETE";
	/** 加载组进度*/
	public static LOAD_GROUP_PROGRESS: string = "LOAD_GROUP_PROGRESS";
	/** 加载组报错*/
	public static LOAD_GROUP_ERROR: string = "LOAD_GROUP_ERROR";

	/********************系统相关**********************/

	/** 解析配置完成*/
	public static readonly DECODE_CONFIG_COMPLETE : string = "decode_config_complete";
	/** 资源加载完毕*/
	public static readonly IMAGE_RES_READY : string = "image_res_ready";
	/** 图片资源加载失败*/
	public static readonly IMAGE_RES_ERROR : string = "image_res_error"


	/*******************socket相关********************/

	/** socket 连接成功 */
	public static readonly SOCKET_CONNECT: string = "socket_connect";
	/** socket 断开*/
	public static readonly SOCKET_CLOSE: string = "socket_close";
	/** socket 重新连接成功*/
	public static readonly SOCKET_RECONNECT: string = "socket_reconnect";
	/** 请求连接socket*/
	public static readonly REQUEST_CONNECT_SOCKET : string = "request_connect_socket";


	/********************登入相关*********************/

	/** 请求用户信息*/
	public static readonly REQUEST_USER_DATA : string = "request_user_data";
	/** 请求服务器列表*/
	public static readonly REQUEST_SERVER_LIST : string = "request_server_list";
	/** 登入*/
	public static readonly LOGIN : string = "login";
	/** 重新登入*/
	public static readonly RELOGIN : string = "relogin";
	/** 开始游戏*/
	public static readonly GAME_START : string = "game_start";


	/*********************************场景相关***********************************/

	/** 初始化图块数据完成*/
	public static readonly INIT_TILE_DATA_COMPLETE : string = "init_tile_data_complete";
	/** 摄像机位置改变*/
	public static readonly CAMERA_POSITION_CHANGE : string = "camera_position_change";
	/** 准备进入场景*/
	public static readonly READY_TO_ENTER_WORLD : string = "ready_to_enter_world";
	/** 进入场景完成*/
	public static readonly ENTER_WORLD_COMPLETE : string = "enter_world_complete";
	/** 地图焦点改变*/
	public static readonly MAP_FOCUS_CHANGE : string = "map_focus_change";

}