/*
 * RequireJSTestCase - JSTestDriver test case that integrates with RequireJS.
 * The main idea comes from <https://github.com/mbreeze/jstd_amd>, but does not do
 * stubbing, and assigns the deps directly to `this.r` in the test.
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
            if (this._depsLoaded) return;

            // The object the dependencies are attached to
            this[depObject] = {};

            // Grab the original config and reuse it with a different urlArgs
            // Is there any way to reuse config with the public API???
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

    this.name = name;
    this.deps = deps;
    this.methods = methods;

    AsyncTestCase(name, methods);
};

