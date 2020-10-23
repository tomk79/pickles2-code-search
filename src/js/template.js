/**
 * template.js
 */
module.exports = function(main){
    var Twig = require('twig'), // Twig module
        twig = Twig.twig;       // Render function

	const templates = {
		"mainframe": require('../resources/templates/mainframe.html'),
		"form": require('../resources/templates/form.html'),
		"progress": require('../resources/templates/progress.html'),
		"result": require('../resources/templates/result.html'),
	};

    this.bind = function(templateName, data){
        var rtn = twig({
            'data': templates[templateName]
        }).render(data);
        return rtn;
    }
}
