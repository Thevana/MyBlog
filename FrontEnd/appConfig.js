var myBlogApp = angular.module("myBlogApp", ["ngRoute", "appControllers"]);

myBlogApp.config(["$routeProvider", function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "home.html",
		controller: "homeController"
	})
	.when("/timeline", {
		templateUrl : "timeline.html",
		controller: "timelineController"
	})
	.when("/timeline/updateArticle", {
		templateUrl : "updateArticle.html",
		controller: "updateArticleController"
	})
	.when("/chat", {
		templateUrl : "chat.html",
		controller: "chatController"
	})
	.otherwise({
		redirectTo : "/"
	});
}]);
