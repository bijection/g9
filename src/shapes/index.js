import * as circle from './circle'
import * as line from './line'
import * as text from './text'
import * as image from './image'
import * as rect from './rect'

var shapes = {}

export function addshape({type, renderer, base, options, cost}){
	shapes[type] = {renderer, base, type, options, cost}
}

addshape(circle)
addshape(line)
addshape(text)
addshape(image)
addshape(rect)

export default shapes