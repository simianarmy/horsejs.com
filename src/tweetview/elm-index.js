'use strict';

require('ace-css/css/ace.css');
require('font-awesome/css/font-awesome.css');

// Require index.html so it gets copied to dist
require('./elm-index.html');

var elm = require('./main.elm');

var tv = elm.TweetView.embed(document.getElementById('viewer'));

var sample = [
    {tid: "123", words: ["hi", "there"]},
    {tid: "222", words: ["oh", "my", "oh", "me"]}
];

tv.ports.addTweets.send(sample);
