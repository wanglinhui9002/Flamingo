/**
 * 计时器管理器
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
    export class TickUtil
    {
        /**
         * timer时间间隔
         */
        public static readonly DELAY : number = 500;
        /** timer类型计时器*/
        public static readonly TIMER_TYPE : string = "timer_type";
        /** frame类型计时器*/
        public static readonly FRAME_TYPE : string = "frame_type";

        /**
         * instace
         */
        private static mInstance : TickUtil;
        public static getInstance() : TickUtil
        {
            if(null == TickUtil.mInstance)
            {
                TickUtil.mInstance = new TickUtil();
            }
            return TickUtil.mInstance;
        }

        /** 帧频计时器*/
        private mFrameTick : FrameTick;
        /** timer计时器，每500ms执行一次*/
        private mTimerTick : TimerTick;
        /** 计时器列表*/
        private mTickMap : {[key : string] : BaseTick};

        /** 添加计时监听*/
        public addTickListener(cusType : string, tDelay : number, tRepeat : number, tContext : any, tCallBack : Function, tCompleteCallBack : Function = null) : void
        {
            this.mTickMap[cusType].addTickListener(tDelay, tRepeat, tContext, tCallBack, tCompleteCallBack);
        }

         /** 移除计时监听*/
        public removeTickListener(cusType : string, tContext : any, tCallBack : Function) : void
        {
            this.mTickMap[cusType].removeTickListener(tContext, tCallBack);
        }

        public constructor()
        {
            this.mFrameTick = new FrameTick();
            this.mTimerTick = new TimerTick();
            this.mTickMap = { 
                [TickUtil.TIMER_TYPE]:this.mTimerTick,
                [TickUtil.FRAME_TYPE]:this.mFrameTick
            }
        }

    }
}