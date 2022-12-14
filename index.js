let httpProxy = require('http-proxy');
let https = require('https');

let proxy = httpProxy.createServer({
  target: "https://localhost:5075",
  agent: https.globalAgent,
  secure: false
})

function replaceRequestHost(stringValue) {
  stringValue = stringValue.replace("bosocp.xyz", "apps-crc.testing")
  stringValue = stringValue.replace("http", "https")
  return stringValue
}

proxy.on('proxyReq', function (proxyReq, req, res, options) {
  let reqHost = req.headers.host
  reqHost = replaceRequestHost(reqHost)
  proxyReq.setHeader('Host', reqHost);

  let reqReferer = req.headers.referer
  if (reqReferer && typeof reqReferer === "string") {
    reqReferer = replaceRequestHost(reqReferer)
    proxyReq.setHeader('Referer', reqReferer);
  }

  let reqOrigin = req.headers.origin;
  if (reqOrigin && typeof reqOrigin === "string") {
    reqOrigin = replaceRequestHost(reqOrigin)
    proxyReq.setHeader('Origin', reqOrigin);
  }
});

proxy.on('proxyRes', function (proxyRes, req, res) {
  let locationHeader = proxyRes.headers['location']
  if (locationHeader && typeof locationHeader === "string") {
    locationHeader = locationHeader.replace("apps-crc.testing", "bosocp.xyz")
    locationHeader = locationHeader.replace("https", "http")
    proxyRes.headers['location'] = locationHeader;
  }
});

proxy.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

console.log("listening on port 8888")
proxy.listen(80);

/*
let http = require('http')
http.createServer(function (req, res) {
  res.setHeader("Location", "apps-crc.testing")
  res.write('Hello World!'); //write a response to the client
  //res.setHeader("Location", "apps-crc.testing")
  res.end(); //end the response
}).listen(4075); //the server object listens on port 8080 */
