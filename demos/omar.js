var data = {
    a: 1,
    b: 1,
    c: 1
}


function data2graphics(data, ctx){
    var f = function(t) {
        return data.a*t*t + data.b*t + data.c*t;
    }

    var render = ctx.pure(function(t) {
        ctx.circle({x:t,y:f(t),r:2})
    })

    for (var t = -5; t <= 5; t += 0.01) {
        render(t)
    }
}


function log(data) {
    console.log(data)
}

var demo = g9(data, data2graphics, log)