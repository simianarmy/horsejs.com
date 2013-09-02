/**
 * HorseJS API object
 */


function HorseJS (stuff) {
    this.PARSE_APP_ID = "M2DRuaNAnfzeQbBQubwFgfbmJJDRRbndjCCECou9";
    this.PARSE_JS_KEY = "9wVUdSrAPT6kKEkuPURTOSgbFYVvwkPbQXT8tzvA";
    this.ParseHorseObject = 'HorseTweet';
    this.ResultsPerQuery = 10;
    this._lastID = null;

    // Init Parse account
    Parse.initialize(this.PARSE_APP_ID, this.PARSE_JS_KEY);
};

/**
 * Call to hook int ready event
 * @param {Function} cb
 */
HorseJS.prototype.ready = function (cb) {
    // Query for first N tweets to return
    var query = this._createQuery();

    query.descending('tid');
    this._query(query, cb);
};

/**
 * Call to fetch N more items older than the current id
 * @param {Object} params
 *   count {Number} number of items to fetch
 * @param {Function} cb
 */
HorseJS.prototype.more = function (count, cb) {
    var query = this._createQuery();

    query.descending('tid');
    if (count > 0) {
        query.limit(count);
    }
    if (this._lastID !== null) {
        query.lessThan('tid', this._lastID);
    }
    this._query(query, cb);
};

HorseJS.prototype._createQuery = function () {
    var hjs = Parse.Object.extend(this.ParseHorseObject),
        query = new Parse.Query(hjs);
        
    query.limit(this.ResultsPerQuery);

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
