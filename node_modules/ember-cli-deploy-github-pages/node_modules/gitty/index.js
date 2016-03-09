/**
* @module gitty
*/

var Repository = require('./lib/repository');
var Command = require('./lib/command');

/**
* Setup function for getting access to a GIT repo
* @constructor
* @param {string} path
* @param {string} [gitpath]
*/
var Gitty = function(path, gitpath) {
  return new Repository(path, gitpath);
};

/**
* Handles the global GIT configuration
* @param {string} key
* @param {string} val
* @param {function} callback
*/
Gitty.setConfig = function(key, val, callback) {
  var cmd = new Command(null, 'config', ['--global', key], '"' + val + '"');
  var done = callback || new Function();

  cmd.exec(function(err, stdout, stderr) {
    done(err || null);
  });
};

/**
* Handles the global GIT configuration
* @param {string} key
* @param {string} val
* @param {function} callback
*/
Gitty.setConfigSync = function(key, val) {
  var cmd = new Command(null, 'config', ['--global', key], '"' + val + '"');

  return cmd.execSync();
};

/**
* Handles the global GIT configuration
* @param {string} key
* @param {function} callback
*/
Gitty.getConfig = function(key, callback) {
  var cmd = new Command(null, 'config', ['--global', key]);
  var done = callback || new Function();

  cmd.exec(function(err, stdout, stderr) {
    done(err || null, stdout);
  });
};

/**
* Handles the global GIT configuration
* @param {string} key
* @param {function} callback
*/
Gitty.getConfigSync = function(key) {
  var cmd = new Command(null, 'config', ['--global', key]);

  return cmd.execSync();
};

/**
* Wrapper for the GIT clone function
* @param {string} path
* @param {string} url
* @param {object} creds
* @param {function} callback
*/
Gitty.clone = function(path, url) {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var creds = args[2].username ? args[2] : {};
  var done = args.slice(-1).pop() || new Function();
  var clone = new Command(null, 'clone', [url, path]);
  var error = null;

  clone.exec(function(err, stdout, stderr) {
    done(err);
  });
};

/**
* Export Contructor
* @constructor
* @type {object}
*/
module.exports = Gitty;

/**
* Export Repository Contructor
* @constructor
* @type {object}
*/
module.exports.Repository = Repository;

/**
* Export Command Contructor
* @constructor
* @type {object}
*/
module.exports.Command = Command;
