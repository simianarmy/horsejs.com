'use strict';

require('ace-css/css/ace.css');
require('font-awesome/css/font-awesome.css');

// Require index.html so it gets copied to dist
require('./elm-index.html');

var ElmTwhispr = require('./twhisprapi/main.elm');
var ElmViewer = require('./tweetview.elm');

var api = ElmTwhispr.TwisprApi.embed(document.getElementById('api'), {
    accountId: 1
});
api.ports.results.subscribe(function (tweets) {
    console.log('TALKED TO ELM & SHE SAID:', tweets);
});

api.ports.getMore.send({limit: 10, maxId: null});

var tv = ElmViewer.TweetView.embed(document.getElementById('viewer'));
