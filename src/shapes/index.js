// import * as circle from './circle'
// import * as line from './line'
// import * as text from './text'
// import * as image from './image'
// import * as rect from './rect'

import point from './point'

var shapes = {}


export function addShape(shape){
	shapes[shape.name] = shape
}

addShape(point)


// export function addShape({type, renderer, base, options, cost}){
// 	shapes[type] = {renderer, base, type, options, cost}
// }



// addShape(circle)
// addShape(line)
// addShape(text)
// addShape(image)
// addShape(rect)

export default shapes