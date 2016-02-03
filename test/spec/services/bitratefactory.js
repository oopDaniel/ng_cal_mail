'use strict';

describe('Service: bitrateFactory', function () {

  // load the service's module
  beforeEach(module('calculatorApp'));

  // instantiate service
  var bitrateFactory;
  beforeEach(inject(function (_bitrateFactory_) {
    bitrateFactory = _bitrateFactory_;
  }));

  it('should do something', function () {
    expect(!!bitrateFactory).toBe(true);
  });

});
