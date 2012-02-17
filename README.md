# RequireJSTestCase

A test case for [JsTestDriver](http://code.google.com/p/js-test-driver/) that
allows the dynamic use of [RequireJS](http://requirejs.org/) modules without
having to compile the modules with r.js.

## Credit
Inspired by [jstd\_amd](https://github.com/mbreeze/jstd_amd), but distinct
enough that is is not a fork.  `jstd_amd` supports stubbing, and you access the
dependencies a bit differently.  Otherwise, I copied the same technique of
using `AsyncTestCase` to make sure the dependencies load before the setup method
is called for the first test.  If you want to stub modules, check out
[Sinon.JS](http://sinonjs.org).

# Usage

Here's how to declare a test case:

```javascript
    RequireJSTestCase("testname",
        {
            FirstDep: 'lib/first-dep',
            SecondDep: 'lib/second-dep',
        },
        {
            setUp: function() {
            },
            
            "test modules loaded": function() {
                // Some JSTestDriver assertions
                assertNotUndefined("FirstDep is present", this.r.FirstDep);
                assertNotUndefined("SecondDep is present", this.r.SecondDep);
            },
        }
    );
```

As you can see, `this.r` is where all the loaded dependencies reside.

There are three arguments to `RequireJSTestCase(testname, dependencies, methods)`:

- `testname`: the JSTestDriver test name
- `dependencies`: an object whose keys are the local name for the module, and
whose values are the requireJS dependency names.  The local name is used as the
key to access the loaded module out of the `this.r` object.
- `methods`: this is the normal object that you would pass to a JsTestDriver test
case.  Since we use `AsyncTestCase` behind the scenes, all the test methods are
passed a queue object you can use for async testing if so needed.

## RequireJS/JsTestDriver config

In `jsTestDriver.conf`, just make sure `require.js` and `require-js-testcase.js`
are loaded before your scripts (obviously).

To set the RequireJS config, just create a separate script that is loaded after
require but before your tests:

```javascript
    // tests/require-config.js
    require.config({
        // Assuming your modules are under the /js folder on your test server
        baseUrl: '/js',
    });
```

Then, specify the file in the right order (after `require.js`) in the jsTestDriver.conf file:

```yaml
    # jsTestDriver.conf
    server: ...
    load:
     # ...
     - lib/require.js
     - tests/require-config.js
     - tests/lib/require-js-testcase.js
     # test cases go here...

    # This allows the modules to be loaded dynamically from a local test server.
    # Can also use the 'serve' option
    proxy: 
     - {matcher: "*", server: "http://localhost:3000"}
```

JsTestDriver also appears to have a `serve` directive which could be used
instead of `proxy` if you don't want to be dependant on a separate server.

Presently, there is no way to specify test-specific config for RequireJS.

## Running JsTestDriver

jstd\_amd requires you to run JsTestDriver with the `--reset` option to reset
the runner everytime.  It seems to work quite well that way, so do it.  Plus, it
seems with this option, you can refresh the capture window and JSTestDriver
won't konk out on you so much for doing so. 

Updates to your app code will be seen upon rerunning a test since we use the
`urlArgs` config option in RequireJS to circumvent the RequireJS module cache.
Unfortunately, if you use Firebug to debug your tests, this means you can't set
breakpoints in your app code unless you put a breakpoint at the beginning of the
test and then find the proper js file that has been reloaded and breakpoint it
after the test begins.  Firebug can get quite cluttered with the reloaded
scripts over time, but a simple refresh of the JsTestDriver capture window will
clear it.

# Compatibility

RequireJSTestCase has been tested with RequireJS 1.0.5 and JsTestDriver 1.3.2.  There
is one dependency on an undocumented feature of RequireJS (the `require.s.contexts.\_`
object).  Otherwise, it should work with future versions without a problem.
