var demo = g9({
    "l": 0.8,
    "startx1": 175,
    "starty1": 96,
    "startx2": -220,
    "starty2": 39
}, function({
    l,
    startx1,
    starty1,
    startx2,
    starty2,
}, draw){
    
    var dragon = draw.pure(function (x1,y1, x2,y2, dir, level){
        if(level){

            var dy = y2 - y1
            var dx = x2 - x1
            var offset = 1/2

            var midx = (x1 + x2)/2+ l*dir*offset*dy
            var midy = (y1 + y2)/2- l*dir*offset*dx

            // draw.circle(midx, midy)
            draw.circle({x:midx, y:midy, cares:['l'], r:2})

            dragon(x1,y1, midx,midy, -1,level-1)
            dragon(midx,midy, x2,y2,  1,level-1)

        } else {
            draw.line({x1,y1,x2,y2,cares:['l'],'stroke-width': 4})
        }
    })

    dragon(startx1,starty1,startx2,starty2,-1,10)
    draw.circle({x:startx1, y:starty1, r:5})
    draw.circle({x:startx2, y:starty2, r:5})

}, function(newdata, renderees){

    document.querySelector('.data').innerText = "var initdata = " + JSON.stringify(newdata, null, 4)
    
})