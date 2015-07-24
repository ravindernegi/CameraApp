angular.module('starter.controllers', [])
//Dashborad
.controller('DashCtrl', function($scope,$ionicPopup,$state, $ionicListDelegate,$timeout, $cordovaCamera, $cordovaFile, Camera) {
	
	
	
	//Get All Folder List
	var albums = []; 
	$scope.albums = "";
	
	$scope.albumDefault = [];
	$scope.DefaultDir = '';

   	localDB.allDocs({
		  include_docs: true, 
		  attachments: true
		}).then(function (result) {
			
			 result.rows.map(function(f) {
				if (f) {
				 // df.appendChild(f);

					albums.push(f.doc);
					
 				
				}
			  });
			  
			 
			 
			
			$scope.albums = albums;
			$scope.$apply($scope.albums); 
			
			for(var i = 0; i < albums.length;i++){
				
				if(albums[i].setDefault==1){
					$scope.albumDefault = albums[i];
					
					$scope.DefaultDir = albums[i]._id;
					$scope.$apply($scope.albumDefault); 
				}
			}
				
			  
		  // handle result
		}).catch(function (err) {
		  console.log('ss' +err);
	});
		

	//For redirect page
	$scope.go = function ( path ) {
	    
		$state.go( path );
		  
	};

	
	
	//For set a default folder
	$scope.setDefaultDir = function(album){
		
		console.info(album);
	};
	

	//For add a folder
	$scope.addAlbum  = function(album) {
		
		
		 $scope.data = {}
		
		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.albumname">',
			title: 'Enter a Folder Name',
			//subTitle: 'Please use normal things',
			scope: $scope,
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.albumname) {
					//don't allow the user to close unless he enters wifi password
					e.preventDefault();
				  } else {
					return $scope.data.albumname;
				  }
				}
			  }
			]
		  });
		  myPopup.then(function(res) {
			//Albums.create(res);
			
			console.info(res);
			
			
				var nameDirValue = res;
				var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
			
				localDB.put({
				  _id: nameDir,
				  albumName: nameDirValue,
				  setDefault:0,
				  docType:'folder'
				}).then(function (response) {
				  // handle response
				  
				  
				  
				}).catch(function (err) {
				  console.log(err);
				});
			
			
				var albumsObj = {
				
					_id: nameDir,
					albumName: nameDirValue,
					setDefault:0,
					docType:'folder'
					
				};
				
				
			
				 $scope.albums.push(albumsObj);
				
		
					//$scope.$apply($scope.albums); 
			
		  });
		  
		
    };
    
    
	//For remove all folder
	 $scope.showDeleteButtons = function() {
			if($ionicListDelegate.showDelete()==true){
				$ionicListDelegate.showDelete(false);
			}else{
				
				$ionicListDelegate.showDelete(true);
				
			}	
			
			
			
			
	};
	
	//For remove a folder
	 $scope.remove = function(album) {
	 
	 	
	 	
			if(album.albumNameAlias!='eg_family_and_vacation'){
				
				
				if($scope.DefaultDir == album._id){
					alert('please set a  another folder to default. if you want to remove.');
				}else{
					//Albums.remove(album);
					
					
					
				}
			}	
		
		
	 };
		
		
		
	//For capture photo 
		
	$scope.addImage = function() {
	
	
			 var b = new FileManager();
	
				Camera.getPicture({
					quality: 100, 
					saveToPhotoAlbum: false
			
				}).then(function(toURL) {
			
			
			
					var dateObj = new Date();
					
					var fileID = "PH"+dateObj.getTime()+'FDR';
	
					var filename = dateObj.getTime()+'.jpg';
				
				
						b.download_file(toURL,appPhotoDir,filename,function(theFile){ 
				
						//	alert(filename + ' -- '+ theFile.toURI());
					
					
							   localDB.put({
								  _id: fileID,
								  albumID: 'asader',
								  photoPath:theFile.toURI(),
								  photoName:filename,
								  docType:'photo'
								}).then(function (response) {
								  // handle response
								}).catch(function (err) {
								  console.log(err);
								});
                      
					
						});
				
				}, function(err) {
					//alert(err);
				});
		
	
        
    };	
    
    	

})
	
	
//Photos
.controller('PhotosCtrl', function($scope,$timeout,$state) {


		
		//for get all photo
		var images = [];	
		$scope.images = "";

		//For load photos
		localDB.allDocs({
		  include_docs: true, 
		  attachments: true
		}).then(function (result) {
			
			 result.rows.map(function(f) {
				if (f) {
				 // df.appendChild(f);

					images.push(f.doc);
					
 				
				}
			  });
			  
				$scope.images = images;
				$scope.$apply($scope.images); 

			  
		  // handle result
		}).catch(function (err) {
		  console.log('ss' +err);
		});
		
		
 
		$scope.go = function ( path ) {
	    	
			$state.go( path );
		  
		};
	
    
})
//Albums
.controller('AlbumsCtrl', function($scope,$ionicPopup, $timeout, $state) {
 
  
  //get All folder list
   var albums = []; 
	$scope.albums = "";

   	localDB.allDocs({
		  include_docs: true, 
		  attachments: true
		}).then(function (result) {
			
			 result.rows.map(function(f) {
				if (f) {
				 // df.appendChild(f);

					albums.push(f.doc);
					
 				
				}
			  });
			  
			 
			 
			
				 $scope.albums = albums;
				 $scope.$apply($scope.albums); 
				
			  
		  // handle result
		}).catch(function (err) {
		  console.log('ss' +err);
		});
		
  
  
   //For redirect on home page
    $scope.go = function ( path ) {
  
			
		  $state.go( path );
		  
	 };
  
		
  
  $scope.remove = function(photo) {
		
  };
  
  
   $scope.addAlbum  = function(photo) {
		 $scope.data = {}
		
		var myPopup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.albumname">',
			title: 'Enter a Album Name',
			//subTitle: 'Please use normal things',
			scope: $scope,
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
				  if (!$scope.data.albumname) {
					//don't allow the user to close unless he enters wifi password
					e.preventDefault();
				  } else {
					return $scope.data.albumname;
				  }
				}
			  }
			]
		  });
		  myPopup.then(function(res) {
			
			
				var nameDirValue = res;
				var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
			
				localDB.put({
				  _id: nameDir,
				  albumName: nameDirValue,
				  setDefault:0,
				  docType:'folder'
				}).then(function (response) {
				  // handle response
				  
				  
				  
				}).catch(function (err) {
				  console.log(err);
				});
			
			
				var albumsObj = {
				
					_id: nameDir,
					albumName: nameDirValue,
					setDefault:0,
					docType:'folder'
					
				};
				
				
			
				 $scope.albums.push(albumsObj);
			
			
		  });
		  
		
		
    };
  
 
})

//Album Detail
.controller('AlbumDetailCtrl', function($scope, $stateParams,  $timeout) {
	
		
	
})



