/**
 * node express app
 */
var express = require('express')
, partials = require('express-partials')
, http = require('http')
, path = require('path')
, ntwitter = require('ntwitter')
, url = require('url');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('secretsession'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(partials());
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

/**
 * Above this line are Express Defaults.
 */

/** Let's encrypt SSL Cert challenge response
 */
app.get("/.well-known/acme-challenge/gvozyhGE0GImvibh87PLRPDT3WShoy09a-hpAO7pifA", function(req, res) {
    res.send("gvozyhGE0GImvibh87PLRPDT3WShoy09a-hpAO7pifA.E7xV6vEpNfWraUz2zp1fAq__2-qk84prGZpB9QjCg9I");
});

/**
 * Home page route
 */
app.get('/', function(req, res) {
    res.render('index', { tid: null, user: app.locals.user || false });
});

/**
 * Render a bookmarked tweet
 */
app.get('/id/:tid', function (req, res) {
    res.render('index', { 
        user: app.locals.user || false,
        tid: req.params.tid
    });
});

// Twitter auth endpoints
//
app.get('/signin_with_twitter', function(req, res){

    //console.log('twitter config', config.Twitter);
    var twit = new ntwitter({
        consumer_key: process.env['TwitterConsumerKey'],
        consumer_secret: process.env['TwitterConsumerSecret']
    });

    var path = url.parse(req.url, true);
    twit.login(path.pathname,"/twitter_callback")(req,res);

    /** 
     * Do NOT include any sort of template rendering here
     * If you do so, it will prevent the redirect to Twitter from happening
     * res.render('do_not_enable ');
     */
});

app.get('/twitter_callback', function(req, res){
    console.log("Sucessfully Authenticated with Twitter...");

    var twit = new ntwitter({
        consumer_key: process.env['TwitterConsumerKey'],
        consumer_secret: process.env['TwitterConsumerSecret']
    });

    twit.gatekeeper()(req,res,function(){
        req_cookie = twit.cookie(req);
        twit.options.access_token_key = req_cookie.access_token_key;
        twit.options.access_token_secret = req_cookie.access_token_secret; 

        twit.verifyCredentials(function (err, data) {
            console.log("Verifying Credentials...");
            if (err) {
                console.log("Verification failed : " + err);
            } else {
                console.log('Verified!', data);
                app.locals.user = data;
            }
            res.writeHead(302, {'Location': '/'});
            res.end();
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
