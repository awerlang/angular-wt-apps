// https://github.com/awerlang/angular-wt-apps
(function() {
    "use strict";
    var app = angular.module("wt.apps", []);
    var app = angular.module("wt.apps");
    app.directive("table", [ function() {
        return {
            restrict: "C",
            compile: function(element, attrs) {
                element.addClass("table-striped responsive");
            }
        };
    } ]);
    var app = angular.module("wt.apps");
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$templateRequest", [ "$delegate", "$templateCache", function($delegate, $templateCache) {
            return function(tpl) {
                var wasCachedBeforeRequest = !!$templateCache.get(tpl);
                var originalReturn = $delegate.apply(null, arguments);
                if (!wasCachedBeforeRequest) {
                    originalReturn.then(function() {
                        $templateCache.remove(tpl);
                    });
                }
                return originalReturn;
            };
        } ]);
    } ]);
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$interpolate", function($delegate) {
            var interpolateWrap = function() {
                var interpolationFn = $delegate.apply(this, arguments);
                if (interpolationFn) {
                    return interpolationFnWrap(interpolationFn, arguments);
                }
            };
            var interpolationFnWrap = function(interpolationFn, interpolationArgs) {
                return function() {
                    var result = interpolationFn.apply(this, arguments);
                    var log = result ? console.log : console.warn;
                    log.call(console, "interpolation of  " + interpolationArgs[0].trim(), ":", result.trim());
                    return result;
                };
            };
            angular.extend(interpolateWrap, $delegate);
            return interpolateWrap;
        });
    } ]);
    var app = angular.module("wt.apps");
    app.config([ "$provide", "$compileProvider", function($provide, $compileProvider) {
        if (!$compileProvider.debugInfoEnabled()) return;
        $provide.decorator("$exceptionHandler", [ "$delegate", "PanicMode", function($delegate, PanicMode) {
            return function $exceptionHandler(exception, cause) {
                PanicMode.reportError(exception);
                $delegate(exception, cause);
            };
        } ]);
    } ]);
    app.factory("PanicMode", [ "$window", function PanicMode($window) {
        function reportError(exception) {
            $window.alert(exception.reason || exception.message);
        }
        return {
            reportError: reportError
        };
    } ]);
    var app = angular.module("wt.apps");
    app.filter("simnao", function() {
        return function SimNaoFilter(valor) {
            return valor == 1 ? "Sim" : "Não";
        };
    });
    var app = angular.module("wt.apps");
    app.directive("button", [ function() {
        return {
            restrict: "E",
            compile: function(element, attrs) {
                if (!attrs.type) {
                    attrs.$set("type", "button");
                }
            }
        };
    } ]);
    app.config([ "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common = {
            "X-Requested-With": "XMLHttpRequest"
        };
        $httpProvider.useApplyAsync(true);
    } ]);
    app.config([ "$locationProvider", function($locationProvider) {
        $locationProvider.html5Mode(true);
    } ]);
    app.run([ "$templateCache", "$document", function($templateCache, $document) {
        var view = $document.querySelectorAll("#ui-view")[0];
        if (view) {
            var tmplUrl = view.attributes["data-tmpl-url"].value;
            var tmplHtml = view.innerHTML;
            $templateCache.put(tmplUrl, tmplHtml);
        }
    } ]);
})();