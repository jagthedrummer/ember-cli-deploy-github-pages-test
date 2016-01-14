/**
* @module gitty/repository
*/

var fs = require('fs');
var path = require('path');
var util = require('util');
var Command = require('./command');
var parse = require('./parser');
var events = require('events');
var logFmt = '--pretty=format:\'{"commit":"%H","author":"%an <%ae>",' +
             '"date":"%ad","message":"%s"}\',';
if (require('os').platform() === 'win32') {
	logFmt = '--pretty=format:{\\"commit\\":\\""%H"\\",\\"author\\":\\""%an ^<%ae^>"\\",' +
             '\\"date\\":\\"%ad\\",\\"message\\":\\"%s\\"},';
}

/**
* Constructor function for all repository commands
* @constructor
* @param {string} repo
* @param {string} gitpath
*/
var Repository = function(repo, gitpath) {
  var self = this;

  events.EventEmitter.call(this);

  self.gitpath = gitpath ? path.normalize(gitpath) : '';
  self.path = path.normalize(repo);
  self._ready = false;
  self.name = path.basename(self.path);

  fs.exists(self.path + '/.git', function(exists) {
    self.initialized = exists;
    self._ready = true;

    self.emit('ready');
  });
};

util.inherits(Repository, events.EventEmitter);

/**
* Initializes the given directory as a GIT repository
* #init
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.init = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var flags = Array.isArray(args[0]) ? args[0] : [];
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'init', flags, '');

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err || new Error(stderr));
    }

    self.initialized = true;

    done();
  });
};

/**
* Initializes the given directory as a GIT repository
* #initSync
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.initSync = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var flags = Array.isArray(args[0]) ? args[0] : [];
  var cmd = new Command(self, 'init', flags, '');

  cmd.execSync();

  return self.initialized = true;
};

/**
* Forwards the commit history to the callback function
* #log
* @param {string} path - optional branch or path
* @param {function} callback
*/
Repository.prototype.log = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var path = typeof args[0] === 'string' ? args[0] : '';
  var done = args.slice(-1).pop() || function() { };
  var cmd = new Command(self, 'log', [logFmt, path]);

  cmd.exec(function(err, stdout, stderr) {
    if (err || stderr) {
      return done(err || new Error(stderr));
    }

    done(null, parse.log(stdout));
  });
};

/**
* Returns the commit history
* #logSync
* @param {string} branch
*/
Repository.prototype.logSync = function(branch) {
  var self = this;
  var cmd = new Command(self, 'log', [logFmt, branch || '']);

  return parse.log(cmd.execSync());
};

/**
* Forwards the GIT status object to the callback function
* #status
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.status = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[0]) ? args[0] : [];
  var status = new Command(self, 'status', flags);
  var lsFiles = new Command(self, 'ls-files', ['-o','--exclude-standard']);

  status.exec(function(err, status, stderr) {
    if (err) {
      return done(err);
    }

    lsFiles.exec(function(err, untracked, stderr) {
      if (err) {
        return done(err);
      }

      done(null, parse.status(status, untracked));
    });
  });
};

/**
* Returns the GIT status object
* #statusSync
* @param {array} flags
*/
Repository.prototype.statusSync = function(flags) {
  var self = this;
  var status = new Command(self, 'status', flags);
  var lsFiles = new Command(self, 'ls-files', ['-o','--exclude-standard']);

  return parse.status(status.execSync(), lsFiles.execSync());
};

/**
* Stages the passed array of files for commiting
* #add
* @param {array} files
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.add = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var files = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'add', flags, files.join(' '));

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Stages the passed array of files for commiting
* #addSync
* @param {array} files
* @param {array} flags
*/
Repository.prototype.addSync = function(files, flags) {
  var self = this;
  var cmd = new Command(self, 'add', flags || [], files.join(' '));

  return cmd.execSync();
};

/**
* Removes the passed array of files from the repo for commiting
* #remove
* @param {array} files
* @param {function} callback
*/
Repository.prototype.remove = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var files = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : ['--cached'];
  var cmd = new Command(self, 'rm', flags, files.join(' '));

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      done(err);
    }

    done(null);
  });
};

