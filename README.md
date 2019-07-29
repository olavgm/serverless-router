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

let options = {}

Router.get('/hello/:name', options, async (req, res, authInfo) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path}`)
})

Router.post('/hello/:name', options, async (req, res, authInfo) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path} ${req.body.age}`)
})

// Registers for all HTTP verbs
Router.all('/goodbye/:name', options, async (req, res, authInfo) => {
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

Router.register('GET', '/hello/:name', options, async (req, res) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path}`)
})

Router.register('POST', '/hello/:name', options, async (req, res, authInfo) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Hello, ${req.params.name}, ${req.method} ${req.path} ${req.body.age}`)
})

Router.register('*', '/goodbye/:name', options, async (req, res, authInfo) => {
  console.info(`Sending response to ${req.method} ${req.path}`)
  res.status(200).send(`Goodbye, ${req.params.name}`)
})

exports.testgcfapi = (req, res) => {
  Router.route(req, res)
}
```

In this example, three routes are registered, `GET /hello/:name`, `POST /hello/:name` and `/goodbye/:name`.

`options` is an object that can contain a property `authorization`, which is a function (`req => ()`) that will check for authorization. The function receives the request object as the only parameter. It should return `false` is the authorization is not valid, and whatever information if the authorization is valid. For example, in an JWT bearer token validation, the function can return the decoded JWT.

The `exports.testgcfapi` is the method that will be called by _Google Cloud Functions_. For deploying this function this method has to be specified:

```
gcloud functions deploy testgcfapi --runtime nodejs8 --trigger-http
```

In the `exports.testgcfapi` method the routing of the request is executed to process the request through the registered routes.

### Static routes

If you want to include static files use this, where the paramameter is the path to the folder where the static files are.

```
Router.static(`${__dirname}/static`)
```

The router will try to match the registered URLs. If none of the match, it will try to find the file in the static folder, including route. If so, it will return the file.

In this example, if you have the file `./static/docs/about.html`, the route `/docs/about.html` will return the file.
