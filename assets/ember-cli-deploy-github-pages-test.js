"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('ember-cli-deploy-github-pages-test/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _ember, _emberResolver, _emberLoadInitializers, _emberCliDeployGithubPagesTestConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _emberCliDeployGithubPagesTestConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _emberCliDeployGithubPagesTestConfigEnvironment['default'].podModulePrefix,
    Resolver: _emberResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _emberCliDeployGithubPagesTestConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('ember-cli-deploy-github-pages-test/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _emberCliDeployGithubPagesTestConfigEnvironment) {

  var name = _emberCliDeployGithubPagesTestConfigEnvironment['default'].APP.name;
  var version = _emberCliDeployGithubPagesTestConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('ember-cli-deploy-github-pages-test/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('ember-cli-deploy-github-pages-test/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('ember-cli-deploy-github-pages-test/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _emberCliDeployGithubPagesTestConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_emberCliDeployGithubPagesTestConfigEnvironment['default'].APP.name, _emberCliDeployGithubPagesTestConfigEnvironment['default'].APP.version)
  };
});
define('ember-cli-deploy-github-pages-test/initializers/export-application-global', ['exports', 'ember', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _ember, _emberCliDeployGithubPagesTestConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_emberCliDeployGithubPagesTestConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _emberCliDeployGithubPagesTestConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_emberCliDeployGithubPagesTestConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('ember-cli-deploy-github-pages-test/router', ['exports', 'ember', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _ember, _emberCliDeployGithubPagesTestConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _emberCliDeployGithubPagesTestConfigEnvironment['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;
});
define("ember-cli-deploy-github-pages-test/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@1.13.11",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "ember-cli-deploy-github-pages-test/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1, "id", "title");
        var el2 = dom.createTextNode("Welcome to Ember!!!");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        return morphs;
      },
      statements: [["content", "outlet", ["loc", [null, [3, 0], [3, 10]]]]],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('ember-cli-deploy-github-pages-test/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-cli-deploy-github-pages-test';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (!runningTests) {
  require("ember-cli-deploy-github-pages-test/app")["default"].create({"name":"ember-cli-deploy-github-pages-test","version":"0.0.0+7b5baa19"});
}

/* jshint ignore:end */
//# sourceMappingURL=ember-cli-deploy-github-pages-test.map