/**
* Removes the passed array of files from the repo for commiting
* #removeSync
* @param {array} files
* @param {array} flags
*/
Repository.prototype.removeSync = function(files, flags) {
  var self = this;
  var cmd = new Command(self, 'rm', flags || ['--cached'], files.join(' '));

  return cmd.execSync();
};

/**
* Unstages the passed array of files from the staging area
* #unstage
* @param {array} files
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.unstage = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var files = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'reset HEAD', flags, files.join(' '));

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Unstages the passed array of files from the staging area
* #unstageSync
* @param {array} files
* @param {array} flags
*/
Repository.prototype.unstageSync = function(files, flags) {
  var self = this;
  var cmd = new Command(self, 'reset HEAD', flags || [], files.join(' '));

  return cmd.execSync();
};

/**
* Commits the staged area with the given message
* #commit
* @param {string} message
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.commit = function() {
  var args = Array.prototype.slice.apply(arguments);
  var message = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1].push('-m') : ['-m'];
  var cmd = new Command(this, 'commit', flags, '"' + message + '"');

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    var result = stdout ? parse.commit(stdout) : {};

    if (result.error) {
      return done(result.error);
    }

    done(null, result);
  });
};

/**
* Commits the staged area with the given message
* #commitSync
* @param {string} message
* @param {array} flags
*/
Repository.prototype.commitSync = function(message, flags) {
  var self = this;
  flags = Array.isArray(flags) ? flags.push('-m') : ['-m'];
  var cmd = new Command(this, 'commit', flags, '"' + message + '"');
  var output = cmd.execSync();
  var result = output ? parse.commit(output) : {};

  if (result.error) {
    throw new Error(result.error);
  }

  return result;
};

/**
* Forwards object with the current branch and all others to the callback
* #getBranches
* @param {function} callback
*/
Repository.prototype.getBranches = function(callback) {
  var self = this;
  var done = callback || function() { };
  var cmd = new Command(self, 'branch');

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null, parse.branch(stdout));
  });
};

/**
* Returns a denoted object with the current branch and all other branches
* #getBranchesSync
* @param {function} callback
*/
Repository.prototype.getBranchesSync = function() {
  var self = this;
  var cmd = new Command(self, 'branch');

  return parse.branch(cmd.execSync());
};

/**
* Creates a new branch with the given branch name
* #createBranch
* @param {string} name
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.createBranch = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var name = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'branch', flags, name);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Creates a new branch with the given branch name
* #createBranchSync
* @param {string} name
* @param {array} flags
*/
Repository.prototype.createBranchSync = function(name, flags) {
  var self = this;
  var cmd = new Command(self, 'branch', flags || [], name);

  return cmd.execSync();
};

/**
* Performs a GIT checkout on the given branch
* #checkout
* @param {string} branch
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.checkout = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var branch = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'checkout', flags, branch);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    self.getBranches(done);
  });
};

/**
* Performs a GIT checkout on the given branch
* #checkoutSync
* @param {string} branch
* @param {array} flags
*/
Repository.prototype.checkoutSync = function(branch, flags) {
  var self = this;
  var cmd = new Command(self, 'checkout', flags || [], branch);

  cmd.execSync();

  return self.getBranchesSync();
};

/**
* Performs a GIT merge in the current branch against the specified one
* #merge
* @param {string} branch
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.merge = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var branch = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'merge', flags, branch);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Performs a GIT merge in the current branch against the specified one
* #mergeSync
* @param {string} branch
*/
Repository.prototype.mergeSync = function(branch, flags) {
  var self = this;
  var cmd = new Command(self, 'merge', flags || [], branch);

  return cmd.execSync();
};

/**
* Forwards a array of repositorys'tags to the callback function
* #getTags
* @param {function} callback
*/
Repository.prototype.getTags = function(callback) {
  var self = this;
  var done = callback || function() { };
  var cmd = new Command(self, 'tag');

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null, parse.tag(stdout));
  });
};

