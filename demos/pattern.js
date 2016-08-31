// var sides = 10
var canvas = document.createElement('canvas'),
	ctx = canvas.getContext('2d')

var {width, height} = document.body.getBoundingClientRect()
canvas.width = width
canvas.height = height

document.body.appendChild(canvas)

var sides = 8

var demo = g9({
	a1:1.1766056921521546,
	a2:1.7616329673543354,
	a3l:1.771046902387237,
	a3r:1.773369450703567,
	a4:2.179060679068228,
	a5:1.9025018735966257,
	a6:2.0894741821951284,
	s1:16.81648142644239,
	s2:66.11645862405204,
	s3:80.42611430671244,
	s4l:167.48943570957016,
	s4r:129.08696284678717,
	s5:192.05638885088797,
	s6:262.8228682272902,
	s7:316.13699803710614,
}, function({x, y, s1, s2, s3, s4l, s4r, s5, s6, s7, a1, a2, a3l, a3r, a4, a5, a6}, draw){

	var rsides = Math.round(sides)
	var a = 2*Math.PI/rsides

	// var cx = 400
	// var cy = 200

	draw.circle(40*sides, 200, 'wolo')


	function doff(cx, cy, ext){
		function rcircle(angle, radius, options){
			angle -= Math.PI/8

			if(typeof options.id != 'undefined'){
				options.id += ext
			} else {
				options += ext
			}

			return draw.circle(cx+radius*Math.cos(angle), cy+radius*Math.sin(angle), options)
				.attr({fill:'rgba(0,0,0,.05)', r: 10})
		}


		for (var i = 0; i < sides; i+=1) {

			var pl = []
			var pr = []

			var base = rcircle(i*a, s1, i)
			
			// left side
			var l = i
			pl.push(base)
			pl.push(rcircle((l+ a1)*a, s2, i+'l'))
			pl.push(rcircle((l+a2)*a, s3, {id:i+'lr', cares:['s3', 'a2']}))
			
			// right side
			var r = i
			pr.push(base)
			pr.push(rcircle((r- a1)*a,s2, i+'r'))
			pr.push(rcircle((r-a2)*a,s3, {id:i+'rl', cares:['s3', 'a2']}))

			if(i%2){
				pl.push(rcircle((l+a3l)*a, s4l, {id:i+'lr1', cares:['s4l', 'a3l']}))
				

				pr.push(rcircle((r-a3r)*a,s4r, {id:i+'rl1', cares:['s4r', 'a3r']}))
				

				pr.push(rcircle((r-a4)*a,s5, {id:i+'rl2', cares:['s5', 'a4']}))


				pr.push(rcircle((r-a5)*a,s6, {id:i+'rl3', cares:['s6', 'a5']}))


				pr.push(rcircle((r-a6)*a,s7, {id:i+'rl4', cares:['s7', 'a6']}))
			} else {


				pl.push(rcircle((l+a3r)*a, s4r, {id:i+'lr1', cares:['s4r', 'a3r']}))
				
				pr.push(rcircle((r-a3l)*a,s4l, {id:i+'rl1', cares:['s4l', 'a3l']}))	
				

				pl.push(rcircle((l+a4)*a, s5, {id:i+'lr2', cares:['s5', 'a4']}))
				

				pl.push(rcircle((l+a5)*a, s6, {id:i+'lr3', cares:['s6', 'a5']}))
				

				pl.push(rcircle((l+a6)*a, s7, {id:i+'lr4', cares:['s7', 'a6']}))
			}

			// lines
			draw.polyline(pl, i+'pl'+ext)
			draw.polyline(pr, i+'pr'+ext)
		}		
	}

	var tile = 200

	doff(0*tile, 0*tile, 'z')
	doff(1*tile, 1*tile, 'a')
	doff(1*tile, 3*tile, 'b')
	doff(3*tile, 1*tile, 'c')
	doff(2*tile, 2*tile, 'd')
	doff(3*tile, 3*tile, 'e')
	doff(0*tile, 2*tile, 'f')
	doff(4*tile, 2*tile, 'g')
	doff(2*tile, 0*tile, 'h')
	doff(4*tile, 0*tile, 'i')
	doff(0*tile, 4*tile, 'j')
	doff(2*tile, 4*tile, 'k')
	doff(4*tile, 4*tile, 'l')
	
}, function(newdata, renderees){

	Object.keys(renderees).forEach((k) => {
		var renderee = renderees[k]
		
		var {type, id} = renderee

		if(type === 'circle'){
			var {x, y} = renderee
			ctx.beginPath()
			ctx.arc(x,y,5,0,2*Math.PI)
			ctx.closePath()
			ctx.fill()

		// console.log(id, x, y)

		} else if (type === 'line') {
			var {d1, d2} = renderee
			var {x: x1, y: y1} = renderees[d1]
			var {x: x2, y: y2} = renderees[d2]
			ctx.beginPath()
			ctx.moveTo(x1,y1)
			ctx.lineTo(x2,y2)
			ctx.closePath()
			ctx.stroke()
		}
	})
})