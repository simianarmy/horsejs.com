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
        endpointRegEx: /^#\/id\/([0-9]+)$/,
        share: {
            hook: {
                link: null,
                script: null
            },
            link1: '<a id="sharey" style="display:none;" href="https://twitter.com/share" class="twitter-share-button" data-url="',
            link2: '" data-text="Listen to the horse:" data-via="horse_js" data-size="large" data-related="folktrash" data-hashtags="horseSays">Tweet</a>'
        },
        isIOS: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) ? true : false
    };
    var method = {
        giddyup: function () {
            cfg.horse = new HorseJS();
            method.mane();
            method.groom();
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
            cfg.share.hook = document.getElementById('twat');
            cfg.share.hack = document.getElementById('twit');
            cfg.share.hook.script = document.getElementById('heady');
            cfg.share.hook.link = document.getElementById('twitterHookLink');

            var i;
            cfg.harras.style = '<style>';
            for (i=1;i<=cfg.harras.max;i++) {
                cfg.harras.style += '.harras' + i + ' {background-image:url(images/harras/' + i + '.jpg);}';
            }
            cfg.harras.style += '</style>';
            cfg.harras.hook.innerHTML = cfg.harras.style;

            soundManager.setup({
                url: '/swf',
                flashVersion: 9, // optional: shiny features (default = 8)
                // optional: ignore Flash where possible, use 100% HTML5 mode
                preferFlash: false,
                onready: function() {
                    // Ready to use; soundManager.createSound() etc. can now be called.
                    // mobile browsers require user click before playing audio
                    if (method.isMobile()) {
                        method.feed();
                    } else {
                        method.chortle();
                    }
                }
            });
        },
        chortle: function () {
            var chortle = document.createElement('audio');
            chortle.src = 'chortle.mp3';
            chortle.play();
            chortle.addEventListener('ended', function () {
                chortle = null;
                method.feed();
            });
        },
        feed: function () {
            if (cfg.count === null) {//first time so use .ready();
                var id = method.getEndpointId();
                cfg.horse.ready(id, function (error, tweets) {
                    method.buck(error, tweets);
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

                // After Ajax response, we have to initiate a user click to be
                // able to play any audio
                if (this.isMobile()) {
                    method.giddyUp();
                } else {
                    method.trot();
                }
            }
        },
        trot: function () {
            if (cfg.count < cfg.tweets.length) {
                var tweet = cfg.tweets[cfg.count],
                    tid = tweet.tid;

                console.log('getEndpointUrl: ' + method.getEndpointUrl(tid));
                method.appendEndpointUrl(tid);

                cfg.corral.style.opacity = 0.5;
                cfg.saddle.style.display = 'none';
                cfg.corral.className = 'harras' + (Math.floor(Math.random() * cfg.harras.max + 1));

                method.whinny(tweet);
            } else {
                console.log('send more apples');
                method.feed();
            }
        },
        /**
         * @param {Number} duration length of audio in milliseconds
         */
        rearing: function (duration) {

            var snorts = cfg.tweets[cfg.count].text.split(' ');
            var bale = Math.max(snorts.length, 1);
            var gallop = duration / (bale + 1);
            var count = 1;

            console.log(snorts);

            setTimeout(function canter() {
                cfg.neigh.innerHTML = snorts.slice(0, count).join(' ');
                if (count++ < bale) {
                    setTimeout(canter, gallop);
                }
            }, gallop);
        },
        giddyUp: function () {
            cfg.corral.style.opacity = 1;
            cfg.neigh.innerHTML = '';//boom!
            cfg.saddle.style.display = 'block';
            cfg.saddle.onclick = function (e) {
                method.clearShare();
                method.trot();
                e.stopPropagation();
            };
        },
        reigns: function () {
            method.insertShare();

            // If we need more tweets, we have to fetch them before showing the 
            // giddyup link (for mobile audio)
            if (this.isMobile() && (cfg.count >= cfg.tweets.length)) {
                method.feed();
            } else {
                method.giddyUp();
            }
        },
        whinny: function (tweet) {
            soundManager.createSound({
               id: tweet.tid,
               url: method.getTweetAudioUrl(tweet),
               onload: function () {
                   method.rearing(this.duration || this.durationEstimate);
                   cfg.count++;
               },
               onfinish: function () {
                   setTimeout(function () {
                       method.reigns();
                   }, 1000);
               }
            }).play();

            /*
            // This totally failed on iOS, even after a user click :(
            var audio = document.createElement('audio');
            audio.src = method.getTweetAudioUrl(tweet); 
            audio.preload = 'metadata';

            audio.addEventListener('loadedmetadata', function () {
                cfg.duration = audio.duration;
                audio.play();
                method.rearing();
                cfg.count++;
            });

            audio.addEventListener('ended', function () {
                audio = null;
                setTimeout(function () {
                    method.reigns();
                },1000);
            });
            */

        },
        insertShare: function () {

            var thing = cfg.share.link1 + window.location.href + cfg.share.link2;
            cfg.share.hook.link.innerHTML = thing;

            var script = document.createElement('script');
            script.id = 'twitty';
            script.type= 'text/javascript';
            script.src= 'http://platform.twitter.com/widgets.js';
            script.async = true;
            cfg.share.hook.script.appendChild(script);

            console.log('that work?');
        },
        clearShare: function () {
            var twitty = document.getElementById('twitty');

            cfg.share.hook.link.innerHTML = '';
            if (twitty) {
                twitty.parentNode.removeChild(twitty);
            }
        },
        /**
         * @param {Object} t tweet data
         * @return {String} url to tweet audio file
         */
        getTweetAudioUrl: function (t) {
            return cfg.tweet.audioUrlBase + t.tid + '.mp3';
        },
        isEndpoint: function () {
            return cfg.endpointRegEx.test(window.location.hash);
        },
        getEndpointId: function () {
            var res = cfg.endpointRegEx.exec(window.location.hash);
            return res ? res[1] : null;
        },
        getEndpointUrl: function (id) {
            return window.location.host + '/#/id/' + id;
        },
        appendEndpointUrl: function (id) {
            if (!cfg.isIOS) {
                window.location.hash = '/id/' + id;
                console.log(window.location);
            }
        },
        isMobile: function () {
            return cfg.isIOS;
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
