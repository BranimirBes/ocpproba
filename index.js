let httpProxy = require('http-proxy');

let proxy = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 4075,
    secure: false
  }
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'console-openshift-console.apps-crc.testing');
});

proxy.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});
 
console.log("listening on port 8888")
proxy.listen(8888);