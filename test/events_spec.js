// events_spec.js
describe('The Events object', function () {
  var ev = null,
      spy, spy1, spy2;

  beforeEach(function () {
    ev = new Events();
    spy = jasmine.createSpy('spy');
    spy1 = jasmine.createSpy('spy1');
    spy2 = jasmine.createSpy('spy2');    
  });

  afterEach(function () {
    ev = null;
  });

  it('requires minimum of 2 arguments to register a listener', function () {
    try {
      // call with only one argument
      ev.on('foo');
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('requires the first argument to be a string register a listener', function () {
    // call with a non-string arg
    try {
      ev.on((function () {}), (function () {}));
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    // call with String obj arg
    try {
      ev.on(new String('blah'), (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }

    // call with string primitive arg
    try {
      ev.on('blah', (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });

  it('requires the second argument to be a function to register a listener', function () {
    try {
      // call with non-function argument
      ev.on('foo', 'not a function');
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    try {
      // call with function argument
      ev.on('foo', (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('registers listeners', function () {
    ev.on('someEvent', spy);
    ev.on('someEvent', spy1);

    expect(ev.callbacks['someEvent'][0]['callback']).toEqual(spy);
    expect(ev.callbacks['someEvent'][1]['callback']).toEqual(spy1);
  });

  it('requires a string event name argument to trigger an event', function () {
    ev.on('someEvent', spy);

    // no args
    try {
      ev.trigger();
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    // non string arg
    try {
      ev.trigger((function () {}));
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    // String obj arg
    try {
      ev.trigger(new String('someEvent'));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }

    // string primitive arg
    try {
      ev.trigger('someEvent');
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });

  it('triggers callbacks', function () {
    ev.on('someEvent', spy);
    ev.on('someEvent', spy1);

    ev.trigger('someEvent');

    expect(spy).toHaveBeenCalledWith(ev);
    expect(spy1).toHaveBeenCalledWith(ev);

    ev.trigger(new String('someEvent'));

    expect(spy.calls.length).toEqual(2);
  });

  it('can bind callbacks to other objects', function () {
    var obj = {foo: 'bar'},
        func = function (o) {this.foo = 'baz';};

    ev.on('someEvent', func, obj);

    ev.trigger('someEvent');

    expect(obj.foo).toBe('baz');
  });

  it('requires minimum of 2 arguments to remove a listener', function () {
    try {
      // call with only one argument
      ev.on('someEvent', (function () {}));
      ev.off('someEvent');
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('requires the first argument to be a string to remove a listener', function () {
    // call with a non-string arg
    try {
      ev.on('someEvent', (function () {}));
      ev.off((function () {}), (function () {}));
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    // call with String obj arg
    try {
      ev.on('someEvent', (function () {}));
      ev.off(new String('someEvent'), (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }

    // call with string primitive arg
    try {
      ev.on('someEvent', (function () {}));
      ev.off('someEvent', (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });

  it('requires the second argument to be a function to remove a listener', function () {
    try {
      // call with non-function argument
      ev.on('foo', (function () {}));
      ev.off('foo', 'not a function');
      expect(true).toBe(false);
    } catch (e) {
      expect(true).toBe(true);
    }

    try {
      // call with function argument
      ev.on('foo', (function () {}));
      ev.off('foo', (function () {}));
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(true);
    }
  });

  it('removes listeners', function () {
    var obj = {};

    ev.on('someEvent', spy);
    ev.on(new String('someEvent'), spy1);
    ev.on(new String('someEvent'), spy2, obj);

    ev.off(new String('someEvent'), spy);
    ev.off('someEvent', spy2, obj);

    expect(ev.callbacks['someEvent'].length).toBe(1);
    expect(ev.callbacks['someEvent'][0]['callback']).toEqual(spy1);
  });

});