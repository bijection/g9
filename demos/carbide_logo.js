var initial = {
    angle: 0,
    s1: 100,
    s2: 100,
}

function data2graphics(data, ctx){
    var {angle, s1,s2,s3 ,x,y} = data;

    function forward(n, c){
        ctx.line(x,y, x+=n*Math.cos(angle), y+=n*Math.sin(angle),{'stroke-linecap': 'round', 'stroke-width':10})
    }

    function turn(n){
        angle -= n * Math.PI/180
    }

    var x = y =0

    var a = angle * 180 / Math.PI

    for(var i = 0; i< 6; i++){
        forward(s1, ['s1', 'a'])
        turn(a)
        forward(s2, ['s2'])
        turn(60 - (a-90))
        forward(s2, ['s2'])
        turn(-90)
    }

}

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)