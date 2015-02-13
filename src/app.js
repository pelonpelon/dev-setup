// app.js
'use strict';

window.m = require('mithril');

var Totaller = function(options) {
  var component = {};
  component.vm = (function() {
    var vm = {};
    vm.title = options.title;
    vm.total = m.prop(0);
    vm.add = function(num) {
      console.log('calling add from ' + this.title);
      this.total(+num + this.total());
    }.bind(vm);
    return vm;
  })(options);

  component.view = function() {
    var vm = component.vm;
    // console.log('Totaller.view called');
    return [
      m('div', vm.title),
      m('div', {
        style: {
          color: 'red'
        }
      }, vm.total())
    ];
  };
  return component;
};

var TaxCalculator = function(options) {
  var component = {};
  component.vm = (function() {
    var vm = {};
    var defaultAmount = 0;
    var defaultTaxRate = 0.10;
    vm.taxrate = options.taxrate ? options.taxrate : defaultTaxRate;
    vm.amount = m.prop(defaultAmount);
    vm.tax = m.prop(0);
    vm.getTax = function(amount) {
      vm.amount(amount);
      // this.tax((Math.ceil(this.amount() * this.taxrate * 100) / 100).toFixed(2));
      var result = (Math.ceil(this.amount() * this.taxrate * 100) / 100).toFixed(2);
      this.tax(result);
      return result;
    }.bind(vm);
    vm.totaller = new Totaller({
      title: options.title || 'You owe:'
    });
    return vm;
  })(options);

  component.view = function() {
    var vm = component.vm;
    // console.log('TaxCalculator.view called');
    return [
      m('input', {
        onchange: m.withAttr('value', vm.getTax),
        value: ''
      }),
      m('div', {
        onchange: vm.totaller.vm.add(vm.tax())
      },
        'The ' + (vm.taxrate * 100) + '% tax on ' + vm.amount() + ' is ' + vm.tax()),
      m('Totaller', vm.totaller.view())
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
      this.taxCalculatorUS = new TaxCalculator({
        title: 'You owe the US',
        taxrate: app.model.USTaxrate
      });
      this.taxCalculatorUK = new TaxCalculator({
        title: 'You owe the UK',
        taxrate: app.model.UKTaxrate
      });
      this.grandTotaller = new Totaller({
        title: 'Grand Total'
      });
      this.update = function(taxCalculator) {
        console.log('updating with ' + taxCalculator.vm.totaller.vm.title + ' ' + taxCalculator.vm.tax());
        app.vm.grandTotaller.vm.add(taxCalculator.vm.tax());
      };

    }
  },

  controller: function() {
    app.vm.init();
    // console.log('app.contrller called');
  },

  view: function() {
    console.log('app.view called');
    return [
      m('h2.text-center', 'Mithril.js'),
      m('taxCalculatorUS', {
        onchange: app.vm.update(app.vm.taxCalculatorUS)
      },
        app.vm.taxCalculatorUS.view()),
      m('taxCalculatorUK', {
        onchange: app.vm.update(app.vm.taxCalculatorUK)
      },
        app.vm.taxCalculatorUK.view()),
      m('grandTotal', app.vm.grandTotaller.view())
    ];
  }
};

m.module(document.getElementById('app'), app);

// m.route(document.getElementById('app'), '/', {
// '/': app(),
// // '/todos-xp': app(XP)
// '/todos-xp/:filter': app(XP)
// });
