const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/stream/:url(*)', (req, res, next) => {
  const targetUrl = decodeURIComponent(req.params.url);

  if (!targetUrl.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    secure: false,
    pathRewrite: () => '',
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    }
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
