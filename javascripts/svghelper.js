const SVG = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

var _ = function(name) {
    return defAttr(document.getElementById(name));
}

var C = function(type) {
   return defAttr(document.createElementNS(SVG, type));
}

var defAttr = function(obj) {
    if (obj.definedAttr) return obj;
    obj.definedAttr = true;

    var xywh = ['x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'width', 'height', 'style'];

    for (var index in xywh) {
        var i = xywh[index];
        obj.__defineGetter__(i, 
                (function(attrName) {
                 return function() { 
                     return this.getAttribute(attrName);
                 }
                 })(i)
            );
        obj.__defineSetter__(i, 
                (function(attrName) {
                     return function(val) { 
                         this.setAttribute(attrName, val);
                         return this.getAttribute(attrName);
                     }
                 })(i)
            );
    }
    obj.styles = {};
    obj.applyStyles = function() {
        var s = '';
        for (var key in obj.styles) {
            s += '' + key + ':' + obj.styles[key] + '; '
        }
        obj.style = s;
    }
    obj.setStyle = function(name, value) {
        obj.styles[name] = value;
        obj.applyStyles();
    }
    obj.removeStyle = function(name) {
        delete obj.styles[name];
        obj.applyStyles();
    }
    return obj;
}

var rootHeight = document.defaultView.innerHeight;
var rootWidth = document.defaultView.innerWidth;
