// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;
var appPhotoDir ='cameraAppAlbum/';
var localDB = new PouchDB("cameraDB");
angular.module('starter', ['ionic', 'starter.services','starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, DirManagerApp) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
	
			DirManagerApp.createDir(appPhotoDir);
			var nameDirValue = 'EG Family and Vacation';
			var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
			
			localDB.put({
			  _id: nameDir,
			  albumName: nameDirValue,
			  setDefault:1,
			  docType:'folder'
			}).then(function (response) {
			  // handle response
			}).catch(function (err) {
			  console.log(err);
			});
			
	

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
	$stateProvider
	.state('dash', {
		url: '/dash',
		cache:false,
		templateUrl: 'templates/tab-dash.html',
		controller: 'DashCtrl'
	
	})
	.state('albums', {
		url: '/albums',
		cache:false,
		templateUrl: 'templates/tab-albums.html',
		controller: 'AlbumsCtrl'
	})
	.state('album', {
		url: '/albums/:albumId',
		cache:false,
		templateUrl: 'templates/album.html',
		controller: 'AlbumDetailCtrl'
	})


	.state('photos', {
		url: '/photos',
		cache:false,
		templateUrl: 'templates/tab-photos.html',
		controller: 'PhotosCtrl'
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/dash');


});
