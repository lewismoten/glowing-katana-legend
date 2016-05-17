describe('project readme', function() {

  'use strict';

  let fs = require('fs'),
    config = require('../config.json'),
    packageJson = require('../../package.json'),
    userName = config.userName,
    repositoryName = config.repositoryName,
    userRepo = userName + '/' + repositoryName,
    shields = 'https://img.shields.io/',
    readme = readText('README.md');

  function readText(file) {

    return fs
      .readFileSync(file, 'utf8')
      .replace(/\r\n/g, '\n');

  }

  describe('Description', function() {

    it('is from package', function() {

      expect(readme).toContain(packageJson.description);

    });

  });

  describe('License', function() {

    let license = readText('LICENSE.md');

    it('is matches quoted license file', function() {

      let quotedLicense = '\n ' + license.replace(/\n(\S)/g, '\n $1');

      expect(readme).toContain(quotedLicense);

    });

  });

  describe('Travis', function() {

    it('has a status image', function() {

      expect(readme).toContain(shields + 'travis/' + userRepo + '.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://travis-ci.org/' + userRepo);

    });

  });

  describe('AppVeyor', function() {

    it('has a status image', function() {

      expect(readme).toContain(
        shields + 'appveyor/ci/' + userRepo + '/master.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://ci.appveyor.com/project/' + userRepo);

    });

  });

  describe('Code Climate', function() {

    it('has a status image', function() {

      expect(readme).toContain(
        shields + 'codeclimate/github/' + userRepo + '.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://codeclimate.com/github/' + userRepo);

    });

  });

  describe('David', function() {

    it('has a status image', function() {

      expect(readme).toContain(
        shields + 'david/' + userRepo + '.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://david-dm.org/' + userRepo);

    });

  });

  describe('Gitter', function() {

    it('has a status image', function() {

      expect(readme).toContain(
        shields + 'gitter/room/' + userRepo + '.js.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://gitter.im/' + userRepo);

    });

  });

  describe('License', function() {

    it('has an image', function() {

      expect(readme).toContain(shields +
        'badge/license-' + packageJson.license + '-brightgreen.svg');

    });

    it('has a link to it', function() {

      expect(readme).toContain('https://raw.githubusercontent.com/' +
        userRepo + '/master/LICENSE');

    });

  });

});
