# dynamic-reverse-proxy-client

A client to [dynamic-reverse-proxy](https://github.com/softek/dynamic-reverse-proxy). 

## Usage

```javascript
var reverseProxyClient = require("dynamic-reverse-proxy-client");

// This is actually the default, but this would be how to change it.
var proxy = {
   host: "localhost",
   port: "80",
   path: "/routes",
   method: "POST"
};

var application = {
   prefix: "/test",
   port: 4321
};

var client = reverseProxyClient({ application: application, proxy: proxy });

client.on("error", function (reason, willRetry) {
   console.log(reason, (willRetry ? "This request will be retried." : "This request will NOT be retried."));
});

client.on("success", function () {
   console.log("Registered.");
});
```