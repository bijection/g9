var demo = g9({

	t: 0.400000000000008,

	startx: 148.00000000002743,
	starty: 232.000000002497,

	middlex: 299.00000000255926,
	middley: 21.000000000037627,

	endx: 469.00000000063096,
	endy: 244.0000000000004,

}, ({

	startx, starty,	middlex, middley, endx, endy, t, nasay

}, {
	circle, line, text, polyline
}) => {

	circle(t*300+100, 300).attr({fill: 'blue'})

	var tlabel = 't='+t.toString().slice(0,4)
	text(tlabel, t*300+110, 300).attr({alignmentBaseline:"middle"})

	var steps = 30
	var spline = []

	for (var i = 0; i < steps; i++) {
		var r = t*i/steps

		function tween(a,b){
			return a + r*(b-a)
		}

		var ax = tween(startx, middlex),
			ay = tween(starty, middley),
			bx = tween(middlex, endx),
			by = tween(middley, endy);
		
		line('a'+i, 'b'+i).attr({stroke:'rgba(0,0,0,.1)'})
		circle(ax,ay,{id: 'a'+i, cares: ['middlex', 'middley']}).attr({fill:'rgba(0,0,0,.1)'})
		circle(bx,by,{id: 'b'+i, cares: ['middlex', 'middley']}).attr({fill:'rgba(0,0,0,.1)'})

		spline.push(
			circle(tween(ax, bx), tween(ay, by), {cares: ['t']}).attr({fill:'rgba(0,0,0,.1)'})
		)

	}

	polyline(spline)

	spline[steps-1].attr({fill:'red'})


		line('start', 'middle')
	line('middle', 'end')

	circle(startx,starty,'start')
	circle(middlex,middley,'middle')
	circle(endx,endy,'end')

}, newdata => {
	console.log(newdata)
})