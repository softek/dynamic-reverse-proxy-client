var DynamicProxyClient = require("./lib/dynamicProxyClient"),
    defaults = {
       proxy: {
          host: "localhost",
          port: "80",
          path: "/routes",
          method: "POST"
       },
       retry: {
         attempts: 10,
         timeout: 5000
       },
       application: {},
       https: false
    };

module.exports = function (options) {
   options = merge(defaults, options || {});
   return new DynamicProxyClient(options);
};

var merge = function (base, addition) {
   var result = {};
   var key;
   for (key in base || {}) { result[key] = base[key]; }
   for (key in addition || {}) { result[key] = addition[key]; }
   return result;
};
