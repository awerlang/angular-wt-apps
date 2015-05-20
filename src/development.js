var app = angular.module('wt.apps');

// Features:
// * Works with UI-Router
// * Works with ngInclude
// * Works with directive's templateUrl
// * Only applies to development scenarios (angular.debugInfoEnabled() == true) 
// @see http://stackoverflow.com/questions/14718826/angularjs-disable-partial-caching-on-dev-machine

app.config(['$provide', '$compileProvider', function ($provide, $compileProvider) {
	if (!$compileProvider.debugInfoEnabled()) return;

	$provide.decorator('$templateRequest', ['$delegate', '$templateCache', function ($delegate, $templateCache) {
		return function (tpl) {
			var wasCachedBeforeRequest = !!$templateCache.get(tpl);
			var originalReturn = $delegate.apply(null, arguments);
			if (!wasCachedBeforeRequest) {
				originalReturn.then(function() { $templateCache.remove(tpl); });
			}
			return originalReturn;
		};
	}]);
}]);

app.config(['$provide', '$compileProvider', function ($provide, $compileProvider) {
	if (!$compileProvider.debugInfoEnabled()) return;

	$provide.decorator("$interpolate", ['$delegate', function ($delegate) {
		var interpolateWrap = function () {
			var interpolationFn = $delegate.apply(this, arguments);
			if (interpolationFn) {
				return interpolationFnWrap(interpolationFn, arguments);
			}
		};

		var interpolationFnWrap = function (interpolationFn, interpolationArgs) {
			return function () {
				var result = interpolationFn.apply(this, arguments);
				var log = result ? console.log : console.warn;
				log.call(console, "interpolation of  " + interpolationArgs[0].trim(),
					":", result.trim());
				return result;
			};
		};

		angular.extend(interpolateWrap, $delegate);
		return interpolateWrap;
	}]);
}]);
