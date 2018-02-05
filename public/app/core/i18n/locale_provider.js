
(function (window, angular, undefined) {
  'use strict';

  var util = {
    trim: function (text) {
      return text.toString().replace(/^\s+|\s+$/g, '');
    },
    lowercase: function (str) {
      return (typeof str === 'string') ? str.toLowerCase() : str;
    },
    indexOf: function (array, searchElement) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === searchElement) {
          return i;
        }
      }
      return -1;
    }
  };

  var runTranslate = ['$translate', function ($translate) {
    var key = $translate.storageKey(),
      storage = $translate.storage();

    var fallbackFromIncorrectStorageValue = function () {
      var prefreed = $translate.preferredLanguage();
      if (angular.isString(prefreed)) {
        $translate.use(prefreed);
      } else {
        storage.put(key, $translate.use());
      }
    };

    if (storage) {
      if (!storage.get(key)) {
        fallbackFromIncorrectStorageValue();
      } else {
        $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
      }
    } else if (angular.isString($translate.preferredLanguage())) {
      $translate.use($translate.preferredLanguage());
    }
  }];
  angular.module('cloudwiz.translate', ['ng']).run(runTranslate);

  /**
   * @name cloudwiz.translate.$translateProvider
   */
  var $translateProvider = ['$STORAGE_KEY', '$windowProvider', function ($STORAGE_KEY, $windowProvider) {

    var $translationTable = {},
      $preferredLanguage,
      $availableLanguageKeys = [],
      $languageKeyAliases,
      $fallbackLanguage,
      $fallbackWasString,
      $uses,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $interpolationFactory,
      $interpolatorFactories = [],
      $loaderFactory,
      $loaderOptions,
      $nestedObjectDelimeter = '.',
      $isReady = false,
      $keepContent = false,
      $nextLang,
      $missingTranslationHandlerFactory,
      $postCompilingEnabled = false,
      loaderCache,
      postProcessFn,
      uniformLanguageTagResolver = 'default',
      statefulFilter = true,
      languageTagResolver = {
        'default' : function (tag) {
          return (tag || '').split('-').join('_');
        },
      };

    /**
     * @name flatObject
     */
    var flatObject = function (data, path, result, prevKey) {
      var key, keyWithPath, keyWithShortPath, val;

      !path && (path = []);
      !result && (result = {});
      for (key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
          continue;
        }
        val = data[key];
        if (angular.isObject(val)) {
          flatObject(val, path.concat(key), result, key);
        } else {
          keyWithPath = path.length ? (path.join($nestedObjectDelimeter) + $nestedObjectDelimeter + key) : key;
          if (path.length && key === prevKey) {
            // Create shortcut path (foo.bar == foo.bar.bar)
            keyWithShortPath = path.join($nestedObjectDelimeter);
            // Link it to original path
            result[keyWithShortPath] = '@:' + keyWithPath;
          }
          result[keyWithPath] = val;
        }
      }
      return result;
    };

    // tries to determine the browsers locale
    var getLocale = function () {
      var locale = window.grafanaBootData.user.locale;
      /en/.test(locale) && (locale = 'en');
      /zh/.test(locale) && (locale = 'zh_CN');

      if (languageTagResolver[uniformLanguageTagResolver]) {
        locale = languageTagResolver[uniformLanguageTagResolver](locale);
      }
      return locale;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#determinePreferredLanguage
     */
    this.determinePreferredLanguage = function (fn) {
      var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();
      if (!$availableLanguageKeys.length) {
        $preferredLanguage = locale;
      }
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#registerAvailableLanguageKeys
     */
    this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
      if (languageKeys) {
        $availableLanguageKeys = languageKeys;
        if (aliases) {
          $languageKeyAliases = aliases;
        }
        return this;
      }
      return $availableLanguageKeys;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useLoader
     */
    this.useLoader = function (loaderFactory, options) {
      $loaderFactory = loaderFactory;
      $loaderOptions = options || {};
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useStaticFilesLoader
     */
    this.useStaticFilesLoader = function (options) {
      return this.useLoader('$translateStaticFilesLoader', options);
    };

    /**
     * @name cloudwiz.translate.$translateProvider#preferredLanguage
     */
    var setupPreferredLanguage = function (langKey) {
      if (langKey) { $preferredLanguage = langKey; }
      return $preferredLanguage;
    };
    this.preferredLanguage = function (langKey) {
      if (langKey) {
        setupPreferredLanguage(langKey);
        return this;
      }
      return $preferredLanguage;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#fallbackLanguage
     */
    var fallbackStack = function (langKey) {
      if (langKey) {
        if (angular.isString(langKey)) {
          $fallbackWasString = true;
          $fallbackLanguage = [langKey];
        } else if (angular.isArray(langKey)) {
          $fallbackWasString = false;
          $fallbackLanguage = langKey;
        }
        if (angular.isString($preferredLanguage) && util.indexOf($fallbackLanguage, $preferredLanguage) < 0) {
          $fallbackLanguage.push($preferredLanguage);
        }

        return this;
      } else {
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }
      }
    };
    this.fallbackLanguage = function (langKey) {
      fallbackStack(langKey);
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#storageKey
     */
    var storageKey = function (key) {
      if (!key) {
        if ($storagePrefix) {
          return $storagePrefix + $storageKey;
        }
        return $storageKey;
      }
      $storageKey = key;
      return this;
    };
    this.storageKey = storageKey;

    /**
     * @name pascalprecht.translate.$translateProvider#statefulFilter
     */
    this.statefulFilter = function (state) {
      if (state === undefined) {
        // getter
        return statefulFilter;
      } else {
        // setter with chaining
        statefulFilter = state;
        return this;
      }
    };

    /**
     * @name cloudwiz.translate.$translateProvider#use
     */
    this.use = function (langKey) {
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
     * @name cloudwiz.translate.$translateProvider#useStorage
     */
    this.useStorage = function (storageFactory) {
      $storageFactory = storageFactory;
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useLocalStorage
     */
    this.useLocalStorage = function () {
      return this.useStorage('$translateLocalStorage');
    };

    /**
     * @name cloudwiz.translate.$translateProvider#translations
     */
    var translations = function (langKey, translationTable) {
      if (!langKey && !translationTable) {
        return $translationTable;
      }

      if (langKey && !translationTable) {
        if (angular.isString(langKey)) {
          return $translationTable[langKey];
        }
      } else {
        if (!angular.isObject($translationTable[langKey])) {
          $translationTable[langKey] = {};
        }
        angular.extend($translationTable[langKey], flatObject(translationTable));
      }
      return this;
    };
    this.translations = translations;

    /**
     * @name pascalprecht.translate.$translateProvider#keepContent
     */
    this.keepContent = function (value) {
      $keepContent = !(!value);
      return this;
    };

    /**
     * @name cloudwiz.translate.$translate
     */
    this.$get = function ($injector, $rootScope, $q) {
      var Storage,
        defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
        pendingLoader = false,
        interpolatorHashMap = {},
        langPromises = {},
        fallbackIndex,
        startFallbackIteration;

      var applyPostProcessing = function (translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy) {
        var fn = postProcessFn;

        if (fn) {
          if (typeof(fn) === 'string') {
            // getting on-demand instance
            fn = $injector.get(fn);
          }
          if (fn) {
            return fn(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy);
          }
        }

        return resolvedTranslation;
      };

      var getTranslationTable = function (langKey) {
        var deferred = $q.defer();
        if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
          deferred.resolve($translationTable[langKey]);
        } else if (langPromises[langKey]) {
          var onResolve = function (data) {
            translations(data.key, data.table);
            deferred.resolve(data.table);
          };
          langPromises[langKey].then(onResolve, deferred.reject);
        } else {
          deferred.reject();
        }
        return deferred.promise;
      };

      var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
        var deferred = $q.defer();

        var onResolve = function (translationTable) {
          if (Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
            Interpolator.setLocale(langKey);
            var translation = translationTable[translationId];
            if (translation.substr(0, 2) === '@:') {
              getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator, sanitizeStrategy)
                .then(deferred.resolve, deferred.reject);
            } else {
              var interpolatedValue = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'service', sanitizeStrategy, translationId);
              interpolatedValue = applyPostProcessing(translationId, translationTable[translationId], interpolatedValue, interpolateParams, langKey);

              deferred.resolve(interpolatedValue);

            }
            Interpolator.setLocale($uses);
          } else {
            deferred.reject();
          }
        };

        getTranslationTable(langKey).then(onResolve, deferred.reject);

        return deferred.promise;
      };

      var translateByHandler = function (translationId, interpolateParams, defaultTranslationText, sanitizeStrategy) {
        // If we have a handler factory - we might also call it here to determine if it provides
        // a default text for a translationid that can't be found anywhere in our tables
        if ($missingTranslationHandlerFactory) {
          return $injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams, defaultTranslationText, sanitizeStrategy);
        } else {
          return translationId;
        }
      };

      var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
        var deferred = $q.defer();

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy).then(
            function (data) {
              deferred.resolve(data);
            },
            function () {
              // Look in the next fallback language for a translation.
              // It delays the resolving by passing another promise to resolve.
              return resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy).then(deferred.resolve, deferred.reject);
            }
          );
        } else {
          // No translation found in any fallback language
          // if a default translation text is set in the directive, then return this as a result
          if (defaultTranslationText) {
            deferred.resolve(defaultTranslationText);
          } else {
            var missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);

            // if no default translation is set and an error handler is defined, send it to the handler
            // and then return the result if it isn't undefined
            if ($missingTranslationHandlerFactory && missingTranslationHandlerTranslation) {
              deferred.resolve(missingTranslationHandlerTranslation);
            } else {
              // deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
        }
        return deferred.promise;
      };

      var fallbackTranslation = function (translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguage((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy);
      };

      var determineTranslation = function (translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy) {
        var deferred = $q.defer();

        var table = uses ? $translationTable[uses] : $translationTable,
          Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {

            $translate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy)
              .then(deferred.resolve, deferred.reject);
          } else {
            //
            var resolvedTranslation = Interpolator.interpolate(translation, interpolateParams, 'service', sanitizeStrategy, translationId);
            resolvedTranslation = applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses);
            deferred.resolve(resolvedTranslation);
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy)
              .then(function (translation) {
                deferred.resolve(translation);
              }, function (_translationId) {
                // deferred.reject(applyNotFoundIndicators(_translationId));
              });
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            if (defaultTranslationText) {
              deferred.resolve(defaultTranslationText);
            } else {
              deferred.resolve(missingTranslationHandlerTranslation);
            }
          } else {
            if (defaultTranslationText) {
              deferred.resolve(defaultTranslationText);
            } else {
              // deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
        }
        return deferred.promise;
      };

      var determineTranslationInstant = function (translationId, interpolateParams, interpolationId, uses, sanitizeStrategy) {
        var result, table = uses ? $translationTable[uses] : $translationTable,
          Interpolator = defaultInterpolator;

        // if the interpolation id exists use custom interpolator
        if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
          Interpolator = interpolatorHashMap[interpolationId];
        }

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {
            result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId, uses, sanitizeStrategy);
          } else {
            result = Interpolator.interpolate(translation, interpolateParams, 'filter', sanitizeStrategy, translationId);
            result = applyPostProcessing(translationId, translation, result, interpolateParams, uses, sanitizeStrategy);
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackIndex = 0;
            result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy);
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            result = missingTranslationHandlerTranslation;
          } else {
            result = applyNotFoundIndicators(translationId);
          }
        }

        return result;
      };

      /**
       * @name the returened
       */
      var $translate = function (translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy) {
        if (!$uses && $preferredLanguage) {
          $uses = $preferredLanguage;
        }
        var uses = $uses;

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          // This transforms all promises regardless resolved or rejected
          var translateAll = function (translationIds) {
            var results = {}; // storing the actual results
            var promises = []; // promises to wait for
            // Wraps the promise a) being always resolved and b) storing the link id->value
            var translate = function (translationId) {
              var deferred = $q.defer();
              var regardless = function (value) {
                results[translationId] = value;
                deferred.resolve([translationId, value]);
              };
              // we don't care whether the promise was resolved or rejected; just store the values
              $translate(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy).then(regardless, regardless);
              return deferred.promise;
            };
            for (var i = 0, c = translationIds.length; i < c; i++) {
              promises.push(translate(translationIds[i]));
            }
            // wait for all (including storing to results)
            return $q.all(promises).then(function () {
              return results;
            });
          };
          return translateAll(translationId);
        }

        var deferred = $q.defer();

        // trim off any whitespace
        if (translationId) {
          translationId = util.trim(translationId);
        }

        var promiseToWaitFor = (function () {
          var promise = langPromises[uses] || langPromises[$preferredLanguage];

          fallbackIndex = 0;

          if ($storageFactory && !promise) {
            // looks like there's no pending promise for $preferredLanguage or
            // $uses. Maybe there's one pending for a language that comes from
            // storage.
            var langKey = Storage.get($storageKey);
            promise = langPromises[langKey];

            if ($fallbackLanguage && $fallbackLanguage.length) {
              var index = util.indexOf($fallbackLanguage, langKey);
              // maybe the language from storage is also defined as fallback language
              // we increase the fallback language index to not search in that language
              // as fallback, since it's probably the first used language
              // in that case the index starts after the first element
              fallbackIndex = (index === 0) ? 1 : 0;

              // but we can make sure to ALWAYS fallback to preferred language at least
              if (util.indexOf($fallbackLanguage, $preferredLanguage) < 0) {
                $fallbackLanguage.push($preferredLanguage);
              }
            }
          }
          return promise;
        }());

        if (!promiseToWaitFor) {
          // no promise to wait for? okay. Then there's no loader registered
          // nor is a one pending for language that comes from storage.
          // We can just translate.
          determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
        } else {
          var promiseResolved = function () {
            // $uses may have changed while waiting
            if (!forceLanguage) {
              uses = $uses;
            }
            determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
          };

          promiseToWaitFor['finally'](promiseResolved)['catch'](angular.noop); // we don't care about errors here, already handled
        }
        return deferred.promise;
      };

      /**
       * @name loadAsync
       */
      var loadAsync = function (key) {
        if (!key) { throw 'No language key specified for loading.'; }

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
              angular.extend(translationTable, flatObject(table));
            });
          } else {
            angular.extend(translationTable, flatObject(data));
          }
          pendingLoader = false;
          deferred.resolve({
            key : key,
            table : translationTable
          });

          $translate.i18n = translationTable;
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
       * @name cloudwiz.translate.$translate#preferredLanguage
       */
      $translate.preferredLanguage = function (langKey) {
        if (langKey) {
          setupPreferredLanguage(langKey);
        }
        return $preferredLanguage;
      };

      /**
       * @name useLanguage
       */
      var useLanguage = function (key) {
        $uses = key;

        // make sure to store new language key before triggering success event
        if ($storageFactory) {
          Storage.put($translate.storageKey(), $uses);
        }

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

      var clearNextLangAndPromise = function (key) {
        if ($nextLang === key) {
          $nextLang = undefined;
        }
        langPromises[key] = undefined;
      };

      // internal purpose only
      $translate.statefulFilter = function () {
        return statefulFilter;
      };

      /**
       * @name cloudwiz.translate.$translate#use
       */
      $translate.use = function (key) {
        if (!key) { return $uses; }

        var deferred = $q.defer();
        deferred.promise.then(null, angular.noop); // AJS "Possibly unhandled rejection"

        $rootScope.$emit('$translateChangeStart', {language : key});

        // if there isn't a translation table for the language we've requested,
        // we load it asynchronously
        $nextLang = key;
        if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
          langPromises[key] = loadAsync(key).then(function (translation) {
            translations(translation.key, translation.table);
            deferred.resolve(translation.key);
            if ($nextLang === key) {
              useLanguage(translation.key);
            }
            return translation;
          }, function (key) {
            $rootScope.$emit('$translateChangeError', {language : key});
            deferred.reject(key);
            $rootScope.$emit('$translateChangeEnd', {language : key});
            return $q.reject(key);
          });
          langPromises[key]['finally'](function () {
            clearNextLangAndPromise(key);
          })['catch'](angular.noop); // we don't care about errors (clearing)
        } else if (langPromises[key]) {
          // we are already loading this asynchronously
          // resolve our new deferred when the old langPromise is resolved
          langPromises[key].then(function (translation) {
            if ($nextLang === translation.key) {
              useLanguage(translation.key);
            }
            deferred.resolve(translation.key);
            return translation;
          }, function (key) {
            // find first available fallback language if that request has failed
            if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0 && $fallbackLanguage[0] !== key) {
              return $translate['use']($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
            } else {
              return deferred.reject(key);
            }
          });
        } else {
          deferred.resolve(key);
          useLanguage(key);
        }

        return deferred.promise;
      };

      /**
       * @name cloudwiz.translate.$translate#isPostCompilingEnabled
       */
      $translate.isPostCompilingEnabled = function () {
        return $postCompilingEnabled;
      };

      /**
       * @name cloudwiz.translate.$translate#storage
       */
      $translate.storage = function () {
        return Storage;
      };

      /**
       * @name cloudwiz.translate.$translate#storageKey
       */
      $translate.storageKey = function () {
        return storageKey();
      };

      /**
       * @name pascalprecht.translate.$translate#instant
       */
      $translate.instant = function (translationId, interpolateParams, interpolationId, forceLanguage, sanitizeStrategy) {
        // we don't want to re-negotiate $uses
        // var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
        //   (negotiateLocale(forceLanguage) || forceLanguage) : $uses;
        var uses = $uses;

        // Detect undefined and null values to shorten the execution and prevent exceptions
        if (translationId === null || angular.isUndefined(translationId)) {
          return translationId;
        }

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          var results = {};
          for (var i = 0, c = translationId.length; i < c; i++) {
            results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId, forceLanguage, sanitizeStrategy);
          }
          return results;
        }

        // We discarded unacceptable values. So we just need to verify if translationId is empty String
        if (angular.isString(translationId) && translationId.length < 1) {
          return translationId;
        }

        // trim off any whitespace
        if (translationId) {
          translationId = util.trim(translationId);
        }

        var result, possibleLangKeys = [];
        if ($preferredLanguage) {
          possibleLangKeys.push($preferredLanguage);
        }
        if (uses) {
          possibleLangKeys.push(uses);
        }
        if ($fallbackLanguage && $fallbackLanguage.length) {
          possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
        }
        for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
          var possibleLangKey = possibleLangKeys[j];
          if ($translationTable[possibleLangKey]) {
            if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
              result = determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy);
            }
          }
          if (typeof result !== 'undefined') {
            break;
          }
        }

        if (!result && result !== '') {
          if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
            throw Error('Not found indicator left or right');
            // result = applyNotFoundIndicators(translationId);
          } else {
            // Return translation of default interpolator if not found anything.
            result = defaultInterpolator.interpolate(translationId, interpolateParams, 'filter', sanitizeStrategy);

            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
            }

            if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              result = missingTranslationHandlerTranslation;
            }
          }
        }

        return result;
      };

      /**
       * @name pascalprecht.translate.$translate#isKeepContent
       */
      $translate.isKeepContent = function () {
        return $keepContent;
      };

      if ($storageFactory) {
        Storage = $injector.get($storageFactory);

        if (!Storage.get || !Storage.put) {
          throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
        }
      }

      if ($loaderFactory) {
        // If at least one async loader is defined and there are no
        // (default) translations available we should try to load them.
        if (angular.equals($translationTable, {})) {
          if ($translate.use()) {
            $translate.use($translate.use());
          }
        }

        // Also, if there are any fallback language registered, we start
        // loading them asynchronously as soon as we can.
        if ($fallbackLanguage && $fallbackLanguage.length) {
          var processAsyncResult = function (translation) {
            translations(translation.key, translation.table);
            $rootScope.$emit('$translateChangeEnd', {language : translation.key});
            return translation;
          };
          for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
            var fallbackLanguageId = $fallbackLanguage[i];
            if (!$translationTable[fallbackLanguageId]) {
              langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
            }
          }
        }
      } else {
        $rootScope.$emit('$translateReady', {language : $translate.use()});
      }

      return $translate;
    };
  }];
  angular.module('cloudwiz.translate').provider('$translate', $translateProvider);

  /**
   * @name cloudwiz.translate.$translateStaticFilesLoader
   */
  angular.module('cloudwiz.translate').factory('$translateStaticFilesLoader', ['$q', '$http', function ($q, $http) {
    return function (options) {
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
          .then(function (result) {
            return result.data;
          }, function () {
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

      return $q.all(promises).then(function (data) {
        var length = data.length, mergedData = {};
        for (var i = 0; i < length; i++) {
          for (var key in data[i]) {
            mergedData[key] = data[i][key];
          }
        }
        return mergedData;
      });
    };
  }]);

  angular.module('cloudwiz.translate').factory('$translateDefaultInterpolation', ['$interpolate', function ($interpolate) {
    var $translateInterpolator = {},
        $locale,
        $identifier = 'default';

    $translateInterpolator.setLocale = function (locale) {
      $locale = locale;
    };

    $translateInterpolator.getInterpolationIdentifier = function () {
      return $identifier;
    };

    $translateInterpolator.interpolate = function (value, interpolationParams, context, sanitizeStrategy, translationId) {
      interpolationParams = interpolationParams || {};
      // interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy, context);

      var interpolatedText;
      if (angular.isNumber(value)) {
        // numbers are safe
        interpolatedText = String(value);
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
  }]);

  ////////
  // Directive
  ////////
  angular.module('cloudwiz.translate').directive('translate', function ($translate, $interpolate, $compile, $parse, $rootScope) {

    return {
      restrict: 'AE',
      scope: true,
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
          var translationIds = {};

          var initInterpolationParams = function (interpolateParams, iAttr, tAttr) {
            // initial setup
            if (iAttr.translateValues) {
              angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
            }
            // initially fetch all attributes if existing and fill the params
            if (translateValueExist) {
              for (var attr in tAttr) {
                if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                  var attributeName = util.lowercase(attr.substr(14, 1)) + attr.substr(15);
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
          var updateTranslation = function (translateAttr, translationId, scope, interpolateParams, defaultTranslationText) {
            if (translationId) {
              $translate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage, scope.sanitizeStrategy)
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
          var observeElementTranslation = function (translationId) {

            // Remove any old watcher
            if (angular.isFunction(observeElementTranslation._unwatchOld)) {
              observeElementTranslation._unwatchOld();
              observeElementTranslation._unwatchOld = undefined;
            }

            if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
              var iElementText = util.trim(iElement.text());

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
                var attributeName = util.lowercase(attrName.substr(14, 1)) + attrName.substr(15);
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
  // filter
  ////////
  angular.module('cloudwiz.translate').filter('translate', function ($parse, $translate) {
    var translateFilter = function (translationId, interpolateParams, interpolation, forceLanguage) {
      if (!angular.isObject(interpolateParams)) {
        var ctx = this;
        interpolateParams = $parse(interpolateParams)(ctx);
      }

      return $translate.instant(translationId, interpolateParams, interpolation, forceLanguage);
    };

    if ($translate.statefulFilter()) {
      translateFilter.$stateful = true;
    }

    return translateFilter;
  });

  ////////
  // Storage
  ////////
  angular.module('cloudwiz.translate').constant('$STORAGE_KEY', 'CLOUDWIZ_LANG_KEY');
  angular.module('cloudwiz.translate').factory('$translateLocalStorage', ['$window', function ($window) {
    var localStorageAdapter = (function () {
      var langKey;
      return {
        get: function (name) {
          if (!langKey) {
            langKey = $window.localStorage.getItem(name);
          }
          return langKey;
        },
        set: function (name, value) {
          langKey = value;
          $window.localStorage.setItem(name, value);
        },
        put: function (name, value) {
          langKey = value;
          $window.localStorage.setItem(name, value);
        }
      };
    }());

    var $translateLocalStorage = localStorageAdapter;
    return $translateLocalStorage;
  }]);

})(window, window.angular);
