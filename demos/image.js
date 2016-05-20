var demo = g9({

	x: 148.00000000002743,
	y: 232.000000002497,

	width: 299.00000000255926,
	height: 21.000000000037627,

}, ({

	x, y, width, height

}, draw) => {

	draw.image('http://i.imgur.com/LQIsf.jpg', x, y, width,width,'nasa').attr({preserveAspectRatio: false})
	draw.circle(x+width,y+width, 'resizer')
	draw.circle(x+width/2,y+width/2, 'mover')
		
}, newdata => {
	console.log(newdata)
})