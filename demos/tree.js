var demo = g9({
    deltaAngle:33,
    attenuation:0.7,
    startLength:189
}, function({deltaAngle,attenuation,startLength}, ctx){
    
    var drawTree = ctx.pure(function (x1, y1, length, angle, n){
        var x2 = x1 + length * Math.cos(angle*Math.PI/180);
        var y2 = y1 + length * Math.sin(angle*Math.PI/180);
     
        ctx.circle(x2, y2, {cares:['deltaAngle', 'attenuation']})
        
        ctx.line(x1,y1,x2,y2)

        if(n > 0) {
            drawTree(x2, y2, length*attenuation, angle+deltaAngle, n-1);
            drawTree(x2, y2, length*attenuation, angle-deltaAngle, n-1);
        }

    })

    ctx.circle(0, ctx.height/2 - 30)

    drawTree(0, ctx.height/2 - 30, startLength, -90, 9)

}, function(newdata, renderees){

    console.log('changed data to', newdata)

})


// demo.getRenderer()
//     .insertInto('.demo .display')
//     .xAlign('center')
//     .yAlign('bottom')