var app = angular.module('wt.apps');

app.directive('table', [function () {
	return {
		restrict: 'C',
		compile: function (element, attrs) {
			element.addClass('table-striped responsive');
		}
	};
}]);
