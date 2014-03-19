var Procrapp = function() {
	var _this = this;
	
	this.localStorage = chrome.storage.local;
	this.$input = document.getElementById('url');
	this.$strikeLink = document.getElementById('strike-link');
	this.$breakLink = document.getElementById('break-link');
	this.deafultBreakLinkText = this.$breakLink.innerHTML;
	
	// listeners
	this.$input.addEventListener('keyup', function(e) {
		_this.handleURLValue(e.currentTarget.value);
	});
	this.$strikeLink.addEventListener('click', function(e) {
		e.preventDefault();
		_this.goToStrike();
	});
	this.$breakLink.addEventListener('click', function(e) {
		e.preventDefault();
		_this.startBreak();
	});

	var _this = this;
	chrome.extension.sendMessage({action: "isOnBreak"}, function(response) {
		if(response.isOnBreak) { _this.disableBreakBtn(); } else { _this.enabledBreakBtn(); }
	});

	// kick off
	this.getURL();
};

Procrapp.prototype = {
	handleURLValue: function(value) {
		this.$input.className = this.isValidURL(value) ? "valid" : "";
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
	},
	disableBreakBtn: function() {
		this.$breakLink.className = "btn disabled";
		this.$breakLink.innerHTML = "On break";
	},
	enabledBreakBtn: function() {
		this.$breakLink.className = "btn";
		this.$breakLink.innerHTML = this.deafultBreakLinkText;
	},
	startBreak: function() {
		var _this = this;
		chrome.extension.sendMessage({action: "giveBreak"}, function(response) {
			_this.disableBreakBtn();
			var t = setTimeout(function() {
				_this.enabledBreakBtn();
			}, response.timeout);
		});
	}
};

document.addEventListener('DOMContentLoaded', function () {
	var app = new Procrapp();
});