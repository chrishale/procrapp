var Background = function() {
	var _this = this;
	_this.redirect_url = null;

	_this.redirectHandler = function(info) {
		console.log(_this.redirect_url);
		if(_this.redirect_url) return { redirectUrl: _this.redirect_url };
	};

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (key in changes) {
			if(key == "redirect_url") _this.redirect_url = changes[key].newValue;
		}
	});

	chrome.webRequest.onBeforeRequest.addListener(_this.redirectHandler, { urls: ["*://*.facebook.com/*", "*://*.twitter.com/*"] }, ["blocking"]);

};

var app = new Background();