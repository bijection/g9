import hu from '../../lib/hu'
import * as elementCreators from './elements'

export default class Renderer {
    
    elements = {};
    el = hu('<svg>').attr({"preserveAspectRatio": 'xMidYMid meet'});
    align = {x:false, y:false}

    constructor(snapshot, desire){
        this.snapshot = snapshot
        this.desire = desire
        window.addEventListener('resize', this.resize.bind(this))
    }

    center({x=false, y=false}){
        this.align = {x,y}
        this.resize()
    }

    resize(){
        var {x,y} = this.align
        if(x || y){
            var {width, height} = this.el.n.getBoundingClientRect()
            this.el.n.setAttribute('viewBox',  
                  (x ? -width/2 : 0)
                + " "
                + (y ? -height/2 : 0)
                + " "
                + width
                + " "
                + height)
        }
    }

    render(renderables){
        var {elements, snapshot, desire, el} = this
        _.forIn(renderables, (renderable, id) => {

            if(!elements[id]){
                elements[id] = new elementCreators[renderable.type](id, el, snapshot, desire)
            }

            elements[id].render(renderable, renderables)
        })

        _.forIn(elements, (element, id) => {
            if(!(id in renderables)){
                element.el.remove()
                delete elements[id]
            }
        })

        this.resize()
    }

    insertInto(selector){
        hu(this.el, selector)
        this.resize()
    }
}