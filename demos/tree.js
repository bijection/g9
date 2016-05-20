var demo = g9({
    deltaAngle:33,
    attenuation:0.7,
    startLength:189
}, function({deltaAngle,attenuation,startLength}, ctx){
    
    var drawTree = ctx.pure(function (x1, y1, length, angle, n, oldid, id){
        var x2 = x1 + length * Math.cos(angle*Math.PI/180);
        var y2 = y1 + length * Math.sin(angle*Math.PI/180);
     
        ctx.circle(x2, y2,
            id === 'trunk' ? id : {id, cares:['deltaAngle', 'attenuation']})
        
        ctx.line(oldid, id)

        if(n > 0) {
            drawTree(x2, y2, length*attenuation, angle+deltaAngle, n-1, id, id+'l');
            drawTree(x2, y2, length*attenuation, angle-deltaAngle, n-1, id, id+'r');
        }

    })

    ctx.circle(0, -40, 'tree')

    drawTree(0, -40, startLength, -90, 9, 'tree', 'trunk')

}, function(newdata, renderees){

    console.log('changed data to', newdata)

})


// demo.getRenderer()
//     .insertInto('.demo .display')
//     .xAlign('center')
//     .yAlign('bottom')