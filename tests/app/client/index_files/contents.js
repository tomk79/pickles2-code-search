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
			'start': function(keyword, searchOptions, callback){
				console.log('----- start', searchOptions);

				callback();

				setTimeout(function(){
					pickles2CodeSearch.report({
						'total': 100,
						'done': 98,
						'hit': 4,
						'path': '/px-files/sitemaps/sitemap.csv',
						'count': 3,
					});
				}, 2000);
				setTimeout(function(){
					pickles2CodeSearch.report({
						'total': 110,
						'done': 101,
						'hit': 5,
						'path': '/px-files/sitemaps/sitemap.csv',
						'count': 6,
					});
				}, 3000);

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
