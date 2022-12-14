let httpProxy = require('http-proxy');
let https = require('https');

let proxy = httpProxy.createServer({
  target: "https://localhost:5075",
  agent: https.globalAgent,
  secure: false
})

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  let reqHost = req.headers.host
  reqHost = reqHost.replace("bosocp.xyz", "apps-crc.testing")
  proxyReq.setHeader('Host', reqHost);

  let reqReferer = req.headers.referer
  if (reqReferer && typeof reqReferer === "string") {
    reqReferer = reqReferer.replace("bosocp.xyz", "apps-crc.testing")
    proxyReq.setHeader('Referer', reqReferer);
  }
});

proxy.on('proxyRes', function (proxyRes, req, res) {
  let locationHeader = proxyRes.headers['location']
  if (locationHeader && typeof locationHeader === "string") {
    locationHeader = locationHeader.replace("apps-crc.testing", "bosocp.xyz")
    proxyRes.headers['location'] = locationHeader;
  }
});

proxy.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

console.log("listening on port 8888")
proxy.listen(8888);

/*
let http = require('http')
http.createServer(function (req, res) {
  res.setHeader("Location", "apps-crc.testing")
  res.write('Hello World!'); //write a response to the client
  //res.setHeader("Location", "apps-crc.testing")
  res.end(); //end the response
}).listen(4075); //the server object listens on port 8080 */
