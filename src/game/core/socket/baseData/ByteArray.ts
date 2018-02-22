module core 
{
	/**
	 * 字节数组
	 */
	export class ByteArray extends egret.ByteArray
	{
		/** 对象池*/
		private static mByteArrayPool : Array<ByteArray> = [];
		/** egret.ByteArray对象池*/
		private static mEgretByteArrayPool : Array<egret.ByteArray> = [];

		public constructor() 
		{
			super();
			this.endian = egret.Endian.BIG_ENDIAN;
		}

		/** 写64位数*/
		public writeInt64(cusValue : Int64) : void
		{
			this.writeInt(cusValue.high);
			this.writeInt(cusValue.low);
		}

		/** 读64位数*/
		public readInt64() : Int64
		{
			let _high : number = this.readInt();
			let _low : number = this.readInt();
			return new Int64(_low, _high);
		}

		/** 读8位数*/
		public readInt8() : Int8
		{
			return new Int8(this.readByte());
		}

		/** 写8位数*/
		public writeInt8(cusValue : Int8) : void
		{
			this.writeByte(cusValue.value);
		}

		/** 读取16位数*/
		public readInt16() : Int16
		{
			return new Int16(this.readShort());
		}

		/** 写入16位数*/
		public writeInt16(cusValue : Int16) : void
		{
			this.writeShort(cusValue.value);
		}

		/** 读取一串字符串*/
		public readString() : string
		{
			return this.readUTF();
		}

		/** 写一串字符串*/
		public writeString(cusValue : string) : void
		{
			this.writeUTF(cusValue);
		}

		/** 创建实例*/
		public static createByteArray() : ByteArray
		{
			let _byteArray : ByteArray = ByteArray.mByteArrayPool.pop();
			if(_byteArray == null)
			{
				_byteArray = new ByteArray();
			}
			return _byteArray;
		}

		/** 重置*/
		public reset() : void
		{
			this.clear();
			ByteArray.mByteArrayPool.push(this);
		}

		/** 创建egret.ByteArray实例*/
		public static createEgretByteArray() : egret.ByteArray
		{
			let _byteArray : egret.ByteArray = ByteArray.mEgretByteArrayPool.pop();
			if(_byteArray == null)
			{
				_byteArray = new egret.ByteArray();
			}
			return _byteArray;
		}

		/** 重置egret.ByteArray*/
		public static resetEgretByteArray(cusByteAray : egret.ByteArray) : void
		{
			cusByteAray.clear();
			ByteArray.mEgretByteArrayPool.push(cusByteAray);
		}

	}
}