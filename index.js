var winston = require("winston"),
    DynamicProxyClient = require("./lib/dynamicProxyClient"),
    defaults = {
       proxy: {
          host: "localhost",
          port: "80",
          path: "/register",
          method: "POST"
       },
       retry: {
         attempts: 10,
         timeout: 5000
       },
       application: {},
       logger: winston,
       https: false
    };

module.exports = function (options) {
   options = merge(defaults, options || {});

   if (!(options.application && options.application.path && options.application.port)) {
      return options.logger.error("Failed to register with reverse proxy: path and port are required configuration.");
   }

   return new DynamicProxyClient(options);
};

var merge = function (base, addition) {
   var result = {};
   for (key in base || {}) { result[key] = base[key]; }
   for (key in addition || {}) { result[key] = addition[key]; }
   return result;
};