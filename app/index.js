'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var MyappGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },


  askFor: function () {
    var done = this.async();
    this.log(this.yeoman);
    this.log(chalk.magenta('You\'re using the fantastic mobileApp generator.'));

    var prompts = [{
      name: 'appTitle',
      message: 'Give your fantastic, sweet and awesome app a name: '
    },
      {
        type: 'checkbox',
        name: 'bowerPackages',
        message: 'Choose the libraries you need: ',
        choices: [
          {
            name: 'Bootstrap',
            value: 'includeBootstrap',
            checked: false
          }, {
            name: 'jQuery',
            value: 'includeJQuery',
            checked: true
          }, {
            name: 'Angular JS',
            value: 'includeAngular',
            checked: false
          }
        ]
      }];

    this.prompt(prompts, function (features) {
      function includedBowerFeature(f) {
        return bower.indexOf(f) !== -1;
      }

      var bower = features.bowerPackages;
      this.appTitle = features.appTitle;

      this.bootstrap = includedBowerFeature("includeBootstrap");
      this.jQuery = includedBowerFeature("includeJQuery");
      this.angular = includedBowerFeature("includeAngular");

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('img');
    this.mkdir('css');
    this.mkdir('js');
    this.mkdir('vendor');

    this.template('Gruntfile.js', 'Gruntfile.js');
    this.template('index.html', 'index.html');
    this.template('_bower.json', 'bower.json');
    this.template('_config.json', 'config.json');
    this.template('_package.json', 'package.json');
    this.template('sass/style.sass', 'css/style.sass');
    this.template('sass/reset.sass', 'css/reset.sass');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = MyappGenerator;