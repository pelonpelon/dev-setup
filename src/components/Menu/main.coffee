(->
  init = ->
    initEvents()
    return

  initEvents = ->
    openbtn.addEventListener "click", togglemenu-wrap
    closebtn.addEventListener "click", togglemenu-wrap  if closebtn

    # close the menu-wrap element if the target it´s not the menu-wrap element or one of its descendants..
    content.addEventListener "click", (ev) ->
      target = ev.target
      togglemenu-wrap()  if isOpen and target isnt openbtn
      return

    return

  togglemenu-wrap = ->
    if isOpen
      classie.remove bodyEl, "show-menu-wrap"
    else
      classie.add bodyEl, "show-menu-wrap"
    isOpen = not isOpen
    return

  bodyEl = document.body
  content = document.querySelector(".content-wrap")
  openbtn = document.getElementById("open-button")
  closebtn = document.getElementById("close-button")
  isOpen = false
  init()
  return
)()
