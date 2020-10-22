/**
 * main.js
 */
module.exports = function($elm){
	const main = this;
	const $ = require('jquery');
	const Px2style = require('px2style'),
		px2style = new Px2style();
	this.px2style = px2style;
	this.px2style.setConfig('additionalClassName', 'pickles2-code-search');

	const $elms = {};
	const templates = {
		"mainframe": require('../resources/templates/mainframe.html'),
		"form": require('../resources/templates/form.html'),
		"progress": require('../resources/templates/progress.html'),
		"result": require('../resources/templates/result.html'),
	};


	var hitCount = 0;
	var targetCount = 0;

	this.options = {};

	/**
	 * Pickles 2 Code Search を初期化します。
	 */
	this.init = function( options, callback ){
		callback = callback || function(){};
		options = options || {};
		options.start = options.start || function(){};
		options.abort = options.abort || function(){};
		this.options = options;

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				px2style.loading();
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// elm
				$elms.elm = $elm;

				$elm.classList.add("pickles2-code-search");
				$elm.innerHTML = templates.mainframe;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){

				$elms.form = $('.pickles2-code-search__form');
				$elms.progress = $('.pickles2-code-search__progress');
				$elms.results = $('.pickles2-code-search__results');
				$elms.resultsProgress = $('<div>');
				$elms.resultsUl = $('<ul>');
				$elms.tpl_searchForm = templates.form;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){

				$elms.form.html('').append( $elms.tpl_searchForm );
				$elms.form
					.find('form')
						.on('submit', function(){
							hitCount = 0;
							targetCount = 0;
							$elms.results
								.html('')
								.append( $elms.resultsProgress.html('') )
								.append( $elms.resultsUl.html('') )
							;
							updateResultsProgress();
							$elms.progress.html( templates.progress ).show();


							var keyword = $(this).find('[name=keyword]').val();
							var searchOptions = {
								'target': $(this).find('select[name=target-dir]').val(),
								'ignore': [],
								'allowRegExp': ($(this).find('input[name=options-regexp]:checked').length ? true : false),
								'caseSensitive': ($(this).find('input[name=options-casesensitive]:checked').length ? true : false),
								'matchFileName': ($(this).find('input[name=options-matchfilename]:checked').length ? true : false)
							};
							if( $(this).find('input[name=ignore-contents-comment]:checked').length ){
								searchOptions.ignore.push('contents-comment');
							}
							if( $(this).find('input[name=ignore-sitemap]:checked').length ){
								searchOptions.ignore.push('sitemap');
							}
							if( $(this).find('input[name=ignore-px-files]:checked').length ){
								searchOptions.ignore.push('px-files');
							}
							if( $(this).find('input[name=ignore-sys-caches]:checked').length ){
								searchOptions.ignore.push('sys');
								searchOptions.ignore.push('caches');
							}
							if( $(this).find('input[name=ignore-packages]:checked').length ){
								searchOptions.ignore.push('packages');
							}

							options.start(keyword, searchOptions, function(){
								console.log('search started.');
							});

							return false;
						})
				;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				px2style.closeLoading();
				callback();
				rlv();
			}); })
		;
	}

	this.report = function(result){
		targetCount = result.total;
		hitCount = result.hit;
		updateResultsProgress();
		console.log(result);
	};

	/**
	 * updateResultsProgress
	 */
	function updateResultsProgress(){
		$elms.resultsProgress.html(targetCount + 'ファイル中、' + hitCount + 'ファイルがヒット')
	}

	/**
	 * getPath
	 */
	this.getPath = function(file){
		file = file.replace( new RegExp('^'+px.php.preg_quote(pj.get('path'))), '' );
		return file;
	}

}
