/*
 * https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02
 * https://www.fghrsh.net/post/123.html
 */

function initWidget(waifuPath) {
	if (screen.width <= 768) return;
	localStorage.removeItem("waifu-display");
	sessionStorage.removeItem("waifu-text");
	$("body").append(`<div id="waifu-tips"></div>`);
	var re = /x/;
	re.toString = function() {
		showMessage("哈哈，你打开了控制台，是想要看看我的秘密吗？", 6000, 9);
		return "";
	};
	$(document).on("copy", function() {
		showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
	});
	$(document).on("visibilitychange", function() {
		if (!document.hidden) showMessage("哇，你终于回来了～", 6000, 9);
	});
	(function() {
		var SiteIndexUrl = location.port ? `${location.protocol}//${location.hostname}:${location.port}/` : `${location.protocol}//${location.hostname}/`, text; //自动获取主页
		if (location.href == SiteIndexUrl) { //如果是主页
			var now = new Date().getHours();
			if (now > 23 || now <= 5) text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
			else if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
			else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
			else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
			else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
			else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
			else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
			else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
			else text = "好久不见，日子过得好快呢……";
		}
		else if (document.referrer !== "") {
			var referrer = document.createElement("a");
			referrer.href = document.referrer;
			var domain = referrer.hostname.split(".")[1];
			if (location.hostname == referrer.hostname) text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
			else if (domain == 'baidu') text = 'Hello！来自 百度搜索 的朋友<br/>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
			else if (domain == 'so') text = 'Hello！来自 360搜索 的朋友<br/>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
			else if (domain == 'google') text = 'Hello！来自 谷歌搜索 的朋友<br/>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
			else text = 'Hello！来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
		}
		else text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
		showMessage(text, 7000, 8);
	})();
	//检测用户活动状态，并在空闲时定时显示一言
	var userAction = false,
		hitokotoTimer = null,
		messageTimer = null,
		messageArray = ["已经过了这么久了呀，日子过得好快呢……", "使用Chrome可以获得最佳浏览体验哦！", "嗨～快来逗我玩吧！", "拿小拳拳锤你胸口！"],
		apiURL = "";
	if ($(".fa-share-alt").is(":hidden")) messageArray.push("记得把小家加入Adblock白名单哦！");
	$(document).mousemove(function() {
		userAction = true;
	}).keydown(function() {
		userAction = true;
	});
	function showMessage(text, timeout, priority) {
		//console.log(text, timeout, priority);
		if (!text) return;
		if (!sessionStorage.getItem("waifu-text") || sessionStorage.getItem("waifu-text") <= priority) {
			if (messageTimer) {
				clearTimeout(messageTimer);
				messageTimer = null;
			}
			if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length)];
			//console.log(text);
			sessionStorage.setItem("waifu-text", priority);
			$("#waifu-tips").stop().html(text).fadeTo(200, 1);
			messageTimer = setTimeout(function() {
				sessionStorage.removeItem("waifu-text");
				$("#waifu-tips").fadeTo(1000, 0);
			}, timeout);
		}
	}
	function initModel() {
		waifuPath = waifuPath || "/waifu-tips.json";
		$.getJSON(waifuPath, function(result) {
			$.each(result.mouseover, function(index, tips) {
				$(document).on("mouseover", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.click, function(index, tips) {
				$(document).on("click", tips.selector, function() {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{text}", $(this).text());
					showMessage(text, 4000, 8);
				});
			});
			$.each(result.seasons, function(index, tips) {
				var now = new Date(),
					after = tips.date.split("-")[0],
					before = tips.date.split("-")[1] || after;
				if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
					var text = Array.isArray(tips.text) ? tips.text[Math.floor(Math.random() * tips.text.length)] : tips.text;
					text = text.replace("{year}", now.getFullYear());
					//showMessage(text, 7000, true);
					messageArray.push(text);
				}
			});
		});
	}
	initModel();
}
