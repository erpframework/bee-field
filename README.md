# bee-field
AngularJS directives to speed up form elements management.

### Features
* generates div container, label and input tag
* apply bootstrap classes
* supports text, textarea and checkbox types
* transcludes content (to the directive scope, not parent scope)
* allows transfer of attributes from container (the <field></field> directive) to the generated input tag
* exposes focus property on directive scope
* exposes view value on directive scope (to allow access invalid input)
* handles validation messages display (not documented - probable api change)
* works in isolate scope
* good unit test coverage

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

---

Check out unit tests for more examples.

Contributions are welcome!
