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
					pickles2CodeSearch.update({
						'total': 100,
						'done': 98,
						'new': [
							{
								'path': '/px-files/sitemaps/sitemap.csv',
								'count': 3
							}
						]
					});
				}, 2000);
				setTimeout(function(){
					pickles2CodeSearch.update({
						'total': 110,
						'done': 101,
						'new': [
							{
								'path': '/px-files/sitemaps/sitemap.csv',
								'count': 6
							},
							{
								'path': '/px-files/sitemaps/sitemap.csv',
								'count': 6
							}
						]
					});
				}, 3000);
				setTimeout(function(){
					pickles2CodeSearch.update({
						'total': 111,
						'done': 111,
					});
				}, 3500);

			},
			'abort': function(callback){
				console.log('abort -----');
				callback();
			}
		},
		function(){
			console.log('ready.');
		}
	);

})();
