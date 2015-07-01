var app = angular.module('wt.apps');

app.directive('button', [function () {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            if (!attrs.type) {
                attrs.$set('type', 'button');
            }
        }
    };
}]);

app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.defaults.headers.common = { 'X-Requested-With': 'XMLHttpRequest' };
	$httpProvider.useApplyAsync(true);
}]);
app.config(['$locationProvider', function ($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

app.run(['$templateCache', '$document', function ($templateCache, $document) {
    // <ui-view> contains a pre-rendered template for the current view
    // caching it will prevent a round-trip to a server at the first page load
    var view = $document.querySelectorAll("#ui-view")[0];
    if (view) {
        var tmplUrl = view.attributes['data-tmpl-url'].value;
        var tmplHtml = view.innerHTML;
        $templateCache.put(tmplUrl, tmplHtml);
    }
}]);

app.run(['$rootScope', '$injector', function ($rootScope, $injector) {
    if (!$injector.has('$modalStack')) return;

    var $modalStack = $injector.get('$modalStack');
    $rootScope.$on('$locationChangeStart', function (event) {
        var top = $modalStack.getTop();
        if (top) {
            $modalStack.dismissAll();
            event.preventDefault();
        }
    });
}]);
