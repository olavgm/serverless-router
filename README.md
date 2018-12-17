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

Router.get('/hello/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path}`)
})

Router.post('/hello/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path} ${req.body.age}`)
})

// Registers for all HTTP verbs
Router.all('/goodbye/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Goodbye, ${req.params.name}`)
})

exports.testgcfapi = (req, res) => {
  Router.route(req, res)
}
```

It could also be done this way, using the `register` method and passing the verb as the first parameter.

```node
const Router = require('@olavgm/serverless-router')

Router.register('GET', '/hello/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path}`)
})

Router.register('POST', '/hello/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path} ${req.body.age}`)
})

Router.register('*', '/goodbye/:name', async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Goodbye, ${req.params.name}`)
})

exports.testgcfapi = (req, res) => {
  Router.route(req, res)
}
```

In this example, three routes are registered, `GET /hello/:name`, `POST /hello/:name` and `/goodbye/:name`.

The `exports.testgcfapi` is the method that will be called by _Google Cloud Functions_. For deploying this function this method has to be specified:

```
gcloud functions deploy testgcfapi --runtime nodejs8 --trigger-http
```

In the `exports.testgcfapi` method the routing of the request is executed to process the request through the registered routes.
