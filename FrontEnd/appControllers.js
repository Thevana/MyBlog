var protocol = "http";
var host = "localhost";
var port = "8080";

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
			$http.post(protocol + "://" + host + ":" + port + "/user/add", newUser)
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
			$http.post(protocol + "://" + host + ":" + port + "/user/authenticate", userToAuthenticate)
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
	}
	
	// Disconnect user
	$scope.disconnectUser = function() {
		$cookies.remove("connectedUser");
		$location.path("/");
	}
	
}]);
