'use strict';

var scrollbarWidth = (function() {
  var scrollbarWidth;
  return function() {
    if (scrollbarWidth === undefined) {
      var scrollDiv = document.createElement('div');
      scrollDiv.className = 'modal-scrollbar-measure';
      document.body.appendChild(scrollDiv);
      scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
    return scrollbarWidth;
  };
})();

var accordion = m.element('accordion', {
  controller: function(options) {
    options = options || {};
    var open = [];
    this.toggle = function(id) {
      if (options.toggle) {
        open[id] = !open[id];
      } else {
        open = id;
      }
    };
    this.isOpen = function(id) {
      return id === open || options.toggle && open[id];
    };
  },
  view: function(ctrl, content) {
    return m('.accordian.panel.panel-default', content.map(function(line, id) {
      var title = line.children[0],
        content = line.children[1];
      return [
        m(line, {
          class: 'panel-heading',
          onclick: ctrl.toggle.bind(ctrl, id)
        },
          m('.panel-title', title)),
        m('div.panel-body', {
          style: 'display:' + (ctrl.isOpen(id) ? 'block' : 'none')
        }, content)
      ];
    }));
  }
});

var jumbotron = m.element('jumbotron', {

  controller: function(state) {

    this.gettab = function(tab) {
      //tell Mithril to wait for this service to complete before redrawing
      m.startComputation();
      var deferred = m.deferred();
      deferred.resolve(function waitfor() {
        if (!m.elements.tabset) {
          setTimeout(function() {}, 2000);
        } else {
          return m.elements.tabset.instances[0].active(tab);
        }
      });
      m.endComputation();
      return deferred.promise;
    };
  },

  view: function(ctrl, inner) {
    return m('.jumbotron', [
      m('.container', [
        inner
      ])
    ]);
  }
});

var modal = m.element('modal', {

  controller: function(options) {
    var open, backdrop,
      saveBodyClass = '';
    function close(e) {
      open = false;
      options.trigger(false);
      document.body.className = saveBodyClass;
      if (e) {
        m.redraw();
      }
    }
    this.close = {
      onclick: function() {
        close();
      }
    };
    this.state = options.trigger;
    this.bind = function(element) {
      if (!open && options.trigger()) {
        open = element;
        saveBodyClass = document.body.className;
        document.body.className += ' modal-open';
        backdrop = element.getElementsByClassName('modal-backdrop')[0];
        backdrop.setAttribute('style', 'height:' + document.documentElement.clientHeight + 'px');
        backdrop.addEventListener('click', close);
      }
    };
  },

  view: function(ctrl, inner) {
    inner = inner();
    var isOpen = ctrl.state();
    return m((isOpen ? '.is-open' : '.modal.fade'), {
      config: ctrl.bind
    }, [
        (isOpen ? m('.modal-backdrop.fade.in') : ''),
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
              inner.ok ? m('button.btn.btn-primary[type="button"]', ctrl.close, inner.ok) : ''
            ])
          ])
        ])
      ]);
  }
});

var tab = function(configure) {
  var conf = m.merge({
    parent: null,
    style: 'pills'
  }, configure);
  var tab = {};
  tab.controller = function(state) {
    this.style = conf.style;
    this.parent = conf.parent;
    this.tabIdx = state.idx;
    this.href = function() {
      return state.href ? {
        config: m.route,
        href: state.href
      } : {
        href: '#'
      };
    };
  };

  tab.view = function(ctrl, inner) {
    var tabName = inner[0],
      tabContent = inner[1];
    m('.tab', {
      onclick: ctrl.parent.vm.Select.bind(ctrl),
      class: ctrl.parent.vm.active(ctrl.tabIdx)
    }, m('a', ctrl.href(), tabName));
    m('.tabcontent', {
      style: ctrl.parent.vm.display(ctrl.tabIdx)
    }, tabContent);
  };
  // tabset based on bootstrap navs markup.
  // Options =
  //  active: current (default) tab
  //  style: 'tabs' | 'pills'
  return tab;
};

var tabset = function(tab) {


  var tabset = {};

  tabset.controller = function(options) {
    this.style = options.style || 'tabs';
    this.currentTab = options.active;
    this.content = this.content = [];
    tabset.vm.init();
  };

  tabset.view = function(ctrl, tabs) {
    return m('.tabset', [
      m('ul.nav.nav-' + ctrl.style, [
        tabs.map(function(tab) {
          return tab;
        })
      ]),
      m('div', ctrl.content)
    ]);
  };

  tabset.vm = {};
  tabset.vm.init = function() {
    var count = 0;
    var tabs = this.tabs = [];
    var currentTab = tabset.controller.currentTab;

    tabset.vm.Select = function Select() {
      currentTab = this.tabIdx;
    };
    tabset.vm.active = function active(tabIdx) {
      return tabIdx === currentTab ? 'active' : '';
    };
    tabset.vm.display = function display(tabIdx) {
      return {
        display: (tabIdx === currentTab ? 'block' : 'none')
      };
    };
  };
  m.element('mytab', tab(tabset));

  return tabset;
};

m.element('tabset', tabset(tab));

module.exports = {
  accordion: accordion,
  jumbotron: jumbotron,
  modal: modal,
  tabset: tabset
};
