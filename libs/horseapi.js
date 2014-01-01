'use strict';
var Kaiseki = require('kaiseki');

/**
 * Query object - abstracts query parameters
 */
function Query (opts) {
    this._params = opts || {};
    this._params.limit = this._params.limit || 10;
};

Query.prototype.params = function () {
    return this._params;
};

Query.prototype.limit = function (val) {
    this._params.limit = val;
};

Query.prototype.descending = function (col) {
    this._params.order = '-' + col;
};

Query.prototype.equalTo = function (key, val) {
    this._params.where = this._params.where || {};
    this._params.where[key] = val;
};

Query.prototype.lessThan = function (key, val) {
    this._params.where = this._params.where || {};
    this._params.where[key] = {'$lt': val};
};

/**
 * @param {String} keys comma-separated list of column names
 */
Query.prototype.select = function (keys) {
    this._params.keys = keys;
};

/**
 * HorseJS API object
 */

function HorseJS (config) {

    this.ParseHorseObject = 'HorseTweet';
    this.RandomQueryKey = 'tid';
    this._resultsPerQuery = config.limit || 10;
    this._randCache = [];
    this._accountID = config.accountID || 0;
    this._parse = new Kaiseki(config.appId, config.restKey);
}

HorseJS.prototype.setAccount = function (id) {
    this._accountID = id;
};

/**
 * Call to hook int ready event
 * @param {String|Number} optId optional id to load
 * @param {Function} cb
 */
HorseJS.prototype.ready = function (optId, cb) {
    // Query for first N tweets to return
    var query = this._createQuery();

    if (optId) {
      this.load(optId, cb);
    } else {
      query.limit(this._resultsPerQuery);
      query.descending('tid');

      this._query(query, cb);
    }
};

/**
 * Call to fetch N more items older than the current id
 * @param {Object} params
 *   count {Number} number of items to fetch
 * @param {Function} cb
 */
HorseJS.prototype.more = function (opts, cb) {
    opts = opts || {};
    var query = this._createQuery(),
        limit = opts.count || this._resultsPerQuery;

    query.descending('tid');
    query.limit(limit);

    if (opts.olderThan) {
        query.lessThan('tid', opts.olderThan);
    }
    this._query(query, cb);
};

/**
 * Fetches specific item by id
 * @param {Number|String} id
 * @param {Function} cb
 */
HorseJS.prototype.load = function (id, cb) {
    var query = this._createQuery();

    query.equalTo(this.RandomQueryKey, id);
    query.limit(1);

    this._query(query, cb);
};

/**
 * Fetches random item
 * XXX Parse will only return 100 results, so that is going to be the random
 * pool for now
 * @param {Function} cb
 */
HorseJS.prototype.random = function (cb) {
    var self = this;

    //TODO: Implement for node version
    cb('Operation not supported');
    return;

    // Check cache first
    if (this._randCache.length === 0) {
        // populate cache with object ids
        var query = this._createQuery();
        query.select(this.RandomQueryKey);
        query.find().then(function(results) {
          // each of results will only have the selected fields available.
          self._randCache = results.map(function(r) {
            return r.attributes[self.RandomQueryKey];
          });
          self._pickRandom(cb);
        });
    } else {
        self._pickRandom(cb);
    }
};

HorseJS.prototype._createQuery = function () {
    var query = new Query();

    return query;
};

/**
 * Executes Parse query, returns data via callback
 * @param {Parse.Query} query
 * @param {Function} cb
 */
HorseJS.prototype._query = function (query, cb) {
    var self = this;

    this._parse.getObjects(this.ParseHorseObject, query.params(), function (err, results, body, success) {
        console.log('err: ' + err);
        console.log('results: ', results);
        console.log('body: ', body);
        if (success) {
            // The object was retrieved successfully.
            // return raw json object
            cb(null, body);
        } else {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            cb(err);
        }
    });
};

HorseJS.prototype._pickRandom = function (cb) {
    var id = this._randCache[Math.floor(Math.random() * this._randCache.length)];

    this.load(id, cb);
};

module.exports = HorseJS;
