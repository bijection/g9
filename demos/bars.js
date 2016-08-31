var initial = {
    x: -300,
    t: 1  
}

var wolo = []

for (var i = 0; i < 50; i++) {
    wolo.push(Math.pow(Math.random(), 2))
}

function color(n){
    return '#'+Math.floor(n).toString(16)
}

var colors1=[]
var colors2=[]
wolo.forEach(w => {
    colors1.push(Math.random()*16777215)
    colors2.push(Math.random()*16777215)
})

function tween(a, b, t){
    return a + (b-a)*t
}

var margin = 3

function center(x,y,w,h){
    return [(x+w/2), y + h/2]
}

function data2graphics(data, ctx){
    var w = (ctx.width - (wolo.length - 1)*margin )/ wolo.length
    var h = (ctx.height - (wolo.length - 1)*margin )/ wolo.length

    var t = Math.max(Math.min(data.t,1),0)

    wolo.forEach(ctx.pure((d, i) => {
        var x = tween(-ctx.width/2 + i * (w + margin), -ctx.width/2, t)
        var y = tween(ctx.height/2, -ctx.height/2+ i*(h + margin), t)
        var width = tween(w, -d * data.x, t)
        var height = tween(-d * Math.log(-data.x)*100, -h, t)

        ctx.rect(
            x,
            y,
            width,
            height,
            {
                fill: color(colors1[i]),//color(tween(colors1[i], colors2[i], t)),
                cares: i ? ['t'] : ['x']
            }
        )
    }))
}

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)