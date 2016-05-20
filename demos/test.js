var demo = g9(
	
	{x: 257, y: 343, z: 188},

function(data, draw){
	
	var merp = draw.circle(10, 10, 'stillness')

	var wolo = draw.circle(data.x, data.y, 'p1')
	var molo = draw.circle(data.x, data.y/2, 'p3')
	
	var moisture = draw.circle(data.x-20, data.y, 'p2')
	var zthing = draw.circle(data.z, data.z, 'coolzdot')

	var last = draw.circle(data.x, 60+50*Math.sin(data.x/30), 's'+i)
	for (var i = 1; i < 10; i++) {
		var cur = draw.circle(data.x+i*10, 60+50*Math.sin((data.x +i*10)/30), 's'+i)
		draw.line(cur, last, 'l'+i)
		last = cur
	}

	draw.line(last, zthing, 'aslkdfjl')
	draw.line(wolo, molo, 'coolassline')
	draw.line(moisture, merp, 'mertle')


}, function(newdata){

	console.log('we changed our data',newdata)

})