var demo = g9({

	endx: 189.99999999995265,
	endy: 76.99999999995309,
	middlex: 9.000000002109623,
	middley: -223.99999999996237,
	startx: -139.9999999999726,
	starty: 81.99999999698782,
	t: 0.5066666666666662,

}, ({

	startx,
	starty,
	middlex,
	middley,
	endx,
	endy,
	t,

}, {
	point, line, height
}) => {

	var tlabel = 'tween='+t.toString().slice(0,4)
	// text(tlabel, (t- .5)*300, height/2 - 30, {alignmentBaseline: "middle"})

	var steps = 30
	var smooth = []

	for (var i = 0; i < steps; i++) {
		var r = t*i/steps

		function tween(a,b){
			return a + r*(b-a)
		}

		var ax = tween(startx, middlex),
			ay = tween(starty, middley),
			bx = tween(middlex, endx),
			by = tween(middley, endy);
		
		// line('a'+i, 'b'+i, {stroke:'rgba(0,0,0,.1)'})
		// point(ax,ay,{id: 'a'+i, affects: ['middlex', 'middley']}, {fill:'rgba(0,0,0,.1)'})
		// point(bx,by,{id: 'b'+i, affects: ['middlex', 'middley']}, {fill:'rgba(0,0,0,.1)'})

		line(ax, ay, bx, by, {affects: ['t'], stroke:'rgba(0,0,0,.1)'})
		smooth.push([tween(ax,bx), tween(ay,by)])
	}

	var p = smooth[0]
	for (var i = 1; i < smooth.length; i++) {
		line(...p, ...smooth[i], {affects: ['t'], 'stroke-width': 5})
		p = smooth[i]
	}

	line(startx,starty, middlex,middley)
	line(middlex,middley, endx,endy)

	point(startx,starty)
	point(middlex,middley)
	point(endx,endy)

}, newdata => {
	console.log(newdata)
})