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
        measurements: {
            account: 'UA-43841804-1',
            domain: 'horsejs.com'
        },
        saddle: null,
        tweets: {},
        tweet: {
          audioUrlBase: 'http://neighs.horsejs.com/audio/'
        },
        endpointRegEx: /^#\/id\/([0-9]+)$/
    };
    var method = {
        giddyup: function () {
            cfg.horse = new HorseJS();
            method.mane();
            method.groom();
            method.chortle();
        },
        mane: function () {
            if (window.location.host.indexOf(cfg.measurements.domain) !== -1) {//we are in prod
                window._gaq = window._gaq || [];
                window._gaq.push(['_setAccount', cfg.measurements.account]);
                window._gaq.push(['_trackPageview']);
                var g = document.createElement('script'), s = document.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                g.async = true;
                s.parentNode.insertBefore(g, s);
            }
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
            cfg.horse.ready(function (error, tweets) {
              if (method.isEndpoint()) {
                cfg.horse.load(method.getEndpointId(), function (error, tweet) {
                  method.buck(error, [tweet]);
                });
              } else {
                method.buck(error, tweets);
              }
            });
          } else {//otherwise use .more();
            cfg.horse.more(10, method.buck.bind(method));
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
                var tid = cfg.tweets[cfg.count].tid;
                console.log('endpoint: ' + method.getEndpointUrl(tid));

                cfg.corral.style.opacity = 0.5;
                cfg.saddle.innerHTML = '';//"hide" link until done
                //cfg.neigh.innerHTML = '';//boom!

                cfg.corral.className = 'harras' + (Math.floor(Math.random() * cfg.harras.max + 1));

                cfg.tweet.audio = document.createElement('audio');
                cfg.tweet.audio.src =  cfg.tweet.audioUrlBase + tid + '.mp3';
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
        },
        isEndpoint: function () {
          return cfg.endpointRegEx.test(window.location.hash);
        },
        getEndpointId: function () {
          var res = cfg.endpointRegEx.exec(window.location.hash);
          return res[1];
        },
        getEndpointUrl: function (id) {
          return window.location.host + '/#/id/' + id;
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
