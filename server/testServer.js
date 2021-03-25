const express = require('express')
const app = express()
const path = require('path')

const httpProxy = require("http-proxy");
const apiProxy = httpProxy.createProxyServer();
const proxies = require('./proxy')
const lodash = require('lodash')
const bodyParser = require('body-parser')
const jsonic = require('jsonic')

const customApis = {}

const apiBasePaths = lodash.flatMap(proxies, function(config) {
  return lodash.reduce(config, function (result, host, basePath) {
    result.push(basePath.replace('/*', ''))
    return result
  }, [])
})

app.set('view engine', 'ejs');

app.use('/js', express.static('js'))

app.get('/custom/api/list', function (req, res) {
  res.render('list_custom_api', {
    apis: customApis
  })
})

app.get('/custom/api/edit', bodyParser.urlencoded({extended: false}), bodyParser.json(), function (req, res) {
  res.render('custom_api', {
    api: customApis[req.query.id]
  })
})

app.get('/custom/api', function (req, res) {
  res.render('custom_api')
})

app.post('/custom/api', bodyParser.urlencoded({extended: false}), bodyParser.json(), function (req, res) {
  const info = req.body
  try {
    info.data = jsonic(info.data)
  } catch (e) {
    console.log(e)
  }
  customApis[`${info.path}@@${info.method}`] = info
  res.send({})
})

app.del('/custom/api', bodyParser.urlencoded({extended: false}), bodyParser.json(), function (req, res) {
  delete customApis[req.query.id]
  res.send({})
})

app.use(function (req, res, next) {
  let reqPath = req.path
  apiBasePaths.forEach(function (basePath) {
    reqPath = reqPath.replace(basePath, '')
  })

  const customInfo = customApis[`${reqPath}@@${req.method}`]
  if (customInfo) {
    res.status(customInfo.status)
    res.send(customInfo.data)
  } else {
    next()
  }
})

app.use('/mpf-cc', express.static(path.join(__dirname, '../build/mpf-cc')))

proxies.forEach(function (config) {
  lodash.forEach(config, function(target, basePath) {
    // Proxy api requests
    app.use(basePath, function(req, res) {
      req.url = req.originalUrl;
      apiProxy.web(req, res, {
        target: target
      }, function (e) {
        console.log(e)
      });
    });
  })
})

app.use('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build/mpf-cc/index.html'))
})

app.listen(5000, () => console.log('Example app listening on port 5000!'))
