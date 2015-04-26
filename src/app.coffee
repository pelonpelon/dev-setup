'use strict'

config = require('../gulp-config.js')
require './styles/app.styl'
fastclick = require('fastclick')
fastclick.attach(document.body)
window.m = require('mithril')

req = (args)->
  m.request(args)

if window.document.location.host == 'sf-eagle.com'
  console.log 'grabbing events from sf-eagle DB'
  eventsUrl = 'http://sf-eagle.com/cgi-bin/events.cgi'
else
  console.log 'not on sf-eagle.com :: events from localStorage'
  eventsUrl = config.version + '/assets/events.json'
logoUrl =  config.version + '/assets/new_trans-200.png'

# TODO: m.request in background, use localstorage as initialValue

fillSplash = ->
  el = document.getElementById 'container' 
  console.log 'el',el
  el.style.background = 'center no-repeat'
  el.style.backgroundImage = "url('rogue/assets/new_trans-200.png')"

fillSplash()

getEvents = ->
  console.log 'removing events from localStorage'
  localStorage.removeItem('events')
  req({method: 'GET', url: eventsUrl })
    .then (events)->
      localStorage.setItem('events', JSON.stringify(events))
    .then ()->
      console.log 'added events to localStorage' if localStorage.hasOwnProperty('events')
      require './common/events_sql.coffee'

getEvents()

importFontsAwesome = ->
  fa = window.document.createElement 'link'
  fa.rel= "stylesheet"
  fa.href= "//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
  document.head.appendChild fa

importFontsAwesome()

Menu = require './components/Menu/Menu.controller'
header = require "./components/header/header.controller"

Page = (module) ->
  return {
    controller: ->
      window.document.body.classList.remove('show-menu')
      new module.controller
    view: (ctrl) ->
      [
        m '.menu-wrap', Menu.view(new Menu.controller)
        m 'button.menu-button#open-button', onclick: Menu.vm.toggleMenu
        m '.content-wrap',
          [
            m '.header', header.view(new header.controller)
            m '.content', module.view(ctrl)
          ]
      ]
  }

m.route document.getElementById("container"), "/",
  "/": new Page(require('./components/Logo/Logo.controller'))
  "/storm": new Page(require('./components/Storm/Storm.controller'))
  "/events": new Page(require('./components/Events/Events.controller'))

