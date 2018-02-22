/**
 * WebSocket
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
	export class WebSocket extends egret.WebSocket
	{
		/** 消息计数器结束值*/
		private static MAX_COUNT_NUM: number = 127;
		/** 消息计数器开始值*/
		private static MIN_COUNT_NUM: number = 0;

		/** instance*/
		private static mInstance : WebSocket;
		public static getInstance() : WebSocket
		{
			if(null == WebSocket.mInstance)
			{
				WebSocket.mInstance = new WebSocket();
			}
			return WebSocket.mInstance;
		}

		/** 最近一次回调时间*/
		private mCallBackTime : number;
		/** 消息计数*/
		private mCmdCount : number = WebSocket.MIN_COUNT_NUM;
		/** 接收到的数据列表*/
		private mPackageInVoList : Array<PackageInVo> = [];
		/** 回调列表*/
		private mCallBackMap: {[key : number] : Array<CallBackVo>} = [];

		public constructor() 
		{
			super();
		}

		/** 连接服务器*/
		public connect(cusHost : string, cusPort : number) : void
		{
			this.type = WebSocket.TYPE_BINARY;
			this.initEvents();
			this.startTick();
			this.mCallBackTime = egret.getTimer();
			super.connect(cusHost, cusPort);
		}

		/** 初始化事件*/
		private initEvents() : void
		{
			this.addEventListener(egret.Event.CONNECT, this.onSocketConnectHandler, this);
			this.addEventListener(egret.Event.CLOSE, this.onSocketCloseHandler, this);
			this.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketDataHandler, this);
		}

		/** 移除事件*/
		private removeEvents() : void
		{
			this.removeEventListener(egret.Event.CONNECT, this.onSocketConnectHandler, this);
			this.removeEventListener(egret.Event.CLOSE, this.onSocketCloseHandler, this);
			this.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketDataHandler, this);
		}

		/** 开始计时*/
		private startTick() : void
		{
			GlobalUtils.TickUtil.addTickListener(core.TickUtil.FRAME_TYPE, 1, 0, this, this.onTickHandler);
		}

		/** 连接成功*/
		private onSocketConnectHandler(event : egret.Event) : void
		{
			egret.log("socket connect----->");
		}

		/** 断开连接*/
		private onSocketCloseHandler(event : egret.Event) : void
		{
			this.removeEvents();
			GlobalUtils.TickUtil.removeTickListener(core.TickUtil.FRAME_TYPE, this, this.onTickHandler);
			egret.log("socket close----->");
		}

		/** 收到数据*/
		private onSocketDataHandler(event : egret.ProgressEvent) : void
		{
			let _byteArray : ByteArray = ByteArray.createByteArray();//new ByteArray();
			this.readBytes(_byteArray);

			let _prototype : number = _byteArray.readUnsignedShort();
			this.checkData(_prototype, _byteArray);
		}

		/** 处理数据*/
		private checkData(cusPrototype : number, cusByteArray : ByteArray) : void
		{
			let _packageIn : IPackageIn = GlobalManagers.packageManager.getPackageIn(cusPrototype);
			if(null != _packageIn)
			{
				_packageIn.deserialization(cusByteArray);
				let _packageInVo : PackageInVo = PackageInVo.create();
				_packageInVo.setData(cusPrototype, _packageIn)
				this.mPackageInVoList.push(_packageInVo);
			}
		}

		/** 计时器处理函数 */
		private onTickHandler() : void
		{
			/**分帧处理暂时先屏蔽,如果效率有问题再把逻辑补全 */
			// let _now : number = egret.getTimer();
			// let _maxCallTime : number;
			// if(_now - this.mCallBackTime > 100)
			// {
			// 	_maxCallTime = 200;
			// }
			// else
			// {
			// 	_maxCallTime = 10;
			// }
			let _packageInVo : PackageInVo;
			let _callBackList : Array<CallBackVo>;
			while(this.mPackageInVoList.length > 0)
			{
				_packageInVo = this.mPackageInVoList.shift();
				_callBackList = this.mCallBackMap[_packageInVo.protocolType];
				if(_callBackList && _callBackList.length > 0)
				{
					for(let _callBackVo of _callBackList)
					{
						_callBackVo.execute(_packageInVo.packageIn);
					}
				}
				_packageInVo.reset();
			}
		}

		/** 添加协议监听*/
		public addPackageListener(cusPackageIn : any, cusCallBack : Function, cusContext : any) : void
		{
			let _protocolType : number = cusPackageIn.PROTOCOL_TYPE;
			let _callBackList : Array<CallBackVo> = this.mCallBackMap[_protocolType];
			if( _callBackList == null)
			{
				_callBackList = [];
			}
			for(let _callBackVo of _callBackList)
			{
				if(_callBackVo.callBack == cusCallBack && _callBackVo.context == cusContext)
				{
					return;
				}
			}
			GlobalManagers.packageManager.registerPackageInCls(cusPackageIn);
			let _vo : CallBackVo = CallBackVo.create();
			_vo.setData(cusContext, cusCallBack);
			_callBackList.push(_vo);
			this.mCallBackMap[_protocolType] = _callBackList;
		}

		/** 移除协议监听*/
		private removePackageListener(cusPackageIn : any, cusCallBack : Function, cusContext : any) : void
		{
			let _protocolType : number = cusPackageIn.PROTOCOL_TYPE;
			let _callBackList : Array<CallBackVo> = this.mCallBackMap[_protocolType];
			let _len : number = _callBackList.length;
			let _callBackVo : CallBackVo;
			for(let i : number = 0; i < _len; i++)
			{
				_callBackVo = _callBackList[i];
				if(_callBackVo.callBack == cusCallBack && _callBackVo.context == cusContext)
				{
					_callBackList.splice(i, 1);
					if(_callBackList.length == 0)
					{
						delete this.mCallBackMap[_protocolType]
					}
					_callBackVo.reset();
					return;
				}
			}
		}

		/** 发送消息*/
		public send(cusProtocolType : number, cusPackageOut ?: IPackageOut) : void
		{
			if(this.connected == false)
			{
				return;
			}
			let _byteArray : egret.ByteArray = ByteArray.createEgretByteArray();
			_byteArray.writeUnsignedShort(cusProtocolType);
			_byteArray.writeByte(this.mCmdCount);

			if(null != cusPackageOut)
			{
				let _datas : ByteArray = ByteArray.createByteArray();
				cusPackageOut.serialization(_datas);
				_byteArray.writeBytes(_datas);

				cusPackageOut.reset();
				_datas.reset();
			}

			this.mCmdCount += 2;
			if (this.mCmdCount > WebSocket.MAX_COUNT_NUM)
			{
				this.mCmdCount = WebSocket.MIN_COUNT_NUM;
			}

			this.writeBytes(_byteArray);
			this.flush();
			ByteArray.resetEgretByteArray(_byteArray);
		}

	}


	class PackageInVo
	{	
		/** 回调数据对象池*/
		private static mPool : Array<PackageInVo> = [];
		/** 协议号*/
		private mProtocolType : number;
		/** 协议*/
		private mPackageIn : IPackageIn;

		public constructor()
		{
		}

		/** 设置数据*/
		public setData(cusProtocolType : number, cusPackageIn : IPackageIn) : void
		{
			this.mProtocolType = cusProtocolType;
			this.mPackageIn = cusPackageIn;
		}

		/** 获取协议号*/
		public get protocolType() : number { return this.mProtocolType; }
		public get packageIn() : IPackageIn { return this.mPackageIn; }

		/** 创建PackageInVo实例*/
		public static create() : PackageInVo
		{
			let _packageInVo : PackageInVo = PackageInVo.mPool.pop();
			if(_packageInVo == null)
			{
				_packageInVo = new PackageInVo();
			}
			return _packageInVo;
		}

		/** 重置数据*/
		public reset() : void
		{
			this.mProtocolType = 0;
			this.mPackageIn.reset();
			this.mPackageIn = null;
			PackageInVo.mPool.push(this);
		}
	}


	class CallBackVo
	{
		/** 对象池*/
		private static mPool : Array<CallBackVo> = []
		/** 回调函数的环境*/
		private mContext : any;
		/** 回调函数*/
		private mCallBack : Function;

		public constructor()
		{
		}

		/** 设置回调数据*/
		public setData(cusContext : any, cusCallBack : Function) : void
		{
			this.mContext = cusContext;
			this.mCallBack = cusCallBack;
		}

		/** 执行*/
		public execute(cusPackageIn : IPackageIn) : void
		{
			this.callBack.apply(this.context, [cusPackageIn]);
		}

		/** 获取回调环境*/
		public get context() : any { return this.mContext; }
		/** 获取回调函数*/
		public get callBack() : Function { return this.mCallBack; }

		/** 创建CallBackVo实例*/
		public static create() : CallBackVo
		{
			let _callBackVo : CallBackVo = CallBackVo.mPool.pop();
			if(null == _callBackVo)
			{
				_callBackVo = new CallBackVo();
			}
			return _callBackVo;
		}

		/** 重置数据*/
		public reset() : void
		{
			this.mContext = null;
			this.mCallBack = null;
			CallBackVo.mPool.push(this);
		}

	}

}