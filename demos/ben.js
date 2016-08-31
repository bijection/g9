var initial = {
    spacing: 100,
    day1: 100,
    day2: 200,
    day3: 300,
    down: 100
}

var total = 1000

function data2graphics(data, ctx){

	var bottom = ctx.height/2 - 40

	ctx.circle(0, bottom)

	var {day1, day2, day3} = data

	var days = (day1+day2+day3)


	var pymy = (total - data.down) * (1 + days*.1/365) / 3
	
	ctx.rect(day1, bottom, 20, -pymy, {
		cares: ['day1'],
	})
	ctx.text(Math.round(day1*100)/100, day1, bottom + 20)
	
	ctx.rect(day2, bottom, 20, -pymy, {
		cares: ['day2'],
	})
	ctx.text(Math.round(day2*100)/100, day2, bottom + 20)
	
	ctx.rect(day3, bottom, 20, -pymy, {
		cares: ['day3'],
	})
	ctx.text(Math.round(day3*100)/100, day3, bottom + 20)

	ctx.rect(0, bottom, 20, -data.down)

	ctx.text(pymy, 0,0)
}   

function log(x){
    console.log(x)
}

var demo = g9(initial, data2graphics, log)