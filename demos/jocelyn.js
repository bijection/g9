var demo = g9({
	s1: 10,
	s2: 10,
	s3: 10,
	s4: 10,
}, function({s1, s2, s3, s4}, draw){
	
	draw.line('bee', 'apple')

	draw.circle(s1, s2, 'bee').attr({fill:"blue"})
	draw.circle(s3, s4, 'apple').attr({fill:"green"})
	draw.circle(s3+s1, s4-s1).attr({fill:"orange"})

}, function(newdata, renderees){

	console.log('changed data to', newdata)

})