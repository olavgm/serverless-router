const Route = require('route-parser')

exports.templates = []

exports.register = (method, path, callback) => {
  for (const template of exports.templates) {
    if (template.method === method && template.path === path) {
      return
    }
  }

  console.info(`Registering ${method} ${path}`)

  exports.templates.push({
    method: method,
    path: path,
    callback: callback
  })
}

exports.route = (req, res) => {
  const template = findTemplate(req)

  if (!template) {
    res.status(404).send(`Not found.`)
    return
  }

  console.info(`Found match for ${req.method} ${req.path} -> ${template.method} ${template.path}`)

  req.params = template.match
  template.callback(req, res)
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
