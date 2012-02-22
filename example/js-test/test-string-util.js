RequireJSTestCase('string-util', 
    {
        StringUtil: 'string-util',
    },
    {
        setUp: function() {
            this.testStr = 'this is a test';
        },

        "test initalCaps": function() {
            var str = this.r.StringUtil.initialCap(this.testStr);
            assertEquals("string was capitalized", 'This is a test', str);
        },

        "test initialCaps empty string": function() {
            var str;

            assertNoException(function() {
                str = this.r.StringUtil.initialCap('');
            });
            assertEquals("str is empty", '', str);
        },

        "test reverse": function() {
            var str = this.r.StringUtil.reverse(this.testStr);
            assertEquals("string was reversed", 'tset a si siht', str);
        },
    }
);
