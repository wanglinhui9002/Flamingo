/**
 * 层级管理器
 * @author wanglinhui
 * @version 1.0.0
 */

 class LayerManager
 {
 	/**
 	 * instance
 	 */
 	private static mInstance : LayerManager;
 	public static getInstance() : LayerManager
 	{
         if(null == LayerManager.mInstance)
         {
             LayerManager.mInstance = new LayerManager();
         }
         return LayerManager.mInstance;
 	}



	/**
	 * 舞台引用
	 */
	private stage : egret.Stage;
    /**
     * 场景层
     */
    public sceneLayer : egret.Sprite;
    /**
     * 主UI层
     */
    public mainUiLayer : egret.Sprite;
    /**
     * 弹出框层
     */
    public popLayer : egret.Sprite;
    /**
     * 二级弹窗层
     */
    public subPopLayer : egret.Sprite;
    /**
     * loading层
     */
    public loadingLayer : egret.Sprite;
    /**
     * 提示框层
     */
    public alertLayer : egret.Sprite;
    /**
     * 顶层
     */
    public topLayer : egret.Sprite;

	/**
	 * 启动
	 */
	public setup(tStage : egret.Stage) : void
	{
		this.stage = tStage;
        this.configChildren();
	}

    /**
     * 初始化
     */
    private configChildren() : void
    {
        this.sceneLayer = new egret.Sprite();
        this.sceneLayer.touchEnabled = false;
        this.stage.addChild(this.sceneLayer);

        this.mainUiLayer = new egret.Sprite();
        this.stage.addChild(this.mainUiLayer);

        this.popLayer = new egret.Sprite();
        this.stage.addChild(this.popLayer);
        
        this.subPopLayer = new egret.Sprite();
        this.stage.addChild(this.subPopLayer);

        this.loadingLayer = new egret.Sprite();
        this.stage.addChild(this.loadingLayer);

        this.alertLayer = new egret.Sprite();
        this.stage.addChild(this.alertLayer);

        this.topLayer = new egret.Sprite();
        this.stage.addChild(this.topLayer);
    }
 }