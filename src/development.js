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

	$provide.decorator("$interpolate", ['$delegate', '$log', '$rootScope', function ($delegate, $log, $rootScope) {
		return angular.extend(function interpolateDecorator() {
			var textToInterpolate = arguments[0].trim();
			var interpolationFn = $delegate.apply(this, arguments);	
			if (!interpolationFn) return;

			return function () {
				var result = interpolationFn.apply(this, arguments);
				if (textToInterpolate) {
					if (!result) {
						$log.debug("$interpolate(", textToInterpolate, "): ", typeof result);
					} else if ($rootScope.logAll) {
						$log.debug("$interpolate(", textToInterpolate, "): ", result.trim());
					}
				}
				return result;
			};
		}, $delegate);
	}]);
}]);
