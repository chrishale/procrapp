var Procrap = function() {
	var _this = this;
	
	this.localStorage = chrome.storage.local;
	this.$input = document.getElementById('url');
	this.$strikeLink = document.getElementById('strike-link');
	
	// listeners
	this.$input.addEventListener('keyup', function(e) {
		_this.storeURL(e.currentTarget.value);
	});
	this.$strikeLink.addEventListener('click', function(e) {
		e.preventDefault();
		_this.goToStrike();
	});
	
	// kick off
	this.getURL();
};

Procrap.prototype = {
	getURL: function() {
		var _this = this;
		chrome.storage.local.get("redirect_url", function(results) {
			if(results["redirect_url"]) _this.$input.value = results["redirect_url"];
		});
	},
	storeURL: function(url) {
		this.localStorage.set({ "redirect_url": url });
	},
	goToStrike: function() {
		chrome.tabs.create({'url': "http://strikeapp.com"});
	}
};

document.addEventListener('DOMContentLoaded', function () {
	var app = new Procrap();
});