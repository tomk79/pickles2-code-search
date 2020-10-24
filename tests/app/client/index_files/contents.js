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
								'highlights': [
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample'
								]
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
								'path': '/px-files/sitemaps/test.csv',
								'highlights': [
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample'
								]
							},
							{
								'path': '/px-files/sitemaps/test2test2test2test2test2test2test2test2test2test2test2test2test2test2.csv',
								'highlights': [
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample',
									'sample <strong>hit</strong> sample'
								]
							}
						]
					});
				}, 3000);
				setTimeout(function(){
					pickles2CodeSearch.update({
						'total': 110,
						'done': 110
					});
				}, 3200);
				setTimeout(function(){
					pickles2CodeSearch.finished();
				}, 3800);

			},
			'abort': function(callback){
				console.log('abort -----');
				callback();
			},
			'tools': [
				{
					"label": "エディタA",
					"open": function(path){
						alert(path + ' with Editor A');
					}
				},
				{
					"label": "エディタB",
					"open": function(path){
						alert(path + ' with Editor B');
					}
				}
			]
		},
		function(){
			console.log('ready.');
		}
	);

})();