/**
* Forwards a array of repositorys'tags to the callback function
* #getTagsSync
*/
Repository.prototype.getTagsSync = function() {
  var self = this;
  var cmd = new Command(self, 'tag');

  return parse.tag(cmd.execSync());
};

/**
* Creates a new tag from the given tag name
* #createTag
* @param {string} name
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.createTag = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var name = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'tag', flags, name);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Creates a new tag from the given tag name
* #createTagSync
* @param {string} name
* @param {array} flags
*/
Repository.prototype.createTagSync = function(name, flags) {
  var self = this;
  var cmd = new Command(self, 'tag', flags || [], name);

  return cmd.execSync();
};

/**
* Adds a new remote
* #addRemote
* @param {string} remote
* @param {string} url
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.addRemote = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var remote = args[0];
  var url = args[1];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[2]) ? args[2] : [];
  var cmd = new Command(self, 'remote add', flags, remote + ' ' + url);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Adds a new remote
* #addRemoteSync
* @param {string} remote
* @param {string} url
* @param {array} flags
*/
Repository.prototype.addRemoteSync = function(remote, url, flags) {
  var self = this;
  var cmd = new Command(self, 'remote add', flags || [], remote + ' ' + url);

  return cmd.execSync();
};

/**
* Changes the URL of a existing remote
* #setRemoteUrl
* @param {string} remote
* @param {string} url
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.setRemoteUrl = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var remote = args[0];
  var url = args[1];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[2]) ? args[2] : [];
  var cmd = new Command(self, 'remote set-url', flags, remote + ' ' + url);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Changes the URL of a existing remote
* #setRemoteUrlSync
* @param {string} remote
* @param {string} url
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.setRemoteUrlSync = function(remote, url, flags) {
  var self = this;
  var cmd = new Command(self, 'remote set-url', flags || [], remote + ' ' + url);

  return cmd.execSync();
};

/**
* Removes the given remote
* #removeRemote
* @param {string} remote
* @param {array} flags
* @param {function} callback
*/
Repository.prototype.removeRemote = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var remote = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd = new Command(self, 'remote rm', flags, remote);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Removes the given remote
* #removeRemoteSync
* @param {string} remote
* @param {array} flags
*/
Repository.prototype.removeRemoteSync = function(remote, flags) {
  var self = this;
  var cmd = new Command(self, 'remote rm', flags || [], remote);

  return cmd.execSync();
};

/**
* Forwards a key-value list (remote : url) to the callback function
* #getRemotes
* @param  {Function} callback
*/
Repository.prototype.getRemotes = function(callback) {
  var self = this;
  var done = callback || function() { };
  var cmd = new Command(self, 'remote', ['-v']);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null, parse.remotes(stdout));
  });
};

/**
* Returns a key-value list (remote : url)
* getRemotesSync
* @param {function} callback
*/
Repository.prototype.getRemotesSync = function() {
  var self = this;
  var cmd = new Command(self, 'remote', ['-v']);

  return parse.remotes(cmd.execSync());
};

/**
* Performs a GIT push to the given remote for the given branch name
* #push
* @param {string} remote
* @param {string} branch
* @param {array} flags
* @param {object} creds
* @param {function} callback
*/
Repository.prototype.push = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var remote = args[0];
  var branch = args[1];
  var done = args.slice(-1).pop();
  var flags = Array.isArray(args[2]) ? args[2] : null;
  var creds = null;

  if (flags && args[3].username) {
    creds = args[3];
  }
  else if (args[2].username) {
    creds = args[2];
  }

  return sync(self, {
    operation: 'push',
    remote: remote,
    branch: branch,
    flags: flags,
    credentials: creds || { username: null, password: null }
  }, done);
};

