var sides = 10


var demo = g9({
	s1: 100,
	s2: 100
}, function({x, y, s1, s2}, draw){
	var a = 2*Math.PI/sides

	for (var i = 0; i < sides; i+=1) {
		draw.circle(400+s1*Math.cos(i*a), 200+s1*Math.sin(i*a), i)
		draw.circle(400+s2*Math.cos((i+.5)*a), 200+s2*Math.sin((i+.5)*a), i+.5)
		draw.line(i, (i+5.5)%sides, i+'asdf')
		draw.line(i, (i+.5)%sides, i+'asddf')
		// draw.line((i+1)%sides, (i+5.5)%sides)
	}
	
}, function(newdata, renderees){

	console.log(newdata)

})