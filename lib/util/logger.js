/*!
 * Copyright 2014 Digital Services, University of Cambridge Licensed
 * under the Educational Community License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var _ = require('underscore');
var bunyan = require('bunyan');

var config = require('../../config');

// The logger to use when no logger is specified
var SYSTEM_LOGGER_NAME = 'system';

// Logger state variables to record active loggers and current configuration
var loggers = {};

////////////////////////
//  PUBLIC FUNCTIONS  //
////////////////////////

/**
 * Create / retrieve a logger with the provided name.
 *
 * @param  {String}     name    The name of the logger
 * @return {Function}           A function that can be used to retrieve the logger
 */
var logger = module.exports.logger = function(name) {
    name = name || SYSTEM_LOGGER_NAME;

    // Lazy-load the logger and cache it so new loggers don't have to be recreated all the time
    if (!loggers[name]) {
        loggers[name] = _createLogger(name);
    }

    // Return a function that returns the logger.
    return function() {
        return loggers[name];
    };
};

//////////////////////////
//  INTERNAL FUNCTIONS  //
//////////////////////////

/**
 * Create a logger with the provided name.
 *
 * @param  {String}     name    The name to assign to the created logger
 * @api private
 */
var _createLogger = function(name) {
    var _config = _.extend({}, config.log);
    _config.name = name;
    return bunyan.createLogger(_config);
};
