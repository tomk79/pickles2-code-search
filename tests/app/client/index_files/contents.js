(function(){
	var pickles2CodeSearch = window.pickles2CodeSearch = new Pickles2CodeSearch(
		document.getElementById('cont-pickles2-code-search'),
		{}
	);
	// console.log(pickles2CodeSearch);
	pickles2CodeSearch.init(function(){
		console.log('ready.');
	});
})();
