'use strict';

/**
 * HorseData API wrapper
 */

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
    var uri = '/more/' + this._id,
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
    this._query('/fetch/' + this._id + '/' + id, cb);
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
        if (res !== null) {
            var info = JSON.parse(res),
                data;

            if (!info.err && info.results) {
                // The object was retrieved successfully.
                data = info.results;
                // Save oldest tid
                if (data.length > 0) {
                    self._lastID = data[data.length-1].tid;
                }
                cb(null, data);
            } else {
                cb(info.err);
            }
        } else {
            cb('Network error');
        }
    });
};

