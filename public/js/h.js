'use strict';
var horse = window.horse || {};

horse = (function () {
    var cfg = {
        body: null,
        chortle: null,
        count: null,
        corral: null,
        duration: null,
        harras: {
            hook: null,
            max: 48,
            style: ''
        },
        horse: null,
        neigh: null,
        saddle: null,
        tweets: {},
        tweet: {}
    };
    var method = {
        giddyup: function () {
            cfg.horse = new HorseJS();
            method.groom();
            method.chortle();
        },
        groom: function () {
            cfg.body = document.getElementById('stallion');
            cfg.neigh = document.getElementById('neigh');
            cfg.saddle = document.getElementById('giddyup');
            cfg.corral = document.getElementById('corral');
            cfg.harras.hook = document.getElementById('hook');

            var i;
            cfg.harras.style = '<style>';
            for (i=1;i<=cfg.harras.max;i++) {
                cfg.harras.style += '.harras' + i + ' {background-image:url(images/harras/' + i + '.jpg);}';
            }
            cfg.harras.style += '</style>';
            cfg.harras.hook.innerHTML = cfg.harras.style;
        },
        chortle: function () {
            cfg.chortle = document.createElement('audio');
            cfg.chortle.src = 'chortle.mp3';
            cfg.chortle.play();
            cfg.chortle.addEventListener('ended', function () {
                cfg.chortle = null;
                method.feed();
            });
        },
        feed: function () {
            if (cfg.count === null) {//first time so use .ready();
                cfg.horse.ready(function (error, tweets) {method.buck(error, tweets);});
            } else {//otherwise use .more();
                cfg.horse.more(10,function (error, tweets) {method.buck(error, tweets);});
            }
        },
        buck: function (error, tweets) {
            if (error) {
                console.log('no apples');
            } else {
                console.log(tweets);
                cfg.tweets = tweets;
                cfg.count = 0;
                method.trot();
            }
        },
        trot: function () {
            if (cfg.count < cfg.tweets.length) {


                cfg.corral.style.opacity = 0.5;
                cfg.saddle.innerHTML = '';//"hide" link until done
                //cfg.neigh.innerHTML = '';//boom!

                cfg.corral.className = 'harras' + (Math.floor(Math.random() * (cfg.harras.max - 1)));

                cfg.tweet.audio = document.createElement('audio');
                cfg.tweet.audio.src =  'http://horsejs.com/audio/' + cfg.tweets[cfg.count].tid + '.mp3';
                cfg.tweet.audio.preload = 'metadata';

                cfg.tweet.audio.addEventListener('loadedmetadata', function () {
                    cfg.duration = cfg.tweet.audio.duration;
                    cfg.tweet.audio.play();
                    method.rearing();
                    cfg.count++;
                });

                cfg.tweet.audio.addEventListener('ended', function () {
                    cfg.tweet.audio = null;
                    setTimeout(function () {
                        method.reigns();
                    },1000);
                });

            } else {
                console.log('send more apples');
                method.feed();
            }
        },
        rearing: function () {

            var snorts = cfg.tweets[cfg.count].text.split(' ');
            var bale = Math.max(snorts.length, 1);
            var gallop = cfg.duration * 1000 / (bale + 1);
            var count = 1;

            console.log(snorts);
            console.log('bale: ' + bale);
            console.log('gallop: ' + gallop);
            console.log('count: ' + count);

            setTimeout(function canter() {
                cfg.neigh.innerHTML = snorts.slice(0, count).join(' ');
                if (count++ < bale) {
                    setTimeout(canter, gallop);
                }
            }, gallop);
        },
        reigns: function () {
            cfg.corral.style.opacity = 1;
            cfg.neigh.innerHTML = '';//boom!
            cfg.saddle.innerHTML = 'GiddyUp &#187;';//make visible
            cfg.saddle.onclick = function (e) {
                method.trot();
                e.stopPropagation();
            };
        }
    };
    var api    = {
        giddyup: method.giddyup,
        buck: method.buck,

        feed: method.feed,//dev
        cfg: cfg//dev
    };
    return api;
})();

horse.giddyup();