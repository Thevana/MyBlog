var protocol = "http";
var host = "localhost";
var port = "8080";
var serverUrl = protocol + "://" + host + ":" + port;

var appControllers = angular.module("appControllers", ["ngCookies"]);

appControllers.controller("homeController", ["$scope", "$http", "$route", "$location", "$cookies", function($scope, $http, $route, $location, $cookies) {
	
	// Vérification au chargement de la page
	if($cookies.getObject("connectedUser") !== undefined) {
		if($cookies.getObject("articleToUpdate") !== undefined) {
			$location.path("/timeline/updateArticle");
		}
		else {
			$location.path("/timeline");
		}
	}
	
	// Add new user
	$scope.addUser = function() {
		$scope.homeMessage = "Veuillez patienter ...";
		if($scope.pseudo !== undefined && $scope.password !== undefined) {
			var newUser = {
				pseudo : $scope.pseudo,
				password : $scope.password
			}
			$http.post(serverUrl + "/user/add", newUser)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre compte a été créé avec succès ! \nVous pouvez dès à présent vous authentifier.");
					$scope.pseudo = "";
					$scope.password = "";
					$scope.homeMessage = "";
				}
				else {
					$scope.homeMessage = "Votre 'Pseudo' ou 'Mot de passe' est incorrect, ou votre 'Pseudo' existe déjà ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.homeMessage = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.homeMessage = "Le champs 'Pseudo' ou 'Mot de passe' est vide ! \nVeuillez réessayez.";
		}
	}
	
	// Authenticate user
	$scope.authentificateUser = function() {
		$scope.homeMessage = "Veuillez patienter ...";
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
					$scope.pseudo = "";
					$scope.password = "";
					$scope.homeMessage = "Chargement en cours ...";
					$cookies.putObject("connectedUser", connectedUser);
					$location.path("/timeline");
				}
				else {
					$scope.homeMessage = "Votre 'Pseudo' ou 'Mot de passe' est incorrect ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.homeMessage = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.homeMessage = "Le champs 'Pseudo' ou 'Mot de passe' est vide ! \nVeuillez réessayez.";
		}
	}
	
}]);

appControllers.controller("timelineController", ["$scope", "$http", "$route", "$location", "$cookies", function($scope, $http, $route, $location, $cookies) {
	
	// Vérification au chargement de la page
	if($cookies.getObject("connectedUser") == undefined) {
		$location.path("/");
	}
	else {
		if($cookies.getObject("articleToUpdate") !== undefined) {
			$location.path("/timeline/updateArticle");
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
		$scope.addArticleMessage = "Veuillez patienter ...";
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
					$scope.updatedArticleTitle = "";
					$scope.updatedArticleText = "";
					$scope.addArticleMessage = "";
					$route.reload();
				}
				else {
					$scope.addArticleMessage = "Le champs 'Titre' ou 'Article' est incorrect ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.addArticleMessage = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.addArticleMessage = "Le champs 'Titre' ou 'Article' est vide ! \nVeuillez réessayez.";
		}
	}
	
	// Update article (Step 1/2)
	$scope.openUpdateArticle = function(articleId, articleTitleToUpdate, articleTextToUpdate) {
		var articleToUpdate = {
			id : articleId,
			title : articleTitleToUpdate,
			text : articleTextToUpdate
		}
		$cookies.putObject("articleToUpdate", articleToUpdate);
		$location.path("/timeline/updateArticle");
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
					alert("Votre commentaire a été ajouté avec succès !");
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
	$scope.updateComment = function(commentId, commentTextToUpdate) {
		var updatedCommentText = prompt("Modifiez votre commentaire", commentTextToUpdate);
		
		if(updatedCommentText !== null && updatedCommentText !== "") {
			var updatedComment = {
				id : commentId,
				text : updatedCommentText
			}
			$http.post(serverUrl + "/article/updateComment", updatedComment)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre commentaire a été modifié avec succès !");
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

appControllers.controller("updateArticleController", ["$scope", "$http", "$route", "$location", "$cookies", function($scope, $http, $route, $location, $cookies) {
	
	if($cookies.getObject("connectedUser") == undefined) {
		$location.path("/");
	}
	else {
		if($cookies.getObject("articleToUpdate") == undefined) {
			$location.path("/timeline");
		}
		else {
			$scope.updatedArticleTitle = $cookies.getObject("articleToUpdate").title;
			$scope.updatedArticleText = $cookies.getObject("articleToUpdate").text;
		}
	}
	
	// Update article (Step 2/2)
	$scope.updateArticle = function() {
		$scope.updateArticleMessage = "Veuillez patienter ...";
		if(($scope.updatedArticleTitle !== undefined && $scope.updatedArticleTitle !== null && $scope.updatedArticleTitle !== "") && ($scope.updatedArticleText !== undefined && $scope.updatedArticleText !== null && $scope.updatedArticleText !== "")) {
			var updatedArticle = {
				id : $cookies.getObject("articleToUpdate").id,
				title : $scope.updatedArticleTitle,
				text : $scope.updatedArticleText
			}
			$http.post(serverUrl + "/article/update", updatedArticle)
			.then(function(resp) {
				if(resp.data) {
					alert("Votre article a été modifié avec succès ! \nVous allez être redirigé vers le 'Timeline'.");
					$scope.updatedArticleTitle = "";
					$scope.updatedArticleText = "";
					$scope.updateArticleMessage = "Redirection en cours ...";
					$cookies.remove("articleToUpdate");
					$location.path("/timeline");
				}
				else {
					$scope.updateArticleMessage = "Le champs 'Titre' ou 'Article' est incorrect ! \nVeuillez réessayez.";
				}
			}, function(resp) {
				$scope.updateArticleMessage = "Erreur de connexion interne ! \nVeuillez réessayer ultérieurement.";
			});
		}
		else {
			$scope.updateArticleMessage = "Le champs 'Titre' ou 'Article' est vide ! \nVeuillez réessayez.";
		}
	}
	
	$scope.cancel = function() {
		$scope.updateArticleMessage = "Action annulé ! \nRedirection en cours ...";
		$cookies.remove("articleToUpdate");
		$location.path("/timeline");
	}

}]);

