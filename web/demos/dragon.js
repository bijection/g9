var demo = g9({
    l:1,
    startx1:200,
    starty1:200,
    startx2:400,
    starty2:200,
    alpha:.5,
}, function({
    l,
    startx1,
    starty1,
    startx2,
    starty2,
    alpha,
}, draw){
    
    var dragon = draw.pure(function (c1, c2, dir, level){
        if(level){

            var {x: x1, y: y1} = c1.data
            var {x: x2, y: y2} = c2.data

            var dy = y2 - y1
            var dx = x2 - x1
            var d = Math.sqrt(dx*dx+dy*dy)
            var offset = Math.sqrt(alpha*(1-alpha))

            var midx = x1*alpha + x2*(1-alpha)
            var midy = y1*alpha + y2*(1-alpha)

            var mid = draw.circle(
                midx + l*dir*offset*dy,
                midy - l*dir*offset*dx,
                {cares:['l']})
                .attr({
                    r:1,
                    stroke:"rgba(0,0,0,.3)",
                    'stroke-width': 3,
                })

            dragon(c1, mid, -1,level-1)
            dragon(mid, c2,  1,level-1)

        } else {
            draw.line(c1,c2)
                .attr({'stroke-width': 1})
        }
    })

    dragon(
        draw.circle(startx1,starty1),
        draw.circle(startx2,starty2),-1,11)

}, function(newdata, renderees){

    console.log('data', newdata)
    console.log('renderees', renderees)

})