/**
* Performs a GIT pull from the given remote with the given branch name
* #pull
* @param {string} remote
* @param {string} branch
* @param {array} flags
* @param {object} creds
* @param {function} callback
*/
Repository.prototype.pull = function() {
  var self = this;
  var args = Array.prototype.slice.apply(arguments);
  var remote = args[0];
  var branch = args[1];
  var done = args.slice(-1).pop();
  var flags = Array.isArray(args[2]) ? args[2] : null;
  var creds = null;

  if (flags && args[3].username) {
    creds = args[3];
  }
  else if (args[2].username) {
    creds = args[2];
  }

  return sync(this, {
    operation: 'pull',
    remote: remote,
    branch: branch,
    flags: flags,
    credentials: creds || { username: null, password: null }
  }, done);
};

/**
* Internal function to create a fake terminal to circumvent SSH limitations
* @param {object} options
* @param {function} callback
*/
function sync(repo, opts, callback) {
  var self = this;
  var done = callback || function() { };
  var flags = opts.flags || [];
  var creds = opts.credentials;
  var options = [opts.remote, opts.branch].concat(flags);
  var cmd = new Command(repo, opts.operation, options);

  cmd.exec(function(err, stdout, stderr) {
    done(err);
  });
}

/**
* Resets the repository's HEAD to the specified commit
* #reset
* @param {string} hash
* @param {function} callback
*/
Repository.prototype.reset = function(hash, callback) {
  var self = this;
  var done = callback || function() { };
  var cmd = new Command(self, 'reset', ['--hard'], hash);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    self.log(function(err, log) {
      if (err) {
        return done(err);
      }

      done(null, log);
    });
  });
};

/**
* Resets the repository's HEAD to the specified commit
* #resetSync
* @param {string} hash
*/
Repository.prototype.resetSync = function(hash) {
  var self = this;
  var cmd = new Command(self, 'reset', ['--hard'], hash);

  cmd.execSync();

  return self.logSync();
};

/**
* Forwards the current commit hash to the callback function
* #describe
* @param {function} callback
*/
Repository.prototype.describe = function(callback) {
  var self = this;
  var done = callback || function() { };
  var cmd = new Command(self, 'describe', ['--always']);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null, stdout);
  });
};

/**
* Returns the current commit hash
* #describeSync
*/
Repository.prototype.describeSync = function() {
  var self = this;
  var cmd = new Command(self, 'describe', ['--always']);

  return cmd.execSync();
};

/**
* Allows cherry-picking
* #cherryPick
* @param {string} commit - commit hash
* @param {function} callback
* @param {array} flags
*/
Repository.prototype.cherryPick = function() {
  var self = this;  var args = Array.prototype.slice.apply(arguments);
  var commit = args[0];
  var done = args.slice(-1).pop() || function() { };
  var flags = Array.isArray(args[1]) ? args[1] : [];
  var cmd  = new Command(self, 'cherry-pick', flags, commit);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }

    done(null);
  });
};

/**
* Allows cherry-picking
* #cherryPickSync
* @param {string} commit - commit hash
* @param {function} callback
* @param {array} flags
*/
Repository.prototype.cherryPickSync = function(commit, flags) {
  var self = this;
  var cmd = new Command(self, 'cherry-pick', flags || [], commit);

  return cmd.execSync();
};

/**
* Allows show
* #show
* @param {string} commit
* @param {string} filePath - full path of the file relative to the repo
* @param {function} callback
*/
Repository.prototype.show = function(commit, filePath, callback) {
  var self = this;
  var done = callback || function() { };
  var revision = commit + ':' + filePath;
  var cmd  = new Command(self, 'show', [], revision);

  cmd.exec(function(err, stdout, stderr) {
    if (err) {
      return done(err);
    }
    done(null, stdout);
  });
};

/**
* Allows show
* #showSync
* @param {string} commit - commit hash
* @param {string} filePath - full path of the file relative to the repo
*/
Repository.prototype.showSync = function(commit, filePath) {
  var self = this;
  var revision = commit + ':' + filePath;
  var cmd = new Command(self, 'show', [], revision);

  return cmd.execSync();
};

/**
 * Export Constructor
 * @type {object}
 */
module.exports = Repository;
