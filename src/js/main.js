/**
 * main.js
 */
module.exports = function($elm, options){
	const main = this;
	options = options || {};

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


	var SinD;
	var hitCount = 0;
	var targetCount = 0;
	var publicCacheDir = pj.getConfig().public_cache_dir || '/caches/';

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
							if( SinD ){
								SinD.cancel();
								return false;
							}
							hitCount = 0;
							targetCount = 0;
							$results
								.html('')
								.append( $elms.resultsProgress.html('') )
								.append( $elms.resultsUl.html('') )
							;
							updateResultsProgress();
							$elms.progress.html( templates.progress ).show();


							var keyword = $(this).find('[name=keyword]').val();
							var finTargets = decideTargets( $(this) );
							console.log(finTargets);

							// 検索を実施
							SinD = new px.SearchInDir(
								finTargets['target'],
								{
									'keyword': keyword ,
									'filter': finTargets['filter'],
									'ignore': finTargets['ignore'],
									'allowRegExp': finTargets.allowRegExp,
									'ignoreCase': finTargets.ignoreCase,
									'matchFileName': finTargets.matchFileName,
									'progress': function( done, max ){
										targetCount = max;
										var per = px.php.intval(done/max*100);
										$elms.progress.find('.progress .progress-bar')
											.text(done+'/'+max)
											.css({'width':per+'%'})
										;
										updateResultsProgress();
									},
									'match': function( file, result ){
										hitCount ++;
										updateResultsProgress();

										var src = $('#template-search-result').html();
										var tplDataObj = {
											'path': _this.getPath(file) ,
											'file': file ,
											'result': result
										};

										var html = window.twig({
											data: src
										}).render(tplDataObj);
										var $html = $(html);
										$html.find('a[data-role=openInFinder]')
											.click(function(){
												px.utils.openURL( px.php.dirname($(this).attr('data-file-path')) );
												return false;
											})
										;
										$html.find('a[data-role=openInTextEditor]')
											.click(function(){
												px.openInTextEditor( $(this).attr('data-file-path') );
												return false;
											})
										;
										$html.find('a[data-role=open]')
											.click(function(){
												px.utils.openURL( $(this).attr('data-file-path') );
												return false;
											})
										;

										$elms.resultsUl.append($html);
									} ,
									'error': function( file, error ){
									} ,
									'complete': function(){
										updateResultsProgress();
										setTimeout(function(){
											$elms.progress.hide('fast');
											SinD = null;
										},2000);
									}
								}
							);
							return false;
						})
				;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
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
			case 'home_dir':
				rtn['target'].push(px.fs.realpathSync(pj.get('path')+'/'+pj.get('home_dir'))+'/**/*');
				break;
			case 'contents_comment':
				rtn['target'].push(px.fs.realpathSync(pj.get('path'))+'/**/*');
				rtn['filter'].push( new RegExp( px.php.preg_quote('/comments.ignore/comment.') ) );
				break;
			case 'sitemaps':
				rtn['target'].push(px.fs.realpathSync(pj.get('path')+'/'+pj.get('home_dir')+'/sitemaps')+'/**/*');
				break;
			case 'sys-caches':
				rtn['target'].push(px.fs.realpathSync(pj.get('path')+'/'+publicCacheDir)+'/**/*');
				rtn['target'].push(px.fs.realpathSync(pj.get('path')+'/'+pj.get('home_dir')+'/_sys')+'/**/*');
				break;
			case 'packages':
				if(pj.get_realpath_composer_root()){
					rtn['target'].push(px.fs.realpathSync(pj.get_realpath_composer_root()+'vendor')+'/**/*');
					rtn['target'].push(px.fs.realpathSync(pj.get_realpath_composer_root()+'composer.json'));
					rtn['target'].push(px.fs.realpathSync(pj.get_realpath_composer_root()+'composer.lock'));
				}
				if(pj.get_realpath_npm_root()){
					rtn['target'].push(px.fs.realpathSync(pj.get_realpath_npm_root()+'node_modules')+'/**/*');
					rtn['target'].push(px.fs.realpathSync(pj.get_realpath_npm_root()+'package.json'));
				}
				break;
			case 'all':
			default:
				rtn['target'].push(px.fs.realpathSync(pj.get('path'))+'/**/*');
				break;
		}

		function setIgnore( checkbox, path ){
			if( !px.utils79.is_dir(path) ){
				return;
			}
			path = px.fs.realpathSync(path);
			path = new RegExp( px.php.preg_quote( path ) );
			if( $form.find('input[name=ignore-'+checkbox+']:checked').size() ){
				rtn['ignore'].push( path );
			}
			return;
		}

		if( $form.find('input[name=target-contents-comment]:checked').size() ){
			rtn['ignore'].push( new RegExp( px.php.preg_quote('/comments.ignore/comment.') ) );
		}
		setIgnore( 'sitemap', pj.get('path')+'/'+pj.get('home_dir')+'sitemaps/' );
		setIgnore( 'px-files', pj.get('path')+'/'+pj.get('home_dir') );
		setIgnore( 'sys-caches', pj.get('path')+'/'+publicCacheDir );
		setIgnore( 'sys-caches', pj.get('path')+'/'+pj.get('home_dir')+'_sys/' );

		if(pj.get_realpath_composer_root()){
			setIgnore( 'packages', pj.get_realpath_composer_root()+'vendor/' );
			setIgnore( 'packages', pj.get_realpath_composer_root()+'composer.json' );
			setIgnore( 'packages', pj.get_realpath_composer_root()+'composer.lock' );
		}
		if(pj.get_realpath_npm_root()){
			setIgnore( 'packages', pj.get_realpath_npm_root()+'node_modules/' );
			setIgnore( 'packages', pj.get_realpath_npm_root()+'package.json' );
		}

		if( $form.find('input[name=options-regexp]:checked').size() ){
			rtn.allowRegExp = true;
		}
		if( $form.find('input[name=options-ignorecase]:checked').size() ){
			rtn.ignoreCase = true;
		}
		if( $form.find('input[name=options-matchfilename]:checked').size() ){
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
