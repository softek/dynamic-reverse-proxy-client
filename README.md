# dynamic-reverse-proxy-client

A client to [dynamic-reverse-proxy](https://github.com/softek/dynamic-reverse-proxy). 

## Usage

```javascript
var reverseProxyClient = require("dynamic-reverse-proxy-client");

// This is actually the default, but this would be how to change it.
var proxy = {
   host: "localhost",
   port: "80",
   path: "/register",
   method: "POST"
};

var application = {
   path: "/test",
   port: 4321
};

reverseProxyClient({ application: application, proxy: proxy });
```