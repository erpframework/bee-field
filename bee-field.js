var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
}

angular.module('beefield', [])
    .directive('field', function () {
        return {
            restrict: 'EA',
            require: '^?form',
            template: function (el, attrs) {
                var input;
                if (attrs.type == 'textarea') {
                    input = '<label class="control-label" for="{{name}}">{{label}}</label>' +
                    '<textarea model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions"></textarea>';
                } else if (attrs.type == 'checkbox') {
                    input = '<label><input model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions" type="checkbox" /> {{label}}</label>';
                } else if (attrs.type == 'select') {
                    input = '<label class="control-label" for="{{name}}">{{label}}</label>' +
                    '<select class="form-control" name="{{name}}" ng-model="model" ng-options="{{optionsExp}}"></select>'

                } else {
                    input = '<label class="control-label" for="{{name}}">{{label}}</label>' +
                    '<input model-helper class="field" name="{{name}}" ng-model="model" ng-model-options="modelOptions" type="{{type}}" />';
                }
                return '<div ng-class="{\'has-error\': !validates()}">' +
                    input +
                    '<p class="help-block" ng-if="form[name].$error.required && !validates()">{{msgs.required}}</p>' +
                    '<p class="help-block" ng-if="form[name].$error.email && !validates()">{{msgs.email}}</p>' +
                    '<p class="help-block" ng-if="form[name].$error.minlength && !validates()">{{msgs.minlength}}</p>' +
                    '<p class="help-block" ng-if="form[name].$error.maxlength && !validates()">{{msgs.maxlength}}</p>' +
                    '<transcluder class="transclude"></transcluder>' +
                    '</div>'
            },
            transclude: true,
            scope: {
                label: '@',
                model: '=',
                data: '=',
                options: '='
            },
            compile: function (tEl, tAttrs, transclude) {

                // transfer attributes
                var input = angular.element(tEl.find('input')[0] || tEl.find('textarea')[0] || tEl.find('select')[0]); // get raw element to make the OR operator work
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
                    'ng-options'
                ];
                angular.forEach(attrToTransfer, function (attr) {
                    var normalizedAttr = tAttrs.$normalize(attr);
                    input.attr(tAttrs.$attr[normalizedAttr], tAttrs[normalizedAttr] || ' ');
                });

                // transfer custom attributes
                angular.forEach(tAttrs, function (attr, key) {
                    if (key.lastIndexOf('tx', 0) === 0) { // if starts with tx
                        var attributeName = key.substring(2); // strip tx
                        input.attr(snake_case(attributeName, '-'), attr);
                    }
                })

                // add bs classes
                if (tAttrs.type == 'checkbox') {
                    tAttrs.$addClass('checkbox');
                } else {
                    tAttrs.$addClass('form-group');
                    input.addClass('form-control');
                }

                // transfer user classes from wrapper to input
                input.addClass(tAttrs.class);
                tEl.removeClass(tAttrs.class)

                // apply user wrapper classes
                tAttrs.$addClass(tAttrs.wrapperClass);

                return {
                    pre: function (scope, el, attrs, formCtrl, transFn) {

                        scope.msgs = {
                            required: attrs.errorRequired,
                            email: attrs.errorEmail,
                            minlength: attrs.errorMinlength,
                            maxlength: attrs.errorMaxlength
                        }

                        scope.type = attrs.type || 'text';
                        scope.name = attrs.model.replace(/\./g, '_');
                        scope.form = formCtrl;
                        scope.modelOptions = {updateOn: attrs.updateOn} || {};

                        scope.optionsExp = attrs.optionsMode == 'single' ? 'o for o in options' : 'o.' + (attrs.optionsKey || 'id') + ' as o.' + (attrs.optionsLabel || 'name' ) + ' for o in options';

                        scope.validates = function () {
                            if (!scope.form) return true; // if there is no parent form tag
                            var defaultRules = scope.form[scope.name].$valid || (!scope.form.$submitted && scope.form[scope.name].$pristine);
                            return defaultRules;
                        }
                        el.find('transcluder').append(transFn(scope, function () {
                        }))
                    }
                }
            }

        }
    })
    .directive('submit', function () {
        return {
            restrict: 'A',
            compile: function (el, attrs) {

                // setup classes
                var btnClass;
                if (attrs.info !== undefined) btnClass = 'info';
                if (attrs.default !== undefined) btnClass = 'default';
                if (attrs.warning !== undefined) btnClass = 'warning';
                if (attrs.success !== undefined) btnClass = 'success';
                if (attrs.error !== undefined) btnClass = 'error';
                el.addClass('btn btn-' + (btnClass || 'primary'));

                // input submit type
                el.attr('type', attrs.type || 'submit');

                // set value
                el.attr('value', attrs.label || 'Submit');
            }

        }
    })
    .directive('modelHelper', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, el, attrs, modelCtrl) {
                scope.$watch(function () {
                    return modelCtrl.$viewValue
                }, function (value) {
                    scope.viewValue = modelCtrl.$viewValue
                })
                el.bind('focus', function () {
                    scope.$apply(function () {
                        scope.focus = true;
                        scope.blur = false;
                    })
                })
                el.bind('blur', function () {
                    scope.$apply(function () {
                        scope.focus = false;
                        scope.blur = true;
                    })

                })

            }
        }
    })
    .directive('forceInteger', function () {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                if ('forceInteger' in attrs) {
                    el.bind('keydown', function (e) {
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