'use strict';

describe('Service: menuFactory', function () {

  // load the service's module
  beforeEach(module('calculatorApp'));

  // instantiate service
  var menuFactory;
  beforeEach(inject(function (_menuFactory_) {
    menuFactory = _menuFactory_;
  }));

  it('should do something', function () {
    expect(!!menuFactory).toBe(true);
  });

});
