/**
 * Loops throuh Parse records to update each row
 */

var Kaiseki = require('kaiseki');

var batchUpdates = function (parse, updates) {
    parse.updateObjects('HorseTweet', updates, function(err, res, body, success) {
        console.log(err);
        console.log(body);
        for (var i = 0; i < updates.length; i++) {
            var object = updates[i];
            console.log('object ' + object.objectId + ' updated');
        }
    });
};
var parse = new Kaiseki(process.env['ParseAppID'], process.env['ParseSecret']);
console.log('parse', parse);

parse.getObjects('HorseTweet', {where: {accountId: {'$ne': 1}}, limit: 1000}, function (err, results, body, success) {
    var updates = [];
    console.log('err: ' + err);
    //console.log('body: ', body);

    console.log('processing ' + body.length + ' rows');
    do {
        // 50 updates at a time allowed
        console.log(body.length + ' rows remaining');
        updates.length = 0;
        for (var i = 0, len = body.length; i < len && i < 50; i++) {
            var row = body.shift();
            updates.push({objectId: row.objectId, data: {accountId: 1}});
        }
        batchUpdates(parse, updates.slice(0));
    } 
    while (body.length > 0);
});
