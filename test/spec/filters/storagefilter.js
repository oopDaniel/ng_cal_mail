'use strict';

describe('Filter: storageFilter', function () {

  // load the filter's module
  beforeEach(module('calculatorApp'));

  // initialize a new instance of the filter before each test
  var storageFilter;
  beforeEach(inject(function ($filter) {
    storageFilter = $filter('storageFilter');
  }));

  it('should return the input prefixed with "storageFilter filter:"', function () {
    var text = 'angularjs';
    expect(storageFilter(text)).toBe('storageFilter filter: ' + text);
  });

});
