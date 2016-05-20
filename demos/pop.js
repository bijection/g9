var demo = g9({
	x:130,
	y:415,
}, function({x,y}, draw){
	
	draw.circle(x,y,"hello")
	draw.circle(y,x,"asdfe")

}, function(newdata, renderees){

	console.log('changed data to', newdata)

})