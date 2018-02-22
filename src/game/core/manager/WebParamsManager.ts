/**
 * 网页参数管理器
 * @author wanglinhui
 * @version 1.0.0
 */
class WebParamsManager
{
	/**
	 * instance
	 */
	private static mInstance : WebParamsManager;
	public static getInstance() : WebParamsManager
	{
		if(null == WebParamsManager.mInstance)
		{
			WebParamsManager.mInstance = new WebParamsManager();
		}
		return WebParamsManager.mInstance;
	}

	/** 平台登录id(帐号)*/		
	public accid : string;
	/** 平台登录账户名称 (也就是平台的udbid)*/		
	public accname : string;
	/** 时间戳*/		
	public timestamp : number = 0;
	/** 验证字符串*/		
	public ticket : string;
	/** 防沉迷： 0:未满18岁，1:已满18岁，2:未填写资料*/		
	public prevent : number = 0;
	/** 玩家账号状态.0--无账号，需要创建.1--有账号，直接进入游戏.2--测试账号登陆.*/		
	public status : number = 0;
	/** 平台名*/		
	public site : string;
	/** 所在服ID*/		
	public serverid : number = 0;
    /** 所在服ID*/		
	public cdn_url : string;
	/** 版本号*/
	public mainVersion : string = "";

	///////////////
	// ip、端口
	//////////////
	/** ip地址*/
	public ip : string = "";
	/** 端口*/
	public port : number = 0;


    /**
	 * 解析页面信息数据
	 * @param  {any} tParams
	 */
	public decodeParams(tParams : any) : void
	{
		this.accid = tParams.userid;
        this.accname = tParams.accname;
        this.timestamp = tParams.timestamp;
        this.ticket = tParams.ticket;
        this.site = tParams.site;
        this.serverid = tParams.server_id;
        this.ip = tParams.ip;
        this.port = tParams.port;

        if(tParams.cdn_url != null)
        {
            this.cdn_url = tParams.cdn_url;
        }
		if(tParams.version != null)
		{
			this.mainVersion = tParams.version;
		}
	}
}