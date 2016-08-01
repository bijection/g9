import {makeDraggable, setAttributes} from '../utils'

export const type = "rect"
export const base = {fill:'#000'}
export const options = ['x', 'y', 'width', 'height', 'cares']
export function cost(renderable, rx, ry, x, y){
    var dx = renderable.x + renderable.width*rx - x
    var dy = renderable.y + renderable.height*ry- y
    return dx*dx + dy*dy
}

export class renderer {

	constructor(id, container, desire){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "rect")
        container.appendChild(this.el)

        makeDraggable(
            this.el,
            this.startDrag.bind(this),
            (x, y) => desire(id, this.rx, this.ry, x, y)
        )
    }

    remove(){
        this.el.parentNode.removeChild(this.el)
        delete this.el
    }

    startDrag(e){
        var {clientX, clientY} = e
        var cx = clientX  - this.leftOffset
        var cy = clientY - this.topOffset

        this.rx = (cx - this.renderable.x) / this.renderable.width
        this.ry = (cy - this.renderable.y) / this.renderable.height

        return [cx, cy]
    }

    setOffset(topOffset, leftOffset){
        this.topOffset = topOffset
        this.leftOffset = leftOffset
    }

    render(renderable){
        this.renderable = renderable
        let {x,y,width,height} = renderable
        if(width < 0){
            x += width
            width = -width
        }
        if(height < 0){
            y+=height
            height = -height
        }
        setAttributes(this.el, renderable.attributes)
        setAttributes(this.el, {x, y, width, height})
    }
}