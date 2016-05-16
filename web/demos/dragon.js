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
    
    var dragon = draw.pure(function (c1, c2, dir, level){
        if(level){

            var {x: x1, y: y1} = c1.data
            var {x: x2, y: y2} = c2.data

            var dy = y2 - y1
            var dx = x2 - x1
            // var d = Math.sqrt(dx*dx+dy*dy)
            var offset = 1/2

            var midx = (x1 + x2)/2
            var midy = (y1 + y2)/2

            var mid = draw.circle(
                midx + l*dir*offset*dy,
                midy - l*dir*offset*dx,
                {cares:['l']})
                .attr({
                    r:2,
                    // stroke:"rgba(0,0,0,.3)",
                    // 'stroke-width': 3,
                })

            dragon(c1, mid, -1,level-1)
            dragon(mid, c2,  1,level-1)

        } else {
            draw.line(c1,c2,{cares:['l']})
                .attr({'stroke-width': 4})
        }
    })

    dragon(
        draw.circle(startx1,starty1),
        draw.circle(startx2,starty2),-1,10)

}, function(newdata, renderees){

    document.querySelector('.data').innerText = "var initdata = " + JSON.stringify(newdata, null, 4)
    // console.log('data', newdata)
    // console.log('renderees', renderees)

})