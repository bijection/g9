import {clamp, makeDraggable, defaultBounds, setAttributes} from '../utils'

export const type = "circle"
export const base = { type: 'circle', ...defaultBounds }
export const options = ['x', 'y', 'xmin', 'xmax', 'ymin', 'ymax', 'cares']
export const shortcut = ['x', 'y']
export function cost(renderable, x, y){
    x = clamp(x, renderable.xmin, renderable.xmax)
    y = clamp(y, renderable.ymin, renderable.ymax)

    var dx = renderable.x - x
    var dy = renderable.y - y
    return dx*dx + dy*dy
}

export class renderer {

	constructor(id, container, desire){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        setAttributes(this.el, {r:5, fill:'#000'})
        container.appendChild(this.el)

        makeDraggable(
            this.el,
            this.getPos.bind(this),
            (x, y) => desire(id, x, y)
        )
    }

    remove(){
        this.el.parentNode.removeChild(this.el)
        delete this.el
    }

    getPos(){
        return [this.renderable.x, this.renderable.y]   
    }

    setOffset(topOffset, leftOffset){
        this.topOffset = topOffset
        this.leftOffset = leftOffset        
    }

    render(renderable){
        this.renderable = renderable
        setAttributes(this.el, renderable.attributes)
        setAttributes(this.el, {
            cx:clamp(renderable.x, renderable.xmin, renderable.xmax),
            cy:clamp(renderable.y, renderable.ymin, renderable.ymax)
        })
    }
}