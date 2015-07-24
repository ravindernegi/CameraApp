(function() {

    angular.module('starter').factory('FolderService', ['$q', FolderService]);

    function FolderService($q) {  
      //  var _db;    
        var _folders;

        return {
            //initDB: initDB,

            getAllFolders: getAllFolders,
            addFolder: addFolder,
            updateFolder: updateFolder,
            deleteFolder: deleteFolder
        };

        function initDB() {
            // Creates the database or opens if it already exists
            //_db = dbObj;
        };

        function addFolder(folder) {
            var deferred = $q.defer();
            deferred.resolve(_db.post(folder));
            return deferred.promise;
        };

        function updateFolder(folder) {
            var deferred = $q.defer();
            deferred.resolve(_db.put(folder));
            return deferred.promise;
        };

        function deleteFolder(folder) {
            var deferred = $q.defer();
            deferred.resolve(_db.remove(folder));
            return deferred.promise;
        };

        function getAllFolders() {

            var deferred = $q.defer();

            if (!_folders) {
                deferred.resolve(_db.allDocs({ include_docs: true})
                          .then(function(docs) {

                            // Each row has a .doc object and we just want to send an 
                            // array of folder objects back to the calling controller,
                            // so let's map the array to contain just the .doc objects.
                            _folders = docs.rows.map(function(row) {
                                // Dates are not automatically converted from a string.
                                row.doc.Date = new Date(row.doc.Date);
                                return row.doc;
                            });

                            // Listen for changes on the database.
                            _db.changes({ live: true, since: 'now', include_docs: true})
                               .on('change', onDatabaseChange);

                           return _folders;
                         }));
            } else {
                // Return cached data as a promise
                deferred.resolve(_folders);
            }

           return deferred.promise;
        };

        function onDatabaseChange(change) {
            var index = findIndex(_folders, change.id);
            var folder = _folders[index];

            if (change.deleted) {
                if (folder) {
                    _folders.splice(index, 1); // delete
                }
            } else {
                if (folder && folder._id === change.id) {
                    _folders[index] = change.doc; // update
                } else {
                    _folders.splice(index, 0, change.doc) // insert
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
