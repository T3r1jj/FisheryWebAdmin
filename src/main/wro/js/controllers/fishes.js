/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.controller('ManageFishController', ['$mdDialog', '$fishService', '$scope', '$mdToast', 'manageService',
    function ($mdDialog, $fishService, $scope, $mdToast, manageService) {
        'use strict';

        this.cancel = $mdDialog.cancel;
        $scope.operation = manageService.getOperation() + " fish";
        $scope.operationConfirm = manageService.getOperation() + " item";
        $scope.fish = manageService.getFish();
        $scope.refresh = refresh;
        if ($scope.fish.fromKnowledgeBase) {
            $scope.fish.protection = {};
            $scope.info = {
                fish: {description: "Fetching fish info...", hide: false, refresh: false},
                images: {description: "Fetching images...", hide: false, refresh: false},
                protection: {description: "Fetching protection info...", hide: false, refresh: false},
            };
            $fishService.fish.get({name: $scope.fish.name}, onFishFetchSuccess, onFishFetchFailure);
            $fishService.fishImages.query({name: $scope.fish.name}, onFishImagesFetchSuccess, onFishImagesFetchFailure);
            $fishService.fishProtection.get({name: $scope.fish.name}, onFishProtectionFetchSuccess, onFishProtectionFetchFailure);
        }

        function refresh(info) {
            if (info === $scope.info.fish) {
                $scope.info.fish.refresh = false;
                $fishService.fish.get({name: $scope.fish.name}, onFishFetchSuccess, onFishFetchFailure);
            } else if (info === $scope.info.images) {
                $scope.info.images.refresh = false;
                $fishService.fishImages.query({name: $scope.fish.name}, onFishImagesFetchSuccess, onFishImagesFetchFailure);
            } else if (info === $scope.info.protection) {
                $scope.info.protection.refresh = false;
                $fishService.fishProtection.get({name: $scope.fish.name}, onFishProtectionFetchSuccess, onFishProtectionFetchFailure);
            }
        }

        function onFishFetchSuccess(fish) {
            $scope.fish.description = fish.description;
            $scope.fish.biology = fish.biology;
            $scope.fish.weight = fish.weight;
            $scope.fish.length = fish.length;
            $scope.info.fish.hide = true;
        }

        function onFishFetchFailure(cause) {
            if (cause.status === 404) {
                $scope.info.fish.hide = true;
            } else {
                $scope.info.fish.refresh = true;
            }
        }

        function onFishImagesFetchSuccess(fishImages) {
            if (fishImages.length > 0) {
                $scope.fish.imgAuthor = fishImages[0].author;
                $scope.fish.img = fishImages[0].url;
            }
            $scope.info.images.hide = true;
        }

        function onFishImagesFetchFailure(cause) {
            if (cause.status === 404) {
                $scope.info.images.hide = true;
            } else {
                $scope.info.images.refresh = true;
            }
        }

        function onFishProtectionFetchSuccess(fishProtection) {
            $scope.fish.protection.assessment = fishProtection.assessment;
            $scope.fish.protection.conservation = fishProtection.conservation;
            $scope.fish.protection.copyright = fishProtection.copyright;
            $scope.fish.protection.status = fishProtection.status;
            $scope.fish.protection.useAndTrade = fishProtection.userStats;
            $scope.info.protection.hide = true;
        }

        function onFishProtectionFetchFailure(cause) {
            if (cause.status === 404) {
                $scope.info.protection.hide = true;
            } else {
                $scope.info.protection.refresh = true;
            }
        }

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
                    $fishService.updateFish.save($scope.fish, success, failure);
                } else {
                    $fishService.addFish.save(JSON.stringify($scope.fish), success, failure);
                }
            }
        };
    }]);
app.controller('FishesController', ['$mdDialog', '$q', '$scope', '$timeout', '$fishService', '$mdToast', 'manageService',
    function ($mdDialog, $q, $scope, $timeout, $fishService, $mdToast, manageService) {
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

        $scope.fishNames = [];
        $scope.fishes = [];

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.loadData = function () {
            if ($scope.data.selectedIndex === 0) {
                $scope.promise = $fishService.fishes.query(fishesSuccessFetch, failure).$promise;
            } else {
                $scope.promise = $fishService.fishNames.query({countryCode: $scope.country.selected.code}, fishNamesSuccessFetch, failure).$promise;
            }
        };

        function fishNamesSuccessFetch(fishNames) {
            for (var i = 0; i < fishNames.length; i++) {
                fishNames[i].commonName = fishNames[i].name;
                fishNames[i].name = fishNames[i].sciName;
                delete fishNames[i].sciName;
            }
            $scope.fishNames = fishNames;
            $scope.selected = [];
        }

        function fishesSuccessFetch(fishes) {
            $scope.fishes = fishes;
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
                .textContent('Are you sure you want to delete selected fish?')
                .ariaLabel('Deletion confirmation')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function () {
                $fishService.deleteFish.get({id: $scope.selected[0].id}, loadManagedData, failure);
            });
        };

        function loadManagedData() {
            if ($scope.data === undefined || $scope.data.selectedIndex === 0) {
                $scope.promise = $fishService.fishes.query(fishesSuccessFetch).$promise;
            } else {
                $fishService.fishes.query(fishesSuccessFetch);
            }
        }

        function openManageDialog(event) {
            var fish = (($scope.selected.length === 0) ? {} : JSON.parse(JSON.stringify($scope.selected[0])));
            if ($scope.data.selectedIndex === 1) {
                fish.fromKnowledgeBase = true;
            }
            if (manageService.getOperation() !== "Update" && fish.id != null) {
                delete fish.id;
            }
            manageService.setFish(fish);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ManageFishController',
                controllerAs: 'ctrl',
                targetEvent: event,
                templateUrl: 'templates/dialogs/manage-fish-dialog.html'
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