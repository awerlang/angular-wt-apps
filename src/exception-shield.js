var app = angular.module('wt.apps');

app.config(['$provide', '$compileProvider', function ($provide, $compileProvider) {
    if (!$compileProvider.debugInfoEnabled()) return;
    
    $provide.decorator("$exceptionHandler", ['$delegate', 'PanicMode', function ($delegate, PanicMode) {
        return function $exceptionHandler(exception, cause) {
            PanicMode.reportError(exception);
            $delegate(exception, cause);
        };
    }]);
}]);

app.factory("PanicMode", ['$window', function PanicMode($window) {
    function reportError(exception) {
        $window.alert(exception.reason || exception.message);
    }

    return {
        reportError: reportError
    };
}]);
