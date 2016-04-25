function Cot(x){ return 1 / Math.tan(x) }
function Csc(x){ return 1 / Math.sin(x) }

function f(x, y, z){
	return 2*Math.sqrt((Math.pow(y - z, 2)*Math.pow(Math.sin(x/2), 2))/
	    ((2 + (-2 + y)*y + 2*(-1 + y)*Math.cos(x))*(2 + (-2 + z)*z + 2*(-1 + z)*Math.cos(x))))
}
function g(x, y, z){ // dfdx
return ((6*(-1 + z) + y*(6 + z*(-6 + y*z)) + 8*(-1 + y)*(-1 + z)*Math.cos(x) - 
      2*(-1 + y)*(-1 + z)*Math.cos(2*x))*Cot(x/2.)*   Math.pow(Csc(x/2.),2)   *
    Math.pow((    Math.pow(y - z, 2)      *   Math.pow(Math.sin(x/2.),2)   )/
       ((2 + (-2 + y)*y + 2*(-1 + y)*Math.cos(x))*(2 + (-2 + z)*z + 2*(-1 + z)*Math.cos(x)))
       ,1.5))/    Math.pow(y - z,2)      
}
function dgdx(x, y, z){
	return (   Math.pow(Csc(x/2.),2)  *Math.sqrt((Math.pow(y-z,2)*Math.pow(Math.sin(x/2),2))/
      ((2 - 2*y + Math.pow(y,2) + 2*(-1 + y)*Math.cos(x))*(2 - 2*z + Math.pow(z,2) + 2*(-1 + z)*Math.cos(x))))
     *((-2 + 2*y - Math.pow(y,2) - 2*(-1 + y)*Math.cos(x))*(2 - 2*z + Math.pow(z,2) + 2*(-1 + z)*Math.cos(x))*
       (-6 + 6*y + 6*z - 6*y*z + Math.pow(y,2)*Math.pow(z,2) + 8*(-1 + y)*(-1 + z)*Math.cos(x) - 
         2*(-1 + y)*(-1 + z)*Math.cos(2*x)) - 
      2*Math.pow(Math.cos(x/2),2)*(2 - 2*y + Math.pow(y,2) + 2*(-1 + y)*Math.cos(x))*
       (2 - 2*z + Math.pow(z,2) + 2*(-1 + z)*Math.cos(x))*
       (-6 + 6*y + 6*z - 6*y*z + Math.pow(y,2)*Math.pow(z,2) + 8*(-1 + y)*(-1 + z)*Math.cos(x) - 
         2*(-1 + y)*(-1 + z)*Math.cos(2*x)) + 
      3*Math.pow(Math.cos(x/2),2)*   Math.pow(-6 + 6*y + 6*z - 6*y*z + Math.pow(y,2)*Math.pow(z,2) + 
          8*(-1 + y)*(-1 + z)*Math.cos(x) - 2*(-1 + y)*(-1 + z)*Math.cos(2*x), 2) - 
      16*(-1 + y)*(-1 + z)*(2 - 2*y + Math.pow(y,2) + 2*(-1 + y)*Math.cos(x))*
       (2 - 2*z + Math.pow(z,2) + 2*(-1 + z)*Math.cos(x))*Math.pow(Math.sin(x/2),2)*   Math.pow(Math.sin(x),2)  ))/
  (2.*  Math.pow(2 - 2*y + Math.pow(y,2) + 2*(-1 + y)*Math.cos(x),2)*
    Math.pow(2 - 2*z + Math.pow(z,2) + 2*(-1 + z)*Math.cos(x),2)   )

}


var demo = g9({
	a: .17,
	b: .15,
}, function(data, draw){

	var steps = 30
	for (var x = 1; x < steps; x++) {
		
		draw.line(x+'low', (x-1)+'low', 'l'+x)

	}


	for (var x = 0; x < steps; x++) {

		var y = f(x*Math.PI/(steps-1), data.a, data.b)
		
		draw.circle(x*10, y*400, x+'low')
			.attr({r: 10})
			.attr({class: 'bar-end-bottom', fill: 'rgba(0,0,0,0)'})

	}

	var maxx = 0
	var maxy = 0
	for (var x = 0; x < steps; x++) {

		var y = f(x*Math.PI/(steps-1), data.a, data.b)

		if(y > maxy){
			maxx = x/10
			maxy = y
		}
	}

    maxx -= g(maxx*Math.PI/(steps-1), data.a, data.b) / dgdx(maxx*Math.PI/(steps-1), data.a, data.b)

    maxy = f(maxx*Math.PI/(steps-1), data.a, data.b)

	draw.circle(maxx*10, maxy*400, 'handle')
		.attr({fill: 'blue', r: 8})

	
}, function(newdata, c){

})