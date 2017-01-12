angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  'use strict';

  $scope.generate = function() {
    var options = {
      origin: $scope.origin
    };

    var config = {
      responseType: 'blob'
    };

    if ($scope.destination) {
      options.destination = $scope.destination;
    }

    if ($scope.page) {
      options.page = $scope.page;
    }

    $http.post('pdf/page', options, config).then(function(response) {
      console.log(response);

      var blob = new Blob([response.data], {type : 'application/pdf'});
      var url = (window.URL || window.webkitURL).createObjectURL(blob);

      var a = document.createElement('a');
      a.href = url;
      a.download = $scope.destination || 'page.jpg';
      a.target = '_blank';
      a.click();

    });
  };

}]);
