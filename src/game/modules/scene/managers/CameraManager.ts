module scene 
{
	/**
	 * 摄像机数据管理器
	 */
	export class CameraManager 
	{

		/** instance*/
		private static mInstance : CameraManager;
		public static getInstance() : CameraManager
		{
			if(null == CameraManager.mInstance)
			{
				CameraManager.mInstance = new CameraManager();
			}
			return CameraManager.mInstance;
		}

		/** 主角位置*/
		private mRolePosition : egret.Point;
		/** 摄像机焦点*/
		private mCameraPosition : egret.Point = new egret.Point();
		/** 是否需要移动镜头*/
		private mNeedCameraMove : boolean = false;
		/** 自定义位置*/
		private mTargetPosition : egret.Point;
		/** 摄像机移动速度*/
		private mMoveSpeed : number;

		public constructor() 
		{
		}

		/** 获取角色位置*/
		public get rolePosition() : egret.Point { return this.mRolePosition; }
		/** 设置角色位置*/
		public set rolePosition(cusPoint : egret.Point) { this.mRolePosition = cusPoint; }

		/** 获取摄像机位置*/
		public get cameraPosition() : egret.Point { return this.mCameraPosition; }
		/** 设置摄像机位置*/
		public set cameraPosition(cusPoint : egret.Point) { this.mCameraPosition = cusPoint; }

		/** 获取目标点位置*/
		public get targetPosition() : egret.Point { return this.mTargetPosition; }
		/** 设置目标点位置*/
		public set targetPosition(cusPoint : egret.Point) { this.mTargetPosition = cusPoint; }

		/** 获取摄像机移动速度*/
		public get moveSpeed() : number { return this.mMoveSpeed; }
		/** 设置摄像机移动速度*/
		public set moveSpeed(cusSpeed : number) { this.mMoveSpeed = cusSpeed; }

		/** 获取是否需要移动摄像机*/
		public get needCameraMove() : boolean { return this.mNeedCameraMove; }
		/** 设置是否需要移动摄像机*/
		public set needCameraMove(cusMove : boolean) { this.mNeedCameraMove = cusMove; }
 
	}
}