function norm2(x){
    return Math.sqrt(x.reduce((a,b)=>a+b*b,0))
}

function identity(n){
    var ret = Array(n)
    for (var i = 0; i < n; i++) {
        ret[i] = Array(n)
        for (var j = 0; j < n; j++) ret[i][j] = +(i == j) ;
    }
    return ret
}

function neg(x){
    return x.map(a=>-a)
}

function dot(a,b){
    if (typeof a[0] !== 'number'){
        return a.map(x=>dot(x,b))
    }
    return a.reduce((x,y,i) => x+y*b[i],0)
}

function sub(a,b){
    if(typeof a[0] !== 'number'){
        return a.map((c,i)=>sub(c,b[i]))
    }
    return a.map((c,i)=>c-b[i])
}

function add(a,b){
    if(typeof a[0] !== 'number'){
        return a.map((c,i)=>add(c,b[i]))
    }
    return a.map((c,i)=>c+b[i])
}

function div(a,b){
    return a.map(c=>c.map(d=>d/b))
}

function mul(a,b){
    if(typeof a[0] !== 'number'){
        return a.map(c=>mul(c,b))
    }
    return a.map(c=>c*b)
}

function ten(a,b){
    return a.map((c,i)=>mul(b,c))
}

function isZero(a){
    for (var i = 0; i < a.length; i++) {
        if(a[i]!== 0) return false
    }
    return true
}

// Adapted from the numeric.js gradient and uncmin functions
// Numeric Javascript
// Copyright (C) 2011 by Sébastien Loisel

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export function gradient(f,x) {
    var dim = x.length, f1 = f(x);
    if(isNaN(f1)) throw new Error('The gradient at ['+x.join(' ')+'] is NaN!');
    var {max, abs, min} = Math
    var tempX = x.slice(0), grad = Array(dim);
    for(var i=0; i<dim; i++) {
        var delta = max(1e-6*f1, 1e-8);
        for (var k = 0;; k++) {
            if(k == 20) throw new Error("Gradient failed at index "+i+" of ["+x.join(' ')+"]");
            tempX[i] = x[i]+delta;
            var f0 = f(tempX);
            tempX[i] = x[i]-delta;
            var f2 = f(tempX);
            tempX[i] = x[i];
            if(!(isNaN(f0) || isNaN(f2))) {
                grad[i] = (f0-f2)/(2*delta)
                var t0 = x[i]-delta;
                var t1 = x[i];
                var t2 = x[i]+delta;
                var d1 = (f0-f1)/delta;
                var d2 = (f1-f2)/delta;
                var err = min(max(abs(d1-grad[i]),abs(d2-grad[i]),abs(d1-d2)),delta);
                var normalize = max(abs(grad[i]),abs(f0),abs(f1),abs(f2),abs(t0),abs(t1),abs(t2),1e-8);
                if(err/normalize < 1e-3) break; //break if this index is done
            }
            delta /= 16
        }
    }
    return grad;
}

export default function minimize(f, x0, end_on_line_search,tol=1e-8,maxit=1000) {


    tol = Math.max(tol,2e-16);
    var grad = a => gradient(f,a)

    x0 = x0.slice(0)
    var g0 = grad(x0)
    var f0 = f(x0)
    if(isNaN(f0)) throw new Error('minimize: f(x0) is a NaN!');
    var n = x0.length;
    var H1 = identity(n)
    
    for(var it = 0; it<maxit; it++) {
        if(!g0.every(isFinite)) { var msg = "Gradient has Infinity or NaN"; break; }
        var step = neg(dot(H1,g0));
        if(!step.every(isFinite)) { var msg = "Search direction has Infinity or NaN"; break; }
        var nstep = norm2(step);
        if(nstep < tol) { var msg="Newton step smaller than tol"; break; }
        var t = 1;
        var df0 = dot(g0,step);
        // line search
        var x1 = x0;
        var s;
        for(;it < maxit && t*nstep >= tol; it++) {
            s = mul(step,t);
            x1 = add(x0,s);
            var f1 = f(x1);
            if(!(f1-f0 >= 0.1*t*df0 || isNaN(f1))) break;
            t *= 0.5;
        }
        if(t*nstep < tol && end_on_line_search) {var msg = "Line search step size smaller than tol"; break; }
        if(it === maxit) { var msg = "maxit reached during line search"; break; }
        var g1 = grad(x1);
        var y = sub(g1,g0);
        var ys = dot(y,s);
        var Hy = dot(H1,y);
        H1 = sub(add(H1,mul(ten(s,s),(ys+dot(y,Hy))/(ys*ys))),div(add(ten(Hy,s),ten(s,Hy)),ys));
        x0 = x1;
        f0 = f1;
        g0 = g1;
    }

    return {solution: x0, f: f0, gradient: g0, invHessian: H1, iterations:it, message: msg};
}


// var x = [4,26,2,8]
// minimize(norm2, x).f *1e9
// 8.597