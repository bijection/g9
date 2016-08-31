var initial = {
    x1: -100,
    x2: 0,
    x3: 100,
}

function data2graphics(data, ctx){
    var m = Math.max(Math.min(data.x2, data.x3 - 20), data.x1 + 20)
    ctx.circle(m,0, {cares: ['x2']})
    ctx.circle(data.x2,20, {cares: ['x2']})
    ctx.circle(data.x1,0, {fill: 'red'})
    ctx.circle(data.x3,0, {fill: 'red'})
}

function log(x, y){
    console.log(x,y)
}

var demo = g9(initial, data2graphics, log)