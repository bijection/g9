import {makeDraggable, setAttributes} from '../utils'

export const type = "image"
export const base = {}
export const options = ['href', 'x', 'y', 'width', 'height', 'cares']
export function cost(renderable, x, y){
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
            x:renderable.x - renderable.width/2,
            y:renderable.y - renderable.height/2,
			width:renderable.width,
            height:renderable.height,
   		})
    }
}