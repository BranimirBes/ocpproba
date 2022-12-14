let httpProxy = require('http-proxy');

let proxy = new httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 4075,
    secure: false
  }
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  let reqHost = proxyReq.headers.get("Host")
  reqHost.replace("bosocp.xyz", "apps-crc.testing")
  proxyReq.setHeader('Host', reqHost);

  let reqReferer = proxyReq.headers.get("Referer")
  if (reqReferer && reqReferer.contains("bosocp.xyz")) {
    reqHost.replace("bosocp.xyz", "apps-crc.testing")
  }

  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    let resLocation = res.getHeader('location');
    if (resLocation && typeof resLocation === "string" && resLocation.includes("apps-crc.testing")) {
      resLocation.replace("apps-crc.testing", "bosocp.xyz")
      res.setHeader('location', resLocation);
    }

    res.oldWriteHead(statusCode, headers);
  }

});

proxy.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});
 
console.log("listening on port 8888")
proxy.listen(8888);