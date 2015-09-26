var protocol = "http";
var host = "localhost";
var port = "8080";
var connectedUser = null;

var appControllers = angular.module("appControllers", []);

appControllers.controller("homeController", function($scope, $location, $http) {
	
	if(connectedUser !== null) {
		$location.path("/timeline");
	}
	
	// Add new user
	$scope.addUser = function() {
		$scope.message = "";
		if($scope.pseudo !== undefined && $scope.password !== undefined) {
			var newUser = {
				pseudo : $scope.pseudo,
				password : $scope.password
			}
			$http.post(protocol + "://" + host + ":" + port + "/user/add", newUser)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre compte a été créé avec succès ! \nVous pouvez dès à présent vous authentifier.");
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
		$scope.message = "";
		if($scope.pseudo !== undefined && $scope.password !== undefined) {
			var userToAuthenticate = {
				pseudo : $scope.pseudo,
				password : $scope.password
			}
			$http.post(protocol + "://" + host + ":" + port + "/user/authenticate", userToAuthenticate)
			.then(function(resp) {
				if(resp.data !== "") {
					connectedUser = resp.data
					$scope.message = "Connexion à MyBlog en cours ...";
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
	
});

appControllers.controller("timelineController", function($scope, $location, $http) {
	
	if(connectedUser !== null) {
		$scope.header = "Bienvenue " + connectedUser.pseudo + " sur MyBlog !";
	}
	
	// Disconnect user
	$scope.disconnectUser = function() {
		connectedUser = null;
		$location.path("/");
	}
	
});
