// var sides = 10


var demo = g9({
	s1: 100,
	s2: 100,
	sides: 10,
	r1: 10,
	r2: 10
}, function({x, y, s1, s2, sides, r1, r2}, draw){

	var rsides = Math.round(sides)
	var a = 2*Math.PI/rsides

	draw.circle(40*sides, 200, 'wolo')


	for (var i = 0; i < sides; i+=1) {

		draw.circle(
			400+s1*Math.cos(i*a + r2),
			200+s1*Math.sin(i*a + r2), i)

		draw.circle(
			400+s2*Math.cos(i*a + r1),
			200+s2*Math.sin(i*a + r1), i+.5)

		draw.line(i, (i + .5)%rsides, 'l1'+i)
		draw.line(i, (i + 1.5)%rsides, 'l2'+i)

	}
	
}, function(newdata, renderees){

	console.log(newdata)

})