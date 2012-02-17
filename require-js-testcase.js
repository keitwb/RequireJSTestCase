/*
 * RequireJSTestCase - JSTestDriver test case that integrates with RequireJS.
 * The main idea comes from <https://github.com/mbreeze/jstd_amd>, but does not do
 * stubbing, and assigns the deps directly to `this` in the test.
 *
 * Note that you should run JSTestDriver with the '--reset' flag so that the
 * RequireJS cache is reset so it will reload any changes you make to the
 * application code.
 *
 * Tested with RequireJS 1.0.5
 */
window.RequireJSTestCase = function(name, deps, methods) {
    var depPaths = [], // The requireJs path string
        depProps = [], // The name of the property of 'depObject' that will be set
        bust = 'bust=' + (new Date()).getTime(), // Used to bust RequireJS's cache
        depObject = 'r'; // This holds the dependencies and is attached to 'this'

    if (deps instanceof Array) {
        // Just make the property name the same as the requireJS path name.
        depProps = depPaths = deps;
    }
    else if (typeof deps === 'object') {
        for (var key in deps) {
            if (deps.hasOwnProperty(key)) {
                depProps.push(key);
                depPaths.push(deps[key]);
            }
        }
    }
    else {
        throw new Error('Dependencies must be an array or object');
    }

    var self = this;

    var setUp = methods.setUp;
    methods.setUp = function(queue) {
        queue.call('Loading dependencies', function(callbacks) {
            console.log(this._depsLoaded);
            if (this._depsLoaded) return;

            // The object the dependencies are attached to
            this[depObject] = {};

            var config = require.s.contexts._.config;
            config.urlArgs = bust;

            var req = require.config(config);

            req(depPaths, callbacks.add(function() {
                for (var i = 0; i < arguments.length; i++) {
                    this[depObject][depProps[i]] = arguments[i];
                }
                this._depsLoaded = true;
            }));
        });

        if (setUp && typeof setUp === 'function') {
            queue.call('Calling original setUp', function(callbacks) {
                setUp.call(this, queue);
            });
        }
    };

    AsyncTestCase(name, methods);
};
