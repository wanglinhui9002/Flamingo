module scene 
{
    export interface IScaleItem
    {
        /** 获取缩放系数*/
        getScale() : number;
        /** 设置缩放系数*/
        setScale(cusScale : number);
    }
}