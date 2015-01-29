// app.js
'use strict';

window.m = require('mithril');

// tab routes
var ACCORDION1 = 0;
var ACCORDION2 = 1;
var MODAL = 2;
var TODOS = 3;
var XP = 4;

var component = function(options) {
  var component = {};
  component.vm = (function() {
    var vm = {};
    var defaultAmount = 1.00;
    var defaultTaxRate = 0.10;
    vm.taxrate = m.prop(options.taxrate ? options.taxrate : defaultTaxRate);

    vm.amount = m.prop(defaultAmount);
    vm.tax = function() {
      return (Math.ceil(vm.amount() * vm.taxrate() * 100) / 100).toFixed(2);
    };
    return vm;
  })(options);

  component.view = function() {
    return [m('input', {
        onchange: m.withAttr('value', component.vm.amount),
        value: component.vm.amount()
      }),
      m('div', 'The ' + (component.vm.taxrate() * 100) + '% tax on ' + component.vm.amount() + ' is ' + component.vm.tax())
    ];
  };
  return component;
};

var app = {

  model: {
    USTaxrate: 0.10,
    UKTaxrate: 0.12,
  },

  vm: {
    init: function() {
      this.taxCalculatorUS = component({
        taxrate: app.model.USTaxrate
      });
      this.taxCalculatorUK = component({
        taxrate: app.model.UKTaxrate
      });
    }
  },

  controller: function() {
    app.vm.init();
  },

  view: function() {
    return [
      m('h2.text-center', 'Mithril.js'),
      m('component', app.vm.taxCalculatorUS.view()),
      m('component', app.vm.taxCalculatorUK.view())
    ];
  }
};

m.module(document.getElementById('app'), app);

// m.route(document.getElementById('app'), '/', {
// '/': app(),
// // '/todos-xp': app(XP)
// '/todos-xp/:filter': app(XP)
// });
