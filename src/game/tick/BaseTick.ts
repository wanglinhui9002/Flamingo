 /**
 * 计时器基类
 * @author wanglinhui
 * @version 1.0.0
 */
module core
{
    export abstract class BaseTick 
    {
        /**
         * 计时器数据列表
         */
        protected mTickVoList : Array<TickVo>;

        public constructor()
        {
            this.mTickVoList = [];
        }

        /**
         * 添加计时监听
         */
        public abstract addTickListener(tDelay : number, tRepeat : number, tContext : any, tCallBack : Function, tCompleteCallBack : Function) : void;

        /**
         * 移除计时监听
         */
        public abstract removeTickListener(tContext : any, tCallBack : Function) : void;
    }
}

