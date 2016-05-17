describe('project package', function() {

  'use strict';

  let packageJson = require('../../package.json'),
    bowerJson = require('../../bower.json'),
    semver = require('semver-regex'),
    config = require('../config.json'),
    userName = config.userName,
    repositoryName = config.repositoryName,
    userRepo = userName + '/' + repositoryName,
    projectUrl = 'https://github.com/' + userRepo,
    fs = require('fs');

  describe('name', function() {

    let name = packageJson.name;

    it('exists', function() {

      expect(name).toBeDefined();
      expect(name).not.toEqual('');
      expect(name).not.toBeNull();

    });

    it('matches bower name', function() {

      expect(name).toEqual(bowerJson.name);

    });

  });

  describe('description', function() {

    let description = packageJson.description;

    it('exists', function() {

      expect(description).toBeDefined();
      expect(description).not.toEqual('');
      expect(description).not.toBeNull();

    });

    it('matches bower description', function() {

      expect(description).toEqual(bowerJson.description);

    });

  });

  describe('version', function() {

    let version = packageJson.version;

    it('exists', function() {

      expect(version).toBeDefined();
      expect(version).not.toEqual('');
      expect(version).not.toBeNull();

    });

    it('is a semantic version format', function() {

      expect(version).toMatch(semver());

    });

  });

  describe('license', function() {

    let license = packageJson.license;

    it('exists', function() {

      expect(license).toBeDefined();
      expect(license).not.toEqual('');
      expect(license).not.toBeNull();

    });

    it('matches bower license', function() {

      expect(license).toEqual(bowerJson.license);

    });

  });

  describe('homepage', function() {

    let homepage = packageJson.homepage;

    it('exists', function() {

      expect(homepage).toBeDefined();
      expect(homepage).not.toEqual('');
      expect(homepage).not.toBeNull();

    });

    it('matches bower homepage', function() {

      expect(homepage).toEqual(bowerJson.homepage);

    });

  });

  describe('keywords', function() {

    let keywords = packageJson.keywords;

    it('exists', function() {

      expect(keywords).toBeDefined();
      expect(keywords.length).toBeGreaterThan(0);

    });

    it('matches bower keywords', function() {

      expect(keywords).toEqual(bowerJson.keywords);

    });

  });

  describe('author', function() {

    let author = packageJson.author;

    it('exists', function() {

      expect(author).toBeDefined();
      expect(author).not.toEqual('');
      expect(author).not.toBeNull();

    });

    it('is in bower authors', function() {

      expect(bowerJson.authors).toContain(author);

    });

  });

  describe('main', function() {

    let main = packageJson.main;

    it('has a main', function() {

      expect(main).toBeDefined();
      expect(main).not.toEqual('');
      expect(main).not.toBeNull();

    });

    it('matches bower main', function() {

      expect(main).toEqual(bowerJson.main);

    });

    it('is an existing file', function() {

      expect(function() {

        fs.accessSync(main, fs.F_OK);

      }).not.toThrow();

    });

  });

  describe('urls', function() {

    it('specifies repository location', function() {

      expect(packageJson.repository.url).toBe('git+' + projectUrl + '.git');

    });

    it('specifies bug reporting location', function() {

      expect(packageJson.bugs.url).toBe(projectUrl + '/issues');

    });

    it('specifies home page', function() {

      expect(packageJson.homepage).toBe(projectUrl + '#readme');

    });

    it('contains repo name in main', function() {

      expect(packageJson.main).toBe('dist/' + repositoryName + '.js');

    });

  });

});
