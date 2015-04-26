if localStorage.getItem('events')
  console.log('yes localStorage')
  events = JSON.parse localStorage.getItem('events')

  today = new Date()
  now = today.getTime()
  anHour = 60*60*1000
  weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  #//- now = Math.round(new Date().getTime()/1000.0)

  closingAdjustment = if today.getHours() < 2 then 0 else 24
  closingTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2+closingAdjustment)
  closingTimeYesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1, 2+closingAdjustment)

  #//-console.log 'closingAdjustment: ', closingAdjustment
  #//-console.log 'closingTime: ', closingTime
  #//-console.log 'closingTimeYesterday: ', closingTimeYesterday
  todaysEvents = events.filter (event)->
    return closingTimeYesterday.getTime()/1000 < parseInt(event.date_num) < closingTime.getTime()/1000

  alreadyTodaysEvents = document.querySelector '.todays-events'
  console.log 'alreadyTodaysEvents:', alreadyTodaysEvents
  if not alreadyTodaysEvents
    console.log 'no .todays-events'
    divToday = document.createElement('div')
    divToday.classList.add 'todays-events'
  else
    console.log 'found .todays-events'
    divToday = alreadyTodaysEvents
    #//-TODO: if TNL show bands
  divToday.innerHTML = '<div class="dayLabel">' + weekdays[today.getDay()] + '</div><hr>'
  for event in todaysEvents
    start = (event.time).replace(/:00/, '')
    end = if event.endtime == '2:00am' then '' else '-' + (event.endtime).replace(/:00/, '')
    div = document.createElement('div')
    div.classList.add 'events-today'
    div.innerHTML = (event.title).replace(/<br\ ?\/?>/g, ' ').toLowerCase()
    div.innerHTML = '<div class="event-time">' + start + end + '</div>' +
      ' <div class="event-title">' + div.textContent + '</div>'
    divToday.innerHTML += div.innerHTML
  foot = document.getElementById('foot')
  footParent = foot.parentNode
  footParent.insertBefore(divToday, foot)
else
  console.log('no localStorage')

