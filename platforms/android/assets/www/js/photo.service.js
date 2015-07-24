(function() {

    angular.module('starter').factory('PhotoService', ['$q', PhotoService]);

    function PhotoService($q) {  
        //var _db;    
        var _photos;

        return {
            //initDB: initDB,

            getAllPhotos: getAllPhotos,
            addPhoto: addPhoto,
            updatePhoto: updatePhoto,
            deletePhoto: deletePhoto
        };

        function initDB() {
            // Creates the database or opens if it already exists
           // _db = dbObj
        };

        function addPhoto(photo) {
            var deferred = $q.defer();
            deferred.resolve(_db.post(photo));
            return deferred.promise;
        };

        function updatePhoto(photo) {
            var deferred = $q.defer();
            deferred.resolve(_db.put(photo));
            return deferred.promise;
        };

        function deletePhoto(photo) {
            var deferred = $q.defer();
            deferred.resolve(_db.remove(photo));
            return deferred.promise;
        };

        function getAllPhotos() {

            var deferred = $q.defer();

            if (!_photos) {
                deferred.resolve(_db.allDocs({ include_docs: true})
                          .then(function(docs) {

                            // Each row has a .doc object and we just want to send an 
                            // array of photo objects back to the calling controller,
                            // so let's map the array to contain just the .doc objects.
                            _photos = docs.rows.map(function(row) {
                                // Dates are not automatically converted from a string.
                                row.doc.Date = new Date(row.doc.Date);
                                return row.doc;
                            });

                            // Listen for changes on the database.
                            _db.changes({ live: true, since: 'now', include_docs: true})
                               .on('change', onDatabaseChange);

                           return _photos;
                         }));
            } else {
                // Return cached data as a promise
                deferred.resolve(_photos);
            }

           return deferred.promise;
        };

        function onDatabaseChange(change) {
            var index = findIndex(_photos, change.id);
            var photo = _photos[index];

            if (change.deleted) {
                if (photo) {
                    _photos.splice(index, 1); // delete
                }
            } else {
                if (photo && photo._id === change.id) {
                    _photos[index] = change.doc; // update
                } else {
                    _photos.splice(index, 0, change.doc) // insert
                }
            }
        }
        
        function findIndex(array, id) {
          var low = 0, high = array.length, mid;
          while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
          }
          return low;
        }
    }
})();
