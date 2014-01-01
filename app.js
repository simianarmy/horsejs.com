/**
 * node express app
 */
var express = require('express')
, partials = require('express-partials')
, http = require('http')
, path = require('path')
, ntwitter = require('ntwitter')
, url = require('url')
, config = require('config/AppConfig')
, horseAPI = require('libs/horseapi');

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
app.get('/', function(req, res) {
    //horsejs.giddyup(app, req);
    res.render('index', { tid: null, user: app.locals.user || false });
});

//app.get('/foo', routes.index);
app.get('/signin_with_twitter', function(req, res){

    console.log('twitter config', config.Twitter);
    var twit = new ntwitter({
        consumer_key: config.Twitter.consumerKey,
        consumer_secret: config.Twitter.consumerSecret});

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
        consumer_key: config.Twitter.consumerKey,
        consumer_secret: config.Twitter.consumerSecret});

    twit.gatekeeper()(req,res,function(){
        req_cookie = twit.cookie(req);
        twit.options.access_token_key = req_cookie.access_token_key;
        twit.options.access_token_secret = req_cookie.access_token_secret; 

        twit.verifyCredentials(function (err, data) {
            console.log("Verifying Credentials...");
            if (err) {
                console.log("Verification failed : " + err)
            } else {
                console.log('Verified!', data);
                app.locals.user = data;
            }
            res.writeHead(302, {'Location': '/'});
            res.end();
        })
    });
});

/**
 * Fetch a tweet, return its data
 */
app.get('/fetch/:aid/:tid', function (req, res) {
    var api = app.get('api');

    api.setAccount(req.params.aid);
    api.load(req.params.tid, app._fetchHandler(res));
});

/**
 * Fetch a bunch of tweets for some account
 */
app.get('/more/:aid', function (req, res) {
    var api = app.get('api');

    api.setAccount(req.params.aid);
    api.more({count: req.query.limit, olderThan: req.query.maxid}, app._fetchHandler(res));
});

/**
 * Helper to return fetch api responses
 */
app._fetchHandler = function (res) {
    return function(err, data) {
        var results;
        if (err) {
            results = {error: err, results: []};
        } else {
            results = {results: data};
        }
        res.writeHead(200, {
            'Content-Type': 'application/x-javascript'
        });
        res.write(JSON.stringify(results));
        res.end();
    }
};

/**
 * Render a bookmarked tweet
 */
app.get('/id/:tid', function (req, res) {
    res.render('index', { 
        user: app.locals.user || false,
        tid: req.params.tid
    });
});

http.createServer(app).listen(app.get('port'), function(){
    app.set('api', new horseAPI(config.Parse));
    console.log("Express server listening on port " + app.get('port'));
});
