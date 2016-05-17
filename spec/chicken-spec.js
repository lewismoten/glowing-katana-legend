describe('sample test', function() {

  'use strict';

  let farm = {};

  global.farm = farm;
  require('../src/chicken.js');

  it('has a chicken', function() {

    expect(farm.chicken).toBeDefined();

  });

  it('has a chicken with a name', function() {

    expect(farm.chicken.name).toBe('Mr. Chicken');

  });

});
