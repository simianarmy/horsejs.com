'use strict';
/**
 * HorseJS API object
 */


function HorseJS (stuff) {
    stuff = stuff || {};

    this.PARSE_APP_ID = "M2DRuaNAnfzeQbBQubwFgfbmJJDRRbndjCCECou9";
    this.PARSE_JS_KEY = "9wVUdSrAPT6kKEkuPURTOSgbFYVvwkPbQXT8tzvA";
    this.ParseHorseObject = 'HorseTweet';
    this.RandomQueryKey = 'tid';
    this._lastID = null;
    this._randCache = [];
    this._resultsPerQuery = stuff.limit || 10;

    // Init Parse account
    Parse.initialize(this.PARSE_APP_ID, this.PARSE_JS_KEY);
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
HorseJS.prototype.more = function (count, cb) {
    var query = this._createQuery(),
        limit = count || this._resultsPerQuery;

    query.descending('tid');
    query.limit(limit);

    if (this._lastID !== null) {
        query.lessThan('tid', this._lastID);
    }
    this._query(query, cb);
};

/**
 * Fetches specific item by id
 * @param {Number|String} id
 * @param {Function} cb
 */
HorseJS.prototype.load = function (id, cb) {
    var self = this;
    var query = this._createQuery();

    query.equalTo(this.RandomQueryKey, id);
    query.first({
        success: function (results) {
            if (typeof results === 'undefined') {
                cb('Not found');
            } else {
                self._lastID = results.attributes.tid;
                cb(null, [results.attributes]);
            }
        },
        error: function (error) {
            cb(error);
        }
    });
};

HorseJS.prototype.getEndpoint = function (id) {
};

/**
 * Fetches random item
 * XXX Parse will only return 100 results, so that is going to be the random
 * pool for now
 * @param {Function} cb
 */
HorseJS.prototype.random = function (cb) {
    var self = this;

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
    var hjs = window.Parse.Object.extend(this.ParseHorseObject);
    var query = new window.Parse.Query(hjs);

    return query;
};

/**
 * Executes Parse query, returns data via callback
 * @param {Parse.Query} query
 * @param {Function} cb
 */
HorseJS.prototype._query = function (query, cb) {
    var self = this;

    query.find({
        success: function(results) {
            // The object was retrieved successfully.
            // Save oldest tid
            if (results.length > 0) {
                self._lastID = results[results.length-1].attributes.tid;
            }
            // Convert to raw json object
            cb(null, results.map(function (r) {
                return r.attributes;
            }));
        },
        error: function(error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            cb(error);
        }
    });
};

HorseJS.prototype._pickRandom = function (cb) {
    var id = this._randCache[Math.floor(Math.random() * this._randCache.length)];

    this.load(id, cb);
};
