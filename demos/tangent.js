var radius = 100
var invisible = 'rgba(0,0,0,0)'

function arrow(draw, fromx, fromy, angle, length, id){
	draw.line(id+'from', id+'to', id+'body')
	draw.line(id+'to', id+'head1', id+'headbody1')
	draw.line(id+'to', id+'head2', id+'headbody2')


	draw.circle(fromx, fromy, id+'from')
	draw.circle(fromx+length*Math.cos(angle), fromy + length*Math.sin(angle), id+'to')
		.attr({fill: invisible})

	var head = .9, wau = .05
	draw.circle(fromx + length*head*Math.cos(angle+wau), fromy + length*head*Math.sin(angle+wau), id+'head1')
		.attr({fill: invisible})
	draw.circle(fromx + length*head*Math.cos(angle-wau), fromy + length*head*Math.sin(angle-wau), id+'head2')
		.attr({fill: invisible})

}

var demo = g9({

	angle: 0,
	x: 0, 
	y: 0,

}, ({

	angle, x, y

}, draw) => {

	draw.circle(600,200,'circle').attr({r: 200, stroke: 'red', fill: 'none'})
	arrow(draw, 600, 200, angle, 200, 'wau')
			
}, newdata => {
	console.log(newdata)
})