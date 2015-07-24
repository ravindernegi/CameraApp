angular.module('starter.services', [])

.factory('Albums', ['$cordovaSQLite','$timeout',function($cordovaSQLite,$timeout) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  
 
  
  var albums = [];

   $timeout(function () {
	var sql ='SELECT * FROM albums';
		 
		
		$cordovaSQLite.execute(db, sql, []).then(function(res) { 
			
			for(var i=0; i < res.rows.length; i++){
					albums.push(res.rows.item(i)); //This added data to the array successfully.
					
			}
			
			
		});
		
		  }, 1000);
		
  return {
    all: function() {
      return albums;
    },
    remove: function(album) {
      albums.splice(albums.indexOf(album), 1);
	  
	  var sql ='DELETE  FROM albums where id = ?';
		 
		
		$cordovaSQLite.execute(db, sql, [album.id]).then(function(res) { 
		
		});
	  
	  
    },
    get: function(albumId) {
      for (var i = 0; i < albums.length; i++) {
        if (albums[i].id === parseInt(albumId)) {
          return albums[i];
        }
      }
      return null;
    },
    
	create:function(data){
		
		var nameDirValue = data;
	 
			var nameDir = nameDirValue.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
		
		var query = "INSERT INTO albums (id, albumNameAlias, albumName) VALUES (?,?,?)";
			$cordovaSQLite.execute(db, query, [null,nameDir, nameDirValue]).then(function(res) {
				console.log("INSERT ID -> " + res.insertId);
				
				albums.push({id:res.insertId,albumName:nameDirValue});
				
			}, function (err) {
				console.error(err);
			});
			
			

	},
	
	setDirDefault:function(albumID){
		
		
		
		var query = "UPDATE  albums SET setDefault = ? ";
			$cordovaSQLite.execute(db, query, [0]).then(function(res) {
				console.info("Update ID -> ", res);
				
				
				
				
			}, function (err) {
				console.error(err);
			});
		
		var query = "UPDATE  albums SET setDefault = ? where id = ? ";
			$cordovaSQLite.execute(db, query, [1,albumID]).then(function(res) {
				console.info("Update ID -> ", res);
				
				
				
				
			}, function (err) {
				console.error(err);
			});
			
			
			
			
			

	}
  };
  

  
}])
.factory('Photos', ['$cordovaSQLite','$timeout',function($cordovaSQLite,$timeout) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var photos = [];

  $timeout(function () {
  
	var sql ='SELECT * FROM photos';
		 
		
		$cordovaSQLite.execute(db, sql, []).then(function(res) { 
			
			for(var i=0; i < res.rows.length; i++){
					photos.push(res.rows.item(i)); //This added data to the array successfully.
					
			}
			
			
		});
		
	},1000);	
		
  return {
    all: function() {
      return photos;
    },
    remove: function(photo) {
      photos.splice(photos.indexOf(photo), 1);
	  
	  var sql ='DELETE  FROM photos where id = ?';
		 
		
		$cordovaSQLite.execute(db, sql, [photo.id]).then(function(res) { 
		
		});
	  
	  
    },
    get: function(photoId) {
      for (var i = 0; i < photos.length; i++) {
        if (photos[i].id === parseInt(photoId)) {
          return photos[i];
        }
      }
      return null;
    },
	update:function(photo){
		
		
		
		var query = "UPDATE  photos SET album_id = ? where id = ? ";
			$cordovaSQLite.execute(db, query, [photo.albumId,photo.id]).then(function(res) {
				console.log("Update ID -> " + res.insertId);
				
				
				 photos.splice(photos.indexOf(photo), 1);
				
			}, function (err) {
				console.error(err);
			});
			
			

	},
	insert:function(photo){

				var query = "INSERT INTO photos (id, album_id, photoName) VALUES (?,?,?)";
				$cordovaSQLite.execute(db, query, [null,photo.albumId, photo.name]).then(function(res) {
						console.log("INSERT ID -> " + res.insertId);
				}, function (err) {
					console.error(err);
				});	
	},
	fillterPhoto:function(albumId){
		 var photosObj = [];
		 
		 
		 for (var i = 0; i < photos.length; i++) {
			 
			if (photos[i].album_id == parseInt(albumId)) {
			  photosObj.push(photos[i]);
			}
      }
      return photosObj;
		
	}
  };
}])

.factory('Camera', ['$q', function($q) {
 
  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}])


.factory('DirManagerApp', ['$q', function($q) {
 
  return {
    createDir: function(dirName) {
				var start=	function(){
				

				//
				//CREATE A DIRECTORY RECURSEVLY
				var a = new DirManager(); // Initialize a Folder manager
				a.create_r(dirName,Log('complete/jorge'));

				//LIST A DIRECTORY 
				 a.list('data', Log('List'));

		  
				//
		  

				
		}
		document.addEventListener('deviceready', start, false);
    }
  }
}])
;

	
