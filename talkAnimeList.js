(()=>{
	"use strict";
	// アニメデータを蓄積するためのclass
	class AnimeData{
		constructor(in_set){
			this.startTime = new Date(in_set.StTime*1000);
			this.endTime = new Date(in_set.EdTime*1000);
			this.title = in_set.Title;
			this.count = in_set.Count;
			this.channel = in_set.ChName;
			this.subTitle = in_set.SubTitle;
			this.url = in_set.Urls;
		}
		showInfo(){
			let outstr = "タイトル："+this.title+"\n";
			if(this.count!=null){
				  outstr += "#"+this.count+"：";
			}
			if(this.subTitle!=null){
			  outstr += this.subTitle+"\n";
			}
				outstr += "開始時刻："+this.startTime.getHours()+":"+this.startTime.getMinutes()+"\n";
			if(this.channel!=null){
				  outstr += "放送局:"+this.channel+"\n";
			}
			outstr += "公式サイト：\n"+this.url+"\n";
			return outstr;
		}
	}
	
	// 指定したパスのファイル内容を取得する
	function getFile(path){
		let fs = require('fs');
		let buf = fs.readFileSync(path);
		let token = buf.toString();
		token = token.replace(/\n/,"");
		return token;
	}
	
	// PromiseでHTTPリクエストを実施する。
	function getRequest(getURL){
		let request = require('request');
		return new Promise((resolve,reject) => {
			request(getURL, function (error, response, body) {
				if(!error && response.statusCode == 200){
					resolve(body);
				}
				else{
					reject(null);
				}
			});
		});
	}
	const postSlack = require("./SlackPost.js");
	
	const in_user = getFile("./token/userID.txt");
	const in_url = "http://cal.syoboi.jp/rss2.php?filter=1&alt=json&usr=" + in_user;
	getRequest(in_url).then( (result) => {
		let AnimeDataSet = [];
		let importAnimeSet = JSON.parse(result);
		let outstr = "今日のアニメは以下になります\n";
		for(let i=0; i<importAnimeSet.items.length; i++){
			AnimeDataSet[i] = new AnimeData(importAnimeSet.items[i]);
			outstr += AnimeDataSet[i].showInfo() + "\n----------\n";
		}
		postSlack(outstr);
	});
})();
