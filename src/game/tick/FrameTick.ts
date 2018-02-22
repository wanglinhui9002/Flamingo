/**
 * 帧频计时器
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
    export class FrameTick extends BaseTick
    {
        /**
         * 用于监听enter_frame的MovieClip
         */
        private mHelpMovieClip : egret.MovieClip;

        public constructor()
        {
            super();
            this.mHelpMovieClip = new egret.MovieClip();
        }

        /**
         * 添加计时监听
         */
        public addTickListener(tDelay : number, tRepeat : number, tContext : any, tCallBack : Function, tCompleteCallBack : Function = null, ...args) : void
        {
            let tickVo : TickVo = TickVo.getTickVo();
            tickVo.setData(tDelay, tRepeat, tContext, tCallBack, tCompleteCallBack, args);
            tickVo.interval = tDelay;
            this.mTickVoList.push(tickVo);

            if(this.mHelpMovieClip.hasEventListener(egret.Event.ENTER_FRAME) == false)
            {
                this.mHelpMovieClip.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrameHandler, this);
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
        this.checkStopEnterFrame();
        }

        /**
         * 帧事件
         */
        private onEnterFrameHandler() : void
        {
            let _i : number = 0;
            let _tickVo : TickVo;
            while(_i < this.mTickVoList.length)
            {
                _tickVo = this.mTickVoList[_i];
                _tickVo.interval--;
                if(_tickVo.interval <= 0)
                {
                    _tickVo.interval = _tickVo.delay;
                    _tickVo.callBack.apply(_tickVo.context, _tickVo.params);
                    if(_tickVo.repeat > 0)
                    {
                        _tickVo.repeat--;
                        if(_tickVo.repeat == 0)
                        {
                            if(_tickVo.completeCallBack != null)
                            {
                                _tickVo.completeCallBack.apply(_tickVo.context, _tickVo.params);
                            }
                            this.mTickVoList.splice(_i, 1);
                            _tickVo.reset();
                            this.checkStopEnterFrame();
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
        private checkStopEnterFrame() : void
        {
            let _len : number = this.mTickVoList.length;
            if(_len <= 0 && this.mHelpMovieClip.hasEventListener(egret.Event.ENTER_FRAME) == true)
            {
                this.mHelpMovieClip.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrameHandler, this);
            }
        }
    }
}