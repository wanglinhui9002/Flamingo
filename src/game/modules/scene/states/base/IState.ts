module scene
{
    /**
     * 状态机接口
     */
    export interface IState
    {
        onEnter(...cusArgs) : void;
        onLeave() : void;
        onUpdate(cusDeltaTime : number) : void;
        checkChangeTo(cusType : string) : boolean;
        stateType : string;
        destroy();
    }
}