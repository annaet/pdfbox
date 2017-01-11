angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  'use strict';

  $scope.generate = function() {
    var options = {
      origin: $scope.origin
    };

    if ($scope.destination) {
      options.destination = $scope.destination;
    }

    if ($scope.page) {
      options.page = 0;
    }

    $http.post('pdf/page', options).then(function(response) {
      console.log(response);
    });
  };

}]);
