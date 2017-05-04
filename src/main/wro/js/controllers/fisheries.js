/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.factory('$fisheryService', ['$resource', function ($resource) {
    'use strict';
    return {
        fisheries: $resource('https://fishery-knowledge-base.herokuapp.com/fishery'),
        rsiFisheries: $resource('https://druzyna-a-crud.herokuapp.com/fishery/list'),
        addRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/create'),
        deleteRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/:id', {id: "@id"}),
        updateRsiFishery: $resource('https://druzyna-a-crud.herokuapp.com/fishery/update', {}, {
            put: {method: 'PUT'}
        })
    };
}]);
app.service('manageService', function () {
    var fishery = null;
    var operation = null;

    var setOperation = function (manageOperation) {
        operation = manageOperation;
    };

    var getOperation = function () {
        return operation;
    };

    var setFishery = function (managedFishery) {
        fishery = managedFishery;
    };

    var getFishery = function () {
        return fishery;
    };

    return {
        setOperation: setOperation,
        getOperation: getOperation,
        setFishery: setFishery,
        getFishery: getFishery
    };

});
app.controller('ManageFisheryController', ['$mdDialog', '$fisheryService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $fisheryService, $scope, $mdToast, manageService) {
        'use strict';

        this.cancel = $mdDialog.cancel;

        $scope.tooltipVisible = true;
        $scope.operation = manageService.getOperation() + " fishery";
        $scope.operationConfirm = manageService.getOperation() + " item";
        $scope.fishery = manageService.getFishery();

        function success(fishery) {
            $mdDialog.hide(fishery);
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(5000)
            );
        }

        this.manageItem = function () {
            $scope.form.$setSubmitted();

            if ($scope.form.$valid) {
                if (manageService.getOperation() === "Update") {
                    $fisheryService.updateRsiFishery.put($scope.fishery, success, failure);
                } else {
                    $fisheryService.addRsiFishery.save($scope.fishery, success, failure);
                }
            }
        };
    }]);
app.controller('FisheriesController', ['$mdDialog', '$q', '$scope', '$timeout', '$fisheryService', '$mdToast', 'manageService',
    function ($mdDialog, $q, $scope, $timeout, $fisheryService, $mdToast, manageService) {
        'use strict';

        $scope.countries = COUNTRIES;
        $scope.country = {};
        $scope.country.selected = $scope.countries[175];
        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15];

        $scope.$watch('data.selectedIndex', function (now, then, scope) {
            $scope.selected = [];
        });

        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        $scope.query = {
            filter: '',
            order: 'name',
            limit: 10,
            page: 1
        };

        $scope.removeFilter = function () {
            $scope.query.filter = '';
        };

        $scope.fisheries = [];
        $scope.rsiFisheries = [];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadData = function () {
            if ($scope.data.selectedIndex === 0) {
                $scope.promise = $fisheryService.rsiFisheries.query(rsiFisheriesSuccessFetch, failure).$promise;
            } else {
                $scope.promise = $fisheryService.fisheries.query({countryCode: $scope.country.selected.code}, fisheriesSuccessFetch, failure).$promise;
            }
        };

        function fisheriesSuccessFetch(fisheries) {
            $scope.fisheries = fisheries;
            $scope.selected = [];
        }

        function rsiFisheriesSuccessFetch(fisheries) {
            $scope.rsiFisheries = fisheries;
            $scope.selected = [];
        }

        $scope.addItem = function (event) {
            if ($scope.data.selectedIndex === 0) {
                manageService.setOperation("Add");
            } else {
                manageService.setOperation("Add managed");
            }
            openManageDialog();
        };
        $scope.updateItem = function (event) {
            manageService.setOperation("Update");
            openManageDialog();
        };
        $scope.deleteItem = function (event) {
            var confirm = $mdDialog.confirm()
                .title('Deletion confirmation')
                .textContent('Are you sure you want to delete selected fishery?')
                .ariaLabel('Deletion confirmation')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                $fisheryService.deleteRsiFishery.delete({id: $scope.selected[0].id}, loadManagedData, failure);
            });
        };

        function loadManagedData() {
            if ($scope.data === undefined || $scope.data.selectedIndex === 0) {
                $scope.promise = $fisheryService.rsiFisheries.query(rsiFisheriesSuccessFetch).$promise;
            } else {
                $fisheryService.rsiFisheries.query(rsiFisheriesSuccessFetch);
            }
        }

        function openManageDialog() {
            var fishery = (($scope.selected.length === 0) ? {} : JSON.parse(JSON.stringify($scope.selected[0])));
            if (fishery.coordinate != null) {
                fishery.lat = fishery.coordinate.lat;
                fishery.lng = fishery.coordinate.lng;
                delete fishery.coordinate;
            }
            if (manageService.getOperation() !== "Update" && fishery.id != null) {
                delete fishery.id;
            }
            manageService.setFishery(fishery);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ManageFisheryController',
                controllerAs: 'ctrl',
                targetEvent: event,
                templateUrl: 'templates/manage-fishery-dialog.html'
            }).then(loadManagedData);
        }

        function failure() {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Error while connecting to the server!')
                    .position('bottom center')
                    .hideDelay(3000)
            );
        }

        loadManagedData();
    }
]);