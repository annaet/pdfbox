angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  'use strict';

  $scope.generate = function() {
    var options = {
      origin: $scope.origin,
      page: 0
    };

    if ($scope.destination) {
      options.destination = $scope.destination;
    }

    $http.post('pdf/page', options).then(function(response) {
      console.log(response);
    });
  };

}]);
