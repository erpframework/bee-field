.directive('field', function(){
    return {
        restrict:   'EA',
        require: '^?form',
        template:   function(el,attrs) {
            var input;
            if (attrs.type == 'textarea') {
                input = '<label class="control-label" for="{{name}}">{{label}}</label>' +
                        '<textarea model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions"></textarea>';
            } else if (attrs.type == 'checkbox') {
                input = '<label><input model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions" type="{{type}}" /> {{label}}</label>';
            } else {
                input = '<label class="control-label" for="{{name}}">{{label}}</label>' +
                        '<input model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions" type="{{type}}" />';
            }
            return '<div ng-class="{\'has-error\': !validates()}">' + 
                        input  + 
                        '<p class="help-block" ng-if="form[name].$error.required && !validates()">{{msgs.required}}</p>' + 
                        '<p class="help-block" ng-if="form[name].$error.email && !validates()">{{msgs.email}}</p>' + 
                        '<p class="help-block" ng-if="form[name].$error.minlength && !validates()">{{msgs.minlength}}</p>' + 
                        '<p class="help-block" ng-if="form[name].$error.maxlength && !validates()">{{msgs.maxlength}}</p>' + 
                        '<span class="transclude"></span>' +
                    '</div>'
        },
        transclude: true,
        scope: {
            label: '@',
            model: '=',
            data: '='
        },
        controller: function($scope,$element,$attrs) {
            var input = angular.element('.field',$element);
            this.onFocus = function(fn) {
                input.bind('focus', fn);
            }
            this.onBlur = function(fn) {
                input.bind('blur', fn);
            }
        },
        compile: function(tEl, tAttrs, transclude) {

            // transfer attributes
            var input = angular.element('.field',tEl);
            var attrToTransfer = [
                'placeholder',
                'rows',
                'ng-disabled',
                'ng-required',
                'required',
                'ng-minlength',
                'ng-maxlength',
                'ng-pattern',
                'ng-change', 
                'ng-trim',
                'force-integer',
                'username'
            ];
            angular.forEach(attrToTransfer, function(attr){
                var normalizedAttr = tAttrs.$normalize(attr);
                input.attr(tAttrs.$attr[normalizedAttr], tAttrs[normalizedAttr]);
            });

            if (tAttrs.type == 'checkbox') {
                tAttrs.$addClass('checkbox');
            } else {
                tAttrs.$addClass('form-group');
                input.addClass('form-control');
            }

            return {
                pre: function(scope,el,attrs,formCtrl,transFn) {
                    
                    scope.msgs = {
                        required: attrs.errorRequired,
                        email: attrs.errorEmail,
                        minlength: attrs.errorMinlength,
                        maxlength: attrs.errorMaxlength
                    }
                    
                    scope.type = attrs.type || 'text';
                    scope.name = attrs.model.replace(/\./g,'_');;
                    scope.form = formCtrl;
                    scope.modelOptions = {updateOn: attrs.updateOn} || {};
                    
                    scope.validates = function() {
                        var defaultRules = scope.form[scope.name].$valid || (!scope.form.$submitted && scope.form[scope.name].$pristine);
                        return defaultRules;
                    }
                    el.find('.transclude').append(transFn(scope,function(){}))
                },
                post: function(scope,el,attrs, formCtrl, transFn) {
                    //
                }
            }
        }
        
    }
})

.directive('modelHelper', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope,el,attrs,modelCtrl) {
            scope.$watch(function(){
                return modelCtrl.$viewValue
            }, function(value) {
                scope.viewValue = modelCtrl.$viewValue
            })
            el.bind('focus', function(){
                scope.$apply(function(){
                    scope.focus = true;
                    scope.blur = false;
                })
            })
            el.bind('blur', function(){
                scope.$apply(function(){
                    scope.focus = false;
                    scope.blur = true;    
                })
                
            })
            
        }
    }
})
.directive('forceInteger', function() {
    return {
        restrict: 'A',
        link: function(scope,el,attrs) {
            if ('forceInteger' in attrs) {
                el.bind('keydown', function(e) {
                    // Allow: backspace, delete, tab, escape, enter and .
                    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                            // Allow: Ctrl+A
                        (e.keyCode == 65 && e.ctrlKey === true) ||
                            // Allow: home, end, left, right
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                })
            }
        }
    }
})