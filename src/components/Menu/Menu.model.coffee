'use strict'
# Menu.model.coffee

classie = require '../../common/classie'

Menu = {}

Menu.vm = (->
  vm = {}
  vm.isOpen = m.prop(false)
  vm.init = ->
    baseUrl = 'http://sf-eagle.com/storm/'
    vm.items = [
      {label: 'calendar', icon: 'fa fa-calendar' , url: baseUrl + 'calendar.php'}
      {label: ' staff', icon: 'fa fa-male' , url: baseUrl + 'index.php'}
      {label: 'merchandise', icon: 'fa fa-shopping-cart' , url: baseUrl + 'merch.php'}
      {label: 'recommended', icon: 'fa fa-star' , url: baseUrl + 'recommended.php'}
      {label: 'softball', icon: 'fa fa-dribbble' , url: baseUrl + 'index.php'}
      {label: 'book an event', icon: 'fa fa-smile-o' , url: baseUrl + 'index.php'}
      {label: 'book my band', icon: 'fa fa-music' , url: baseUrl + 'index.php'}
      {label: 'about us', icon: 'fa fa-glass' , url: baseUrl + 'index.php'}
      {label: '', icon: '' , url: baseUrl + 'index.php'}
    ]

    vm.social = [
      {lbook: 'Twitter', icon: 'fa fa-facebook-official' , url: 'https://facebook.com/SFEagle'}
      {label: 'Twitter', icon: 'fa fa-twitter' , url: 'https://twitter.com/SFEagleBar'}
      {label: 'Twitter', icon: 'fa fa-instagram' , url: 'https://instagram.com/sfeagle/'}
      {label: 'Twitter', icon: 'fa fa-google-plus' , url: 'https://plus.google.com/u/0/104184281608152528049'}
      {label: 'Twitter', icon: 'fa fa-tumblr' , url: 'http://sfeaglebar.tumblr.com'}
    ]

    bodyEl = document.body
    content = document.querySelector(".content-wrap")

    vm.toggleMenu = (url) ->
      # console.log 'url: ', url
      if bodyEl.classList.contains('show-menu')
        classie.remove bodyEl, "show-menu"
        vm.isOpen(false)
      else
        classie.add bodyEl, "show-menu"
        vm.isOpen(true)
      # console.log 'after toggleMenu', 'isOpen: ', vm.isOpen()
      if not url.target then window.location.href = url
      return
      # if ev.target is document.getElementById('open-button')
        # console.log 'toggleMenu', 'isOpen: ', vm.isOpen()
        # if bodyEl.classList.contains('show-menu')
          # classie.remove bodyEl, "show-menu"
          # vm.isOpen(false)
        # else
          # classie.add bodyEl, "show-menu"
          # vm.isOpen(true)
        # console.log 'after toggleMenu', 'isOpen: ', vm.isOpen()
      # return

    content.addEventListener "click", ->
      vm.toggleMenu()
      return

    vm
  vm
)()

module.exports = Menu
