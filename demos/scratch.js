var initial = {
	c1: Math.random(),
	c2: Math.random(),
	c3: Math.random(),
	c4: Math.random()
}

function f(x){
	return c1 * Math.cos(x / 1)
		+ c2 * Math.cos(x / 3)
		+ c3 * Math.cos(x / 5)
		+ c4 * Math.cos(x / 17)
}

function data2graphics(data, ctx){

	function f(x){
		return data.c1 * Math.cos(x / 1)
			+ data.c2 * Math.cos(x / 3)
			+ data.c3 * Math.cos(x / 5)
			+ data.c4 * Math.cos(x / 17)
	}
	
	var radius = 500

	var ix = i => i*(ctx.width - 20) / radius
	var iy = i => f(i/radius * 100) * 100

	var k = ctx.pure(i => ctx.line( ix(i), iy(i), ix(i+1), iy(i+1), {'stroke-width': 10, 'stroke-linecap': 'round'} ))

	for (var i = -radius; i < radius; i++) {
		k(i)
	}
}

function log(x, y){
    console.log(x,y)
}

var demo = g9(initial, data2graphics, log)