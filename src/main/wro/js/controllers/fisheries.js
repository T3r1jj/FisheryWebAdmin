/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.controller('ManageFisheryController', ['$mdDialog', '$fisheryService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $fisheryService, $scope, $mdToast, manageService) {
        'use strict';

        this.cancel = $mdDialog.cancel;

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
                    $fisheryService.updateFishery.save($scope.fishery, success, failure);
                } else {
                    $fisheryService.addFishery.save($scope.fishery, success, failure);
                }
            }
        };
    }]);
app.controller('FisheriesController', ['$mdDialog', '$q', '$scope', '$timeout', '$fisheryService', '$mdToast', 'manageService',
    function ($mdDialog, $q, $scope, $timeout, $fisheryService, $mdToast, manageService) {
        'use strict';

        $scope.tooltipVisible = true;
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

        $scope.scrapedFisheries = [];
        $scope.fisheries = [];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadData = function () {
            if ($scope.data.selectedIndex === 0) {
                $scope.promise = $fisheryService.fisheries.query(fisheriesSuccessFetch, failure).$promise;
            } else {
                $scope.promise = $fisheryService.scrapedFisheries.query({countryCode: $scope.country.selected.code}, scrapedFisheriesSuccessFetch, failure).$promise;
            }
        };

        function fisheriesSuccessFetch(fisheries) {
            $scope.fisheries = fisheries;
            $scope.selected = [];
        }

        function scrapedFisheriesSuccessFetch(fisheries) {
            $scope.scrapedFisheries = fisheries;
            $scope.selected = [];
        }

        $scope.addItem = function (event) {
            if ($scope.data.selectedIndex === 0) {
                manageService.setOperation("Add");
            } else {
                manageService.setOperation("Add managed");
            }
            openManageDialog(event);
        };
        $scope.updateItem = function (event) {
            manageService.setOperation("Update");
            openManageDialog(event);
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
                $fisheryService.deleteFishery.get({id: $scope.selected[0].id}, loadManagedData, failure);
            });
        };

        function loadManagedData() {
            if ($scope.data === undefined || $scope.data.selectedIndex === 0) {
                $scope.promise = $fisheryService.fisheries.query(fisheriesSuccessFetch).$promise;
            } else {
                $fisheryService.fisheries.query(fisheriesSuccessFetch);
            }
        }

        function openManageDialog(event) {
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
                templateUrl: 'templates/dialogs/manage-fishery-dialog.html'
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