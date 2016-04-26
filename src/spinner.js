var app = angular.module('wt.apps');

/**
 * @private
 */
function FullPageSpinner(START_REQUEST, END_REQUEST) {
    return function (scope, element, attrs) {
        element[0].style.display = 'none';

        scope.$on(START_REQUEST, function () {
            element[0].style.display = '';
        });

        scope.$on(END_REQUEST, function () {
            element[0].style.display = 'none';
        });
    };
}

/**
 * @private
 */
function SpinnerHttpInterceptor($q, $rootScope, START_REQUEST, END_REQUEST) {
    var numLoadings = 0;
    const skip = function (config) {
        return config.params && config.params.bg === true;
    };

    return {
        request: function (config) {
            if (!skip(config)) {
                numLoadings++;
                $rootScope.$broadcast(START_REQUEST);
            }
            return config || $q.when(config);
        },
        requestError: function (rejection) {
            if ((--numLoadings) === 0) {
                $rootScope.$broadcast(END_REQUEST);
            }
            return $q.reject(rejection);
        },

        response: function (response) {
            if (!skip(response.config)) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast(END_REQUEST);
                }
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!skip(response.config)) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast(END_REQUEST);
                }
            }

            return $q.reject(response);
        }
    };
}

app.constant('START_REQUEST', 'START_REQUEST')
.constant('END_REQUEST', 'END_REQUEST')
.directive('wtFullPageSpinner', ['START_REQUEST', 'END_REQUEST', FullPageSpinner])
.factory('spinnerHttpInterceptor', ['$q', '$rootScope', 'START_REQUEST', 'END_REQUEST', SpinnerHttpInterceptor])
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('spinnerHttpInterceptor');
}]);
