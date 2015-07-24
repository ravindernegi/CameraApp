(function(){
angular.module('starter').controller('PhotoController', ['$scope', '$ionicModal', '$ionicPlatform', 'PhotoService','$state', PhotoController]);

function PhotoController($scope, $ionicModal, $ionicPlatform, photoService,$state) {
	var vm = this;

	// Initialize the database.
	$ionicPlatform.ready(function() {
		//photoService.initDB();

		// Get all folder records from the database.
		photoService.getAllPhotos().then(function(photos) {
			vm.photos = photos;
		});
	});
	
	vm.go = function(url){
		
		$state.go(url);
	};
	
	// Initialize the modal view.
	/*$ionicModal.fromTemplateUrl('add-or-edit-folder.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	vm.showAddPhotoModal = function() {
		$scope.photo = {};
		$scope.action = 'Add';
		$scope.isAdd = true;
		$scope.modal.show();			
	};
	
	vm.showEditPhotoModal = function(photo) {
		$scope.photo = photo;
		$scope.action = 'Edit';
		$scope.isAdd = false;			
		$scope.modal.show();
	};
*/
	$scope.savePhoto = function() {
		
		
		console.info($scope.photo);
		if ($scope.isAdd) {
			photoService.addPhoto($scope.photo);				
		} else {
			photoService.updatePhoto($scope.photo);				
		}						
		$scope.modal.hide();
	};
	
	$scope.deletePhoto = function() {
		photoService.deletePhoto($scope.photo);			
		$scope.modal.hide();
	};
			
	$scope.$on('$destroy', function() {
		$scope.modal.remove(); 
	});

	return vm;
}
})();