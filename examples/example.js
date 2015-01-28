angular.module('example', ['beefield']).
    controller('example', function($scope) {

        $scope.user = {};

        $scope.select = [
            {
                id: 1,
                name: 'xxx'
            },
            {
                id: 2,
                name: 'yyy'
            }
        ]

    })