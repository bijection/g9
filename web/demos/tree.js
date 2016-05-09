var demo = g9({
    da:70,
    dl:.75,
    initl: 100,
    
}, function({da,dl,initl}, ctx){
    
    var drawTree = ctx.pure(function (x1, y1, length, angle, n, oldid, id){
        var x2 = x1 + length * Math.cos(angle*Math.PI/180);
        var y2 = y1 + length * Math.sin(angle*Math.PI/180);
     
        if(!oldid){
            oldid = 'tree'
            id = 'trunk'
            ctx.circle(x1, y1, oldid);
            ctx.circle(x2, y2, id).attr({r: 3})
        } else {
            ctx.circle(x2, y2, {id, cares:['da', 'dl']}).attr({r: 3})
        }

        ctx.line(oldid, id)

        if(n > 0) {
            drawTree(x2, y2, length*dl, angle+da, n-1, id, id+'l');
            drawTree(x2, y2, length*dl, angle-da, n-1, id, id+'r');
        }
    })

    drawTree(0, 530, initl, -90, 10)

}, function(newdata, renderees){

    console.log('changed data to', newdata)

})