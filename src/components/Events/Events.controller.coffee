'use strict'
# Events.controller.coffee

Events = require './Events.model'

Events.controller = ->
  Events.vm.init()


Events.view = require './Events.view'

module.exports = Events
