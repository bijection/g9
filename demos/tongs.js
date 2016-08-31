var initial = {
    a: 18,
    b: 1,
}

function rotate(x,y, a){
    return [Math.cos(a)*x - Math.sin(a)*y, Math.sin(a)*x + Math.cos(a)*y]
}

function data2graphics(data, ctx){
    var x = 0, y1 = 0, y2 = -100*Math.sin(data.b)
    for (var i = 0; i < 4; i++) {

        var dir = (i%2)*2 - 1

        var nextx = x + 100*Math.cos(data.b)
        var nexty1 = y1 + dir*100*Math.sin(data.b)
        var nexty2 = y2 - dir*100*Math.sin(data.b)

        ctx.line(...rotate(x,y1,data.a), ...rotate(nextx,nexty1,data.a), {"stroke-width":10, "stroke-linecap":"round"})
        ctx.line(...rotate(x,y2,data.a), ...rotate(nextx,nexty2,data.a), {"stroke-width":10, "stroke-linecap":"round"})
        
        x = nextx
        y1 = nexty1
        y2 = nexty2

    }    
    // ctx.circle(100*Math.cos(data.a - data.b), 100*Math.sin(data.a - data.b))
}   

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)