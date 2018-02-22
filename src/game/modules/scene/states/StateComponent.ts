module scene 
{
	export class StateComponent 
	{
		/** 状态机列表*/
		private mStateMap : {[key : string] : IState};
		/** 当前状态*/
		protected mState : IState;

		public constructor() 
		{
			this.init();
		}

		/**
		 * 初始化
		 */
		protected init() : void 
		{ 
			this.mStateMap = {};
		}

		/**
		 * 添加状态机
		 */
		public addState(cusState : IState) : void
		{
			if(null != this.mStateMap[cusState.stateType])
			{
				return;
			}
			this.mState[cusState.stateType] = cusState;
		}

		/**
		 * 更新
		 */
		public update(cusDeltaTime : number) : void
		{
			if(this.mState)
			{
				this.mState.onUpdate(cusDeltaTime);
			}
		}

		/**
		 * 改变状态
		 */
		public changeState(cusType : string, ...cusArgs) : void
		{
			let _canChange : boolean = this.checkCanChange(cusType);
			if(_canChange == false)
			{
				return;
			}
			this.changeStateForce(cusType, cusArgs);
		}

		/**
		 * 直接改变状态
		 */
		public changeStateForce(cusType : string, ...cusArgs) : void
		{
			let _targetState : IState = this.mStateMap[cusType];
			if(_targetState == null)
			{
				return;
			}
			if(this.mState)
			{
				this.mState.onLeave();
			}
			_targetState.onEnter(cusArgs)
			this.mState = _targetState;
		}

		/**
		 * 检查是否能切换
		 */
		protected checkCanChange(cusType : string) : boolean
		{
			if(this.mState == null)
			{
				return true;
			}
			return this.mState.checkChangeTo(cusType);
		}

		/** 获取当前状态*/
		public get state() : IState { return this.mState; }
		/** 获取当前状态机类型*/
		public get stateType() : string { return this.mState.stateType; }

		/**
		 * 释放
		 */
		protected destroy() : void
		{
			let _state : IState;
			for(let _key in this.mStateMap )
			{
				_state = this.mStateMap[_key];
				_state.destroy();
			}
			this.mStateMap = {};
		}
	}
}