describe('farm', function() {

  'use strict';

  global.farm = 'default';

  require('../src/index.js');

  it('has a farm', function() {

    expect(global.farm).toEqual({});

  });

});
