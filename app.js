var http =  require('http'),
fs = require('fs');
http.createServer(function(req,res){
	console.log('服务器开启成功')
	if( req.method =='GET'){
		if(req.url == "/")	{
			fs.readFile('./view/index.html','utf8',function(error,data){
				res.writeHead(200,{'Content-Type':"text/html"});
				res.end(data)
			})
		}else if(req.url == '/main.js'){
			fs.readFile('./view/main.js','utf8',function(error,data){
				res.writeHead(200,{'Content-Type':"text/javascript"});
				res.end(data)
			})
		}
	}else{
		if(req.url == "/"){
			var str = "";
			req.on('data', function(chuck){
				str += chuck;
			})
			req.on('end', function(){
				var obj = JSON.parse(str),
				imgData = new Buffer(obj.data, 'base64');
				fs.writeFile(obj.name+'.png' , imgData ,function(err){
					if(err){
						console.log(err);
						return ;
					}
					console.log('图片保存成功')
				})
				res.writeHead(200,{'Content-Type':"text/plain"});
				res.end('上传成功')
			})
		}
	}
}).listen(3000)