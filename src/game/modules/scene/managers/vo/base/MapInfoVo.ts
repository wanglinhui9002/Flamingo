module scene 
{
	/**
	 * 地图编辑器产生的场景信息数据.
	 */
	export class MapInfoVo 
	{

		/** 地图编号*/
		public mapId : number;
		/** 图块宽度*/
		public tileWidth : number;
		/** 图块高度*/
		public tileHeight : number;
		/** 地图宽*/
		public mapWidth : number;
		/** 地图高*/
		public mapHeight : number;
		/** 路点信息*/
		public maskData : {[key : number] : Array<any>};
		/** 此地图的版本号*/
		public version : string;

		public constructor() 
		{
		}

		/** 解析数据*/
		public parseData(cusData : any) : void
		{
			this.mapId = cusData.id;
			this.tileWidth = cusData.tileWidth;
			this.tileHeight = cusData.tileHeight;
			this.mapWidth = cusData.width;
			this.mapHeight = cusData.height;
			egret.log("!!!!!!!!!!!!!!!!!!!!!!!!!!路点信息暂时没有解析!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
			this.version = cusData.version.toString();
		}

	}
}