/**
 * server.js
 */
const fs = require('fs');
const path = require('path');
const utils79 = require('utils79');
const express = require('express'),
	app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');

app.use( bodyParser({"limit": "1024mb"}) );
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use( '/common/pickles2-code-search/', express.static( path.resolve(__dirname, '../../../dist/') ) );
app.use( '/common/bootstrap/', express.static( path.resolve(__dirname, '../../../node_modules/bootstrap/dist/') ) );
app.use( express.static( __dirname+'/../client/' ) );

// 3000番ポートでLISTEN状態にする
server.listen( 3000, function(){
	console.log('server-standby');
} );
