/**
 * Created by Damian Terlecki on 10.05.17.
 */
app.controller('HelpController', ['$scope', '$rootScope', 'joyrideService', '$anchorScroll', '$location', function ($scope, $rootScope, joyrideService, $anchorScroll, $location) {
    joyrideService.resumeJoyride();
    var steps = {
        "Dashboard": {
            "0": [
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
            ]
        },


        "Articles": {
            0: [
                {
                    title: "Articles",
                    content: 'On this page you can see manage articles about fishing.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Managed data',
                    content: 'This tab is connected with the data from the CRUD service. That is the data which is visible to the users.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search1',
                    title: 'Search',
                    content: 'Use search to find data faster.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table1',
                    title: 'Articles',
                    content: 'Site articles are displayed here. You can make a selection and edit or delete them.',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Interface',
                    content: 'The add/update/delete operations are available through these buttons.',
                    placement: 'left'
                }],

            1: [
                {
                    title: "Articles",
                    content: 'On this page you can see manage articles about fishing.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Knowledge Base',
                    content: 'Knowledge Base provides scraped articles.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table2',
                    title: 'Articles requests',
                    content: 'The table contains articles requests. By pressing on scraped articles a dialog will open with a list of scraped articles. From there it is possible to edit and add them to managed data. After estimated time scraped articles will be removed.',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Add articles request',
                    content: 'You can request articles by pressing this button and providing some basic information like tags. The request will be queued and estimated time will be calculated.',
                    placement: 'left'
                }]
        },


        "Fishes": {
            0: [
                {
                    title: "Fishes",
                    content: 'On this page you can manage fish entries.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Managed data',
                    content: 'This tab is connected with the data from the CRUD service. That is the data which is visible to the users.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search1',
                    title: 'Search',
                    content: 'Use search to find data faster.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table1',
                    title: 'Articles',
                    content: 'Managed data is displayed here. You can make a selection and edit or delete given entry.',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Interface',
                    content: 'The add/update/delete operations are available through these buttons.',
                    placement: 'left'
                }],
            1: [
                {
                    title: "Fishes",
                    content: 'On this page you can manage fish entries.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Knowledge Base',
                    content: 'Knowledge Base provides scraped info about fishes.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search2',
                    title: 'Search fishes',
                    content: 'Fish scraping is done by country. After fetching the data you can use the search.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#refresh',
                    title: 'Refresh',
                    content: 'Press refresh to fetch the data',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table2',
                    title: 'Scraped fishes',
                    content: 'The table contains scraped fish names by selected country. By selecting a fish and pressing Add button a dialog will open which will load additional information (protection, images, description). After that you will be able to edit scraped info and add it as a managed entry to CRUD service (database).',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Add managed fish',
                    content: 'Select a fish and press this button to edit and add scraped data. Otherwise start adding an empty entry.',
                    placement: 'left'
                }]
        },

        "Fisheries": {
            0: [
                {
                    title: "Fisheries",
                    content: 'On this page you can manage fishery entries.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Managed data',
                    content: 'This tab is connected with the data from the CRUD service. That is the data which is visible to the users.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search1',
                    title: 'Search',
                    content: 'Use search to find data faster.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table1',
                    title: 'Articles',
                    content: 'Managed data is displayed here. You can make a selection and edit or delete given entry.',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Interface',
                    content: 'The add/update/delete operations are available through these buttons.',
                    placement: 'left'
                }],
            1: [
                {
                    title: "Fisheries",
                    content: 'On this page you can manage fisheries.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Knowledge Base',
                    content: 'Knowledge Base provides scraped info about fisheries.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search2',
                    title: 'Search fishes',
                    content: 'Fishery scraping is done by country. After fetching the data you can use the search.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#refresh',
                    title: 'Refresh',
                    content: 'Press refresh to fetch the data',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table2',
                    title: 'Scraped fisheries',
                    content: 'The table contains scraped fisheries by selected country. By selecting a fishery and pressing Add button a dialog will open where you will be able to edit information and modify location on the map. Finally it will be added as a managed entry in CRUD service (database).',
                    placement: 'top'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#fab',
                    title: 'Add managed fish',
                    content: 'Select a fishery and press this button to edit and add scraped data. Otherwise start adding an empty entry.',
                    placement: 'left'
                }]
        },

        "Users": {
            0: [
                {
                    title: "Users",
                    content: 'On this page you can interact with users.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Client module',
                    content: 'This tab is connected with the data from the Client service.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    type: 'element',
                    selector: '#search1',
                    title: 'Search',
                    content: 'Use search to find data faster.',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table1',
                    title: 'Emails',
                    content: 'Users data is displayed here. You can select multiple users and send them an email.',
                    placement: 'top'
                }],
            1: [
                {
                    title: "Fishery reservations",
                    content: 'On this page you can manage fishery reservations.'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '.md-tab.md-active',
                    title: 'Client module',
                    content: 'This tab will provide information about fishery reservations (visiting/fishing plans) done by the users.',
                    placement: 'bottom',
                    scroll: false
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#refresh',
                    title: 'Refresh',
                    content: 'Press refresh to fetch the data',
                    placement: 'bottom'
                },
                {
                    appendToBody: true,
                    type: 'element',
                    selector: '#table2',
                    title: 'Reservation',
                    content: 'The table contains fisheries reservations for all users. You can multi-select reservations, send emails or cancel them.',
                    placement: 'top'
                }]
        }
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
            steps: steps[$rootScope.title][$scope.$parent.data.selectedIndex]
        };
        $scope.joyride.start = true;
    }
}]);