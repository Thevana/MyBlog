var myBlogApp = angular.module("myBlogApp", ["ngRoute", "appControllers"]);

myBlogApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'home.html',
		controller: 'homeController'
	})
	.when('/timeline', {
		templateUrl : 'timeline.html',
		controller: 'timelineController'
	})
	.otherwise({
		redirectTo : '/'
	});
}]);
