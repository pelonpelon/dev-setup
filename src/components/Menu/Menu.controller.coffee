'use strict'
# Menu.controller.coffee

Menu = require './Menu.model'
require './Menu.view'

Menu.controller = ->
  Menu.vm.init()
  return

module.exports = Menu
