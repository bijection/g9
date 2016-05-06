var demo = g9({
    da:70,
    dl:.75,
}, function({da,dl}, draw){
    
    // var id = 0

    function drawTree(x1, y1, length, angle, n, oldid, id){
        var x2 = x1 + length * Math.cos(angle*Math.PI/180);
        var y2 = y1 + length * Math.sin(angle*Math.PI/180);
     
        // var a = id++
        if(!oldid){
            oldid = 'tree'
            id = 'trunk'
            draw.circle(x1, y1, oldid);
        }

        draw.circle(x2, y2, id)
        
        draw.line(oldid, id).attr({"stroke-width": 10})
        
        if(n > 0) {
            drawTree(x2, y2, length*dl, angle+da, n-1, id, id+'l');
            drawTree(x2, y2, length*dl, angle-da, n-1, id, id+'r');
        }
    }

    drawTree(350.5, 530, 100, -90, 7)

}, function(newdata, renderees){

    console.log('changed data to', newdata)

})