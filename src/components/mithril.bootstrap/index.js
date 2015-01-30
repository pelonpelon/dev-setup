'use strict';

var identity = function(){return this;};
var scrollbarWidth = (function () {
  var scrollbarWidth;
  return function(){
    if (scrollbarWidth===undefined){
      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'modal-scrollbar-measure';
      document.body.appendChild(scrollDiv);
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
    return scrollbarWidth;    
  };
})();

m.tags.accordion = {
  controller: function(data) {
    var opening=[],animating=[];

    var options = data.attrs;

    this.toggle = function(id){
      if (options.toggle){
        opening[id]=!opening[id];
      }
      else {
        opening = id;
      }
    };
    this.isOpen = function(id){
      return id === opening || options.toggle && opening[id];
    };
  },
  view: function(ctrl) {
    return m('.accordion.panel.panel-default', ctrl.children.map(function(line,id){
      var isOpen = ctrl.isOpen(id);
      var title=line.children[0],content=line.children[1];
      return [
        m('.panel-heading',{
          onclick:ctrl.toggle.bind(ctrl,id)
        },
        m('.panel-title',title)),
        m('div.panel-body',{style:'display:'+(isOpen? 'block':'none')},content)
      ];
    }));
  }
};

m.tags.jumbotron = {
  view: function(ctrl) {
    return m('.jumbotron',[
      m('.container',[
        ctrl.children
      ])
    ]);
  }
};

m.tags.modal = {
  controller: function(options) {
    var open, backdrop, saveBodyClass='';
    function close(e){
      open = false;
      options.attrs.trigger(false);
      document.body.className=saveBodyClass;
      if (e) m.redraw();
    }
    this.state = options.attrs.trigger;
    this.close = {onclick:function(){close();}};
    this.bind = function(element){
      if (!open && options.attrs.trigger()){
        open=element;
        saveBodyClass = document.body.className;
        document.body.className += ' modal-open';
        backdrop = element.getElementsByClassName('modal-backdrop')[0];
        backdrop.setAttribute('style', 'height:'+document.documentElement.clientHeight+'px');
        backdrop.addEventListener('click', close);
      }
    };
  },

  view: function(ctrl) {
    var inner = ctrl.children[0]();
    var isOpen = ctrl.state();
    return m((isOpen? '.is-open':'.modal.fade'), {config:ctrl.bind}, [
      (isOpen? m('.modal-backdrop.fade.in'):''),
      m('.modal-dialog', [
        m('.modal-content', [
          m('.modal-header', [
            m('button.close[type="button" data-dismiss="modal" aria-label="Close"]',
              m('span[aria-hidden=true]', ctrl.close, m.trust('&times;'))),
            m('h4.modal-title', inner.title)
          ]),
          m('.modal-body', inner.body),
          m('.modal-footer', [
            m('button.btn.btn-default[type="button" data-dismiss="modal"]', ctrl.close, inner.cancel || 'Close'),
            inner.ok? m('button.btn.btn-primary[type="button"]', ctrl.close, inner.ok):''
          ])
        ])
      ])
    ]);
  }
};

// tabset based on bootstrap navs markup.
// Options = 
//  active: current (default) tab
//  style: 'tabs' | 'pills'

m.tags.tabset = {
  controller: function(){

    var options = this.attrs;
    var currentTab = options.active;

    this.style=options.style || 'tabs';

    function Select(){
      currentTab = this.tabIdx;
    }

    function active(tabIdx) {
      return tabIdx===currentTab? 'active':'';
    }

    this.display = function(tabIdx) {
      return {display: (tabIdx===currentTab? 'block':'none')};
    };

    this.tags.tab = {
      controller: function(data){
        var href = data.attrs.href;
        this.tabIdx=data.attrs.id;
        this.href=function(){
          return href? {config: m.route,href:href}:{href:'#'};
        };
      },
      
      view: function(ctrl) {
        var tabName=ctrl.children[0];
        return m('li.tab', {onclick:Select.bind(ctrl),class:active(ctrl.tabIdx)}, m('a', ctrl.href(), tabName));
      }
    };
  },

  view: function(ctrl) {
    // we need to split the children nodes into tab / content
    return m('.tabset',[
      m('ul.nav.nav-'+ctrl.style, ctrl.children.map(function(tab, id){
        tab.attrs.id = id;
        // split of the first tag child as its tag title
        return m(tab.tag,tab.attrs, tab.children[0]);
      })),
      m('div',ctrl.children.map(function(tab,id){
        // wrap the content in a toggle block
        return m('.tabcontent', {style:ctrl.display(id)}, tab.children[1]);
      }))
    ]);
  }
};
