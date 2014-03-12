var Background = function() {
	var _this = this;
	_this.redirect_url = "";
	_this.should_redirect = false;
	_this.blocking_urls = [
		"*://*.facebook.com/*",
		"*://*.twitter.com/*",
		"*://*.9gag.com/*",
		"*://*.ebaumsworld.com/*",
		"*://*.break.com/*"
	];

	chrome.storage.local.get('redirect_url', function (result) {
		_this.redirect_url = result.redirect_url;
		_this.checkRedirect();
	});

	_this.redirectHandler = function(info) {
		if(_this.should_redirect && _this.redirect_url) return { redirectUrl: _this.redirect_url };
	};

	_this.getStirkeURL = function() {
		var $a = document.createElement("a");
		$a.href = _this.redirect_url;
		if($a.hostname != "strikeapp.com" && $a.hostname != "www.strikeapp.com") return false;
		if($a.hash) return "http://strikeapp.com/lists/" + $a.hash.replace("#", '') + ".json";
		return false;
	};

	_this.checkRedirect = function(url) {
		if(_this.getStirkeURL()) {
			var xhr = new XMLHttpRequest();
			xhr.open('get', _this.getStirkeURL());
			xhr.addEventListener('load', function (e) {
				if(xhr.readyState == 4 && xhr.status == 200) {
					var o = JSON.parse(xhr.responseText);
					if(o.tasks.length) {
						_this.should_redirect = false;
						for (var i=0;i<o.tasks.length;i++) {
							if(!o.tasks[i].completed) { _this.should_redirect = true; }
						}
					}
				}
			}, false);
			xhr.send();
		} else {
			_this.should_redirect = true;
		}
	};

	_this.goCheckRedirect = function(e) {
		if(e.method == "POST") _this.checkRedirect();
	};

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (key in changes) {
			if(key == "redirect_url") {
				_this.redirect_url = changes[key].newValue;
				_this.checkRedirect();
			}
		}
	});

	chrome.webRequest.onBeforeRequest.addListener(_this.redirectHandler, { types: ["main_frame"], urls: _this.blocking_urls }, ["blocking"]);

	chrome.webRequest.onResponseStarted.addListener(_this.goCheckRedirect, { urls: ["*://*.strikeapp.com/*"] }, ['responseHeaders']);

};

var app = new Background();

