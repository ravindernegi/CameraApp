(function(){
angular.module('starter').controller('FolderController', ['$scope', '$ionicModal', '$ionicPlatform', 'FolderService', 'PhotoService','$state','$cordovaCamera', FolderController]);

function FolderController($scope, $ionicModal, $ionicPlatform, folderService, photoService,$state,$cordovaCamera) {
	var vm = this;

	// Initialize the database.
	$ionicPlatform.ready(function() {
		
		//folderService.initDB();
		
		
		var nameDirValue = 'EG Family and Vacation';
		var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
		$scope.folder = {
			_id: nameDir,
			folderName : nameDirValue,
			setDefault : 1,
			docType:'folder'
		};
		

		folderService.addFolder($scope.folder);
		// Get all folder records from the database.
		folderService.getAllFolders().then(function(folders) {
			vm.folders = folders;
		});
	});
	
	// Initialize the modal view.
	$ionicModal.fromTemplateUrl('templates/add-or-edit-folder.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	vm.showAddFolderModal = function() {
		
		
		$scope.folder = {};
		$scope.action = 'Add';
		$scope.isAdd = true;
		$scope.modal.show();			
	};
	
	vm.showEditFolderModal = function(folder) {
		$scope.folder = folder;
		$scope.action = 'Edit';
		$scope.isAdd = false;			
		$scope.modal.show();
	};
	
	vm.go = function(url){
		
		$state.go(url);
	};
	
	
	
	
	vm.addImage = function() {
    
    
        // 2
        var options = {
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum:true
        };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
            	console.log('fileURI '  + fileURI);
            
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
            console.log('fileEntry ' + fileEntry.fullPath);
            
            
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

				console.log('cordova.file.dataDirectory ' + cordova.file.dataDirectory);
					console.log('newName ' + newName);

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(
                        fileSystem2,
                        newName,
                        onCopySuccess,
                        fail
                    );
                },
                fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                   // $scope.images.push(entry.nativeURL);
                    
                    console.log('entry.nativeURL : '+entry.nativeURL);
                   
                   var picturePathFull =  entry.nativeURL; 
                   
                   var pictureName = picturePathFull.substr(picturePathFull.lastIndexOf('/') + 1);
                    
                    
                     console.log('pictureName : '+pictureName);
                       console.log('picturePathFull : '+picturePathFull);
                       
                    
                       var nameDirValue = 'EG Family and Vacation';
						var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
                       
                       
                       var dateVar = new Date();
                       var timeVar = dateVar.getTime();
                       var photoID = "PH"+timeVar;
                     //  var pictureName = photoID+'.jpg';
                     //  var picturePathFull = 'var/cache/'+photoID+'.jpg';
                       
							$scope.photo = {
								_id: photoID,
								photoName: pictureName,
								photoPath: picturePathFull,
								folderID : nameDir,
								docType:'photo'
							};
		

						photoService.addPhoto($scope.photo);
                       
              
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    }

    vm.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        
         console.log("trueOrigin " + trueOrigin);
        return trueOrigin;
    }
	
	
	
	
	
	
	
	
	
	
	
	

	$scope.saveFolder = function() {
		
		
		console.info($scope.folder);
		if ($scope.isAdd) {
			folderService.addFolder($scope.folder);				
		} else {
			folderService.updateFolder($scope.folder);				
		}						
		$scope.modal.hide();
	};
	
	$scope.deleteFolder = function() {
		folderService.deleteFolder($scope.folder);			
		$scope.modal.hide();
	};
			
	$scope.$on('$destroy', function() {
		$scope.modal.remove(); 
	});

	return vm;
}
})();