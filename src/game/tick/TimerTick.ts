/**
 * 帧频计时器
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
    export class TimerTick extends BaseTick
    {
        /**
         * 计时器
         */
        private mHelpTimer : egret.Timer;
        /**
         * 是否已经启动了
         */
        private mHasStarted : boolean = false;

        public constructor()
        {
            super();
            this.mHelpTimer = new egret.Timer(TickUtil.DELAY);
            this.mHelpTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimerTickHandler, this);
        }

        /**
         * 添加计时监听
         * @param tCallBack 回调函数一定有一个参数(需要执行的次数)
         */
        public addTickListener(tDelay : number, tRepeat : number, tContext : any, tCallBack : Function, tCompleteCallBack : Function = null) : void
        {
            let tickVo : TickVo = TickVo.getTickVo();
            tickVo.setData(tDelay, tRepeat, tContext, tCallBack, tCompleteCallBack);
            tickVo.interval = egret.getTimer() + tDelay * TickUtil.DELAY;
            this.mTickVoList.push(tickVo);
            
            if(this.mHasStarted == false)
            {
                this.mHelpTimer.start();
                this.mHasStarted = true;
            }
        }

        /**
         * 移除计时监听
         */
        public removeTickListener(tContext : any, tCallBack : Function) : void
        {
            let _len : number = this.mTickVoList.length;
            let _i : number;
            let _tickVo : TickVo;
            for(_i = 0; _i < _len; _i++)
            {
                _tickVo = this.mTickVoList[_i];
                if(_tickVo.context = tContext && _tickVo.callBack == tCallBack)
                {
                    this.mTickVoList.splice(_i, 1);
                    _tickVo.reset();
                    break;
                }
            }
        this.checkStopTimer();
        }

        /** 计时器处理函数*/
        private onTimerTickHandler() : void
        {
            let _i : number = 0;
            let _applyCount : number;
            let _tickVo : TickVo;
            let _now : number = egret.getTimer();
            while(_i < this.mTickVoList.length)
            {
                _tickVo = this.mTickVoList[_i];
                if(_now >= _tickVo.interval)
                {
                    _applyCount = Math.floor((_now - _tickVo.interval) / TickUtil.DELAY) + 1;
                    _tickVo.interval = _now + _tickVo.delay * TickUtil.DELAY;
                    _tickVo.callBack.apply(_tickVo.context, [_applyCount]);
                    if(_tickVo.repeat > 0)
                    {
                        _tickVo.repeat --;
                        if(_tickVo.repeat == 0)
                        {
                            if(_tickVo.completeCallBack != null)
                            {
                                _tickVo.completeCallBack.apply(_tickVo.context, _tickVo.params);
                            }
                            this.mTickVoList.splice(_i, 1);
                            _tickVo.reset();
                            this.checkStopTimer();
                            continue;
                        }
                    }
                }
                _i++;
            }
        }

        /**
         * 检查是否停止帧频
         */
        private checkStopTimer() : void
        {
            let _len : number = this.mTickVoList.length;
            if(_len <= 0 && this.mHasStarted == true)
            {
                this.mHelpTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimerTickHandler, this);
            }
        }

    }
}
