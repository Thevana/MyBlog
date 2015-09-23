var app = angular.module("agenda", []);
app.controller("mainController", function($scope, $http){
	
	$http.get('http://localhost:8080/article/all')
	.then(function(resp) {
		$scope.contacts = resp.data;
	}, function(resp) {
		alert(JSON.stringify(resp));
	});
	
	$scope.addContact =  function(){
		
		var newContact = {
			firstname : $scope.firstname,
			lastname : $scope.lastname
		}
		
		$scope.contacts.push(newContact);
		
		$http.post('http://localhost:3000/add', newContact)
		.then(function(resp) {
			
		}, function(resp) {
			alert(resp);
		});
		
		$scope.firstname = '';
		$scope.lastname = '';
		
	}
});