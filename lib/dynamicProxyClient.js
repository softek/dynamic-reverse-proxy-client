var http = require("http"),
    https = require("https");

var DynamicProxyClient = module.exports = function (options) {
   this.proxy = options.proxy;
   this.application = options.application;
   this.logger = options.logger;
   this.retrySettings = options.retry;
   this.request = (options.https ? https : http).request;

   this.failedAttempts = 0;

   this.register();
};

DynamicProxyClient.prototype.register = function () {
   var req = this.request(this.proxy, bind(this.handleResponse, this));
   req.on("error", bind(this.retry, this));
   req.write(JSON.stringify(this.application));
   req.end();
};

DynamicProxyClient.prototype.retry = function (reason) {
   this.failedAttempts++;

   this.logger.warn("Failed to register with reverse proxy:", reason);

   if (this.failedAttempts < this.retrySettings.attempts) {
      var remaining = this.retrySettings.attempts - this.failedAttempts;
      this.logger.info("Retrying registration with reverse proxy in " + this.retrySettings.timeout + " ms. " + remaining + " attempt(s) remaining.")
      setTimeout(bind(this.register, this), this.retrySettings.timeout);
      this.retrySettings.timeout = this.retrySettings.timeout * 2;
   }
   else {
      this.logger.error("Failed to register with reverse proxy. No retries left.");
   }
};

DynamicProxyClient.prototype.handleResponse = function (res) {
   if (res.statusCode !== 200) {
      this.retry(res.statusCode);
   }
   else {
      this.logger.info("Registered with reverse proxy.");
   }
};

var bind = function (fn, scope) {
   return function () { return fn.apply(scope, arguments); };
};