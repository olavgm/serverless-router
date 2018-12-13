# Serverless Router

**Serverless Router** is a routing module for serverless functions. It routes paths to methods.

## Installation

### npm

```
npm install @olavgm/serverless-router
```

## Usage

```node
const Router = require('@olavgm/serverless-router')

Router.register('GET', '/hello/:name', async (req, res, params) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${params.name}, ${req.method} ${req.path}`)
})

Router.register('POST', '/hello/:name', async (req, res, params) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${params.name}, ${req.method} ${req.path} ${req.body.age}`)
})

Router.register('*', '/goodbye/:name', async (req, res, params) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Goodbye, ${params.name}`)
})

exports.testgcfapi = (req, res) => {
  Router.route(req, res)
}
```
