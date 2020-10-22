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
							var finTargets = decideTargets( $(this) );
							console.log(finTargets);

							var searchOptions = {
								'keyword': keyword ,
								'filter': finTargets['filter'],
								'ignore': finTargets['ignore'],
								'allowRegExp': finTargets.allowRegExp,
								'ignoreCase': finTargets.ignoreCase,
								'matchFileName': finTargets.matchFileName,
							};

							options.start(searchOptions, function(){
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
	 * updateResultsProgress
	 */
	function updateResultsProgress(){
		$elms.resultsProgress.html(targetCount + 'ファイル中、' + hitCount + 'ファイルがヒット')
	}

	/**
	 * decideTargets
	 */
	function decideTargets( $form ){
		var rtn = {
			'target': [],
			'filter':[],
			'ignore': [],
			'allowRegExp': false,
			'ignoreCase': false,
			'matchFileName': false
		};

		var targetDir = $form.find('select[name=target-dir]').val();
		switch(targetDir){
			case 'contents_comment':
				rtn['filter'].push( new RegExp( px.php.preg_quote('/comments.ignore/comment.') ) );
				break;
			case 'all':
			default:
				break;
		}

		if( $form.find('input[name=options-regexp]:checked').length ){
			rtn.allowRegExp = true;
		}
		if( $form.find('input[name=options-ignorecase]:checked').length ){
			rtn.ignoreCase = true;
		}
		if( $form.find('input[name=options-matchfilename]:checked').length ){
			rtn.matchFileName = true;
		}

		return rtn;
	}

	/**
	 * getPath
	 */
	this.getPath = function(file){
		file = file.replace( new RegExp('^'+px.php.preg_quote(pj.get('path'))), '' );
		return file;
	}

}
