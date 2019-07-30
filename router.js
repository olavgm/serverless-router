const Route = require('route-parser')
const fs = require('fs')

exports.templates = []
exports.static = null

exports.register = (method, path, options, callback) => {
  for (const template of exports.templates) {
    if (template.method === method && template.path === path) {
      return
    }
  }

  console.info(`Registering ${method} ${path}`)

  exports.templates.push({ method, path, options, callback })
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

exports.static = (staticPath) => {
  this.static = staticPath
}

exports.route = (req, res) => {
  const template = findTemplate(req)

  if (!template) {
    if (this.static && req.method === 'GET') {
      try {
        const filePath = `${this.static}${req.path}`

        if (fs.existsSync(filePath)) {
          console.info(`Found match for ${req.path} in static.`)

          res.sendFile(filePath)
          return
        }
      } catch (err) {
        console.error(err)
      }
    }

    res.status(404).send(`Not found.`)
    return
  }

  console.info(`Found match for ${req.method} ${req.path} -> ${template.method} ${template.path}`)

  let authorization = ((template || {}).options || {}).authorization
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
