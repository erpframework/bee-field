describe('beefieldDirective', function () {
    var $compile, $rootScope, $scope;

    beforeEach(module('beefield'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
    }));

    it('should create a new isolate scope', function () {
        $scope.parent = true;
        var element = $compile('<field model="user.name"></field>')($scope);
        var directiveScope = element.isolateScope();
        expect(directiveScope.parent).toBe(undefined);
    });

    it('should bind model', function () {
        $scope.user = {
            name: 'pippo'
        };
        var element = $compile('<field model="user.name"></field>')($scope);
        var directiveScope = element.isolateScope();
        expect(directiveScope.model).toBe('pippo');
        $scope.$apply(function () {
            $scope.user.name = 'topolino';
        })
        expect(directiveScope.model).toBe('topolino');
    });

    it('should create input element', function () {
        var element = $compile('<field model="user.name"></field>')($scope);
        expect(element.find('input')[0]).toBeTruthy();
    })

    it('should create a textarea element', function () {
        var element = $compile('<field type="textarea" model="user.name"></field>')($scope);
        expect(element.find('textarea')[0]).toBeTruthy();
    })

    it('should create a checkbox', function () {
        var element = $compile('<field type="checkbox" model="user.name"></field>')($scope);
        var input = element.find('input');
        expect(input.attr('type')).toBe('checkbox');
    })

    it('should set custom type', function () {
        var element = $compile('<field type="email" model="user.name"></field>')($scope);
        $scope.$digest();
        var input = element.find('input');
        expect(input.attr('type')).toBe('email');
    })

    it('should add a label', function () {
        var element = $compile('<field label="Your name" model="user.name"></field>')($scope);
        var label = element.find('label');
        $scope.$digest();
        expect(label[0]).toBeTruthy();
        expect(label[0].innerHTML).toBe('Your name');
    })

    it('should add bootstrap classes', function () {
        var element = $compile('<field label="Your name" model="user.name"></field>')($scope);
        var label = element.find('label');
        var input = element.find('input');
        expect(input.hasClass('form-control')).toBeTruthy();
        expect(label.hasClass('control-label')).toBeTruthy();
    })

    it('should set name attribute on input', function () {
        var element = $compile('<field label="Your name" model="user.name"></field>')($scope);
        var input = element.find('input');
        $scope.$digest();
        expect(input.attr('name')).toBe('user_name');
    })

    it('should transfer attributes from parent to input', function () {
        var element = $compile('<field label="Your name" model="user.name" placeholder="Placeholder"></field>')($scope);
        var input = element.find('input');
        $scope.$digest();
        expect(input.attr('placeholder')).toBe('Placeholder');
    })

    it('should transfer custom attributes from parent to input', function () {
        var element = $compile('<field label="Your name" model="user.name" tx-custom-directive="yo"></field>')($scope);
        var input = element.find('input');
        $scope.$digest();
        expect(input.attr('custom-directive')).toBe('yo');
    })

    it('should transfer classes from parent to input', function () {
        var element = $compile('<field label="Your name" model="user.name" class="my-class"></field>')($scope);
        var input = element.find('input');
        expect(input.hasClass('my-class')).toBeTruthy();
    })

    it('should apply wrapper classes', function () {
        var element = $compile('<field label="Your name" model="user.name" wrapper-class="my-class"></field>')($scope);
        $scope.$digest();
        expect(element.hasClass('my-class')).toBeTruthy();
    })

    it('should expose focus/blur properties on scope', function () {
        var element = $compile('<field model="user.name"></field>')($scope);
        var input = element.find('input');
        var scope = element.isolateScope();
        input.triggerHandler('focus');
        expect(scope.focus).toBeTruthy();
        expect(scope.blur).toBeFalsy();
        input.triggerHandler('blur');
        expect(scope.blur).toBeTruthy();
        expect(scope.focus).toBeFalsy();
    })

    it('should expose model view value', function () {
        $scope.user = {
            name: 'pippo'
        };
        var element = $compile('<field model="user.name"></field>')($scope);
        var directiveScope = element.isolateScope();
        directiveScope.$digest();
        expect(directiveScope.viewValue).toBe('pippo');
    })

    it('should transclude content to the same scope', function () {
        $scope.user = {
            name: 'pluto'
        }
        var element = $compile('<field model="user.name">{{model}}</field>')($scope);
        $scope.$digest();
        expect(element[0].innerHTML).toContain('<span class="ng-binding ng-scope">pluto</span>');
    });

    // buttons
    it('should properly create submit buttons', function () {
        var primary = $compile('<input submit/>')($scope);
        expect(primary.attr('type')).toBe('submit');
        expect(primary.hasClass('btn-primary')).toBeTruthy();

        var info = $compile('<input submit info/>')($scope);
        expect(info.hasClass('btn-info')).toBeTruthy();

        var reset = $compile('<input submit type="reset" />')($scope);
        expect(reset.attr('type')).toBe('reset');

        var withLabel = $compile('<input submit label="Send" />')($scope);
        expect(withLabel.attr('value')).toBe('Send');
    });

    it('should create selects', function() {
        var element = $compile('<field type="select" label="Select" model="user.select"></field>')($scope);
        var select = element.find('select')[0];
        expect(select).toBeTruthy();
    })

    it('should create select options', function() {
        $scope.options = ['a','b','c'];
        var element = $compile('<field type="select" label="Select" model="user.select" options="options"></field>')($scope);
        $scope.$digest();
        var options = element.find('option');
        expect(options.length).toBe(4);
    });

    it('should update select', function() {
        $scope.options = ['a','b','c'];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options"></field>')($scope);
        var select = element.find('select');
        $scope.$digest();
        $scope.user.select = 'c';
        $scope.$digest();
        expect(select.val()).toBe('2');
        $scope.user.select = 'b';
        $scope.$digest();
        expect(select.val()).toBe('1');
    });

    it('should update select model', function() {
        $scope.options = ['a','b','c'];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options"></field>')($scope);
        var select = element.find('select');
        $scope.$digest();
        select.val('1');
        select.triggerHandler('change');
        expect($scope.user.select).toBe('b');
    });

    it('should update select (object)', function() {
        $scope.options = [{id: 1, name: 'a'},{id: 2, name: 'b'},{id: 3, name: 'c'}];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options" options-mode="object"></field>')($scope);
        var select = element.find('select');
        $scope.$digest();
        $scope.user.select = 3;
        $scope.$digest();
        expect(select.val()).toBe('2');
    });

    it('should update select (object) model', function() {
        $scope.options = [{id: 1, name: 'a'},{id: 2, name: 'b'},{id: 3, name: 'c'}];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options" options-mode="object"></field>')($scope);
        var select = element.find('select');
        $scope.$digest();
        select.val('0');
        select.triggerHandler('change');
        expect($scope.user.select).toBe(1);
        select.val('2');
        select.triggerHandler('change');
        expect($scope.user.select).toBe(3);
    });

    it('should update select (object) model with custom key', function() {
        $scope.options = [{code: 1, name: 'a'},{code: 2, name: 'b'},{code: 3, name: 'c'}];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options" options-mode="object" options-key="code"></field>')($scope);
        var select = element.find('select');
        $scope.$digest();
        select.val('0');
        select.triggerHandler('change');
        expect($scope.user.select).toBe(1);
        select.val('2');
        select.triggerHandler('change');
        expect($scope.user.select).toBe(3);
    });

    it('should create select labels', function() {
        $scope.options = [{id: 1, name: 'a'},{id: 2, name: 'b'},{id: 3, name: 'c'}];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options" options-mode="object"></field>')($scope);
        $scope.$digest();
        var options = element.find('option');
        expect(options[0].innerHTML).toBe('');
        expect(options[1].innerHTML).toBe('a');
        expect(options[2].innerHTML).toBe('b');
        expect(options[3].innerHTML).toBe('c');
        expect(options[4]).toBeUndefined();
    });

    it('should create select labels with custom label', function() {
        $scope.options = [{id: 1, label: 'a'},{id: 2, label: 'b'},{id: 3, label: 'c'}];
        $scope.user = {};
        var element = $compile('<field type="select" label="Select" model="user.select" options="options" options-mode="object" options-label="label"></field>')($scope);
        $scope.$digest();
        var options = element.find('option');
        expect(options[0].innerHTML).toBe('');
        expect(options[1].innerHTML).toBe('a');
        expect(options[2].innerHTML).toBe('b');
        expect(options[3].innerHTML).toBe('c');
        expect(options[4]).toBeUndefined();
    });

    it('should update form validation state', function() {
        var element = $compile('<form name="form" novalidate><field model="user.name" required></field></form>')($scope);

        $scope.user = {name: ''};
        $scope.$digest();
        expect($scope.form.$valid).toBeFalsy();
        expect($scope.form.user_name.$valid).toBeFalsy();

        $scope.user.name = 'Eufrate';
        $scope.$digest();
        expect($scope.form.$valid).toBeTruthy();
        expect($scope.form.user_name.$valid).toBeTruthy();
    });

    it('should set error classes', function() {
        var form = $compile('<form name="form" novalidate><field model="user.name" required></field></form>')($scope);
        $scope.user = {};
        $scope.form.$submitted = true;
        $scope.$digest();
        var wrapper = form.find('div.has-error');
        expect(wrapper[0]).toBeDefined();

        $scope.user.name = 'Kebap';
        $scope.$digest();
        expect(wrapper.hasClass('has-error')).toBeFalsy();
    });

    it('should display validation messages when form is invalid and submitted', function() {
        var form = $compile('<form name="form" novalidate><field model="user.name" required></field></form>')($scope);
        $scope.user = {};
        $scope.form.$submitted = true;
        $scope.$digest();

        expect(form[0].innerHTML).toContain('This field is required');
    })

    it('should not display validation messages when form is valid and submitted', function() {
        var form = $compile('<form name="form" novalidate><field model="user.name"></field></form>')($scope);
        $scope.user = {};
        $scope.form.$submitted = true;
        $scope.$digest();

        expect(form[0].innerHTML).not.toContain('This field is required');
    });

    it('should display custom validation messages when form is invalid and submitted', function() {
        var form = $compile('<form name="form" novalidate><field model="user.name" error-required="Fill da field!!" required></field></form>')($scope);
        $scope.user = {};
        $scope.form.$submitted = true;
        $scope.$digest();

        expect(form[0].innerHTML).toContain('Fill da field!!');
    })

    it('should display interpolated custom validation messages when form is invalid and submitted', function() {
        var form = $compile('<form name="form" novalidate><field model="user.name" error-minlength="Enter at least {{minlength}} characters" ng-minlength="10" required></field></form>')($scope);
        $scope.user = {name: '6chars'};
        $scope.form.$submitted = true;
        $scope.$digest();

        expect(form[0].innerHTML).toContain('Enter at least 10 characters');
    })


});