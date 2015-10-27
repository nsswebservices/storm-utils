(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormUtils = factory();
  }
}(this, function() {
	'use strict';
     
     /**
      * @name classlist
      * @description Returns object that can add, remove, check for and toggle classes on an element
      * @params Each property of the object is a function that accepts a DOM element and a classname String
      *
      * @name attributelist
      * @description Returns object that can add, remove, and boolean toggle attributes on a DOM element
      */
     var classlist = {
            add : function(el, c) {
                el.className = el.className + ' ' + c;
                return this;
            },
            remove: function(el, c) {
                var re = new RegExp("(^|\\s+)" + c + "(\\s+|$)");
                el.className = el.className.replace(re, ' ');
                return this;
            },
            has: function(el, c) {
                var re = new RegExp("(^|\\s+)" + c + "(\\s+|$)");
                return re.test(el.className);
            },
            toggle: function(el, c) {
                if(classlist.has(el, c)) {
                    classlist.remove(el, c);
                } else {
                    el.className = el.className + ' ' + c;
                }
                return this;
            }
         },
         attributelist = {
             add: function(el, attrs) {
                 for(var attr in attrs){
                     el.setAttribute(attr, attrs[attr]);
                 }
                 return this;
             },
            toggle: function(el, attr) {
                el.setAttribute(attr, el.getAttribute(attr) === 'true' ? false : true);
                return this;
            }
         };
     
     /**
      * @name extend
      * @description Merges two (or more) objects, giving the last one precedence
      */
      function merge(target, source) {
          if ( typeof target !== 'object') {
              target = {};
          }
          
          for (var property in source) {
              if (source.hasOwnProperty(property)) {
                  var sourceProperty = source[ property ];
                  
                  if ( typeof sourceProperty === 'object' ) {
                      target[ property ] = merge( target[ property ], sourceProperty );
                      continue;
                  }
                  target[property] = sourceProperty;
              }
          }
          for (var a = 2, l = arguments.length; a < l; a++) {
              merge(target, arguments[a]);
          }
          return target;
      }
     
     /**
      * @name on
      * @description batch attach events to an element
      * @param element, DOM node, to attach events to
      * @param events, String, comma separated events
      * @param fn, Function, 
      */
      function on(element, events, fn) {
          events.split(' ').forEach(function(ev){
              element.addEventListener(ev, fn, false);
          });
      }
     
     /**
      * @name debounce
      * @description call function once after multiple invocations
      * @param fn, function to be called
      * @param wait, int, time to wait after last invocation before calling the function
      * @param immediate, boolean, whether to execute immediaely after last invocation or after another wait
      */
     function debounce(fn, wait, immediate) {
         var timeout;
         return function() {
             var context = this,
                 args = arguments,
                 later = function() {
                    timeout = null;
                    if (!immediate) fn.apply(context, args);
                };
                if (immediate && !timeout) fn.apply(context, args);
                window.clearTimeout(timeout);
                timeout = window.setTimeout(later, wait);
        };
     }
     
     /**
      * @name throttle
      * @description call a function with a maximum specified frequency
      * @param fn, function to be called
      * @param ms, int, minimum interval between calls
      */
     function throttle(fn, ms) {
         var timeout,
             last = 0;
         return function() {
            var a = arguments,
                t = this,
                now = +(new Date()),
                exe = function() { 
                    last = now; 
                    fn.apply(t,a); 
                };
            window.clearTimeout(timeout);
            if(now >= last + ms) {
                exe();
            } else {
                timeout = window.setTimeout(exe, ms);
            }
        };
     }
     
     /**
      * @name loadJS
      * @description asynchronously load script files
      * @param src, String, src path of the script
      * @param cb, Function, callback function executed once the script is loaded or fails
      */
     function loadJS(src, cb) {
        var script = document.createElement('script'),
            timer = window.setTimeout(function() {
                cb('Script ' + src + ' failed to load in time.');
            }, 5000);
         
        script.src = src;
        script.onload = function() {
            window.clearTimeout(timer);
            cb();
        };
        document.body.appendChild(script);
    }
     
     /**
      * @name xhr
      * @description Make XMLHttpRequests
      * @param url, string, path to make the request to
      * @param method, string, HTTP method
      * @param cb, function, callback exectued after request is made
      * @param data, string, serialized form data
      */
     function xhr(url, method, cb, data) {
		var http = new XMLHttpRequest(),
			type = method || 'GET',
			params = data || null;
		
		if(!!url) {
			http.open(type, url, true);
			
			if(type === 'POST') {
				http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			}
			
			http.onreadystatechange = function() {//Call a function when the state changes.
				if(http.readyState == 4 && http.status == 200) {
					if(!!cb) { cb(null, http.responseText); }
				}
			};
			http.onerror = function(){
				if(!!cb) { cb('Error'); }
			};
			http.send(params);
		}
	}
     
     /**
      * @name serialize
      * @description serialize a form, exactly the same result as jQuery's serialize()
      * @param form, DOM element, the form to serialize
      */
     function serialize(form){
          var field,
              s = [],
              len;
          if (!(typeof form == 'object' && form.nodeName == "FORM")) {
              return console.log('Cannot serialize form');
          }

          len = form.elements.length;
          for (var i =0; i < len; i++) {
            field = form.elements[i];
            if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                if (field.type == 'select-multiple') {
                    for (var j = form.elements[i].options.length-1; j>=0; j--) {
                        if(field.options[j].selected)
                            s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                    }
                } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                    s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                }
            }
        }
        return s.join('&').replace(/%20/g, '+');
      }
     
     /**
      * @name closest
      * @description get the closest matching element up the DOM tree using element.matches()
      * @param el, DOM element, starting element
      * @param selector, DOM element, String, selector to test match
      */
      function closest(el, selector) {
          if (el.closest) {
            return el.closest(selector);
          }

          var matches = el.matches || el.msMatchesSelector;

          do {
            if (el.nodeType != 1) continue;
            if (matches.call(el, selector)) return el;
          } while (el = el.parentNode);

          return undefined;
      }
     
     /**
      * @name escapeHTML
      * @description escape HTML entities in a string
      * @param string, String, the string...
      */
      function escapeHTML(string) {
          var entityMap = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': '&quot;',
              "'": '&#39;',
              "/": '&#x2F;'
          };
          return String(string).replace(/[&<>"'\/]/g, function (s) {
              return entityMap[s];
          });
      }
     
     return {
         throttle: throttle,
         debounce: debounce,
         merge: merge,
         on: on,
         classlist: classlist,
         attributelist: attributelist,
         loadJS: loadJS,
         serialize: serialize,
         xhr: xhr,
         closest: closest,
         escapeHTML: escapeHTML
     };
 }));