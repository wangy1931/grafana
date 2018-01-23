///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';

angular.module('cloudwiz.translate', ['ng']).run(($translate) => {
  $translate.use($translate.preferredLanguage());
});

/**
 *  @name cloudwiz.translate.$translateProvider
 */
angular.module('cloudwiz.translate').constant('cloudwizTranslateOverrider', {}).provider('$translate', $translate);

function $translate($windowProvider, cloudwizTranslateOverrider) {

  var $translationTable = {},
    $preferredLanguage,
    $availableLanguageKeys = [],
    $uses,
    $interpolationFactory,
    $interpolatorFactories = [],
    $loaderFactory,
    $loaderOptions,
    $isReady = false,
    $keepContent = false,
    loaderCache,
    uniformLanguageTagResolver = 'default',
    languageTagResolver = {
      'default' : function (tag) {
        return (tag || '').split('-').join('_');
      },
    };

  /**
   * @name pascalprecht.translate.$translateProvider#useLoader
   */
  this.useLoader = (loaderFactory, options) => {
    $loaderFactory = loaderFactory;
    $loaderOptions = options || {};
    return this;
  };

  /**
   * @name pascalprecht.translate.$translateProvider#useStaticFilesLoader
   */
  this.useStaticFilesLoader = (options) => {
    return this.useLoader('$translateStaticFilesLoader', options);
  };

  /**
   * @name pascalprecht.translate.$translateProvider#preferredLanguage
   */
  var setupPreferredLanguage = (langKey) => {
    if (langKey) { $preferredLanguage = langKey; }
    return $preferredLanguage;
  };
  this.preferredLanguage = (langKey) => {
    if (langKey) {
      setupPreferredLanguage(langKey);
      return this;
    }
    return $preferredLanguage;
  };

  /**
   * @name pascalprecht.translate.$translateProvider#use
   */
  this.use = (langKey) => {
    if (langKey) {
      if (!$translationTable[langKey] && (!$loaderFactory)) {
        // only throw an error, when not loading translation data asynchronously
        throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
      }
      $uses = langKey;
      return this;
    }
    return $uses;
  };
}

/**
 * @name pascalprecht.translate.$translateStaticFilesLoader
 */
angular.module('cloudwiz.translate').factory('$translateStaticFilesLoader', ($q, $http) => {
  return (options) => {
    if (!options || (!angular.isArray(options.files) && (!angular.isString(options.prefix) || !angular.isString(options.suffix)))) {
      throw new Error('Couldn\'t load static files, no files and prefix or suffix specified!');
    }

    if (!options.files) {
      options.files = [{
        prefix: options.prefix,
        suffix: options.suffix
      }];
    }

    var load = function (file) {
      if (!file || (!angular.isString(file.prefix) || !angular.isString(file.suffix))) {
        throw new Error('Couldn\'t load static file, no prefix or suffix specified!');
      }

      var fileUrl = [
        file.prefix,
        options.key,
        file.suffix
      ].join('');

      if (angular.isObject(options.fileMap) && options.fileMap[fileUrl]) {
        fileUrl = options.fileMap[fileUrl];
      }

      return $http(angular.extend({
        url: fileUrl,
        method: 'GET'
      }, options.$http))
        .then((result) => {
          return result.data;
        }, () => {
          return $q.reject(options.key);
        });
    };

    var promises = [], length = options.files.length;

    for (var i = 0; i < length; i++) {
      promises.push(load({
        prefix: options.files[i].prefix,
        key: options.key,
        suffix: options.files[i].suffix
      }));
    }

    return $q.all(promises).then((data) => {
      var length = data.length, mergedData = {};
      for (var i = 0; i < length; i++) {
        for (var key in data[i]) {
          mergedData[key] = data[i][key];
        }
      }
      return mergedData;
    });
  };
});

