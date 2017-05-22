/**
 * Created by Damian Terlecki on 02.05.17.
 */
app.controller('DashboardController', ['$scope', '$articleService', '$fishService', '$fisheryService', '$statusService', '$userService', 'leafletData', '$timeout',
    function ($scope, $articleService, $fishService, $fisheryService, $statusService, $userService, leafletData, $timeout) {
        $scope.managedStats = [];
        $scope.knowledgeBaseStats = [];
        $scope.statuses = {
            crud: {name: "CRUD", value: "pending"},
            knowledgeBase: {name: "Knowledge Base", value: "pending"},
            client: {name: "Client Services", value: "pending"},
            user: {name: "User web app", value: "pending"}
        };
        $scope.userStats = {
            admin: {name: "Admin accounts", value: 0},
            user: {name: "Active users", value: 0}
        };

        $articleService.articles.query().$promise.then(function (articles) {
            $scope.managedStats.push({name: "Articles", value: articles.length});
        });
        $articleService.articlesRequests.query().$promise.then(function (articles) {
            $scope.knowledgeBaseStats.push({name: "Articles requests", value: articles.length});
            var scrapedCount = 0;
            for (var i = 0; i < articles.length; i++) {
                if (articles[i].scraped) {
                    ++scrapedCount;
                }
            }
            var value = scrapedCount;
            if (articles.length !== 0) {
                value += " (" + Math.round(scrapedCount * 100 / articles.length) + " %)";
            }
            $scope.knowledgeBaseStats.push({name: "Scraped requests", value: value});
            value = articles.length - scrapedCount;
            if (articles.length !== 0) {
                value += " (" + Math.round((articles.length - scrapedCount) * 100 / articles.length) + " %)";
            }
            $scope.knowledgeBaseStats.push({name: "Pending requests", value: value});
        });
        $fishService.fishes.query().$promise.then(function (articles) {
            $scope.managedStats.push({name: "Fishes", value: articles.length});
        });
        $fisheryService.fisheries.query().$promise.then(function (fisheries) {
            $scope.managedStats.push({name: "Fisheries", value: fisheries.length});
            var icon = {
                iconUrl: 'css/images/marker-icon.png',
                shadowUrl: 'css/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            };
            var markers = [];
            for (var i = 0; i < fisheries.length; i++) {
                markers.push({
                    lat: fisheries[i].lat,
                    lng: fisheries[i].lng,
                    icon: icon
                })
            }
            angular.extend($scope, {
                markers: markers
            });
        });
        $statusService.knowledgeBase.get().$promise.then(function (result) {
            $scope.statuses.knowledgeBase.value = result.status
        }, function () {
            $scope.statuses.knowledgeBase.value = "down";
        });
        $statusService.client.get().$promise.then(function (result) {
            $scope.statuses.client.value = result.status
        }, function () {
            $scope.statuses.client.value = "down";
        });
        $statusService.crud.get().$promise.then(function (result) {
            $scope.statuses.crud.value = result.status
        }, function () {
            $scope.statuses.crud.value = "down";
        });
        $statusService.user.get().$promise.then(function (result) {
            $scope.statuses.user.value = result.status
        }, function () {
            $scope.statuses.user.value = "down";
        });
        $userService.adminsCount.get().$promise.then(function (result) {
            $scope.userStats.admin.value = result.count;
        });
        $userService.usersCount.get().$promise.then(function (result) {
            $scope.userStats.user.value = result.count;
        });

        $timeout(function () {
            leafletData.getMap().then(function (map) {
                map.invalidateSize();
                map.setView([30, 20], 2);
            })
        });

    }]);