(function(){
var app = angular.module('angular-joyride', ['ngAnimate']);

////////******* Add default template to template cache *******//////////
app.run(['$templateCache', function($templateCache) {
  $templateCache.put('ngJoyrideDefault.html', '<div class="jr_container" id="jr_{{joyride.current}}"><div class="jr_step"><h4 ng-if="joyride.config.steps[joyride.current].title" class="jr_title">{{joyride.config.steps[joyride.current].title}}</h4><div ng-if="joyride.config.steps[joyride.current].content" class="jr_content" ng-bind-html="joyride.config.steps[joyride.current].content | jr_trust"></div></div><div class="jr_buttons"><div class="jr_left_buttons"><a class="jr_button jr_skip" ng-click="joyride.start = false">Skip</a></div><div class="jr_right_buttons"><a class="jr_button jr_prev" ng-click="joyride.prev()" ng-class="{\'disabled\' : joyride.current === 0}">Prev</a><a class="jr_button jr_next" ng-click="joyride.next()" ng-bind="(joyride.current == joyride.config.steps.length-1) ? \'Finish\' : \'Next\'"></a></div></div></div>');
}]);
////////////**********////////////////

////////******* Utility functions *******//////////
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}

function getElementOffset(element){
    var de = document.documentElement;
    var box = element.getBoundingClientRect();
    var top = box.top + window.pageYOffset - de.clientTop;
    var left = box.left + window.pageXOffset - de.clientLeft;
    return { top: top, left: left };
}

function getScroll(){
 if(window.pageYOffset!= undefined){
  return pageYOffset;
 }
 else{
  var sy, d= document, r= d.documentElement, b= d.body;
  sy= r.scrollTop || b.scrollTop || 0;
  return [sx, sy];
 }
}

////////******* Joyride Directive *******//////////
var joyrideDirective = function($animate, joyrideService, $compile, $templateRequest, $timeout, $window, $anchorScroll, $location){
    return {
      restrict: 'E',
      scope: {},
      template: '<div class="jr_overlay"></div>',
      link: function(scope, element, attrs){
        scope.joyride = joyrideService;
        var joyrideContainer,
            // overlay = '<div class="jr_overlay"></div>',
            template;

        angular.element($window).bind('resize', function(){
          if (scope.joyride.start) {
            setPos();
          }
        });

        function appendJoyride(){
          var appendHtml = $compile(template)(scope),
              currentStep = scope.joyride.config.steps[scope.joyride.current],
              divElement = angular.element(document.querySelector('body'));

          if (currentStep.type === 'element' && !currentStep.appendToBody) {
            var divElement = angular.element(document.querySelector(currentStep.selector));
          }

          divElement.append(appendHtml);
          joyrideContainer = document.querySelector('.jr_container');

          /// When joyride is nested inside an element this
          /// prevents any functions or state changes that are
          /// binded to the parentfrom executing when
          /// clicking on the joyride
          if (currentStep.type === 'element' && !currentStep.appendToBody) {
            angular.element(joyrideContainer).on('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
            });
          }

          angular.element(joyrideContainer).append("<div class='triangle'></div>");
          if (scope.joyride.start) {
            if (!scope.joyride.transitionStep) {
              angular.element(joyrideContainer).addClass('jr_start').addClass('jr_transition');
            }
          }

        }

        function removeJoyride(){
          angular.element(joyrideContainer).remove();
        }

        //////// Watching for change in the start variable
          scope.$watch('joyride.start', function(show, oldShow) {
            if (show !== oldShow || show === true) {

              //////// Joyride was opened
              if (show) {
                template = scope.joyride.config.template || 'ngJoyrideDefault.html';
                $templateRequest(template,false).then(function (html) {
                  template=html;
                  angular.element(document.querySelector('body')).addClass('jr_active');
                  if (scope.joyride.config.overlay !== false) {
                    angular.element(document.querySelector('body')).addClass('jr_overlay_show');
                  }

                  if (typeof scope.joyride.config.steps[scope.joyride.current].beforeStep === "function") {
                    scope.joyride.config.steps[scope.joyride.current].beforeStep(start);
                  }

                  else{
                    start();
                  }
                });

                function start(){
                  appendJoyride();
                    $animate.addClass(joyrideContainer, 'jr_start').then(scope.joyride.config.onStart);
                    setPos();
                }
              }

              ////////// Joyride was closed
              if (!show) {
                $animate.removeClass(joyrideContainer, 'jr_start').then(joyrideEnded);
              }
          }
        });

        //////////// Watching for transition trigger
        scope.$watch('joyride.transitionStep', function(val, oldVal) {
          if (val !== oldVal && scope.joyride.start) {
            if (val) {

              if (val == 'next' && scope.joyride.current == scope.joyride.config.steps.length-1) {
                scope.joyride.start = false;
              }

              else if (val == 'prev' && scope.joyride.current == 0) {
                return;
              }

              else{
                $animate.addClass(joyrideContainer, 'jr_transition').then(beforeTransition);
              }

            }
            if (!val) {
              $animate.removeClass(joyrideContainer, 'jr_transition');
            }
          }
        });

        ////// check for afterStep function before going to next step
        function beforeTransition(){
          if (typeof scope.joyride.config.steps[scope.joyride.current].afterStep === "function") {
            scope.joyride.config.steps[scope.joyride.current].afterStep(afterTransition);
          }

          else{
            afterTransition();
          }
        }

        ////// Remove -> Append joyride and transition in
        scope.joyride.resumeJoyride = function(){
          if (!scope.joyride.start) {
            return;
          }
          scope.joyride.transitionStep = false;
          if (typeof scope.joyride.config.onStepChange === "function") {
            scope.joyride.config.onStepChange();
          }
          removeJoyride();
          appendJoyride();
          $timeout(function(){
            setPos();
          })
        }


        ////// Set position and current step after joyride transitions out
        function afterTransition(){

          ////// transitions in the next step
            if (scope.joyride.transitionStep == 'next') {
              scope.joyride.current++;
            }
            else{
              scope.joyride.current--;
            }


            // if step contains a beforeStep function
            // execute it first before transitioning in
            // else just transition in
              if (typeof scope.joyride.config.steps[scope.joyride.current].beforeStep === "function") {
                scope.joyride.config.steps[scope.joyride.current].beforeStep(scope.joyride.resumeJoyride);
              }

              else{
                scope.joyride.resumeJoyride();
              }

        }

        // Reset variables after joyride ends
        var joyrideEnded = function(){
          // angular.element(document.querySelector('.jr_overlay')).remove()
          angular.element(document.querySelector('body')).removeClass('jr_active jr_overlay_show');
          removeJoyride();
          scope.joyride.current = 0;
          scope.joyride.transitionStep = true;
          if (typeof scope.joyride.config.onFinish === "function") {
            scope.joyride.config.onFinish();
          }
          if (document.querySelector(".jr_target")) {
            angular.element(document.querySelector(".jr_target")).removeClass('jr_target');
          }
        }

        // Handles joyride positioning
        function setPos(){
          var currentStep = scope.joyride.config.steps[scope.joyride.current];

          $timeout(function(){

            removeClassByPrefix(joyrideContainer, "jr_pos_");
            var step = scope.joyride.config.steps[scope.joyride.current];


          // If step type equals 'element' set position and styles
          if (step.type == 'element') {
            joyrideContainer.removeAttribute('style');
            angular.element(joyrideContainer).addClass('jr_element');


            if (document.querySelector(".jr_target")) {
              angular.element(document.querySelector(".jr_target")).removeClass('jr_target');
            }

            var jrElement = angular.element(document.querySelector(step.selector)),
                position = getElementOffset(jrElement[0]),
                window_width = window.innerWidth;

            jrElement.addClass('jr_target');

            // Check where the step should be positioned then change the position property accordingly
            var placement = step.placement || 'bottom';
            if (step.responsive && window_width < step.responsive.breakpoint) {
              placement = step.responsive.placement || 'bottom';
            }

            angular.element(joyrideContainer).addClass('jr_pos_'+placement);

            if (currentStep.appendToBody){
              if (placement === 'top' || placement === 'bottom') {
                if (placement === 'top') {
                  var height = joyrideContainer.clientHeight;
                  position.top -= height + 20;
                }

                else {
                  var height = jrElement[0].clientHeight;
                  position.top += height + 20;
                }
                var jrWidth = joyrideContainer.clientWidth,
                    targetWidth = jrElement[0].clientWidth;

                // var leftOffset = Math.max(jrWidth, targetWidth) - Math.min(jrWidth, targetWidth)/2;
                // position.left = Math.max(leftOffset, position.left) - Math.min(leftOffset, position.left);
                position.left = ((position.left + targetWidth/2) - jrWidth/2 );

                if (position.left < 0) {
                  var triangle = document.querySelector(".jr_container .triangle");
                  triangle.style.left = position.left + Math.abs((jrWidth - targetWidth + triangle.offsetWidth)/2)  + 'px';
                  triangle.style.right = "auto";
                  position.left = 0;

                }

                else if((position.left + jrWidth) > window_width){
                  var tempPos = position.left + (jrWidth/2)
                  var triangle = document.querySelector(".jr_container .triangle");
                  triangle.style.right = "auto";
                  position.left = window_width - jrWidth;
                  triangle.style.left = tempPos - position.left - triangle.offsetWidth / 2  + 'px';
                }

                else{

                  var triangle = document.querySelector(".jr_container .triangle");
                  triangle.style.left = 0;
                  triangle.style.right = 0;
                }

              }

              else{
                var jrHeight = joyrideContainer.clientHeight,
                    targetHeight = jrElement[0].clientHeight;
                // var leftOffset = Math.max(jrWidth, targetWidth) - Math.min(jrWidth, targetWidth)/2;
                // position.left = Math.max(leftOffset, position.left) - Math.min(leftOffset, position.left);
                position.top = ((position.top + targetHeight/2) - jrHeight/2 );
                if (placement === 'left') {
                  var width = joyrideContainer.clientWidth;
                  position.left -= width + 20;

                }

                else {
                  var width = jrElement[0].clientWidth;
                  position.left += width + 20;
                }
                // position.top -= 20;
              }

              // Set joyride position
              joyrideContainer.style.left = position.left + 'px';
              joyrideContainer.style.top = position.top + 'px';
              joyrideContainer.style.right = 'auto';
              joyrideContainer.style.bottom = 'auto';
              joyrideContainer.style.transform = 'none';



            }

            // Scroll to element if scroll is enabled
              if (step.scroll !== false) {
                var id = $location.hash();
                $location.hash(jrElement[0].id);
                $anchorScroll();
                $location.hash(id);
              }
          }


          // If step isn't an element
          else{
            angular.element(joyrideContainer).removeClass('jr_element');
            if (document.querySelector(".jr_target")) {
              angular.element(document.querySelector(".jr_target")).removeClass('jr_target');
            }
            joyrideContainer.style.left = '';
            joyrideContainer.style.top = getScroll(placement, joyrideContainer) + 100 + 'px';
          }
      });

        }
      }

    }

  }

////////******* Joyride Service *******//////////
  var joyrideService = function(){
    return {
      current : 0,
      transitionStep: true,
      resumeJoyride: function(){},
      start: false,
      config: {
        overlay: true,
        template: false,
        steps : [],
        onStepChange: function(){},
        onFinish: function(){},
        onStart: function(){}
      },
      next: function(){
        this.transitionStep = 'next';
      },
      prev: function(){
        this.transitionStep = 'prev';
      },
      goTo: function(step){
        this.start = true;
        if (step) {
          this.current = step;
        }
      }
    };
  }

app.filter('jr_trust', [
  '$sce',
  function($sce) {
    return function(value, type) {
      // Defaults to treating trusted text as `html`
      return $sce.trustAsHtml(value);
    }
  }
]);

app.factory('joyrideService', [joyrideService]);
app.directive('joyride', ['$animate', 'joyrideService', '$compile', '$templateRequest', '$timeout', '$window', '$anchorScroll', '$location', joyrideDirective]);

})();