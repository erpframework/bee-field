# bee-field
AngularJS directives to speed up form elements management.

### Features
* generates div container, label and input tag
* apply bootstrap classes
* supports text, textarea, select and checkbox types
* transcludes content (to the directive scope, not parent scope)
* allows transfer of attributes from container (the <field></field> directive) to the generated input tag
* exposes focus/blur properties on directive scope
* exposes view value on directive scope (to allow access invalid input)
* handles validation messages display
* works in isolate scope
* good unit test coverage
* provides global configuration service

### Install

`bower install bee-field`

### Usage

#### Basic field
```html
<field model="user.name"></field>
```
will output to

```html
<div class="form-group">
    <input type="text" ng-model="model" class="form-control" name="user_name" />
</div>
```

#### Labeled field
```html
<field model="user.name" label="Your name"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_name" class="control-label">Your name</label>
    <input type="text" ng-model="model" class="form-control" name="user_name" />
</div>
```

#### Required field
```html
<field model="user.name" label="Your name" required></field>
```
will output to

```html
<div class="form-group">
    <label for="user_name" class="control-label">Your name</label>
    <input type="text" ng-model="model" class="form-control" name="user_name" required />
</div>
```

#### Custom type
```html
<field model="user.name" label="Your name" type="email"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_name" class="control-label">Your name</label>
    <input type="email" ng-model="model" class="form-control" name="user_name" required />
</div>
```

#### Textarea
```html
<field model="user.name" label="Your name" type="textarea"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_name" class="control-label">Your name</label>
    <textarea type="email" ng-model="model" class="form-control" name="user_name"></textarea>
</div>
```

#### Checkbox
```html
<field model="user.accept" label="Accept" type="checkbox"></field>
```
will output to

```html
<div class="checkbox">
    <label><input type="checkbox" ng-model="model" name="user_accept" /> Accept</label>
</div>
```

#### Select (basic)
```html
<field model="user.age" label="Age" type="select" options="ages"></field>
```
($scope.ages is an array of numbers)
will output to

```html
<div class="form-group">
    <label for="user_age" class="control-label">Age</label>
    <select class="form-control" ng-options="o for o in options" ng-model="model">
        <option value=""></option>
    </select>
</div>
```

#### Select (with object)
```html
<field model="user.country" label="Country" type="select" options="countries" options-mode="object"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_country" class="control-label">Country</label>
    <select class="form-control" ng-options="o.id as o.name for o in options" ng-model="model">
        <option value=""></option>
    </select>
</div>
```

#### Select (with object and custom key/label)
```html
<field model="user.country" label="Country" type="select" options="countries" options-mode="object" options-key="code" options-label="nested.name"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_country" class="control-label">Country</label>
    <select class="form-control" ng-options="o.code as o.nested.name for o in options" ng-model="model">
        <option value=""></option>
    </select>
</div>
```

#### Select (with custom null label)
```html
<field model="user.country" label="Country" type="select" options="countries" options-null="Please select"></field>
```
will output to

```html
<div class="form-group">
    <label for="user_country" class="control-label">Country</label>
    <select class="form-control" ng-options="o for o in options" ng-model="model">
        <option value="">Please select</option>
    </select>
</div>
```

#### Transcluded content
```html
<field model="user.name" label="Your name" required>
  <p class="help-block">Some help text</p>
</field>
```
will output to

```html
<div class="form-group">
    <label for="user_name" class="control-label">Your name</label>
    <input type="text" ng-model="model" class="form-control" name="user_name" required />
    <p class="help-block">Some help text</p>
</div>
```

Unlike classic transclusion, I opted to transclude to the directive scope, so you can do things like this
```html
<field model="user.name" label="Your name" required>
  <p class="help-block">You entered {{model.length}} chars</p>
</field>
```
or this
```html
<field model="user.name" label="Your name" required>
  <p ng-show="focus">This only appears when the input has focus</p>
</field>
```

#### Access model view value
The directive exposes a viewValue property to let you access the input value even if validation fails
```html
<field model="user.name" label="Your name" ng-minlength="300" required>
  <p class="help-block">{{viewValue}}</p>
</field>
```

### Global configuration
The module provides a `beefieldConfig` service to globally configure directive options. At the moment the only options supported are the validation messages.

Example usage:
```javascript
angular.module('myapp',['beefield'])
.run(function(beefieldConfig){
    beefieldConfig.errors.required = 'This field is required';
    beefieldConfig.errors.minlength = 'This field must be at least {{minlength}} characters long';
})
```


---

Check out unit tests for more examples.

Contributions are welcome!
