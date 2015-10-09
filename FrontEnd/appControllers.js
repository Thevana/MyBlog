var protocol = "http";
var host = "localhost";
var port = "8080";
var serverUrl = protocol + "://" + host + ":" + port;

var appControllers = angular.module("appControllers", ["ngCookies"]);

appControllers.controller("homeController", ["$scope", "$http", "$route", "$location", "$cookies", function($scope, $http, $route, $location, $cookies) {
	
	// Vérification au chargement de la page
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

appControllers.controller("timelineController", ["$scope", "$http", "$route", "$location", "$cookies", function($scope, $http, $route, $location, $cookies) {
	
	// Vérification au chargement de la page
	if($cookies.getObject("connectedUser") == undefined) {
		$location.path("/");
	}
	else {
		$scope.header = "Salut " + $cookies.getObject("connectedUser").pseudo + " !";
		
		/* S'il y a au moins un article on affiche le timeline, sinon on le cache */
		$http.get(serverUrl + "/article/isAnyArticle")
		.then(function(resp) {
			$scope.showTimelineState = resp.data;
			if($scope.showTimelineState) {
				$http.get(serverUrl + "/article/all")
				.then(function(resp) {
					$scope.articles = resp.data;
				}, function(resp) {
					alert(JSON.stringify(resp));
				});
			}
		}, function(resp) {
			alert(JSON.stringify(resp));
		});
	}
	
	// Disconnect user
	$scope.disconnectUser = function() {
		$cookies.remove("connectedUser");
		$location.path("/");
	}
	
	// Show action
	/*Action disponible si l'utilisateur courant correspond à 'ownerId'*/
	$scope.showAction = function(ownerId) {
		if($cookies.getObject("connectedUser").id === ownerId) {
			return true;
		}
		return false;
	}
	
	// Set Owner Pseudo For Object
	$scope.setOwnerPseudoForObject = function (ownerId, object) {
		$http.get(serverUrl + "/user/getPseudoFromId?id=" + ownerId)
		.then(function(resp) {
			object.ownerPseudo = resp.data.pseudo;
		}, function(resp) {
			alert(JSON.stringify(resp));
		});
	}
	
	// Add new article
	$scope.addArticle = function() {
		$scope.message = "Veuillez patienter ...";
		if(($scope.title !== undefined && $scope.title !== null && $scope.title !== "") && ($scope.text !== undefined && $scope.text !== null && $scope.text !== "")) {
			var newArticle = {
				ownerId : $cookies.getObject("connectedUser").id,
				title : $scope.title,
				text : $scope.text
			}
			$http.post(serverUrl + "/article/add", newArticle)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre article a été ajouté avec succès ! \nVous pouvez dès à présent le voir dans le 'Timeline'.");
					$scope.message = "";
					$route.reload();
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
	
	// Update article
	$scope.updateArticle = function(articleId, oldArticleTitle, oldArticleText) {
		var updatedArticleTitle = prompt("ETAPE 1/2 : Modifiez le titre de votre article", oldArticleTitle);
		
		if(updatedArticleTitle !== null && updatedArticleTitle !== "") {
			var updatedArticleText = prompt("ETAPE 2/2 : Modifiez le texte de votre article", oldArticleText);
			
			if(updatedArticleText !== null && updatedArticleText !== "") {
				var updatedArticle = {
					id : articleId,
					title : updatedArticleTitle,
					text : updatedArticleText
				}
				$http.post(serverUrl + "/article/update", updatedArticle)
				.then(function(resp) {
					if(resp.data) {
						alert("Votre article a été modifié avec succès !");
						$route.reload();
					}
					else {
						alert("Le champs 'Titre' ou 'Article' est incorrect ! \nVeuillez réessayez.");
					}
				}, function(resp) {
					alert("Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.");
				});
			}
			else if(updatedArticleText !== null && updatedArticleText === "") {
				alert("Le champs 'Article' est vide ! \nVeuillez réessayer.");
			}
		}
		else if(updatedArticleTitle !== null && updatedArticleTitle === "") {
			alert("Le champs 'Titre' est vide ! \nVeuillez réessayer.");
		}
	}
	
	// Delete article
	$scope.deleteArticle = function(articleId) {
		var deleteArticleAction = confirm("Êtes-vous sûr de vouloir supprimer cet article ?");
		if(deleteArticleAction) {
			$http.get(serverUrl + "/article/delete?id=" + articleId)
			.then(function(resp) {
				if(resp.data) {
					alert("L'article a été supprimé avec succès !");
					$route.reload();
				}
				else {
					alert("L'article n'a pas pu être supprimé ! \nVeuillez réessayer.");
				}
			}, function(resp) {
				alert("Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.");
			});
		}
	}
	
	// Add comment
	$scope.addComment = function(articleId) {
		var commentText = prompt("Entrez votre commentaire");
		
		if(commentText !== null && commentText !== "") {
			var newComment = {
				ownerId : $cookies.getObject("connectedUser").id,
				articleId : articleId,
				text : commentText
			}
			$http.post(serverUrl + "/article/addComment", newComment)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre commentaire a été ajouté avec succès !.");
					$route.reload();
				}
				else {
					alert("Le champs est incorrect ! \nVeuillez réessayez.");
				}
			}, function(resp) {
				alert("Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.");
			});
		}
		else if(commentText !== null && commentText === "") {
			alert("Le champs est vide ! \nVeuillez réessayer.");
		}
	}
	
	// Update comment
	$scope.updateComment = function(commentId, oldCommentText) {
		var updatedCommentText = prompt("Modifiez votre commentaire", oldCommentText);
		
		if(updatedCommentText !== null && updatedCommentText !== "") {
			var updatedComment = {
				id : commentId,
				text : updatedCommentText
			}
			$http.post(serverUrl + "/article/updateComment", updatedComment)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre commentaire a été modifié avec succès !.");
					$route.reload();
				}
				else {
					alert("Le champs est incorrect ! \nVeuillez réessayez.");
				}
			}, function(resp) {
				alert("Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.");
			});
		}
		else if(updatedCommentText !== null && updatedCommentText === "") {
			alert("Le champs est vide ! \nVeuillez réessayer.");
		}
	}
	
	// Delete comment
	$scope.deleteComment = function(commentId) {
		var deleteCommentAction = confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?");
		if(deleteCommentAction) {
			$http.get(serverUrl + "/article/deleteComment?id=" + commentId)
			.then(function(resp) {
				if(resp.data) {
					alert("Le commentaire a été supprimé avec succès !");
					$route.reload();
				}
				else {
					alert("Le commentaire n'a pas pu être supprimé ! \nVeuillez réessayer.");
				}
			}, function(resp) {
				alert("Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.");
			});
		}
	}
	
}]);
