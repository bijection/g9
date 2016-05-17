import {clamp, makeDraggable, defaultBounds, setAttributes} from '../utils'

export const type = "image"
export const base = { type: 'image', ...defaultBounds }
export const options = ['href', 'x', 'y','width', 'height', 'xmin', 'xmax', 'ymin', 'ymax', 'cares']
export const shortcut = ['href', 'x', 'y','width', 'height']
export function cost(renderable, x, y){
    x = clamp(x, renderable.xmin, renderable.xmax)
    y = clamp(y, renderable.ymin, renderable.ymax)

    var dx = renderable.x - x
    var dy = renderable.y - y
    return dx*dx + dy*dy
}

export class renderer {

	constructor(id, container, desire){
        this.el = document.createElementNS("http://www.w3.org/2000/svg", "image")
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

    render(renderable){
        this.renderable = renderable
        setAttributes(this.el, renderable.attributes)
        setAttributes(this.el,{'href': c.href}, "http://www.w3.org/1999/xlink")
        setAttributes(this.el, {
            x:clamp(renderable.x - renderable.width/2, renderable.xmin, renderable.xmax),
            y:clamp(renderable.y - renderable.height/2, renderable.ymin, renderable.ymax),
			width:renderable.width,
            height:renderable.height,
   		})
    }
}