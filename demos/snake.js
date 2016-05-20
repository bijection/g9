var demo = g9({
	r1: 6.259436678879225,
	r2: 12.539682642803488,
	r3: 12.707953163637603,
	r4: 6.018393351961019,
	x: 490.853355091885,
	y: 162.09610769932087,
}, function(data, draw){

	var dots = [[data.x, data.y]];

	var r0 = 0;
	[data.r1, data.r2, data.r3, data.r4].forEach(function(r){
		var last = dots[dots.length-1]
		var x = last[0], y = last[1];
		r0+=r
		dots.push([x+50*Math.cos(r0), y+50*Math.sin(r0)])
	})

	var id = 0
	dots.map(function(d){
		return draw.circle(d[0], d[1], id++)
	}).reduce(function(a,b){
		draw.line(a,b,id++)//.css({pointerEvents: 'none'})
		return b
	})

}, function(newdata){
	console.log('kevin sucks', newdata)
})