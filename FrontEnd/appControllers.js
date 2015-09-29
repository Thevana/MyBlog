var protocol = "http";
var host = "localhost";
var port = "8080";
var serverUrl = protocol + "://" + host + ":" + port;

var appControllers = angular.module("appControllers", ["ngCookies"]);

appControllers.controller("homeController", ["$scope", "$http", "$location", "$cookies", function($scope, $http, $location, $cookies) {
	
	if($cookies.getObject("connectedUser") !== undefined) {
		$location.path("/timeline");
	}
	
	// Add new user
	$scope.addUser = function() {
		$scope.message = "Veuillez patienter ...";
		if($scope.pseudo !== undefined && $scope.password !== undefined) {
			var newUser = {
				pseudo : $scope.pseudo,
				password : $scope.password
			}
			$http.post(serverUrl + "/user/add", newUser)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre compte a été créé avec succès ! \nVous pouvez dès à présent vous authentifier.");
					$scope.message = "";
				}
				else {
					$scope.message = "Votre 'Pseudo' ou 'Mot de passe' est incorrect, ou votre 'Pseudo' existe déjà ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.message = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.message = "Le champs 'Pseudo' ou 'Mot de passe' est vide ! \nVeuillez réessayez.";
		}
		$scope.pseudo = "";
		$scope.password = "";
	}
	
	// Authenticate user
	$scope.authentificateUser = function() {
		$scope.message = "Veuillez patienter ...";
		if($scope.pseudo !== undefined && $scope.password !== undefined) {
			var userToAuthenticate = {
				pseudo : $scope.pseudo,
				password : $scope.password
			}
			$http.post(serverUrl + "/user/authenticate", userToAuthenticate)
			.then(function(resp) {
				if(resp.data !== -1) {
					var connectedUser = {
						id : resp.data,
						pseudo : userToAuthenticate.pseudo
					}
					$cookies.putObject("connectedUser", connectedUser);
					$scope.message = "Chargement en cours ...";
					$location.path("/timeline");
				}
				else {
					$scope.message = "Votre 'Pseudo' ou 'Mot de passe' est incorrect ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.message = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.message = "Le champs 'Pseudo' ou 'Mot de passe' est vide ! \nVeuillez réessayez.";
		}
		$scope.pseudo = "";
		$scope.password = "";
	}
	
}]);

appControllers.controller("timelineController", ["$scope", "$http", "$location", "$cookies", function($scope, $http, $location, $cookies) {
	
	if($cookies.getObject("connectedUser") == undefined) {
		$location.path("/");
	}
	else {
		$scope.header = "Salut " + $cookies.getObject("connectedUser").pseudo + " !";
		
		/* S'il n'y a pas d'article on cache le timeline, sinon on l'affiche */
		$http.get(serverUrl + "/article/isAnyArticle")
		.then(function(resp) {
			$scope.timelineState = resp.data;
		}, function(resp) {
			alert(JSON.stringify(resp));
		});
		
	}
	
	// Disconnect user
	$scope.disconnectUser = function() {
		$cookies.remove("connectedUser");
		$location.path("/");
	}
	
	// Add new article
	$scope.addArticle = function() {
		$scope.message = "Veuillez patienter ...";
		if($scope.title !== undefined && $scope.text !== undefined) {
			var newArticle = {
				userId : $cookies.getObject("connectedUser").id,
				title : $scope.title,
				text : $scope.text
			}
			$http.post(serverUrl + "/article/add", newArticle)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre article a été ajouté avec succès ! \nVous pouvez dès à présent le voir dans le 'Timeline'.");
					$scope.message = "";
				}
				else {
					$scope.message = "Le champs 'Titre' ou 'Article' est incorrect ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.message = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.message = "Le champs 'Titre' ou 'Article' est vide ! \nVeuillez réessayez.";
		}
		$scope.title = "";
		$scope.text = "";
	}
	
}]);
