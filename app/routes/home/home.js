angular.module('myApp')

.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  'use strict';

  $scope.debug = [];

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

    $scope.debug.push('Downloading ' + $scope.origin);
    $http.post('pdf/page', options, config).then(function(response) {
      console.log(response);
      if (response.status === 200) {
        $scope.debug.push('Success');
      }

      var blob = new Blob([response.data], {type : 'application/pdf'});
      var url = (window.URL || window.webkitURL).createObjectURL(blob);

      var pageNum = $scope.pageNum || 1;

      var a = document.createElement('a');
      a.href = url;
      a.download = $scope.destination || 'page-' + pageNum + '.jpg';
      a.target = '_blank';
      a.click();
    });
  };

}]);
