/**
 * 计时器数据
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
    export class TickVo
    {
        /**
         * 延迟次数
         */
        public delay : number;
        /**
         * 调用间隔
         */
        public interval : number;
        /**
         * 回调函数执行环境
         */
        public context : any;
        /**
         * 调用重复次数
         */
        public repeat : number;
        /**
         * 每次的回调
         */
        public callBack : Function;
        /**
         * 当repeat == 0的时候
         */
        public completeCallBack : Function;
        /**
         * completeCallBack的参数
         */
        public params = [];

        public constructor() 
        {
        }

        /**
         * 设置数据
         */
        public setData(tDelay : number, tRepeat : number, tContext : any, tCallBack : Function, tCompleteCallBack : Function, ...args) : void
        {  
            this.delay = tDelay;
            this.repeat = tRepeat;
            this.context = tContext;
            this.callBack = tCallBack;
            this.completeCallBack = tCompleteCallBack;
            this.params = args;
        }
        /**
         * 重置
         */
        public reset() : void
        {
            this.delay = 0;
            this.repeat = 0;
            this.context = 0;
            this.callBack = null;
            this.completeCallBack = null;
            this.params = [];
            TickVo.mTickVoPool.push(this);
        }

        /**
         * 数据池
         */
        private static mTickVoPool : Array<TickVo> = [];

        /**
         * 获取一个TickVo实例
         */
        public static getTickVo() : TickVo
        {
            let tTickVo : TickVo = this.mTickVoPool.pop();
            if( null == tTickVo )
            {
                tTickVo = new TickVo();
            }
            return tTickVo;
        }
    }
}
