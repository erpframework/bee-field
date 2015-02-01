angular.module('example', ['beefield']).
    controller('example', function ($scope) {

        $scope.user = {};

        $scope.optionsBasic = ['a', 'b', 'c', 'd', 'e'];

        $scope.optionsObject = [
            {
                id: 1,
                name: 'Doner'
            },
            {
                id: 2,
                name: 'Kebap'
            }
        ]

        $scope.optionsObjectKeys = [
            {
                id: 1,
                nested: {
                    name: 'Nested Doner'
                }

            },
            {
                id: 2,
                nested: {
                    name: 'Nested Kebap'
                }

            }
        ]

    })