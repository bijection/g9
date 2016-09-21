// import * as text from './text'
// import * as image from './image'
// import * as rect from './rect'

import circle from './circle'
import point from './point'
import line from './line'
import rect from './rect'

var shapes = {}


export function addShape(shape){
	shapes[shape.name] = shape
}

addShape(point)
addShape(circle)
addShape(line)
addShape(rect)


// export function addShape({type, renderer, base, options, cost}){
// 	shapes[type] = {renderer, base, type, options, cost}
// }



// addShape(circle)
// addShape(line)
// addShape(text)
// addShape(image)
// addShape(rect)

export default shapes