"use strict"
var HOST = process.env.HOST || process.argv[2] || '127.0.0.1'
var BASES = (process.env.BASES || process.argv[3] || '').split(',')
var SILENT = process.env.SILENT || process.argv[4] || 'true'


var Hapi = require('hapi')
var Rif = require('rif')

var server = new Hapi.Server()
var rif = Rif()


var host = rif(HOST) || HOST


server.connection({ 
  port: 80 // test with http://localhost:8000/api/ping
})

server.register(require('inert'))

server.register({
  register: require('wo'),
  options: {
    bases: BASES,
      sneeze: {
	host: host,
	silent: JSON.parse(SILENT),
        swim: {interval: 1111}
      }
  }
})

server.route({ 
  method: 'GET', path: '/api/ping', 
  handler: {
    wo: {}
  }
})

server.route({
  method: 'POST', path: '/api/post/{user}', 
  handler: {
    wo: {
      passThrough: true
    }
  }
})

server.route({
  method: 'POST', path: '/api/follow/{user}', 
  handler: {
    wo: {
      passThrough: true
    }
  }
})


server.route({ 
  method: 'GET', path: '/mine/{user}', 
  handler: {
    wo: {}
  }
})


server.route({ 
  method: ['GET','POST'], path: '/search/{user}', 
  handler: {
    wo: {}
  }
})


server.route({ 
  method: 'GET', path: '/{user}', 
  handler: {
    wo: {}
  }
})

server.route({
  path: '/favicon.ico',
  method: 'get',
  config: {
    cache: {
      expiresIn: 1000*60*60*24*21
    }
  },
  handler: function(request, reply) {
    reply().code(200).type('image/x-icon')
  }
})

server.route({
  method: 'GET',
  path: '/res/{path*}',
  handler: {
    directory: {
      path: __dirname + '/www/res',
    }
  }
})


server.start(function(){
  console.log('front',server.info.uri)
})
