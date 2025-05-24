const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/stream/:url(*)', createProxyMiddleware({
  target: '',
  changeOrigin: true,
  secure: false,
  router: req => {
    const url = decodeURIComponent(req.params.url);
    return url.startsWith('http') ? new URL(url).origin : '';
  },
  pathRewrite: (path, req) => {
    const url = decodeURIComponent(req.params.url);
    return new URL(url).pathname + new URL(url).search;
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = '*';
  }
}));

app.listen(process.env.PORT || 3000, () => {
  console.log('CORS proxy running');
});
