/**
 * 全局数据接口
 * @author wanglinhui
 * @version 1.0.0
 */

 class GlobalManagers
 {
	/** 舞台引用*/
	private static mStage : egret.Stage;
	/** 网页参数管理器*/
	public static webParamsManager : WebParamsManager;
	/** 层级管理器 */
	public static layerManager : LayerManager;
	/** 消息包管理器*/
	public static packageManager : webSocket.PackageManager;
	/** 登入*/
	public static loginManager : login.LoginManager;
	/** 场景*/
	public static sceneManager : scene.SceneManager;
	/** 摄像机数据*/
	public static cameraManager : scene.CameraManager;
	/** url*/
	public static urlManager : core.URLManager;

	/** 启动*/
	public static setup(tStage : egret.Stage) : void
	{
		GlobalManagers.mStage = tStage;

		GlobalManagers.webParamsManager = WebParamsManager.getInstance();			//网页参数
		GlobalManagers.layerManager = LayerManager.getInstance();					//游戏层级
		GlobalManagers.layerManager.setup(tStage);
		GlobalManagers.packageManager = webSocket.PackageManager.getInstance();		//网络包管理器
		GlobalManagers.loginManager = login.LoginManager.getInstance();				//登入
		GlobalManagers.sceneManager = scene.SceneManager.getInstance();				//场景
		GlobalManagers.cameraManager = scene.CameraManager.getInstance();			//摄像机
		GlobalManagers.urlManager = core.URLManager.getInstance();					//url
	}

	/** 解析配置*/
	public static parseConfig() : void
	{
		let _bufferArray : ArrayBuffer = GlobalUtils.RESProxy.getRes("res_mpt");
		let _uint8Array : Uint8Array = new Uint8Array(_bufferArray);
		let _inflate : Zlib.Inflate = new Zlib.Inflate(_uint8Array);
		let _deplain : any = _inflate.decompress();
		let _configData : egret.ByteArray = new egret.ByteArray(_deplain);
		_configData.endian = egret.Endian.LITTLE_ENDIAN;
		this.decodeStep(_configData, _deplain.length);
	}

	/** 解析配置*/
	private static decodeStep(cusData : egret.ByteArray, cusEndIndex : number) : void
	{
		if(cusData.position >= cusEndIndex)
		{
			GlobalUtils.EventDispatcher.dispatchEvent(EventTypes.DECODE_CONFIG_COMPLETE);
		}
		else
		{
			let _startTime : number = egret.getTimer();
			let _name : string;
			let _data : string;
			let _len : number;
			while(egret.getTimer() - _startTime < 10)
			{
				_name = cusData.readUTF().slice(0, -5);
				_len = cusData.readInt();
				_data = cusData.readUTFBytes(_len);
				this.decode(_name, JSON.parse(_data));
				if(cusData.position >= cusEndIndex)
				{
					GlobalUtils.EventDispatcher.dispatchEvent(EventTypes.DECODE_CONFIG_COMPLETE);
					return;
				}
			}
		}
		egret.setTimeout(this.decodeStep, this, 34, cusData, cusEndIndex);
	}

	/** 解析数据*/
	private static decode(cusName : string, cusData : any) : void
	{
		switch(cusName)
		{
			case "scene":
				GlobalManagers.sceneManager.parseConfigData(cusData);
				break;
		}
	}

 }