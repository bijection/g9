var initial = {
    size: 100,
}

function data2graphics(data, ctx){
	ctx.line(0, -100, 0, data.size, {
		"stroke-width": 10})
	ctx.circle(0, data.size)
	if (data.size>100) {
		var left
		if (Math.random() > 0.5) {
			left = 1
		} else {
			left = -1
		}
		ctx.line(0, 100, (data.size-100)*left, 100)
	}
	
}  

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)