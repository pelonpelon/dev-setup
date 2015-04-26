'use strict'
# header.view.coffee

header = require("./header.model")

header.view = (ctrl) ->
  [
    m 'h2.page-title', header.vm.title
    m '.logo'
  ]

module.exports = header
