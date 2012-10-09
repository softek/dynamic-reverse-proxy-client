var http = require("http");

var DynamicProxyClient = module.exports = function (options) {
   this.proxy = options.proxy;
   this.application = options.application;
   this.logger = options.logger;
   this.retry = options.retry;

   this.failedAttempts = 0;

   this.register();
};

DynamicProxyClient.prototype.register = function () {
   var req = http.request(this.proxy, bind(this.handleResponse, this));
   req.on("error", bind(this.retry, this));
   req.write(JSON.stringify(registration));
   req.end();
};

DynamicProxyClient.prototype.retry = function () {
   this.failedAttempts++;

   if (this.failedAttempts > this.retry.attempts) {
      setTimeout(bind(this.register, this), this.retry.timeout);
      this.retry.timeout = this.retry.timeout * 2;
   }
};

DynamicProxyClient.prototype.handleResponse = function (res) {
   if (res.statusCode !== 200) {
      this.logger.warn("Failed to register with reverse proxy:", res.statusCode);
      this.retry();
   }
   else {
      this.logger.info("Registered with reverse proxy.");
   }
};

var bind = function (fn, scope) {
   return function () { return fn.apply(scope, arguments); };
};