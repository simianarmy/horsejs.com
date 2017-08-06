'use strict';

/**
 * Simple twhispr API wrapper
 */

// The DigitalOcean box is hosed
//var TWHISPER_API_URL = 'https://api.twhispr.com/v1/';
// It works on Heroku ??
var TWHISPER_API_URL = 'https://twhispr-api.herokuapp.com/v1/';

function HorseData (accountID) {
    this._id = accountID;
    this._xhr = window.ajax; // miniajax
};

/**
 * Call to hook int ready event
 * @param {String|Number} optId optional id to load
 * @param {Function} cb
 */
HorseData.prototype.ready = function (optId, cb) {
    // Query for first N tweets to return
    if (optId) {
      this.load(optId, cb);
    } else {
      this.more(null, cb);
    }
};

/**
 * Call to fetch N more items older than the current id
 * @param {Object} params
 * @param {Function} cb
 */
HorseData.prototype.more = function (opts, cb) {
    var uri = TWHISPER_API_URL + 'more/' + this._id,
        queries = [];

    opts = opts || {};
    if (opts.limit) {
        queries.push('limit=' + opts.limit);
    }
    if (this._lastID) {
        queries.push('maxid=' + this._lastID);
    }
    if (queries.length > 0) {
        uri += '?' + queries.join('&');
    }
    this._query(uri, cb);
};

/**
 * Fetches specific item by id
 * @param {Number|String} id
 * @param {Function} cb
 */
HorseData.prototype.load = function (id, cb) {
    this._query(TWHISPER_API_URL + 'fetch/' + this._id + '/' + id, cb);
};

/**
 * Fetches random item
 * XXX Parse will only return 100 results, so that is going to be the random
 * pool for now
 * @param {Function} cb
 */
HorseData.prototype.random = function (cb) {
    cb('Operation not supported');
};

/**
 * Executes query, returns data via callback
 * @param {String} uri
 * @param {Object} opts
 * @param {Function} cb
 */
HorseData.prototype._query = function (uri, cb) {
    var self = this;

    this._xhr.get(uri, function (res) {
        if (res !== null && res !== "") {
            var info = JSON.parse(res),
                data;

            if (!info.err && info.results) {
                // Save oldest tid
                if (info.results.length > 0) {
                    self._lastID = info.results[info.results.length-1].tid;
                }
                cb(null, info);
            } else {
                cb(info.err);
            }
        } else {
            cb('Network error');
        }
    });
};

