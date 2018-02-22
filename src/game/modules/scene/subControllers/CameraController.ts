module scene 
{
	/**
	 * 摄像机控制器
	 */
	export class CameraController extends core.Controller
	{

		/** instance*/
		private static mInstance : CameraController;
		public static getInstance() : CameraController
		{
			if(CameraController.mInstance == null)
			{
				CameraController.mInstance = new CameraController();
			}
			return CameraController.mInstance;
		}

		public constructor() 
		{
			super();
		}

		/** 初始化*/
		public initialize() : void
		{
			super.initialize();
			GlobalUtils.TickUtil.addTickListener(core.TickUtil.TIMER_TYPE, 1, 0, this, this.step);
		}

		/** 添加模块间事件*/
		protected addNotification() : void 
		{
			this.mDispatcher.addEventListener(EventTypes.READY_TO_ENTER_WORLD, this.onReadyToEnterHandler, this);
		}

		/** 大循环*/
		private step() : void
		{
			if(GlobalManagers.cameraManager.needCameraMove == true)
			{
				let _point : egret.Point = GlobalManagers.cameraManager.rolePosition;
				if(_point && GlobalManagers.cameraManager.cameraPosition.equals(_point) == false)
				{
					GlobalManagers.cameraManager.cameraPosition = _point;
					GlobalUtils.EventDispatcher.dispatchEvent(EventTypes.CAMERA_POSITION_CHANGE, false, false, _point);
					GlobalManagers.cameraManager.needCameraMove = false;
				}
			}
		}

		/** 准备进入场景*/
		private onReadyToEnterHandler(event : egret.Event) : void
		{

		}

		private updateRolePosition() : void
		{
			let _mapInfoVo : MapInfoVo = GlobalManagers.sceneManager.mapInfoVo;
			if(_mapInfoVo == null)
			{
				return;
			}
			// if()
			// {

			// }
			// else
			// {

			// }
		}


		public test(cusPoint : egret.Point) : void
		{
			this.updataPosition(cusPoint);
			GlobalManagers.cameraManager.needCameraMove = true;
		}

		/** 更新位置*/
		private updataPosition(cusPoint : egret.Point) : void
		{
			let _mapInfoVo : MapInfoVo = GlobalManagers.sceneManager.mapInfoVo;
			let _mapWidth : number = _mapInfoVo.mapWidth;
			let _mapHeight : number = _mapInfoVo.mapHeight;
			let _stageWidth : number = GlobalUtils.StageProxy.width;
			let _stageHeight : number = GlobalUtils.StageProxy.height;
			let _focusPoint : egret.Point = new egret.Point();
			let _cusPoint : egret.Point = cusPoint.clone();
			if(_stageWidth > _mapWidth)
			{
				_focusPoint.x = (_stageWidth - _mapWidth) >> 1;
			}
			else
			{
				if (_cusPoint.x < (_stageWidth >> 1))
				{
					_focusPoint.x = 0;
				} 
				else
				{
					if (_cusPoint.x > (_mapWidth - (_stageWidth >> 1)))
					{
						_focusPoint.x = _mapWidth - _stageWidth;
					} 
					else
					{
						_focusPoint.x = _cusPoint.x - (_stageWidth >> 1);
					}
				}
			}
			if (_stageHeight > _mapHeight)
			{
				_focusPoint.y =  - ((_stageHeight - _mapHeight) >> 1);
			} 
			else
			{
				if (_cusPoint.y < (_stageHeight >> 1))
				{
					_focusPoint.y = 0;
				} 
				else
				{
					if (_cusPoint.y > (_mapHeight - (_stageHeight >> 1)))
					{
						_focusPoint.y = _mapHeight - _stageHeight;
					} 
					else
					{
						_focusPoint.y = _cusPoint.y - (_stageHeight >> 1);
					}
				}
			}
			GlobalManagers.cameraManager.rolePosition = _focusPoint;
		}


	}
}