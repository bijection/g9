import {makeDraggable, setAttributes} from '../utils'

export const type = "line"
export const options = ['x1', 'y1', 'x2', 'y2', 'cares']
export const base = {stroke: '#000'}

export function cost(renderable, r, x, y){
    var {x1, y1, x2, y2} = renderable
    var dx = x1 + (x2 - x1)*r - x
    var dy = y1 + (y2 - y1)*r - y
    return dx*dx + dy*dy
}

export class renderer {

    constructor(id, container, desire){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "line")
        container.appendChild(this.el)

        makeDraggable(
            this.el,
            this.startDrag.bind(this),
            (x,y) => desire(id, this.r, x, y)
        )
    }

    remove(){
        this.el.parentNode.removeChild(this.el)
        delete this.el
    }

    startDrag(e){
        var {x1,y1,x2,y2} = this.renderable
        var {clientX, clientY} = e
        var cx = clientX  - this.leftOffset
        var cy = clientY - this.topOffset

        var dx1 = x2 - x1, dy1 = y2 - y1
        var dx2 = cx - x1
        var dy2 = cy - y1

        this.r = Math.sqrt(dx2*dx2 + dy2*dy2) / Math.sqrt(dx1*dx1 + dy1*dy1)
        
        return [cx, cy]
    }

    setOffset(topOffset, leftOffset){
        this.topOffset = topOffset
        this.leftOffset = leftOffset        
    }

    render(renderable){
        this.renderable = renderable

        var {x1,y1,x2,y2,attributes} = renderable

        setAttributes(this.el, attributes)

        setAttributes(this.el, { x1, y1, x2, y2, })
    }
}