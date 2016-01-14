# Gitty

[![Build Status](https://travis-ci.org/gordonwritescode/gitty.svg)](https://travis-ci.org/gordonwritescode/gitty)

Gitty is a Node.js wrapper for Git. It's syntax resembles the Git command line
syntax, executes common commands, and parses the output into operable objects.

## Installation

### Prerequisites

* Node.js 0.12.x (http://nodejs.org)
* Git 1.7.x.x (http://git-scm.com)

```
$ npm install gitty
```

### Testing

Run the the unit and integration tests with:

```
$ npm test
```

## Usage

```js
var git    = require('gitty');
var myRepo = git('/path/to/repo');
```

Now you can call this instance of `Repository`'s methods. For example, to
execute `git log` for `myRepo`, you would do:

```javascript
myRepo.log(function(err, log) {
	if (err) return console.log('Error:', err);
	// ...
});
```

### Where are the Docs?

For now, use the source, Luke. Pretty much everything you'll need is in
`lib/repository.js` and it's very readable. Running the test suite will be of
use as well since all public methods are tested and will print to the console.

## Authenticated Repositories

Gitty no longer supports username/password authentication over SSH. You should
be using SSH keys for that.

```javascript
myRepo.push('origin', 'master', function(err, succ) {
	if (err) return console.log(err);
	// ...
});
```

## Author

Gitty was written by Gordon Hall (gordon@gordonwritescode.com)  
Licensed under LGPLv3 license
