"use strict"

header = require("./header.model") #returns object with obj.model
require "./header.view" # load the view

header.controller = ->
  header.vm.init()
  return

module.exports = header
