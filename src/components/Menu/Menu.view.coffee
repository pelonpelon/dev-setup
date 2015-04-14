'use strict'
# Menu.view.coffee

Menu = require './Menu.model'

Menu.view = (ctrl) ->
  [
    m 'nav.menu-header',
      m '.icon-list',
        Menu.vm.social.map (item) ->
          m 'a[href='+item.url+']', { onclick: m.withAttr('url', Menu.vm.toggleMenu), target:'_blank' },
            m 'i', className: item.icon
    m '.menu-items',
      Menu.vm.items.map (item) ->
        m 'a[href='+item.url+']', { onclick: m.withAttr('url', Menu.vm.toggleMenu), target:'_blank' },
          m 'i', className: item.icon, item.label
  ]

module.exports = Menu
