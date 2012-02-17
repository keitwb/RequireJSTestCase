# RequireJSTestCase

A test case for JSTestDriver that allows the dynamic use of RequireJS modules.

## Credit
Inspired by [jstd _ amd](https://github.com/mbreeze/jstd_amd), but distinct
enough that is is not a fork.  jstd _ amd supports stubbing, and you access the
dependencies a bit differently.  Otherwise, I copied the same technique of
using AsyncTestCase to make sure the dependencies load before the setup method
is called for the first test.  If you want to stub modules, check out
[Sinon.JS](http://sinonjs.org).

# Usage

Here's how to declare a testcase:

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

As you can see, `this.r` is where all the loaded dependencies reside.

There are three arguments to `RequireJSTestCase(testname, dependencies, methods)`:

- `testname`: the JSTestDriver test name
- `dependencies`: an object whose keys are the local name for the module, and
whose values are the requireJS dependency names.  The local name is used as the
key to access the loaded module out of the `this.r` object.
- `methods`: this is the normal object that you would pass to a JSTestDriver test
case.  Since we use `AsyncTestCase` behind the scenes, all the test methods are
passed a queue object you can use for async testing if so needed.
