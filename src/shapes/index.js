import * as circle from './circle'
import * as line from './line'
import * as text from './text'
import * as image from './image'

var shapes = {}

export function addshape({type, renderer, base, options, shortcut, cost}){
	shapes[type] = {renderer, base,shortcut, options, cost}
}

addshape(circle)
addshape(line)
addshape(text)
addshape(image)

export default shapes