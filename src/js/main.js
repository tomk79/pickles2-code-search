/**
 * main.js
 */
module.exports = function($elm, options){
	var main = this;
	options = options || {};

	var Px2style = require('px2style'),
		px2style = new Px2style();
	this.px2style = px2style;

	var $elms = {};

	var templates = {
		"mainframe": require('../resources/templates/mainframe.html')
	};

	/**
	 * Pickles 2 Code Search を初期化します。
	 */
	this.init = function( callback ){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				// elm
				$elms.elm = $elm;

				$elm.classList.add("pickles2-code-search");
				$elm.innerHTML = templates.mainframe;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback();
				rlv();
			}); })
		;
	}
}
