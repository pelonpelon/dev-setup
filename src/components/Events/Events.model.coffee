'use strict'
# Events.model.coffee

config = require '../../../myprivateconfig.js'

Events = {}

Event = (event)->
  @_dp_original = event._dp_original
  @_thumbnail_id = event._thumbnail_id
  @_wp_attached_file = event._wp_attached_file
  @band_1 = event['band_#1']
  @band_1_link = event['band_#1_link']
  @band_2 = event['band_#2']
  @band_2_link = event['band_#2_link']
  @band_3 = event['band_#3']
  @band_3_link = event['band_#3_link']
  @band_4 = event['band_#4']
  @band_4_link = event['band_#4_link']
  @blurb = event.blurb
  @contact_name = event.contact_name
  @contact_phone = event.contact_phone
  @contact_email = event.contact_email
  @crowd = if event.crowd then event.crowd.match(/\w{3,}/g) else undefined
  @date = event.date
  @date_num = event.date_num
  @dj_name = event.dj_name
  @endtime = event.endtime
  @include_a_lead = event.include_a_lead
  @include_title = event.include_title
  @link = event.link
  @notes = event.notes
  @price = event.price
  @promoter = event.promoter
  @promoter_link = event.promoter_link
  @publish = event.publish
  @tease = event.tease
  @time = event.time
  @title = event.title
  @title_thumbnail = event.title_thumbnail
  @web_site = event.web_site
  @weekly = event.weekly

Event.list = ->
  return m.request
    method: 'GET'
    url: '/' + config.version + '/assets/events.json'
    type: Event
  .then (events)->
    console.log 'events: ', events
    localStorage.removeItem 'events'
    localStorage.setItem 'events', JSON.stringify(events)
    return events

Events.vm = (->
  vm = {}
  vm.init = ->
    vm.events = Event.list()
    console.log 'vm.events:', vm.events()
    vm

  vm
)()

module.exports = Events
