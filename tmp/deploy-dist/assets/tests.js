define('ember-cli-deploy-github-pages-test/tests/app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('ember-cli-deploy-github-pages-test/tests/helpers/destroy-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/destroy-app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember-cli-deploy-github-pages-test/tests/helpers/start-app', 'ember-cli-deploy-github-pages-test/tests/helpers/destroy-app'], function (exports, _qunit, _emberCliDeployGithubPagesTestTestsHelpersStartApp, _emberCliDeployGithubPagesTestTestsHelpersDestroyApp) {
  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _emberCliDeployGithubPagesTestTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        (0, _emberCliDeployGithubPagesTestTestsHelpersDestroyApp['default'])(this.application);

        if (options.afterEach) {
          options.afterEach.apply(this, arguments);
        }
      }
    });
  };
});
define('ember-cli-deploy-github-pages-test/tests/helpers/module-for-acceptance.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/module-for-acceptance.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/helpers/resolver', ['exports', 'ember/resolver', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _emberResolver, _emberCliDeployGithubPagesTestConfigEnvironment) {

  var resolver = _emberResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _emberCliDeployGithubPagesTestConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _emberCliDeployGithubPagesTestConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('ember-cli-deploy-github-pages-test/tests/helpers/resolver.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/helpers/start-app', ['exports', 'ember', 'ember-cli-deploy-github-pages-test/app', 'ember-cli-deploy-github-pages-test/config/environment'], function (exports, _ember, _emberCliDeployGithubPagesTestApp, _emberCliDeployGithubPagesTestConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _emberCliDeployGithubPagesTestConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _emberCliDeployGithubPagesTestApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('ember-cli-deploy-github-pages-test/tests/helpers/start-app.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/router.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('ember-cli-deploy-github-pages-test/tests/test-helper', ['exports', 'ember-cli-deploy-github-pages-test/tests/helpers/resolver', 'ember-qunit'], function (exports, _emberCliDeployGithubPagesTestTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_emberCliDeployGithubPagesTestTestsHelpersResolver['default']);
});
define('ember-cli-deploy-github-pages-test/tests/test-helper.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('ember-cli-deploy-github-pages-test/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map