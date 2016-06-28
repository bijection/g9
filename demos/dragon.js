var data = {
    "squareness": 0.8,
    "fromX": 175,
    "fromY": 96,
    "toX": -220,
    "toY": 39
}

function data2graphics(data, ctx){
    var lineoptions = {'stroke-width': 4, cares:['squareness'], "stroke-linecap":"round"}

    function dragon(x1,y1, x2,y2, dir, level){
        if(level == 0){
            ctx.line(x1, y1,x2, y2, lineoptions)
        } else {
            var midx = (x1 + x2 + data.squareness*dir*(y2 - y1))/2
            var midy = (y1 + y2 - data.squareness*dir*(x2 - x1))/2

            dragon(x1,y1, midx,midy, -1,level-1)
            dragon(midx,midy, x2,y2,  1,level-1)
        }
    }
    
    dragon = ctx.pure(dragon)
    
    dragon(data.fromX, data.fromY, data.toX, data.toY, -1, 8)
    
    ctx.circle(data.fromX, data.fromY, {r:5})
    ctx.circle(data.toX, data.toY, {r:5})
}

function log(x) {
    console.log(x)
}

var demo = g9(data, data2graphics, log)