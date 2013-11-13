// events_spec.js
describe('The Events object', function () {
  var ev = null,
      spy = jasmine.createSpy('spy'),
      spy1 = jasmine.createSpy('spy1');
      spy2 = jasmine.createSpy('spy2');

  beforeEach(function () {
    ev = new Events();
  });

  afterEach(function () {
    ev = null;
  });

  it('registers listeners', function () {
    ev.on('someEvent', spy);
    ev.on('someEvent', spy1);

    expect(ev.callbacks['someEvent'][0]['callback']).toEqual(spy);
    expect(ev.callbacks['someEvent'][1]['callback']).toEqual(spy1);
  });

  it('triggers callbacks', function () {
    ev.on('someEvent', spy);
    ev.on('someEvent', spy1);

    ev.trigger('someEvent', spy);

    expect(spy).toHaveBeenCalledWith(ev);
    expect(spy1).toHaveBeenCalledWith(ev);
  });

  it('can bind callbacks to other objects', function () {
    var obj = {foo: 'bar'},
        func = function (o) {this.foo = 'baz';};

    ev.on('someEvent', func, obj);

    ev.trigger('someEvent');

    expect(obj.foo).toBe('baz');
  });

  it('removes listeners', function () {
    var obj = {};

    ev.on('someEvent', spy);
    ev.on('someEvent', spy1);
    ev.on('someEvent', spy2, obj);

    ev.off('someEvent', spy);
    ev.off('someEvent', spy2, obj);

    expect(ev.callbacks['someEvent'].length).toBe(1);
    expect(ev.callbacks['someEvent'][0]['callback']).toEqual(spy1);
  });

});