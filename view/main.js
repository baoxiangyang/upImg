//裁剪插件
/*
入参
canImg:图片预览位置
width，height 裁剪图片大小，
clipIded 裁剪后的图片id，默认clipIded。
公共方法和属性
loadImg方法：预览图片，obj为filsts对象
clipIng方法 裁剪图片
clipCanvas:
*/
function clipImg(canImg,width,height,clipIded){
		this._canImg = canImg;
		this._height = height;
		this._width = width;
		this._clipIded =  clipIded || "clipIded";
	}
clipImg.prototype = {
	loadImg:function(obj){
		for(var i = 0,len = obj.length; i < len; i++){
			if(obj[i].type.indexOf('image') == -1){
				continue;
			}
			var fr = new FileReader();
			fr.readAsDataURL(obj[i]);	
			fr.onload = function(){
				var img =  document.createElement('img');
		  			img.src = fr.result;
		  			img.onload = function(e){
		  				this.showCanvasImg(img)
		  			}.bind(this)		
			}.bind(this)
		}	
	},
	showCanvasImg:function(img){
		if(!this.ctx){
			this._canDiv = document.getElementById(this._canImg);
			this._canvas = document.createElement('canvas');
			this.ctx = this._canvas.getContext('2d');
		}
		this._canvas.width = img.width;
		this._canvas.height = img.height;
		this.ctx.drawImage(img,0,0);
		this._canDiv.appendChild(this._canvas);
		this.clipIng()
	},
	clipIng:function(){
		var  cutDiv = document.createElement('div'),
		newCanvas = document.createElement('canvas'),
		newCtx = newCanvas.getContext('2d'),
		halfWidth = this._width/2,
		halfHeight = this._height/2,
		ofLeft = this._canDiv.offsetLeft,
		ofTop = this._canDiv.offsetTop,
		imgData; 
		newCanvas.id = this._clipIded;
		newCanvas.width = this._width;
		newCanvas.height = this._height;
		cutDiv.className = 'cutDiv';
		cutDiv.style.width = this._width +'px';
		cutDiv.style.height = this._height+'px';
		var moveDiv = function(e){
				e.stopPropagation();
				var x = e.clientX , y = e.clientY,
				zx = x - ofLeft - halfWidth,
				zy = y - ofTop - halfHeight;
				cutDiv.style.top = zy+'px';
				cutDiv.style.left = zx+'px';
				imgData = this.ctx.getImageData(zx,zy,this._width,this._height); 
			}.bind(this)
		this._canvas.addEventListener('mouseenter',function(e){
			e.stopPropagation()
			this._canDiv.appendChild(cutDiv);
			this._canDiv.appendChild(newCanvas);
			cutDiv.style.display = 'block';
			document.addEventListener('mousemove',moveDiv,false)
		}.bind(this),false);
		cutDiv.addEventListener('click',function(e){
			newCtx.putImageData(imgData,0,0);
			this.clipCanvas = newCanvas;
			e.stopPropagation()
		}.bind(this),false)
		this._canDiv.addEventListener('mouseleave',function(e){
			cutDiv.style.display = 'none';
			document.removeEventListener('mousemove',moveDiv,false)
			e.stopPropagation();
		}.bind(this),false)
	}
}

//ajax 方法
function ajaxPost(url, sData, fnOnSucc, fnOnFaild)
{
	var oAjax=null;
	
	//1.初始化Ajax对象
	if(window.ActiveXObject)
	{
		oAjax=new ActiveXObject("Msxml2.XMLHTTP")||new ActiveXObject("Microsoft.XMLHTTP");
	}
	else
	{
		oAjax=new XMLHttpRequest();
	}
	
	//2.建立连接
	oAjax.open('post', url, true);
	
	//3.监控请求状态
	oAjax.onreadystatechange=function ()
	{
		//readyState->Ajax对象内部的状态
		//status->服务器返回的请求结果
		if(oAjax.readyState==4)
		{
			//alert('请求完成，请求结果是：'+oAjax.status);
			//alert(oAjax.responseText);
			if(oAjax.status==200)
			{
				if(fnOnSucc)
				{
					fnOnSucc(oAjax.responseText);
				}
			}
			else
			{
				if(fnOnFaild)
				{
					fnOnFaild(oAjax.status);
				}
			}
		}
	};
	//4.发送请求
	oAjax.send(sData);
	
}