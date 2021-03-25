const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const httpProxy = require("http-proxy");
const apiProxy = httpProxy.createProxyServer();
const proxies = require('../proxy')
const lodash = require('lodash')
const zpConfig = require('../../internals/config')

function createWebpackMiddleware (compiler, publicPath) {
  return webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath,
    silent: true,
    stats: 'errors-only',
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'DNT, User-Agent, X-Requested-With, If-Modified-Since, Cache-Control, Content-Type, Range',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
    }
  })
}

module.exports = function addDevMiddlewares (app, webpackConfig) {
  const compiler = webpack(webpackConfig)
  const middleware = createWebpackMiddleware(compiler, webpackConfig.output.publicPath)

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler, {
    path: `${zpConfig.publicPath}__webpack_hmr`,
    reload: true,
    log: console.log
  }))

  proxies.forEach(function (config) {
    lodash.forEach(config, function(target, basePath) {
      // Proxy api requests
      app.use(basePath, function(req, res) {
        req.url = req.originalUrl;
        apiProxy.web(req, res, {
          target: target
        });
      });
    })
  })

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = middleware.fileSystem

  app.get('*', (req, res) => {
    fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
      if (err) {
        res.sendStatus(404)
      } else {
        res.send(file.toString())
      }
    })
  })
}
