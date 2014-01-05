'use strict';
var horse = window.horse || {};

horse = (function () {
    var cfg = {
        accountID: 1,
        body: null,
        chortle: null,
        currentIndex: null,
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
        tweets: [],
        tweet: {
          audioUrlBase: 'https://s3-us-west-2.amazonaws.com/horsejs/'
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
            cfg.horse = new HorseData(cfg.accountID);
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
            var self = this;

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
                cfg.harras.style += '.harras' + i + ' {background-image:url(/images/harras/' + i + '.jpg);}';
            }
            cfg.harras.style += '</style>';
            cfg.harras.hook.innerHTML = cfg.harras.style;

            // Add history listener
            window.addEventListener("popstate", function(e) {
                if (e.state && e.state.tid) {
                    console.log('loading state', e);
                    self.trot(e.state.tid);
                }
            });
            
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
            chortle.src = '/chortle.mp3';
            chortle.play();
            chortle.addEventListener('ended', function () {
                chortle = null;
                method.feed();
            });
        },
        feed: function () {
            if (cfg.currentIndex === null) {//first time so use .ready();
                var id = method.getEndpointId();
                cfg.horse.ready(id, function (error, tweets) {
                    method.buck(error, tweets);
                });
            } else {//otherwise use .more();
                cfg.horse.more({limit: 10}, method.buck.bind(method));
            }
        },
        buck: function (error, tweets) {
            if (error) {
                console.log('no apples');
            } else {
                console.log(tweets);
                // append to list or initialize
                cfg.tweets = cfg.tweets.concat(tweets);

                if (cfg.tweets.length === tweets.length) {
                    cfg.currentIndex = 0;
                }

                // After Ajax response, we have to initiate a user click to be
                // able to play any audio
                if (this.isMobile()) {
                    method.giddyUp();
                } else {
                    method.trot();
                }
            }
        },
        trot: function (optTid) {
            var tweet, tid;

            // Did we come from a history nav?
            if (optTid) {
                tid = optTid;
                // find the matching tweet object
                for (var i =0; i < cfg.tweets.length; i++) {
                    if (tid === cfg.tweets[i].tid) {
                        // save position
                        cfg.currentIndex = i;
                        tweet = cfg.tweets[i];
                        break;
                    }
                };
                if (!tweet) {
                    console.warn('could not find tweet associated with id ', tid);
                    return;
                }
            }
            else if (cfg.currentIndex < cfg.tweets.length) {
                tweet = cfg.tweets[cfg.currentIndex];
                tid = tweet.tid;
                // add the state if we're not coming from history api
                method.appendEndpointUrl(tid);
            }
            if (tid) {
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

            var snorts = cfg.tweets[cfg.currentIndex].text.split(' ');
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

            cfg.currentIndex++;
            console.log('index at ' + cfg.currentIndex);
            // If we need more tweets, we have to fetch them before showing the 
            // giddyup link (for mobile audio)
            if (this.isMobile() && (cfg.currentIndex >= cfg.tweets.length)) {
                method.feed();
            } else {
                method.giddyUp();
            }
        },
        whinny: function (tweet) {
            // look for existing sound
            var sound = soundManager.getSoundById(tweet.tid);

            if (sound) {
                sound.play();
                method.rearing(sound.duration);
            } else {
                soundManager.createSound({
                   id: tweet.tid,
                   url: method.getTweetAudioUrl(tweet),
                   onload: function () {
                       method.rearing(this.duration || this.durationEstimate);
                   },
                   onfinish: function () {
                       setTimeout(function () {
                           method.reigns();
                       }, 1000);
                   }
                }).play();
            }

            /*
            // This totally failed on iOS, even after a user click :(
            var audio = document.createElement('audio');
            audio.src = method.getTweetAudioUrl(tweet); 
            audio.preload = 'metadata';

            audio.addEventListener('loadedmetadata', function () {
                cfg.duration = audio.duration;
                audio.play();
                method.rearing();
                cfg.currentIndex++;
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
            return typeof window.tid !== 'undefined';
        },
        getEndpointId: function () {
            return window.tid;
        },
        getEndpointUrl: function (id) {
            return window.location.host + '/id/' + id;
        },
        appendEndpointUrl: function (id) {
            window.history.pushState({tid: id}, null, '/id/' + id);
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
