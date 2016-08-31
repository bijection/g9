var initial = {
    a: 0,
    b: 0,
    k:100,
}

function rotate(x,y, a){
    return [Math.cos(a)*x - Math.sin(a)*y, Math.sin(a)*x + Math.cos(a)*y]
}

function rgb(r,g,b){
    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    return 'rgba('+r+','+g+','+b+',1)'
}

function data2graphics(data, ctx){
    var x = 0, y1 = 0, y2 = -100*Math.sin(data.b)

    function inner(r,n,a,j){
        ctx.circle(...rotate(0, r, j / n * Math.PI*2 + a), {
            r:data.k,
            fill: rgb(
                Math.abs(Math.sin(j/n*Math.PI*2*3)),
                Math.abs(Math.sin(j/n*Math.PI*2*5)),
                Math.abs(Math.sin(j/n*Math.PI*2*7))
            )
        })        
    }

    inner = ctx.pure(inner)

    function ring(r, n, a) {
        for (var j = 0; j < n; j++) {
            inner(r,n,a,j)
        }
    }

    ring = ctx.pure(ring)



    for (var i = 1; i < 40; i++) {

        ring(i*2*data.k, i*6, i%2 ? data.a : - data.a)
        
    }    
    // ctx.circle(100*Math.cos(data.a - data.b), 100*Math.sin(data.a - data.b))
}   

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)