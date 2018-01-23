///<reference path="../../headers/common.d.ts" />

import angular from 'angular';

angular.module('cloudwiz.translate', ['ng']).run(($translate) => {
  // $translate.use($translate.preferredLanguage());
});


/**
 *  @name cloudwiz.translate.$translateProvider
 */
angular.module('cloudwiz.translate').constant('cloudwizTranslateOverrider', {}).provider('$translate', $translate);

//($STORAGE_KEY, $windowProvider, $translateSanitizationProvider, cloudwizTranslateOverrider)
function $translate($STORAGE_KEY, $windowProvider, cloudwizTranslateOverrider) {

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
    $fallbackLanguage,
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

  /**
   * @name pascalprecht.translate.$translate
   */
  this.$get = ($injector, $rootScope, $q) => {
    var defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
      pendingLoader = false,
      interpolatorHashMap = {},
      langPromises = {},
      fallbackIndex,
      startFallbackIteration;

    /**
     * @name loadAsync
     */
    var loadAsync = function (key) {
      if (!key) {
        throw 'No language key specified for loading.';
      }

      var deferred = $q.defer();

      $rootScope.$emit('$translateLoadingStart', {language : key});
      pendingLoader = true;

      var cache = loaderCache;
      if (typeof(cache) === 'string') {
        // getting on-demand instance of loader
        cache = $injector.get(cache);
      }

      var loaderOptions = angular.extend({}, $loaderOptions, {
        key : key,
        $http : angular.extend({}, {
          cache : cache
        }, $loaderOptions.$http)
      });

      var onLoaderSuccess = function (data) {
        var translationTable = {};
        $rootScope.$emit('$translateLoadingSuccess', {language : key});

        if (angular.isArray(data)) {
          angular.forEach(data, function (table) {
            angular.extend(translationTable, table);
            // angular.extend(translationTable, flatObject(table));
          });
        } else {
          angular.extend(translationTable, data);
          // angular.extend(translationTable, flatObject(data));
        }
        pendingLoader = false;
        deferred.resolve({
          key : key,
          table : translationTable
        });
        $rootScope.$emit('$translateLoadingEnd', {language : key});
      };

      var onLoaderError = function (key) {
        $rootScope.$emit('$translateLoadingError', {language : key});
        deferred.reject(key);
        $rootScope.$emit('$translateLoadingEnd', {language : key});
      };

      $injector.get($loaderFactory)(loaderOptions).then(onLoaderSuccess, onLoaderError);

      return deferred.promise;
    };

    /**
     * @name pascalprecht.translate.$translate#preferredLanguage
     */
    $translate['preferredLanguage'] = (langKey) => {
      if (langKey) {
        setupPreferredLanguage(langKey);
      }
      return $preferredLanguage;
    };

    /**
     * @param key @name useLanguage
     */
    var useLanguage = (key) => {
      $uses = key;

      // make sure to store new language key before triggering success event
      // if ($storageFactory) {
      //   Storage.put($translate.storageKey(), $uses);
      // }

      $rootScope.$emit('$translateChangeSuccess', {language : key});

      // inform default interpolator
      defaultInterpolator.setLocale($uses);

      var eachInterpolator = function (interpolator, id) {
        interpolatorHashMap[id].setLocale($uses);
      };

      // inform all others too!
      angular.forEach(interpolatorHashMap, eachInterpolator);
      $rootScope.$emit('$translateChangeEnd', {language : key});
    };

    /**
     * @name pascalprecht.translate.$translate#use
     */
    $translate['use'] = (key?) => {
      if (!key) { return $uses; }

      var deferred = $q.defer();
      deferred.promise.then(null, angular.noop); // AJS "Possibly unhandled rejection"

      $rootScope.$emit('$translateChangeStart', {language : key});

      deferred.resolve(key);
      useLanguage(key);

      // Try to get the aliased language key
      // var aliasedKey = negotiateLocale(key);
      // Ensure only registered language keys will be loaded
      // if ($availableLanguageKeys.length > 0 && !aliasedKey) {
      //   return $q.reject(key);
      // }

      // if (aliasedKey) {
      //   key = aliasedKey;
      // }

      // if there isn't a translation table for the language we've requested,
      // we load it asynchronously
      // $nextLang = key;
      // if (($forceAsyncReloadEnabled || !$translationTable[key]) && $loaderFactory && !langPromises[key]) {
      //   langPromises[key] = loadAsync(key).then(function (translation) {
      //     translations(translation.key, translation.table);
      //     deferred.resolve(translation.key);
      //     if ($nextLang === key) {
      //       useLanguage(translation.key);
      //     }
      //     return translation;
      //   }, function (key) {
      //     $rootScope.$emit('$translateChangeError', {language : key});
      //     deferred.reject(key);
      //     $rootScope.$emit('$translateChangeEnd', {language : key});
      //     return $q.reject(key);
      //   });
      //   langPromises[key]['finally'](function () {
      //     clearNextLangAndPromise(key);
      //   })['catch'](angular.noop); // we don't care about errors (clearing)
      // } else if (langPromises[key]) {
      //   // we are already loading this asynchronously
      //   // resolve our new deferred when the old langPromise is resolved
      //   langPromises[key].then(function (translation) {
      //     if ($nextLang === translation.key) {
      //       useLanguage(translation.key);
      //     }
      //     deferred.resolve(translation.key);
      //     return translation;
      //   }, function (key) {
      //     // find first available fallback language if that request has failed
      //     if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0 && $fallbackLanguage[0] !== key) {
      //       return $translate.use($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
      //     } else {
      //       return deferred.reject(key);
      //     }
      //   });
      // } else {
      //   deferred.resolve(key);
      //   useLanguage(key);
      // }

      return deferred.promise;
    };

    if ($loaderFactory) {
      // If at least one async loader is defined and there are no
      // (default) translations available we should try to load them.
      if (angular.equals($translationTable, {})) {
        if ($translate['use']()) {
          $translate['use']($translate['use']());
        }
      }

      // Also, if there are any fallback language registered, we start
      // loading them asynchronously as soon as we can.
      // if ($fallbackLanguage && $fallbackLanguage.length) {
      //   var processAsyncResult = function (translation) {
      //     translations(translation.key, translation.table);
      //     $rootScope.$emit('$translateChangeEnd', {language : translation.key});
      //     return translation;
      //   };
      //   for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
      //     var fallbackLanguageId = $fallbackLanguage[i];
      //     if ($forceAsyncReloadEnabled || !$translationTable[fallbackLanguageId]) {
      //       langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
      //     }
      //   }
      // }
    } else {
      $rootScope.$emit('$translateReady', {language : $translate['use']()});
    }

    return $translate;
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

/**
 * ($interpolate, $translateSanitization)
 */
angular.module('cloudwiz.translate').factory('$translateDefaultInterpolation', ($interpolate) => {
  var $translateInterpolator: any = {},
      $locale,
      $identifier = 'default';

  $translateInterpolator.setLocale = function (locale) {
    $locale = locale;
  };

  $translateInterpolator.getInterpolationIdentifier = function () {
    return $identifier;
  };

  // $translateInterpolator.useSanitizeValueStrategy = function (value) {
  //   $translateSanitization.useStrategy(value);
  //   return this;
  // };

  $translateInterpolator.interpolate = function (value, interpolationParams, context, sanitizeStrategy, translationId) {
    interpolationParams = interpolationParams || {};
    // interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy, context);

    var interpolatedText;
    if (angular.isNumber(value)) {
      // numbers are safe
      interpolatedText = '' + value;
    } else if (angular.isString(value)) {
      // strings must be interpolated (that's the job here)
      interpolatedText = $interpolate(value)(interpolationParams);
      // interpolatedText = $translateSanitization.sanitize(interpolatedText, 'text', sanitizeStrategy, context);
    } else {
      // neither a number or a string, cant interpolate => empty string
      interpolatedText = '';
    }

    return interpolatedText;
  };

  return $translateInterpolator;
});


angular.module('cloudwiz.translate').directive('translate', ($translate, $interpolate, $compile, $parse, $rootScope) => {

  var trim = function() {
    return this.toString().replace(/^\s+|\s+$/g, '');
  };

  var lowerFn = function (str) {
    return angular.isString(str) ? str.toLowerCase() : str;
  };

  return {
    restrict: 'AE',
    scope: true,
    // priority: $translate.directivePriority(),
    compile: function (tElement, tAttr) {

      var translateValuesExist = (tAttr.translateValues) ?
        tAttr.translateValues : undefined;

      var translateInterpolation = (tAttr.translateInterpolation) ?
        tAttr.translateInterpolation : undefined;

      var translateSanitizeStrategyExist = (tAttr.translateSanitizeStrategy) ?
        tAttr.translateSanitizeStrategy : undefined;

      var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);

      var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
          watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';

      return function linkFn(scope, iElement, iAttr) {

        scope.interpolateParams = {};
        scope.preText = '';
        scope.postText = '';
        var translationIds: any = {};

        var initInterpolationParams = function (interpolateParams, iAttr, tAttr) {
          // initial setup
          if (iAttr.translateValues) {
            angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
          }
          // initially fetch all attributes if existing and fill the params
          if (translateValueExist) {
            for (var attr in tAttr) {
              if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                var attributeName = lowerFn(attr.substr(14, 1)) + attr.substr(15);
                interpolateParams[attributeName] = tAttr[attr];
              }
            }
          }
        };

        var applyTranslation = function (value, scope, successful, translateAttr) {
          if (!successful) {
            if (typeof scope.defaultText !== 'undefined') {
              value = scope.defaultText;
            }
          }
          if (translateAttr === 'translate') {
            // default translate into innerHTML
            if (successful || (!successful && !$translate.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
              iElement.empty().append(scope.preText + value + scope.postText);
            }
            var globallyEnabled = $translate.isPostCompilingEnabled();
            var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
            var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
            if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
              $compile(iElement.contents())(scope);
            }
          } else {
            // translate attribute
            var attributeName = iAttr.$attr[translateAttr];
            if (attributeName.substr(0, 5) === 'data-') {
              // ensure html5 data prefix is stripped
              attributeName = attributeName.substr(5);
            }
            attributeName = attributeName.substr(15);
            iElement.attr(attributeName, value);
          }
        };

        // Put translation processing function outside loop
        var updateTranslation = function(translateAttr, translationId, scope, interpolateParams, defaultTranslationText) {
          if (translationId) {
            console.log($translate);
            var pro = $translate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage, scope.sanitizeStrategy);
            console.log(pro);
            pro
              .then(function (translation) {
                applyTranslation(translation, scope, true, translateAttr);
              }, function (translationId) {
                applyTranslation(translationId, scope, false, translateAttr);
              });
          } else {
            // as an empty string cannot be translated, we can solve this using successful=false
            applyTranslation(translationId, scope, false, translateAttr);
          }
        };

        // Master update function
        var updateTranslations = function () {
          for (var key in translationIds) {
            if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
              updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText);
            }
          }
        };

        // Ensures any change of the attribute "translate" containing the id will
        // be re-stored to the scope's "translationId".
        // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
        var observeElementTranslation: any = function (translationId) {

          // Remove any old watcher
          if (angular.isFunction(observeElementTranslation._unwatchOld)) {
            observeElementTranslation._unwatchOld();
            observeElementTranslation._unwatchOld = undefined;
          }

          if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
            var iElementText = trim.apply(iElement.text());

            // Resolve translation id by inner html if required
            var interpolateMatches = iElementText.match(interpolateRegExp);
            // Interpolate translation id if required
            if (angular.isArray(interpolateMatches)) {
              scope.preText = interpolateMatches[1];
              scope.postText = interpolateMatches[3];
              translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
              var watcherMatches = iElementText.match(watcherRegExp);
              if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
                observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function (newValue) {
                  translationIds.translate = newValue;
                  updateTranslations();
                });
              }
            } else {
              // do not assigne the translation id if it is empty.
              translationIds.translate = !iElementText ? undefined : iElementText;
            }
          } else {
            translationIds.translate = translationId;
          }
          updateTranslations();
        };

        var observeAttributeTranslation = function (translateAttr) {
          iAttr.$observe(translateAttr, function (translationId) {
            translationIds[translateAttr] = translationId;
            updateTranslations();
          });
        };

        // initial setup with values
        initInterpolationParams(scope.interpolateParams, iAttr, tAttr);

        var firstAttributeChangedEvent = true;
        iAttr.$observe('translate', function (translationId) {
          if (typeof translationId === 'undefined') {
            // case of element "<translate>xyz</translate>"
            observeElementTranslation('');
          } else {
            // case of regular attribute
            if (translationId !== '' || !firstAttributeChangedEvent) {
              translationIds.translate = translationId;
              updateTranslations();
            }
          }
          firstAttributeChangedEvent = false;
        });

        for (var translateAttr in iAttr) {
          if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr' && translateAttr.length > 13) {
            observeAttributeTranslation(translateAttr);
          }
        }

        iAttr.$observe('translateDefault', function (value) {
          scope.defaultText = value;
          updateTranslations();
        });

        if (translateSanitizeStrategyExist) {
          iAttr.$observe('translateSanitizeStrategy', function (value) {
            scope.sanitizeStrategy = $parse(value)(scope.$parent);
            updateTranslations();
          });
        }

        if (translateValuesExist) {
          iAttr.$observe('translateValues', function (interpolateParams) {
            if (interpolateParams) {
              scope.$parent.$watch(function () {
                angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
              });
            }
          });
        }

        if (translateValueExist) {
          var observeValueAttribute = function (attrName) {
            iAttr.$observe(attrName, function (value) {
              var attributeName = lowerFn(attrName.substr(14, 1)) + attrName.substr(15);
              scope.interpolateParams[attributeName] = value;
            });
          };
          for (var attr in iAttr) {
            if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
              observeValueAttribute(attr);
            }
          }
        }

        if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
          scope.$watch('interpolateParams', updateTranslations, true);
        }

        // Replaced watcher on translateLanguage with event listener
        scope.$on('translateLanguageChanged', updateTranslations);

        // Ensures the text will be refreshed after the current language was changed
        // w/ $translate.use(...)
        var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);

        // ensure translation will be looked up at least one
        if (iElement.text().length) {
          if (iAttr.translate) {
            observeElementTranslation(iAttr.translate);
          } else {
            observeElementTranslation('');
          }
        } else if (iAttr.translate) {
          // ensure attribute will be not skipped
          observeElementTranslation(iAttr.translate);
        }
        updateTranslations();
        scope.$on('$destroy', unbind);
      };
    }
  };
});


////////
// Storage
////////
angular.module('cloudwiz.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');

