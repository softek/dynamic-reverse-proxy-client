var http = require("http"),
    events = require("events"),
    https = require("https");

var DynamicProxyClient = module.exports = function (options) {
   this.proxy = options.proxy;
   this.application = options.application;
   this.retrySettings = options.retry;
   this.request = (options.https ? https : http).request;

   this.failedAttempts = 0;
   this.register();
};

DynamicProxyClient.prototype = Object.create(events.EventEmitter.prototype);

DynamicProxyClient.prototype.register = function () {
   var req = this.request(this.proxy, this.handleResponse.bind(this));
   req.on("error", this.retry.bind(this));
   req.write(JSON.stringify(this.application));
   req.end();
};

DynamicProxyClient.prototype.retry = function (reason) {
   this.failedAttempts++;

   var reason = "Failed to register with reverse proxy: " + reason,
       willRetry = this.failedAttempts < this.retrySettings.attempts;

   this.emit("error", reason, willRetry);

   if (willRetry) {
      setTimeout(this.register.bind(this), this.retrySettings.timeout);
   }
};

DynamicProxyClient.prototype.handleResponse = function (res) {
   if (res.statusCode >= 500) {
      this.retry(res.statusCode);
   }
   if (res.statusCode !== 200) {
      var body = "";
      res.on("data", function (data) { body += data; });
      res.on("end", function () {
         var reason = "Failed to register with reverse proxy (" + res.statusCode + "): " + body;
         this.emit("error", reason, false);
      }.bind(this));
   }
   else {
      this.emit("success");
   }
};