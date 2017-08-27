'use strict';

require('ace-css/css/ace.css');
require('font-awesome/css/font-awesome.css');

// Require index.html so it gets copied to dist
require('./elm-index.html');

var ElmTwhispr = require('./main.elm');

var tv = ElmViewer.TweetView.embed(document.getElementById('viewer'));
