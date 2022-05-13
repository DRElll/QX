# Q-Search 
# From 🐩️哥 (https://raw.githubusercontent.com/Neurogram-R/Surge/master/Q-Search.js)
# - Safari 内输入 命令 + 空格 + 关键词 快速指定搜索引擎搜索
#  注：先进入设置更改 Safari 默认搜索为 DuckDuckGO 其他浏览器同理
# 可自行修改指令或者添加搜索引擎


[rewrite_local]
^https:\/\/duckduckgo.com\/\?q=.+ url script-echo-response https://raw.githubusercontent.com/DRElll/QX/main/Script/Q-Search.js

[mitm]
hostname = duckduckgo.com
 */

const engineData = {
	// Wikipedia 中文
	wk: "https://zh.wikipedia.org/wiki/%@",
	// 百度
	bd: "https://www.baidu.com/s?wd=%@",
	// GitHub
	gh: "https://github.com/search?q=%@",
	// Google 搜索 TestFlight
	tf: "https://www.google.com/search?as_q=%@&as_sitesearch=testflight.apple.com",
	// Google 图片
	gi: "https://www.google.com/search?&tbm=isch&q=%@",
	// 有道词典
	yd: "https://dict.youdao.com/search?q=%@",
  // YouTube
	ytb: "https://www.youtube.com/results?search_query=%@",
	// StackExchange
	se: "https://stackexchange.com/search?q=%@",
	// 知乎
	zh: "https://www.zhihu.com/search?q=%@",
	// 微博
	wb: "https://s.weibo.com/weibo/%@",
	// PornHub
	ph: "https://cn.pornhub.com/video/search?search=%@",
	// Twitter
	tw: "https://twitter.com/search?q=%@",
	// Google 搜索 Google Drive 资源
	gd: "https://www.google.com/search?q=%22Google+Drive%22+%@",
	// Google
	gl: "https://www.google.com/search?q=%@",
	"@default": "bd",
};

let commands = Object.keys(engineData);
let url = $request.url;
let keyword = url.match(/duckduckgo.com\/\?q=([^&]+)/);
if (keyword) {
	keyword = keyword[1];
	let patt = new RegExp(`^(${commands.join("|")})(\\+|%20)`, "g");
	let command = keyword.match(patt);
	if (command) {
		url = engineData[command[0].replace(/(\+|%20)/, "")].replace(
			/%@/,
			keyword.replace(command[0], "")
		);
	} else {
		url = engineData[engineData["@default"]].replace(/%@/, keyword);
	}

	const isQuanX = typeof $notify != "undefined";
	const newstatus = isQuanX ? "HTTP/1.1 302 Temporary Redirect" : 302;
	const redirect = {
		status: newstatus,
		headers: {
			Location: url,
		},
	};
	const resp = isQuanX ? redirect : { response: redirect };
	$done(resp);
} else {
	$done({});
}
