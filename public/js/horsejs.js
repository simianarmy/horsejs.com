/**
 * HorseJS API object
 */


function HorseJS (stuff) {
    this.PARSE_APP_ID = "M2DRuaNAnfzeQbBQubwFgfbmJJDRRbndjCCECou9";
    this.PARSE_JS_KEY = "9wVUdSrAPT6kKEkuPURTOSgbFYVvwkPbQXT8tzvA";
    this.ParseHorseObject = 'HorseTweet';
    this.ResultsPerQuery = 10;

    // Init Parse account
    Parse.initialize(this.PARSE_APP_ID, this.PARSE_JS_KEY);
};

/**
 * Call to hook int ready event
 * @param {Function} cb
 */
HorseJS.prototype.ready = function (cb) {
    // Query for first N tweets to return
    var hjs = Parse.Object.extend(this.ParseHorseObject);
    var query = new Parse.Query(hjs);

    query.limit(this.ResultsPerQuery);
    query.descending('tid');

    query.find({
        success: function(results) {
            // The object was retrieved successfully.
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

