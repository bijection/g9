var levels = 20

var bounds = {
	xmin: 1,
	xmax: 400,
	ymin: 0,
	ymax: 300
}

var demo = g9({
	x: 300,
	y: 275,
}, function(data, draw){
	


	var slope = (data.y - bounds.ymax) / data.x

	for (var i = 1; i < levels+1; i++) {

		var x = i*bounds.xmax/(levels)
		var y = bounds.ymax + x*slope

		draw.line(i+'high', i+'low', i+'line')
			.attr({'class': 'bar'})
		
		draw.circle(x, bounds.ymax, {id: i+'low', bounds})
			.attr({class: 'bar-end-bottom'})
		draw.circle(x, Math.max(y, data.y), {id:i+'high', bounds})
			.attr({class: 'bar-end-top'})

	}

	draw.circle( data.x, data.y, {id:'handle', bounds})
	.attr({fill: 'blue', r: 8})

	
}, function(newdata, renderees){

	var alphas = []
	
	for (var i = 1; i < levels+1; i++) {
		alphas.push((bounds.ymax-renderees[i+'high'].y)*1000/bounds.ymax)
	}

	console.log(alphas)


})