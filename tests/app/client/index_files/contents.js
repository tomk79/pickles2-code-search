(function(){
	const socket = io();

	socket.on('connect', () => {
		console.log('connect');
	});
	socket.on('channel0001', (message) => {
		console.log(`channel0001 - ${message}`);
	});

	var SinD;

	var pickles2CodeSearch = window.pickles2CodeSearch = new Pickles2CodeSearch(
		document.getElementById('cont-pickles2-code-search')
	);
	pickles2CodeSearch.init(
		{
			'start': function(searchOptions, callback){
				console.log('----- start', searchOptions);

				if( SinD ){
					SinD.cancel();
					return false;
				}

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
				callback();

			},
			'abort': function(){
				console.log('abort -----');
			}
		},
		function(){
			console.log('ready.');
		}
	);

})();
