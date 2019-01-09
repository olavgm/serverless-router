const Route = require('route-parser')

exports.templates = []

exports.register = (method, path, options, callback) => {
  for (const template of exports.templates) {
    if (template.method === method && template.path === path) {
      return
    }
  }

  console.info(`Registering ${method} ${path}`)

  exports.templates.push({
    method: method,
    path: path,
    options: options,
    callback: callback
  })
}

exports.all = (path, options, callback) => {
  exports.register('*', path, options, callback)
}

exports.get = (path, options, callback) => {
  exports.register('GET', path, options, callback)
}

exports.post = (path, options, callback) => {
  exports.register('POST', path, options, callback)
}

exports.put = (path, options, callback) => {
  exports.register('PUT', path, options, callback)
}

exports.delete = (path, options, callback) => {
  exports.register('DELETE', path, options, callback)
}

exports.patch = (path, options, callback) => {
  exports.register('PATCH', path, options, callback)
}

exports.route = (req, res) => {
  const template = findTemplate(req)

  if (!template) {
    res.status(404).send(`Not found.`)
    return
  }

  let authorization = ((template || {}).options || {}).authorization

  console.info(`Found match for ${req.method} ${req.path} -> ${template.method} ${template.path}`)

  let authorizationResult

  if (authorization !== undefined) {
    authorizationResult = authorization(req)

    if (!authorizationResult) {
      res.status(401).send(`Unauthorized.`)
      return
    }
  }

  req.params = template.match
  template.callback(req, res, authorizationResult)
}

function findTemplate (req) {
  for (const template of exports.templates) {
    if (template.method !== req.method && template.method !== '*') {
      continue
    }

    const route = new Route(template.path)
    const match = route.match(req.path)

    if (match) {
      return { match, ...template }
    }
  }

  return null
}
