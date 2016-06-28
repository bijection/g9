function gradient(f,x) {
    var dim = x.length, f1 = f(x);
    if(isNaN(f1)) throw new Error('The gradient at ['+x.join(' ')+'] is NaN!');
    var {max, abs, min} = Math
    var tempX = [...x], grad = Array(dim);
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


function norm2(x){
    return Math.sqrt(x.reduce((a,b)=>a+b*b,0))
}

function identity(n){
    return Array.from(Array(n), (_,i) => Array.from(Array(n), (_,j) => +(i==j)))
}

function neg(x){
    return x.map(a=>-a)
}

function dot(a,b){
    if (Array.isArray(a[0])){
        return a.map(x=>dot(x,b))
    }
    return a.reduce((x,y,i) => x+y*b[i],0)
}

function sub(a,b){
    if(Array.isArray(a[0])){
        return a.map((c,i)=>sub(c,b[i]))
    }
    return a.map((c,i)=>c-b[i])
}

function add(a,b){
    if(Array.isArray(a[0])){
        return a.map((c,i)=>add(c,b[i]))
    }
    return a.map((c,i)=>c+b[i])
}

function div(a,b){
    return a.map(c=>c.map(d=>d/b))
}

function mul(a,b){
    if(Array.isArray(a[0])){
        return a.map(c=>mul(c,b))
    }
    return a.map(c=>c*b)
}

function ten(a,b){
    return a.map((c,i)=>mul(b,c))
}

export default function minimize(f,x0,tol=1e-8,maxit=1000) {
    tol = Math.max(tol,2e-16);
    x0 = [...x0];
    var n = x0.length;
    var f0 = f(x0);
    if(isNaN(f0)) throw new Error('minimize: f(x0) is a NaN!');
    var grad = a => gradient(f,a)
    var H1 = identity(n), g0 = grad(x0);
    // var randsteps = 0
    // while(g0.every(x=>x<2e-16)){
    //     x0[Math.floor(Math.random()*n)] += (Math.random()-.5)*Math.pow(2, randsteps-10)
    //     g0 = grad(x0)
    //     if(++randsteps > 20) break;
    // }
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
        if(t*nstep < tol) { var msg = "Line search step size smaller than tol"; break; }
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