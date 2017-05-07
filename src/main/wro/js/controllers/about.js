/**
 * Created by Damian Terlecki on 07.05.17.
 */
app.controller('AboutController', ['$scope', '$http', function ($scope, $http) {
    $scope.version = "";
    $http.get("/api/status").then(function (api) {
        $scope.version = api.data.version;
    });
    $scope.attributions = {
        crud: {
            name: "Fishery CRUD web service",
            author: "Daniel Ruszczyk",
            link: "https://gitlab.com/autharian"
        },
        client: {
            name: "Fishery client web service",
            author: "Michał Szum",
            link: "https://gitlab.com/Suuum"
        },
        knowledgeBase: {
            name: "Fishery knowledge base web service",
            author: "Damian Terlecki",
            license: "https://fishery-knowledge-base.herokuapp.com/license.html",
            link: "https://fishery-knowledge-base.herokuapp.com"
        },
        totp4j: {
            name: "totp4j - an authentication module",
            author: "Damian Terlecki",
            link: "https://t3r1jj.gitlab.io"
        },
        spring: {
            name: "Spring and Spring-Boot",
            author: "Pivotal Software",
            license: "Apache 2.0",
            link: "https://projects.spring.io/spring-boot/"
        },
        angular: {
            name: "AngularJS - a structural framework for dynamic web apps",
            author: "Copyright (c) 2010-2017 Google, Inc. http://angularjs.org",
            license: "MIT",
            link: "https://angularjs.org/"
        },
        "angular-material": {
            name: "AngularJS Material",
            author: "Copyright (c) 2014-2017 Google, Inc. http://angularjs.org",
            license: "MIT",
            link: "https://material.angularjs.org/latest/"
        },
        "angular-material-icons": {
            name: "Angular Material Icons",
            author: "Copyright (c) 2014 urmilparikh",
            license: "MIT, CC BY 4.0 (icons)",
            link: "https://klarsys.github.io/angular-material-icons/"
        },
        "md-data-table": {
            name: "md-data-table - Material Design Data Table for Angular Material",
            author: "Copyright (c) 2015 Daniel Nagy",
            license: "MIT",
            link: "https://github.com/daniel-nagy/md-data-table"
        },
        leaflet: {
            name: "Leaflet - the leading open-source JavaScript library for mobile-friendly interactive maps",
            author: "Copyright (c) 2010-2016, Vladimir Agafonkin; Copyright (c) 2010-2011, CloudMade",
            license: "BSD 2-clause",
            link: "http://leafletjs.com/"
        },
        "ui-leaflet": {
            name: "ui-leaflet - AngularJS directive to embed an interact with maps managed by Leaflet library",
            author: "Copyright (c) https://github.com/angular-ui/ui-leaflet; Original Copyright (c) https://github.com/tombatossals/angular-leaflet-directive",
            license: "MIT",
            link: "http://angular-ui.github.io/ui-leaflet/#!/"
        },
        textAngular: {
            name: "textAngular - Text-Editor/Wysiwyg editor for Angular.js",
            author: "https://github.com/fraywing/textAngular/graphs/contributors",
            license: "MIT",
            link: "https://github.com/textAngular/textAngular"
        },
        wro4j: {
            name: "wro4j - a web resource optimizer",
            author: "https://github.com/wro4j/wro4j",
            license: "Apache 2.0",
            link: "http://alexo.github.io/wro4j/"
        }
    }
}]);