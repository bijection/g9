/* http://Github.com/Canop/hu.js */

// A simple SVG library by denys.seguret@gmail.com
"use strict";

var nn = 1, // counter for dynamically generated def id
    U = function(n) { this.n = n },
    fn = U.prototype,
    nopx = { // css properties which don't need a unit
        "column-count": 1,
        "fill-opacity": 1,
        "flex-grow": 1,
        "flex-shrink": 1,
        "font-weight": 1,
        "opacity": 1,
        "z-index": 1
    };

function node(a, c){
    if (a instanceof U) return a.n;
    if (c) c = node(c);
    if (typeof a === "string") {
        var m = a.match(/^\s*<\s*(\w+)\s*>?\s*$/);
        if (m) {
            var n = document.createElementNS("http://www.w3.org/2000/svg", m[1]);
            if (/^svg$/i.test(n.tagName)) {
                // hack to force Firefox to see the dimension of the element
                ù('<rect', n).attr({width:"100%", height:"100%", opacity:0});
            }
            return n;
        }
        return (c||document).querySelector(a);
    }
    return a[0]||a; // to support jQuery elements and nodelists
}   

var ù = window.ù = window.hu = function(a, c){
    if (!c) return new U(node(a));
    c = node(c);
    a = node(a, c);
    if (!a) return null;
    if (c && !a.parentNode) c.appendChild(a);
    return new U(a);
}
ù.fn = fn; // so that ù can be easily extended

// reverse camel case : "strokeOpacity" -> "stroke-opacity"
function rcc(n){
    return n.replace(/[A-Z]/g, function(l){ return '-'+l.toLowerCase() });
}

fn.append = function(a){
    this.n.appendChild(node(a));
    return this;
}
fn.prependTo = function(a){
    a = node(a);
    a.insertBefore(this.n, a.firstChild);
    return this;
}

// removes the graphical nodes, not the defs
// (to remove everything, just call the standard DOM functions)
fn.empty = function(){
    for (var l=this.n.childNodes, i=l.length; i--;) {
        if (!/^defs$/i.test(l[i].tagName)) this.n.removeChild(l[i]);
    }
    return this;
}

fn.autoid = function(){
    return this.attrnv('id', 'ù'+nn++);
}

fn.text = function(s){
    this.empty().n.appendChild(document.createTextNode(s));
    return this;
}

// stores the passed element in the closest SVG parent of this
//  and gives it an automatic id.
fn.def = function(a){
    var u = ù(a), p = this;
    while (p) {
        if (p.n.tagName === "svg") {
            (ù("defs", p)||ù('<defs', p.n)).n.appendChild(u.n); 
            return u.autoid();
        }
        p = ù(p.parentNode);
    }
    throw "No parent SVG";
}

fn.stops = function(){
    for (var i=0; i<arguments.length; i++) {
        ù('<stop', this).attr(arguments[i]);
    }
    return this;
}

fn.rgrad = function(cx, cy, r, c1, c2){
    return this.def('<radialGradient').attr({cx:cx, cy:cy, r:r}).stops(
        {offset:'0%', stopColor:c1},
        {offset:'100%', stopColor:c2}
    );
}

fn.width = function(v){
    // window.getComputedStyle is the only thing that seems to work on FF when there are nested svg elements
    if (v === undefined) return this.n.getBBox().width || parseInt(window.getComputedStyle(this.n).width); 
    return this.attrnv('width', v);
}
fn.height = function(v){
    if (v === undefined) return this.n.getBBox().height || parseInt(window.getComputedStyle(this.n).height);
    return this.attrnv('height', v);
}

// css name value
fn.cssnv = function(name, value){
    name = rcc(name);
    if (value === undefined) return this.n.style[name];
    if (typeof value === "number" && !nopx[name]) value += 'px';
    this.n.style[name] = value;
    return this;
}

fn.css = function(a1, a2){
    if (typeof a1 === "string") return this.cssnv(a1, a2);
    for (var k in a1) this.cssnv(k, a1[k]);
    return this;
}

// attr name value
fn.attrnv = function(name, value){
    name = rcc(name);
    if (value === undefined) return this.n.getAttributeNS(null, name);
    if (value instanceof U) value = "url(#"+value.n.id+")";
    this.n.setAttributeNS(null, name, value);
    return this;
}

fn.attr = function(a1, a2){
    if (typeof a1 === "string") return this.attrnv(a1, a2);
    for (var k in a1) {
        this.attrnv(k, a1[k]);
    }
    return this;        
}

fn.on = function(et, f){
    et.split(' ').forEach(function(et){
        this.addEventListener(et, f);
    }, this.n);
    return this;
}
fn.off = function(et, f){
    et.split(' ').forEach(function(et){
        this.removeEventListener(et, f);
    }, this.n);
    return this;
}
fn.remove = function(){
    if (this.n.parentNode) this.n.parentNode.removeChild(this.n);
    return this;
}

for (var n in fn) {
    if (typeof fn[n] === "function") ù[n] = fn[n];
}

export default ù