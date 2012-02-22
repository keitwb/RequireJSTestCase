// A simple singleton String utility class
define(function() {
    var StringUtil = {
        reverse: function(str) {
            var out = '';
            for (var i = str.length-1; i >= 0; i--) {
                out += str[i];
            }
            return out;
        },

        initialCap: function(str) {
            if (!str || !str.length) return str;

            return str[0].toUpperCase() + str.slice(1); 
        },
    };

    return StringUtil;
});
