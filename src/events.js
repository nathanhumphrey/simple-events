/**
 * Events.js 0.1.1
 * Author: Nathan Humphrey
 * Created: November8, 2013
 *
 * Generic Events object that can be extended by objects to provide 
 * basic support for observation.  There are no dependencies.
 * 
 */ 
(function (exports) {
  // helper function to determine if a callback is in fact a function
  var isFunction = function (func) {
    return (typeof func === 'function');
  };

  var Events = (function () {
    // return function
    var f = function () {};
    
    // shorthand to work with the prototype
    f.fn = f.prototype;
    
    /**
     * Add a callback function for an event on this object. If the event has not
     * yet been registered with the object, it will be added.
     * 
     * @param {String} event - a string name for the event to watch
     * @param {Function} callback - the observer callback function to call when the event is triggered
     * @param {Object} [obj] - the observer object for callback binding
     * @throws {Error} if callback is not a function
     */
    f.fn.on = function (event, callback, obj) {
      // if callback is not a function, throw an exception
      if (!isFunction(callback)) {
        throw new Error('callback is not a function');
      }

      // ensure that the instance has an events hash and check for previous callbacks
      this.events || (this.events = {});
      this.events[event] || (this.events[event] = event);
      
      this.callbacks || (this.callbacks = {});
      this.callbacks[event] || (this.callbacks[event] = []);
 
      this.callbacks[event].push({obj: obj || undefined, callback: callback}); 
    };
    
    /**
     * Remove a callback for an event on the object.  This only removes the first
     * match for a callback, so multiple registrations won't be affected.
     * 
     * @param {String} event - a string name for the event to remove the callback on
     * @param {Function} callback - the callback function to remove from the object's specified event
     * @param {Object} [obj] - the observer object for callback binding
     * @throws {Error} if callback is not a function
     */
    f.fn.off = function (event, callback, obj) {
      // if callback is not a function, throw an exception
      if (!isFunction(callback)) {
        throw new Error('callback is not a function');
      }

      var i = -1,
          callback,
          callbacks;
      
      if (this.callbacks && this.callbacks[event]) {
        callbacks = this.callbacks[event];

        // remove object function
        while (callbackObj = callbacks[++i]) {
          
          if (callbackObj.callback === callback
              && callbackObj.obj === obj) {
            callbacks.splice(i, 1);
            return;
          }
        }
      }
    };
    
    /**
     * Trigger an event on this object.  All callbacks registered for the supplied event
     * will be called and passed this object as a single argument.
     * @param {String} event - a string name for the event to trigger
     */
    f.fn.trigger = function (event) {
      var i = -1,
          callbacks,
          callbackObj;
      
      if (this.events && this.events[event]) {
        // retrieve, loop through and call all callbacks registered for the specified event
        callbacks = this.callbacks[event];    
        
        while (callbackObj = callbacks[++i]) {
          callbackObj.callback.apply(callbackObj.obj || this, [this]);
        }
      }
    };
    
    return f;
  }());
 
  // export Events to the global object
  exports.Events = Events;

}(this));