var Procrap = function() {
	var _this = this;
	
	this.localStorage = chrome.storage.local;
	this.$input = document.getElementById('url');
	this.$strikeLink = document.getElementById('strike-link');
	
	// listeners
	this.$input.addEventListener('keyup', function(e) {
		_this.handleURLValue(e.currentTarget.value);
	});
	this.$strikeLink.addEventListener('click', function(e) {
		e.preventDefault();
		_this.goToStrike();
	});
	
	// kick off
	this.getURL();
};

Procrap.prototype = {
	handleURLValue: function(value) {
		if(this.isValidURL(value)) {
			this.$input.className = "valid";
		} else {
			this.$input.className = "";
		}
		this.storeURL(value);
	},
	getURL: function() {
		var _this = this;
		chrome.storage.local.get("redirect_url", function(results) {
			if(results["redirect_url"]) _this.$input.value = results["redirect_url"];
			_this.handleURLValue(_this.$input.value);
		});
	},
	storeURL: function(url) {
		this.localStorage.set({ "redirect_url": url });
	},
	goToStrike: function() {
		chrome.tabs.create({'url': "http://strikeapp.com"});
	},
	isValidURL: function(url) {
		var RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		if(RegExp.test(url)) {
			return true;
		} else {
			return false;
		}
	 }
};

document.addEventListener('DOMContentLoaded', function () {
	var app = new Procrap();
});