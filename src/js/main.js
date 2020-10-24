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
	const template = new (require('./template.js'));

	const $elms = {};

	var mode = 'standby';
	var hitCount = 0;
	var targetCount = 0;
	var doneCount = 0;

	this.options = {};

	/**
	 * Pickles 2 Code Search を初期化します。
	 */
	this.init = function( options, callback ){
		callback = callback || function(){};
		options = options || {};
		options.start = options.start || function(){};
		options.abort = options.abort || function(){};
		options.tools = options.tools || [];
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
				$elm.innerHTML = template.bind('mainframe', {});

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){

				$elms.form = $('.pickles2-code-search__form');
				$elms.progress = $('.pickles2-code-search__progress');
				$elms.results = $('.pickles2-code-search__results');
				$elms.resultsProgress = $('<div>').addClass('pickles2-code-search__progress-text');
				$elms.resultsUl = $('<ul>');
				$elms.tpl_searchForm = template.bind('form', {});

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){

				$elms.form.html('').append( $elms.tpl_searchForm );
				$elms.form
					.find('form')
						.on('submit', function(){
							targetCount = 0;
							doneCount = 0;
							hitCount = 0;

							setMode('active');

							$elms.results
								.html('')
								.append( $elms.resultsProgress.html('') )
								.append( $elms.resultsUl.html('') )
							;
							updateResultsProgress();
							$elms.progress.html( template.bind('progress', {}) ).show();
							$elms.progress.find('.pickles2-code-search__btn-abort').on('click', function(){
								options.abort(function(){
									setMode('standby');
								});
							});

							$elms.form.find('input').attr({'disabled': true});

							var keyword = $(this).find('[name=keyword]').val();
							if( !keyword.length ){
								alert('キーワードを入力してください。');
								setMode('standby');
								return false;
							}
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

	/**
	 * 進捗を更新する
	 */
	this.update = function(result){
		if( mode == 'standby' ){
			return;
		}
		// console.log(result);
		if( result.total ){
			targetCount = result.total;
		}
		if( result.done ){
			doneCount = result.done;
		}
		if( result.new && result.new.length ){
			for(var i = 0; i < result.new.length; i ++){
				hitCount ++;
				var opt = result.new[i];
				opt.tools = main.options.tools;
				var resultUnit = template.bind('result', opt);
				var $resultUnit = $(resultUnit);
				for( var i2 in main.options.tools ){
					$resultUnit.find('a[data-tool-id='+i2+']').on('click', function(){
						var toolId = $(this).attr('data-tool-id');
						var path = $(this).attr('data-path');
						main.options.tools[toolId].open(path);
					});
				}
				$elms.resultsUl.append($resultUnit);
			}
		}
		updateResultsProgress();
		return;
	};

	/**
	 * 検索処理の完了を宣言する
	 */
	this.finished = function(){
		updateResultsProgress();
		setMode('standby');
	}

	/**
	 * モードを変更する
	 */
	function setMode(modeTo){
		mode = modeTo;
		if(mode == 'standby'){
			setTimeout(function(){
				$elms.form.find('input,textarea,button').attr({'disabled': false});
				$elms.progress.html('');
			}, 500);
		}else if(mode == 'active'){
			$elms.form.find('input,textarea,button').attr({'disabled': true});
		}
	}

	/**
	 * updateResultsProgress
	 */
	function updateResultsProgress(){
		$elms.resultsProgress.html(targetCount + 'ファイル中、' + hitCount + 'ファイルがヒット');
		$elms.progress.find('.progress-bar')
			.css({'width': Number(doneCount/targetCount*100)+'%'})
			.text(doneCount+'/'+targetCount)
		;
		return;
	}

}
