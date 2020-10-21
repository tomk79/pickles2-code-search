(function(){
	var pickles2CodeSearch = window.pickles2CodeSearch = new Pickles2CodeSearch(
		document.getElementById('cont-pickles2-code-search'),
		{}
	);
	// console.log(pickles2CodeSearch);
	pickles2CodeSearch.init(function(){
		console.log('ready.');
	});

	const socket = io();

	socket.on('connect', () => {
		console.log('connect');
	});
	socket.on('channel0001', (message) => {
		console.log(`channel0001 - ${message}`);
	});

})();
