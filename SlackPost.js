(()=>{
	"use strict";
	
	// 指定したパスのファイル内容を取得する
	function getFile(path){
		let fs = require('fs');
		let buf = fs.readFileSync(path);
		let token = buf.toString();
		token = token.replace(/\n/,"");
		return token;
	}
	
	// Slack投稿テスト
	module.exports = (post_str) => {
		// 投稿するチャンネルID
		const channelID = getFile("./token/channelID.txt");
		const token = getFile("./token/token.txt");
		let request = require('request');
		let set_url = "https://slack.com/api/chat.postMessage?token=" + token;
		set_url += "&channel=" + channelID + "&as_user=true&pretty=1&text=";
		set_url += encodeURIComponent(post_str);
		request(set_url, function (error, response, body) {
		if(!error && response.statusCode == 200){
				console.log(JSON.parse(body));
			}
			else{
				console.log('error: '+ response.statusCode);
			}
		})
	}
})();
