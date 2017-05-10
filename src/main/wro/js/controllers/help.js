/**
 * Created by Damian Terlecki on 10.05.17.
 */
app.controller('HelpController', ['$scope', '$rootScope', 'joyrideService', '$anchorScroll', '$location', function ($scope, $rootScope, joyrideService, $anchorScroll, $location) {

    var steps = {
        "Dashboard": [
            {
                title: "Dashboard",
                content: 'On this page you can see overview of the services, data and stats.'
            },
            {
                appendToBody: true,
                type: 'element',
                selector: '#Articles',
                title: 'Articles management',
                content: 'Here you can manage articles about fishing.',
                placement: 'bottom',
                scroll: false,
                beforeStep: function () {
                    $scope.$parent.$parent.openSidenav();
                    $scope.joyride.resumeJoyride();
                }
            },
            {
                appendToBody: true,
                type: 'element',
                selector: '#Fishes',
                title: 'Fish management',
                content: 'Here you can manage fish data (name, description, protection, images).',
                placement: 'bottom',
                scroll: false
            },
            {
                appendToBody: true,
                type: 'element',
                selector: '#Fisheries',
                title: 'Fishery management',
                content: 'Here you can manage fisheries (name, location, description, requirements).',
                placement: 'bottom',
                scroll: false
            },
            {
                type: 'element',
                selector: '#services-status',
                title: 'Service status',
                content: 'Here you can check if our services are up. The Web Admin interface requires CRUD service to be up and Knowledge Base if you intend to manually search and add scraped data.',
                placement: 'bottom',
                beforeStep: function () {
                    $scope.$parent.$parent.closeSidenav();
                    $scope.joyride.resumeJoyride();
                }
            },
            {
                type: 'element',
                selector: '#map',
                title: 'Fisheries map',
                content: 'The map presents the fisheries that are mapped (inside the CRUD database). They will be visible for our users.',
                placement: 'bottom'
            },
            {
                type: 'element',
                selector: '#managed',
                title: 'Managed data (CRUD)',
                content: 'Managed data is the data inside the CRUD database, accessible for users in the user applications.',
                placement: 'bottom'
            },
            {
                type: 'element',
                selector: '#scraped',
                title: 'Scraped data (Knowledge Base)',
                content: 'This is the data that has been scraped from the web. It is not visible to users but can be edited and added as managed data',
                placement: 'top'
            },
            {
                type: 'element',
                selector: '#users',
                title: 'Users',
                content: 'Lastly - some info about users.',
                placement: 'top'
            }
        ],
        "Articles": [],
        "Fishes": [],
        "Fisheries": []
    };
    $scope.joyride = joyrideService;

    $scope.startHelp = function ($event) {
        $scope.joyride.config = {
            overlay: true,
            onStepChange: function () {
            },
            onStart: function () {
            },
            onFinish: function () {
            },
            steps: steps[$rootScope.title]
        };
        $scope.joyride.start = true;
    }
}]);
